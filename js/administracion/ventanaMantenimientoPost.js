var winAddVehiculos;
var contenedorVehiculos;
var formRecordsVehiculosPost;
var gridRecordsVehiculosPost;
var formImageVehiculos;
var storeVehiculosMantenimiento;
var matriz = new Array();
var arregloEstandars;
var formPanelGrid_VehiculosPost;
var modal = 0;
var obj_vehiculos;
var obj_empresa;
var dateMantenimiento;
var servicioSeleccionado = false;
var edadDate;
var seleccionado = '';
var estandar;
var valorTipoServicio;
var valorTipoMantenimiento;
var gridWinStoreVehiculosPost;
var id;
var banderaVehiculo = false;
var bandera = false;
var fechaConfig = '';
var fechaSoat = Ext.create('Ext.form.field.Date', {
    fieldLabel: 'Desde el',
    format: 'Y-m-d',
    id: 'fechaIniBan',
    name: 'fechaIni',
    vtype: 'daterange',
    allowBlank: false,
    endDateField: 'fechaFinBan',
    emptyText: 'Fecha Inicial...',
    listConfig: {
        minWidth: 300
    }
});
var storecombo = new Ext.data.ArrayStore({
    id: 'stor',
    fields: [
        'id',
        'text'
    ],
    data: [['1', 'Nuevo'], ['2', 'Usado']]
});
Ext.onReady(function () {
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectVehiculo', {
        extend: 'Ext.data.Model',
        fields: [
            //id
            {name: 'id', mapping: 'idmantenimiento'},
            //Registro Mantenimiento
            {name: 'idempresa', type: 'int'},
            {name: 'idestandar', type: 'int'},
            {name: 'valorTipoServicio', type: 'int'},
            {name: 'empresa', type: 'string'},
            {name: 'propietario', type: 'string'},
            {name: 'servicio', type: 'string'},
            {name: 'vehiculo', type: 'string'},
            {name: 'idvehiculo', type: 'int'},
            //Mantenimientoss
            {name: 'valorTipoMantenimiento', type: 'int'},
            {name: 'mkilometraje', type: 'int'},
            {name: 'mdias', type: 'int'},
            {name: 'mfecha', type: 'date', dateFormat: 'c'},
            {name: 'mobservacion', type: 'string'},
            //Reparación
            {name: 'repaFecha', type: 'date', dateFormat: 'c'},
            {name: 'repaDescripcion', type: 'string'},
            {name: 'repaObservacion', type: 'string'},
            //Repuesto
            {name: 'repuMarca', type: 'string'},
            {name: 'repuModelo', type: 'string'},
            {name: 'repuCodigo', type: 'string'},
            {name: 'repuSerie', type: 'string'},
            {name: 'repuEstado'},
            //Registrar servicios adicionales
            {name: 'descripSoat', type: 'string'},
            {name: 'fechaSoatReg', type: 'date', dateFormat: 'c'},
            {name: 'fechaSoatVenc', type: 'date', dateFormat: 'c'},
            {name: 'descripMatricula', type: 'string'},
            {name: 'fechaMatriculaReg', type: 'date', dateFormat: 'c'},
            {name: 'fechaMatriculaVenc', type: 'date', dateFormat: 'c'},
            {name: 'descripSeguro', type: 'string'},
            {name: 'fechaSeguroReg', type: 'date', dateFormat: 'c'},
            {name: 'fechaSeguroVenc', type: 'date', dateFormat: 'c'},
            {name: 'estandar', type: 'string',
            }
        ]
    });
    // crea los datos del store
    gridWinStoreVehiculosPost = Ext.create('Ext.data.Store', {
        model: 'DataObjectVehiculo',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/mantenimientoPost/read.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'veh',
                messageProperty: 'message'
            },
        }
    });
    //campos del grid
    var columnsRecordsPost = [
        {header: '<b>Vehiculo</b>', width: 170, dataIndex: 'vehiculo'},
        {header: '<b>Estandar Servicio</b>', width: 310, dataIndex: 'servicio', editor:
                    new Ext.form.field.ComboBox({
                        xtype: 'combobox',
                        editable: false,
                        store: storeServicios,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        lazyRender: true,
                        listClass: 'x-combo-list-small',
                        emptyText: 'Seleccionar Servicio',
                        listConfig: {
                            minWidth: 350
                        },
                        listeners: {
                            select: function (combo, records, eOpts) {
                                //obtener datos del servicio seleccionado
                                estandar = records[0].data.id;
                                //para cehiculo
                                banderaVehiculo = true;
                                //obtener datos
                                formPanelGrid_VehiculosPost.getForm().submit({
                                    url: 'php/administracion/mantenimientoPost/readHistorico.php',
                                    params: {
                                        idVehiculoStandar: seleccionado.data.id,
                                        idEstandar: records[0].data.id
                                    },
                                    success: function (form, action) {
                                        //obtener datos
                                        var resultado = action.result;
                                        //habilitar campos
                                        formRecordsVehiculosPost.down('#updateVeh').enable();
                                        formRecordsVehiculosPost.down('#createVeh').disable();
                                        formRecordsVehiculosPost.down('#deleteVeh').enable();
                                        //id del vehiculo seleccionado
                                        id = resultado.datos[0].idmantenimiento;
                                        //cargo de datos del seleccionado
                                        Ext.getCmp('idestandar').setValue(resultado.datos[0].idestandar);
                                        Ext.getCmp('s1').setValue(resultado.datos[0].valorTipoServicio);
                                        if (resultado.datos[0].mdias != '') {
                                            Ext.getCmp('mt').setValue(true);
                                        } else {
                                            if (resultado.datos[0].mkilometraje != '') {
                                                Ext.getCmp('mk').setValue(true);

                                            }
                                        }
                                        Ext.getCmp('mkilometraje').setValue(resultado.datos[0].mkilometraje);
                                        Ext.getCmp('mdias').setValue(resultado.datos[0].mdias);
                                        Ext.getCmp('mfecha').setValue(resultado.datos[0].mfecha);
                                        Ext.getCmp('mobservacion').setValue(resultado.datos[0].mobservacion);
                                        Ext.getCmp('repaFecha').setValue(resultado.datos[0].repaFecha);
                                        Ext.getCmp('repaDescripcion').setValue(resultado.datos[0].repaDescripcion);
                                        Ext.getCmp('repaObservacion').setValue(resultado.datos[0].repaObservacion);
                                        Ext.getCmp('repuMarca').setValue(resultado.datos[0].repuMarca);
                                        Ext.getCmp('repuModelo').setValue(resultado.datos[0].repuModelo);
                                        Ext.getCmp('repuCodigo').setValue(resultado.datos[0].repuCodigo);
                                        Ext.getCmp('repuSerie').setValue(resultado.datos[0].repuSerie);
                                        Ext.getCmp('repuEstado').setValue(resultado.datos[0].repuEstado);
                                        Ext.getCmp('descripSoat').setValue(resultado.datos[0].descripSoat);
                                        Ext.getCmp('fechaSoatReg').setValue(resultado.datos[0].fechaSoatReg);
                                        Ext.getCmp('fechaSoatVenc').setValue(resultado.datos[0].fechaSoatVenc);
                                        Ext.getCmp('matricula').setValue(resultado.datos[0].descripMatricula);
                                        Ext.getCmp('fechaMatriculaReg').setValue(resultado.datos[0].fechaMatriculaReg);
                                        Ext.getCmp('fechaMatriculaVenc').setValue(resultado.datos[0].fechaMatriculaVenc);
                                        Ext.getCmp('descripSeguro').setValue(resultado.datos[0].descripSeguro);
                                        Ext.getCmp('fechaSeguroReg').setValue(resultado.datos[0].fechaSeguroReg);
                                        Ext.getCmp('fechaSeguroVenc').setValue(resultado.datos[0].fechaSeguroVenc);
                                        //cargando datos del estandar
                                        servicioSeleccionado = true;
                                        arregloEstandars = new Array();
                                        for (i = 0; i < records.length; i++) {
                                            arregloEstandars[i] = new Array(records[i].data.tiempo, records[i].data.kilometro);
                                        }
                                    }
                                });
                            }
                        }
                    })
        },
        {header: '<b>Organización</b>', width: 130, dataIndex: 'empresa'}
    ];
    // declare the source Grid
    gridRecordsVehiculosPost = Ext.create('Ext.grid.Panel', {
        store: gridWinStoreVehiculosPost,
        columns: columnsRecordsPost,
        plugins: [new Ext.grid.plugin.CellEditing({
                clicksToEdit: 1,
                autoCancel: false
            })],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection: true,
            preserveScrollOnRefresh: false
        },
        height: 500,
        features: [filters],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected[0] !== null) {
                    //para controlar que hay un seleccionado
                    bandera = true;
                    formRecordsVehiculosPost.getForm().reset();
                    //cargo datos
                    gridWinStoreVehiculosPost.reload();
                    //guardo el dato seleccionado
                    banderaVehiculo = true;
                    seleccionado = selected[0];
                    //cargo la lista de los estandares del vehiculo seleccionado
                    var lista = seleccionado.data.estandar.split(',');
                    var listaStandar = '';
                    for (var i = 0; i < lista.length - 1; i++) {
                        if (i === lista.length - 2) {
                            listaStandar = listaStandar + lista[i];
                        } else {
                            listaStandar = listaStandar + lista[i] + ',';
                        }
                    }
                    storeServicios.load({
                        params: {
                            lisEstandar: listaStandar
                        }
                    });
                    //para que se cargen los datos en el form
                    storeVeh.load({
                        params: {
                            cbxEmpresas: seleccionado.data.idempresa
                        }
                    });
                    //guardo el id del vehiculo seleccionado
                    id = seleccionado.data.id;
                    //cargo los datos de vehiculo seleccionado con el estandar
                    Ext.getCmp('idempresa').setValue(seleccionado.data.idempresa);
                    Ext.getCmp('idvehiculo').setValue(seleccionado.data.idvehiculo);
                    Ext.getCmp('idestandar').setValue(seleccionado.data.idestandar);
                    Ext.getCmp('s1').setValue(seleccionado.data.valorTipoServicio);
                    if (seleccionado.data.mdias != '') {
                        Ext.getCmp('mt').setValue(true);
                    } else {
                        if (seleccionado.data.mkilometraje != '') {
                            Ext.getCmp('mk').setValue(true);

                        }
                    }
                    Ext.getCmp('mkilometraje').setValue(seleccionado.data.mkilometraje);
                    Ext.getCmp('mdias').setValue(seleccionado.data.mdias);
                    Ext.getCmp('mfecha').setValue(seleccionado.data.mfecha);
                    Ext.getCmp('mobservacion').setValue(seleccionado.data.mobservacion);
                    Ext.getCmp('repaFecha').setValue(seleccionado.data.repaFecha);
                    Ext.getCmp('repaDescripcion').setValue(seleccionado.data.repaDescripcion);
                    Ext.getCmp('repaObservacion').setValue(seleccionado.data.repaObservacion);
                    Ext.getCmp('repuMarca').setValue(seleccionado.data.repuMarca);
                    Ext.getCmp('repuModelo').setValue(seleccionado.data.repuModelo);
                    Ext.getCmp('repuCodigo').setValue(seleccionado.data.repuCodigo);
                    Ext.getCmp('repuSerie').setValue(seleccionado.data.repuSerie);
                    Ext.getCmp('repuEstado').setValue(seleccionado.data.repuEstado);
                    Ext.getCmp('descripSoat').setValue(seleccionado.data.descripSoat);
                    Ext.getCmp('fechaSoatReg').setValue(seleccionado.data.fechaSoatReg);
                    Ext.getCmp('fechaSoatVenc').setValue(seleccionado.data.fechaSoatVenc);
                    Ext.getCmp('matricula').setValue(seleccionado.data.descripMatricula);
                    Ext.getCmp('fechaMatriculaReg').setValue(seleccionado.data.fechaMatriculaReg);
                    Ext.getCmp('fechaMatriculaVenc').setValue(seleccionado.data.fechaMatriculaVenc);
                    Ext.getCmp('descripSeguro').setValue(seleccionado.data.descripSeguro);
                    Ext.getCmp('fechaSeguroReg').setValue(seleccionado.data.fechaSeguroReg);
                    Ext.getCmp('fechaSeguroVenc').setValue(seleccionado.data.fechaSeguroVenc);
                    //habilito los botones
                    formRecordsVehiculosPost.down('#updateVeh').enable();
                    formRecordsVehiculosPost.down('#createVeh').disable();
                    formRecordsVehiculosPost.down('#deleteVeh').enable();
//                  servicioSeleccionado = false;
//                Ext.getCmp('mt').disable();
//                Ext.getCmp('mk').disable();
//                Ext.getCmp('mtyk').disable();
//                Ext.getCmp('mtok').disable();
//                Ext.getCmp('idReparacion').toggle();
                }
            }
        }
    });
    formPanelGrid_VehiculosPost = Ext.create('Ext.form.Panel', {
        width: '31%',
        margins: '0 2 0 0',
        region: 'west',
        height: 560,
        autoScroll: true,
        items: [gridRecordsVehiculosPost]
    });
    formRecordsVehiculosPost = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-vehiculos',
        autoScroll: true,
        width: '79%',
        region: 'center',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 40,
        hight: 150,
        margins: '3 0 0 3',
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Registro de Mantenimiento</b>',
                id: 'idReparacion',
                collapsible: true,
                layout: 'vbox',
//                padding: '0 0 0 10',
                defaults: {
//                    padding: '0 0 15 30',
                    baseCls: 'x-plain',
                    defaults: {
                        labelWidth: 90
                    }
                }
                ,
                items: [
                    {
                        xtype: 'fieldset',
                        layout: 'hbox',
                        padding: '0 0 0 5',
                        defaults: {
                            padding: '0 0 5 15',
                            baseCls: 'x-plain',
                            defaults: {
                                labelWidth: 80
                            }
                        },
                        items: [
                            {
                                defaults: {
                                    padding: '5 0 5 5',
                                    baseCls: 'x-plain',
                                    layout: 'vbox',
                                    defaults: {
                                        labelWidth: 80
                                    }
                                },
                                items: [
                                    {
                                        items: [
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: '<b>Org </b>',
                                                name: 'idempresa',
                                                afterLabelTextTpl: required,
                                                id: 'idempresa',
                                                store: storeEmpresas,
                                                valueField: 'id',
                                                displayField: 'text',
                                                queryMode: 'local',
                                                emptyText: 'Seleccionar Organización...',
                                                allowBlank: false,
                                                width: 250,
                                                listeners: {
                                                    select: function (combo, records, eOpts) {
                                                        //se cargan los datos del vehiculo 
                                                        var listSelected = formRecordsVehiculosPost.down('[name=idvehiculo]');
                                                        listSelected.clearValue();
                                                        listSelected.store.removeAll();
                                                        obj_empresa = combo.getValue();
                                                        storeVeh.load({
                                                            params: {
                                                                cbxEmpresas: records[0].data.id
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: '<b>Elejir Vehiculo</b>',
                                                name: 'idvehiculo',
                                                afterLabelTextTpl: required,
                                                id: 'idvehiculo',
                                                store: storeVeh,
                                                valueField: 'id',
                                                displayField: 'text',
                                                emptyText: 'Seleccionar Vehículo...',
                                                allowBlank: false,
                                                editable: false,
                                                width: 250,
                                                listConfig: {
                                                    minWidth: 350
                                                }, listeners: {
                                                    select: {
                                                        fn: function (combo, records, index) {
                                                            obj_vehiculos = combo.getValue();
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: '<b>Servicio</b>',
                                                afterLabelTextTpl: required,
                                                name: 'idestandar',
                                                displayField: 'text',
                                                valueField: 'id',
                                                id: 'idestandar',
                                                store: storeVehiculosservicios,
                                                emptyText: 'Seleccionar el Servicio...',
                                                queryMode: 'local',
                                                allowBlank: false,
                                                width: 250,
                                                listConfig: {
                                                    minWidth: 350
                                                }
                                                , listeners: {
                                                    select: {
                                                        fn: function (combo, record, index) {
                                                            if (record.length !== null) {
                                                                //guardo el estandar seleccionado
                                                                estandar = record[0].data.id;
//                                                                console.log(seleccionado.data);
                                                                //para seleccionar la operacion
                                                                var aux = true;
                                                                servicioSeleccionado = true;
                                                                bandera = true;
                                                                if (banderaVehiculo) {
                                                                    var val = seleccionado.data.estandar.split(',');
                                                                    console.log(seleccionado.data.estandar);
                                                                    for (var i = 0; i < val.length - 1; i++) {
                                                                        console.log(parseInt(val[i]) + 'actual' + estandar);
                                                                        if (parseInt(val[i]) === parseInt(estandar)) {
                                                                            aux = false;
                                                                        }
                                                                    }

                                                                    if (aux) {
                                                                        formRecordsVehiculosPost.down('#updateVeh').disable();
                                                                        formRecordsVehiculosPost.down('#createVeh').enable();
                                                                        formRecordsVehiculosPost.down('#deleteVeh').disable();
                                                                    } else {
                                                                        formRecordsVehiculosPost.down('#updateVeh').enable();
                                                                        formRecordsVehiculosPost.down('#createVeh').disable();
                                                                        formRecordsVehiculosPost.down('#deleteVeh').enable();
                                                                    }
                                                                }
                                                                Ext.getCmp('mk').enable();
                                                                Ext.getCmp('mt').enable();
                                                                Ext.getCmp('mtyk').enable();
                                                                Ext.getCmp('mtok').enable();
                                                                Ext.getCmp('mdias').enable();
                                                                Ext.getCmp('mkilometraje').enable();
                                                                Ext.getCmp('mk').reset();
                                                                Ext.getCmp('mt').reset();
                                                                Ext.getCmp('mtyk').reset();
                                                                Ext.getCmp('mtok').reset();
                                                                Ext.getCmp('mdias').reset();
                                                                Ext.getCmp('mkilometraje').reset();
                                                                arregloEstandars = new Array();
                                                                for (i = 0; i < record.length; i++) {
                                                                    arregloEstandars[i] = new Array(record[i].data.tiempo, record[i].data.kilometro);
                                                                }
                                                            }
                                                        }}}},
                                        ]}]},
                            {
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        flex: 2,
                                        title: '<b>Elegir Tipo de Servicio</b>',
                                        defaultType: 'radio',
                                        layout: 'anchor',
                                        items: [
                                            {
                                                boxLabel: 'Mantenimiento',
                                                id: 's1',
                                                name: 'valorTipoServicio',
                                                inputValue: '1',
                                                listeners: {
                                                    change: function (field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s1').value;
                                                        if (r1 === true) {
                                                            valorTipoServicio = 1;
                                                            Ext.getCmp('fsmantenimiento').toggle();
                                                            Ext.getCmp('fsreparacion').collapse();
                                                            Ext.getCmp('fsrepuesto').collapse();
                                                        }
                                                    }
                                                }
                                            }, {
                                                boxLabel: 'Reparación',
                                                id: 's2',
                                                name: 'valorTipoServicio',
                                                inputValue: '2',
                                                listeners: {
                                                    change: function (field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s2').value;
                                                        if (r1 === true) {
                                                            valorTipoServicio = 2;
                                                            Ext.getCmp('fsmantenimiento').collapse();
                                                            Ext.getCmp('fsreparacion').toggle();
                                                            Ext.getCmp('fsrepuesto').collapse();
                                                        }
                                                    }
                                                }
                                            }, {
                                                boxLabel: 'Repuesto',
                                                id: 's3',
                                                name: 'valorTipoServicio',
                                                inputValue: '3',
                                                listeners: {
                                                    change: function (field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s3').value;
                                                        if (r1 === true) {
                                                            valorTipoServicio = 3;
                                                            Ext.getCmp('fsmantenimiento').collapse();
                                                            Ext.getCmp('fsreparacion').collapse();
                                                            Ext.getCmp('fsrepuesto').toggle();
                                                        }
                                                    }
                                                }
                                            }]
                                    }
                                ]
                            },
                            {
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        title: '<b>Registrar SOAT</b>',
                                        defaultType: 'radio',
                                        layout: 'anchor',
                                        padding: '0 0 0 10',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: 'Descripción',
                                                padding: '0 10 5 0 ',
                                                name: 'descripSoat',
                                                id: 'descripSoat',
                                                emptyText: 'Descripción Matricula'
                                            },
                                            {
                                                fieldLabel: 'Registro',
                                                padding: '0 0 5 0',
                                                name: 'fechaSoatReg',
                                                id: 'fechaSoatReg',
                                                xtype: 'datefield',
                                                format: 'Y-m-d',
                                                maxValue: new Date(),
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function () {
                                                        edadDate = Ext.Date.add(Ext.getCmp('fechaSoatReg').value, Ext.Date.YEAR, 1);
                                                        Ext.getCmp('fechaSoatVenc').reset();
                                                        Ext.getCmp('fechaSoatVenc').setValue(edadDate);
                                                    }
                                                }
                                            },
                                            {
                                                fieldLabel: 'Vencimiento',
                                                padding: '0 0 5 0',
                                                name: 'fechaSoatVenc',
                                                id: 'fechaSoatVenc',
                                                xtype: 'datefield',
                                                format: 'Y-m-d',
                                                minValue: 'fechaSoatReg',
                                                emptyText: 'Seleccionar Fecha...'
                                            }

                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        layout: 'hbox',
                        padding: '0 0 0 5',
                        defaults: {
                            padding: '0 0 5 25',
                            baseCls: 'x-plain',
                            defaults: {
                                labelWidth: 80
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        title: '<b>Registrar Matricula</b> ',
                                        defaultType: 'radio',
                                        layout: 'anchor',
                                        padding: '0 10 0 10',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                padding: '0 0 5 0',
                                                fieldLabel: 'Descripción',
                                                name: 'descripMatricula',
                                                id: 'matricula',
                                                emptyText: 'Descripción Matricula'
                                            },
                                            {
                                                fieldLabel: 'Registro',
                                                padding: '0 0 5 0',
                                                name: 'fechaMatriculaReg',
                                                id: 'fechaMatriculaReg',
                                                xtype: 'datefield',
                                                format: 'Y-m-d',
                                                maxValue: new Date(),
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function () {
                                                        edadDate = Ext.Date.add(Ext.getCmp('fechaMatriculaReg').value, Ext.Date.YEAR, 1);
                                                        Ext.getCmp('fechaMatriculaVenc').reset();
                                                        Ext.getCmp('fechaMatriculaVenc').setValue(edadDate);
                                                    }
                                                }
                                            },
                                            {
                                                fieldLabel: 'Vencimiento',
                                                padding: '0 0 5 0',
                                                name: 'fechaMatriculaVenc',
                                                id: 'fechaMatriculaVenc',
                                                minValue: 'fechaMatriculaReg',
                                                xtype: 'datefield',
                                                format: 'Y-m-d',
                                                emptyText: 'Seleccionar Fecha...'
                                            }

                                        ]
                                    }
                                ]
                            }
                            , {
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        title: '<b>Registrar Seguro</b> ',
                                        defaultType: 'radio',
                                        layout: 'anchor',
                                        padding: '0 0 0 15',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                padding: '0 12 5 0',
                                                fieldLabel: 'Descripción ',
                                                name: 'descripSeguro',
                                                id: 'descripSeguro',
                                                emptyText: 'Descripción Seguro'
                                            },
                                            {
                                                fieldLabel: 'Registro',
                                                padding: '0 0 5 0',
                                                name: 'fechaSeguroReg',
                                                id: 'fechaSeguroReg',
                                                xtype: 'datefield',
                                                format: 'Y-m-d',
                                                maxValue: new Date(),
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function () {
                                                        edadDate = Ext.Date.add(Ext.getCmp('fechaSeguroReg').value, Ext.Date.YEAR, 1);
                                                        Ext.getCmp('fechaSeguroVenc').reset();
                                                        Ext.getCmp('fechaSeguroVenc').setValue(edadDate);
                                                    }
                                                }
                                            },
                                            {
                                                fieldLabel: 'Vencimiento',
                                                padding: '0 0 5 0',
                                                name: 'fechaSeguroVenc',
                                                id: 'fechaSeguroVenc',
                                                xtype: 'datefield',
                                                minValue: 'fechaSeguroReg',
                                                format: 'Y-m-d',
                                                emptyText: 'Seleccionar Fecha...'
                                            }

                                        ]
                                    }
                                ]
                            }]}
                ]
            }
            , {
                xtype: 'fieldset',
                title: '<b>Mantenimiento</b>',
                disable: true,
                id: 'fsmantenimiento',
                autoHeight: true,
                checkboxToggle: true,
                collapsed: true,
                collapsible: true,
                layout: 'vbox',
                padding: '2 2 2 2',
                listeners: {
                    'beforeexpand': function () {
                        Ext.getCmp('fsreparacion').collapse();
                        Ext.getCmp('fsrepuesto').collapse();
//                        Ext.getCmp('idReparacion').collapse();
                        Ext.getCmp('s1').setValue(true);
                        Ext.getCmp('repaFecha').reset();
                        Ext.getCmp('repaDescripcion').reset();
                        Ext.getCmp('repaObservacion').reset();
                        Ext.getCmp('repuMarca').reset();
                        Ext.getCmp('repuModelo').reset();
                        Ext.getCmp('repuCodigo').reset();
                        Ext.getCmp('repuSerie').reset();
                        Ext.getCmp('repuEstado').reset();
                    }
                },
                items: [
                    {
                        layout: 'vbox',
                        baseCls: 'x-plain',
                        defaults: {
                            padding: '5 5 5 15',
                            baseCls: 'x-plain',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            defaults: {
                                labelWidth: 80
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        xtype: 'radio',
                                        name: 'valorTipoMantenimiento',
                                        id: 'mt',
                                        fieldLabel: '<b>Tiempo</b>',
                                        inputValue: '1',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var r = Ext.getCmp('mt').value;
                                                if (r === true && servicioSeleccionado === true) {
                                                    valorTipoMantenimiento = 1;
                                                    Ext.getCmp('mdias').setValue(arregloEstandars[0][0]);
                                                    Ext.getCmp('mkilometraje').setValue("");
                                                }
                                            }
                                        }},
                                    {
                                        xtype: 'radio',
                                        name: 'valorTipoMantenimiento',
                                        padding: '0 0 5 45',
                                        id: 'mk',
                                        fieldLabel: '<b>Kilometro</b>',
                                        tooltip: 'Escoger Kilometros',
                                        inputValue: '2',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mk').value;
                                                if (r1 === true && servicioSeleccionado === true) {
                                                    valorTipoMantenimiento = 2;
                                                    Ext.getCmp('mkilometraje').setValue(arregloEstandars[0][1]);
                                                    Ext.getCmp('mdias').setValue("");
                                                }
                                            }
                                        }
                                    }, {xtype: 'textfield',
                                        fieldLabel: '<i>Elegir Tiempo en Dias   </i>', name: 'mdias',
                                        vtype: 'digitos',
                                        padding: '0 0 0 80',
                                        id: 'mdias',
                                        emptyText: 'Tiempo',
                                        width: 165
                                    }
                                ]
                            },
                            {
                                items: [
                                    {
                                        xtype: 'radio',
                                        name: 'valorTipoMantenimiento',
                                        id: 'mtyk',
                                        fieldLabel: '<b>Tiempo y Kilometro</b>',
                                        inputValue: '3',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mtyk').value;
                                                if (r1 === true && servicioSeleccionado === true) {
                                                    valorTipoMantenimiento = 3;
                                                    Ext.getCmp('mdias').setValue(arregloEstandars[0][0]);
                                                    Ext.getCmp('mkilometraje').setValue(arregloEstandars[0][1]);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'radio',
                                        name: 'valorTipoMantenimiento',
                                        padding: '0 0 5 45',
                                        id: 'mtok',
                                        fieldLabel: '<b>Tiempo o Kilometro</b>',
                                        inputValue: '4',
                                        listeners: {
                                            change: function (field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mtok').value;
                                                if (r1 === true && servicioSeleccionado === true) {
                                                    valorTipoMantenimiento = 4;
                                                    Ext.getCmp('mdias').setValue(arregloEstandars[0][0]);
                                                    Ext.getCmp('mkilometraje').setValue(arregloEstandars[0][1]);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: '<i>Kilometraje</i> ',
                                        name: 'mkilometraje',
                                        vtype: 'digitos',
                                        padding: '7 0 0 80',
                                        id: 'mkilometraje',
                                        emptyText: 'kilometraje',
                                        width: 165
                                    }
                                ]
                            }
                            ,
                            {
                                items: [
                                    {
                                        fieldLabel: 'Fecha ',
                                        padding: '0 0 5 0',
                                        name: 'mfecha',
                                        id: 'mfecha',
                                        value: new Date(),
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        maxValue: new Date(),
                                        emptyText: 'Seleccionar Fecha...',
                                    },
                                    {
                                        xtype: 'textarea',
                                        id: 'mobservacion',
                                        padding: '0 0 5 0',
                                        fieldLabel: 'Observación',
                                        labelWidth: 90,
                                        width: '100%',
                                        grow: true,
                                        name: 'mobservacion'
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
            ,
            {
                xtype: 'fieldset',
                title: '<b>Reparación</b>',
                id: 'fsreparacion',
                autoHeight: true,
                checkboxToggle: true,
                collapsed: true, // fieldset initially collapsed                 disable: true,
                collapsible: true,
                layout: 'hbox',
                padding: '3 5 5 3',
                listeners: {
                    'beforeexpand': function () {
                        Ext.getCmp('fsmantenimiento').collapse();
                        Ext.getCmp('fsrepuesto').collapse();
//                        Ext.getCmp('idReparacion').collapse();
                        Ext.getCmp('s2').setValue(true);
                        Ext.getCmp('mt').reset();
                        Ext.getCmp('mk').reset();
                        Ext.getCmp('mtyk').reset();
                        Ext.getCmp('mtok').reset();
                        Ext.getCmp('mdias').reset();
                        Ext.getCmp('mkilometraje').reset();
                        Ext.getCmp('mobservacion').reset();
                        Ext.getCmp('mfecha').reset();
                        Ext.getCmp('repuMarca').reset();
                        Ext.getCmp('repuModelo').reset();
                        Ext.getCmp('repuCodigo').reset();
                        Ext.getCmp('repuSerie').reset();
                        Ext.getCmp('repuEstado').reset();
                    }
                },
                defaults: {
                    padding: '0 0 5 15',
                    baseCls: 'x-plain',
                    layout: 'hbox',
                    defaults: {
                        labelWidth: 80
                    }
                }
                ,
                items: [
                    {
                        defaults: {
                            padding: '0 0 15 0',
                            baseCls: 'x-plain',
                            layout: 'vbox',
                            defaults: {
                                labelWidth: 100
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        fieldLabel: 'Fecha ',
                                        name: 'repaFecha',
                                        id: 'repaFecha',
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        maxValue: new Date(),
                                        emptyText: 'Seleccionar Fecha...'
                                    },
                                    {
                                        xtype: 'textarea',
                                        fieldLabel: 'Descripción',
                                        id: 'repaDescripcion',
                                        labelWidth: 100,
                                        grow: true,
                                        name: 'repaDescripcion',
                                    }
                                ]
                            }

                        ]

                    },
                    {
                        items: [
                            {
                                xtype: 'textarea',
                                fieldLabel: 'Observación',
                                id: 'repaObservacion',
                                labelWidth: 90,
                                width: '100%',
                                grow: true,
                                name: 'repaObservacion'
                            }
                        ]
                    }
                ]

            }
            ,
            {
                xtype: 'fieldset',
                title: '<b>Repuesto</b>',
                id: 'fsrepuesto',
                autoHeight: true,
                checkboxToggle: true,
                collapsed: true, // fieldset initially collapsed
                disable: true,
                collapsible: true,
                layout: 'hbox',
                padding: '3 5 5 3',
                listeners: {
                    'beforeexpand': function () {
                        Ext.getCmp('fsmantenimiento').collapse();
                        Ext.getCmp('fsreparacion').collapse();
//                        Ext.getCmp('idReparacion').collapse();
                        Ext.getCmp('s3').setValue(true);
                        Ext.getCmp('mt').reset();
                        Ext.getCmp('mk').reset();
                        Ext.getCmp('mtyk').reset();
                        Ext.getCmp('mtok').reset();
                        Ext.getCmp('mdias').reset();
                        Ext.getCmp('mkilometraje').reset();
                        Ext.getCmp('mfecha').reset();
                        Ext.getCmp('mobservacion').reset();
                        Ext.getCmp('repaFecha').reset();
                        Ext.getCmp('repaDescripcion').reset();
                        Ext.getCmp('repaObservacion').reset();
                    }
                },
                defaults: {
                    padding: '0 0 5 15',
                    baseCls: 'x-plain',
                    layout: 'hbox',
                    defaults: {
                        labelWidth: 80
                    }
                }
                ,
                items: [
                    {
                        defaults: {
                            padding: '0 0 5 0',
                            baseCls: 'x-plain',
                            layout: 'vbox',
                            defaultType: 'textfield',
                            defaults: {
                                labelWidth: 50
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        fieldLabel: '<b>Marca</b>',
                                        id: 'repuMarca',
                                        name: 'repuMarca',
                                        vtype: 'campos',
                                        emptyText: 'Marca del Vehiculo...',
                                        maxLength: 45
                                    },
                                    {
                                        fieldLabel: '<b>Modelo</b>',
                                        name: 'repuModelo',
                                        id: 'repuModelo',
                                        vtype: 'campos',
                                        emptyText: 'Modelo del Vehiculo...',
                                        maxLength: 45
                                    },
                                    {
                                        fieldLabel: '<b>Codigo</b>',
                                        name: 'repuCodigo',
                                        id: 'repuCodigo',
                                        vtype: 'campos',
                                        emptyText: 'Modelo del Vehiculo...',
                                        maxLength: 45
                                    }
                                ]
                            }

                        ]

                    },
                    {
                        //                     
                        defaults: {
                            padding: '0 0 5 0',
                            baseCls: 'x-plain',
                            layout: 'vbox',
                            defaultType: 'textfield',
                            defaults: {
                                labelWidth: 50
                            }},
                        items: [
                            {
                                items: [
                                    {
                                        fieldLabel: '<b>Serie</b>',
                                        name: 'repuSerie',
                                        id: 'repuSerie',
                                        vtype: 'campos',
                                        emptyText: 'Serie del Vehiculo del Vehiculo...',
                                        maxLength: 45
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '<b>Estado</b>',
                                        name: 'repuEstado',
                                        id: 'repuEstado',
                                        store: storecombo,
                                        valueField: 'id',
                                        displayField: 'text',
                                        editable: false,
                                        queryMode: 'local',
                                        emptyText: 'Escoger Estado...',
                                        listConfig: {
                                            minWidth: 50
                                        }}]}]}]}
        ],
        listeners: {
            create: function (form, data) {
//                gridWinStoreVehiculosPost.insert(0, data);
//                gridWinStoreVehiculosPost.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [
                    {iconCls: 'icon-add-car', scope: this, tooltip: 'Ingresar Nuevo Vehiculo.....', handler: ventanaAddVehiculos},
                    '->',
                    {iconCls: 'icon-update', itemId: 'updateVeh', text: '<b>Actualizar</b>', scope: this, tooltip: 'Actualizar Servicio...', handler: onUpdateVehiculos},
                    {iconCls: 'icon-car', itemId: 'createVeh', text: '<b>Crear</b>', scope: this, tooltip: 'Crear Servicio...', handler: onCreateVehiculos},
                    {iconCls: 'icon-delete', text: '<b>Eliminar</b>', itemId: 'deleteVeh', scope: this, tooltip: 'Eliminar Servicio....', handler: onDeleteClickVehiculos},
                    {iconCls: 'icon-cleans', text: '<b>Limpiar</b>', scope: this, tooltip: 'Limpiar Campos', handler: onResetVehiculos},
                    {iconCls: 'icon-cancelar', text: '<b>Cancelar</b>', tooltip: 'Cancelar', scope: this, handler: clearWinVehiculos}
                ]
            }]
    });
    contenedorVehiculos = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 8,
        items: [
        ]
    });
});
function ventAddMantenimientosPost() {
    if (!winAddVehiculos) {
        winAddVehiculos = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Mantenimiento Post',
            iconCls: 'icon-mantenimiento',
            resizable: false,
            width: 1195,
            height: 560,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border', bodyPadding: 5,
                    items: [formPanelGrid_VehiculosPost,
                        formRecordsVehiculosPost]
                }]
        });
    }
    contenedorVehiculos.getForm().reset();
    winAddVehiculos.show();
    var nowDate = new Date();
    Ext.getCmp('mfecha').setValue(formatoFecha(nowDate));
    formRecordsVehiculosPost.down('#updateVeh').disable();
    formRecordsVehiculosPost.down('#createVeh').enable();
    formRecordsVehiculosPost.down('#deleteVeh').disable();
    if (gridRecordsVehiculosPost.getStore().getCount() === 0) {
        gridRecordsVehiculosPost.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElVehiculos = document.getElementById('panel-datos-vehiculos');
    var formPanelDropTargetVehiculos = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElVehiculos, {
        ddGroup: 'GridExample',
        notifyEnter: function (ddSource, e, data) {
            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsVehiculosPost.body.stopAnimation();
            formRecordsVehiculosPost.body.highlight();
        }
    });
}

function setActiveRecordVehiculos(record) {
    seleccionado = record;
//    formRecordsVehiculosPost.activeRecord = record;
    if (record) {
        storeVeh.load({
            params: {
                cbxEmpresas: record.data.idempresa
            }
        });
//        formRecordsVehiculosPost.down('#updateVeh').enable();
//        formRecordsVehiculosPost.down('#createVeh').disable();
//        formRecordsVehiculosPost.down('#deleteVeh').enable();
//        formRecordsVehiculosPost.getForm().loadRecord(record);
    }
//    else {
//        formRecordsVehiculosPost.down('#updateVeh').disable();
//        formRecordsVehiculosPost.getForm().reset();
//    }
}

function onUpdateVehiculos() {

    if (bandera) {
        if (parseInt(Ext.getCmp('mdias').getValue()) > 0) {
            fechaConfig = Ext.Date.add(Ext.getCmp('mfecha').value, Ext.Date.DAY, parseInt(Ext.getCmp('mdias').getValue()));
        }
        formPanelGrid_VehiculosPost.getForm().submit({
            url: 'php/administracion/mantenimientoPost/update.php',
            params: {
                id: id,
                idvehiculo: Ext.getCmp('idvehiculo').getValue(),
                idestandar: Ext.getCmp('idestandar').getValue(),
                valorTipoServicio: valorTipoServicio,
                fechaConfig: fechaConfig,
                valorTipoMantenimiento: valorTipoMantenimiento,
                mkilometraje: Ext.getCmp('mkilometraje').getValue(),
                mdias: Ext.getCmp('mdias').getValue(),
                mfecha: Ext.getCmp('mfecha').getRawValue(),
                mobservacion: Ext.getCmp('mobservacion').getValue(),
                repaFecha: Ext.getCmp('repaFecha').getRawValue(),
                repaDescripcion: Ext.getCmp('repaDescripcion').getValue(),
                repaObservacion: Ext.getCmp('repaObservacion').getValue(),
                repuMarca: Ext.getCmp('repuMarca').getValue(),
                repuModelo: Ext.getCmp('repuModelo').getValue(),
                repuCodigo: Ext.getCmp('repuCodigo').getValue(),
                repuSerie: Ext.getCmp('repuSerie').getValue(),
                repuEstado: Ext.getCmp('repuEstado').getValue(),
                descripSoat: Ext.getCmp('descripSoat').getValue(),
                fechaSoatReg: Ext.getCmp('fechaSoatReg').getRawValue(),
                fechaSoatVenc: Ext.getCmp('fechaSoatVenc').getRawValue(),
                descripMatricula: Ext.getCmp('matricula').getValue(),
                fechaMatriculaReg: Ext.getCmp('fechaMatriculaReg').getRawValue(),
                fechaMatriculaVenc: Ext.getCmp('fechaMatriculaVenc').getRawValue(),
                descripSeguro: Ext.getCmp('descripSeguro').getValue(),
                fechaSeguroReg: Ext.getCmp('fechaSeguroReg').getRawValue(),
                fechaSeguroVenc: Ext.getCmp('fechaSeguroVenc').getRawValue()

            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error...',
                    msg: 'No se pudo guardar',
                    buttons: Ext.MessageBox.ERROR,
                    icon: Ext.MessageBox.ERROR
                });
            },
            success: function (form, action) {
                Ext.example.msg("Mensaje", 'Datos actualizados correctamente');
                formRecordsVehiculosPost.getForm().reset();
                gridWinStoreVehiculosPost.reload();
                banderaVehiculo = false;
            }
        });
    } else {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'El servicio para este  vehiculo ya existe',
            buttons: Ext.MessageBox.ERROR,
            icon: Ext.MessageBox.ERROR
        });
    }
}

function validarDatos() {
    if (bandera) {
        onCreateVehiculos();
    } else {
        estandar = Ext.getCmp('idestandar').getValue();
        var idvehiculo = Ext.getCmp('idvehiculo').getValue();
        for (var i = 0; i < gridWinStoreVehiculosPost.data.length; i++) {
            if (parseInt(gridWinStoreVehiculosPost.getAt(i).data.idvehiculo) === parseInt(idvehiculo)) {
                var lista = gridWinStoreVehiculosPost.getAt(i).data.estandar.split(',');
                for (var i = 0; i < lista.length; i++) {
                    if (parseInt(lista[i]) === parseInt(estandar)) {
                        bandera = false;
                    }
                }
            } else {
                bandera = true;
            }
        }
        onCreateVehiculos();
    }
}
function onCreateVehiculos() {
    if (bandera) {
        if (parseInt(Ext.getCmp('mdias').getValue()) > 0) {
            fechaConfig = Ext.Date.add(Ext.getCmp('mfecha').value, Ext.Date.DAY, parseInt(Ext.getCmp('mdias').getValue()));
        }
        formPanelGrid_VehiculosPost.getForm().submit({
            url: 'php/administracion/mantenimientoPost/create.php',
            params: {
                idvehiculo: Ext.getCmp('idvehiculo').getValue(),
                idestandar: Ext.getCmp('idestandar').getValue(),
                valorTipoServicio: valorTipoServicio,
                valorTipoMantenimiento: valorTipoMantenimiento,
                mkilometraje: Ext.getCmp('mkilometraje').getValue(),
                fechaConfig: fechaConfig,
                mdias: Ext.getCmp('mdias').getValue(),
                mfecha: Ext.getCmp('mfecha').getRawValue(),
                mobservacion: Ext.getCmp('mobservacion').getValue(),
                repaFecha: Ext.getCmp('repaFecha').getRawValue(),
                repaDescripcion: Ext.getCmp('repaDescripcion').getValue(),
                repaObservacion: Ext.getCmp('repaObservacion').getValue(),
                repuMarca: Ext.getCmp('repuMarca').getValue(),
                repuModelo: Ext.getCmp('repuModelo').getValue(),
                repuCodigo: Ext.getCmp('repuCodigo').getValue(),
                repuSerie: Ext.getCmp('repuSerie').getValue(),
                repuEstado: Ext.getCmp('repuEstado').getValue(),
                descripSoat: Ext.getCmp('descripSoat').getValue(),
                fechaSoatReg: Ext.getCmp('fechaSoatReg').getRawValue(),
                fechaSoatVenc: Ext.getCmp('fechaSoatVenc').getRawValue(),
                descripMatricula: Ext.getCmp('matricula').getValue(),
                fechaMatriculaReg: Ext.getCmp('fechaMatriculaReg').getRawValue(),
                fechaMatriculaVenc: Ext.getCmp('fechaMatriculaVenc').getRawValue(),
                descripSeguro: Ext.getCmp('descripSeguro').getValue(),
                fechaSeguroReg: Ext.getCmp('fechaSeguroReg').getRawValue(),
                fechaSeguroVenc: Ext.getCmp('fechaSeguroVenc').getRawValue()

            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error...',
                    msg: 'No se pudo guardar',
                    buttons: Ext.MessageBox.ERROR,
                    icon: Ext.MessageBox.ERROR
                });
            },
            success: function (form, action) {
                Ext.example.msg("Mensaje", 'Servicio Generado Correctamente');
                formRecordsVehiculosPost.getForm().reset();
                gridWinStoreVehiculosPost.reload();
                banderaVehiculo = false;
            }
        });
    } else {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'El servicio para este  vehiculo ya existe',
            buttons: Ext.MessageBox.ERROR,
            icon: Ext.MessageBox.ERROR
        });
    }
}


function onResetVehiculos() {
    bandera = false;
    banderaVehiculo = false;
    setActiveRecordVehiculos(null);
    formRecordsVehiculosPost.down('#deleteVeh').disable();
    formRecordsVehiculosPost.down('#updateVeh').disable();
    formRecordsVehiculosPost.down('#createVeh').enable();
    formRecordsVehiculosPost.getForm().reset();
    Ext.getCmp('mkilometraje').disable();
}

function clearWinVehiculos() {
    formRecordsVehiculosPost.down('#deleteVeh').disable();
    formRecordsVehiculosPost.down('#createVeh').enable();
    winAddVehiculos.hide();
}

function onDeleteClickVehiculos() {
    seleccionar = '';
    Ext.MessageBox.confirm('Confirmar ', 'Realmente desea Eliminar el Servicio... ?', function (choice) {
        if (choice === 'yes') {
            formPanelGrid_VehiculosPost.getForm().submit({
                url: 'php/administracion/mantenimientoPost/destroy.php',
                params: {
                    id: id
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No se pudo guardar',
                        buttons: Ext.MessageBox.ERROR,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                success: function (form, action) {
                    Ext.example.msg("Mensaje", 'Datos actualizados correctamente');
                    formPanelGrid_VehiculosPost.getForm().reset();
                    gridWinStoreVehiculosPost.reload();
                    banderaVehiculo = false;
                }
            });
        }
    });
}



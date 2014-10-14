var winAddVehiculos;
var contenedorVehiculos;
var formRecordsVehiculos;
var gridRecordsVehiculos;
var formImageVehiculos;
var storeVehiculosMantenimiento;
var matriz = new Array();
var arregloEstandars;
var formPanelGrid_Vehiculos;
var modal = 0;
var obj_vehiculos;
var obj_empresa;
var dateMantenimiento;
var servicioSeleccionado = false;
var edadDate;


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
Ext.onReady(function() {


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
            //Mantenimiento

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
            {name: 'repaFecha', type: 'date', dateFormat: 'c'},
            {name: 'descripSeguro', type: 'string'},
            {name: 'repaFecha', type: 'date', dateFormat: 'c'},
            {name: 'repaFecha', type: 'date', dateFormat: 'c'}
        ]
    });
    // crea los datos del store
    var gridWinStoreVehiculos = Ext.create('Ext.data.Store', {
        utoLoad: true,
        autoSync: true,
        model: 'DataObjectVehiculo',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/mantenimiento/read.php',
                create: 'php/administracion/mantenimiento/create.php',
                update: 'php/administracion/mantenimiento/update.php',
                destroy: 'php/administracion/mantenimiento/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'veh',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function(proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function(store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    if (operation.state) {
                        formRecordsVehiculos.down('#updateVeh').disable();
                        formRecordsVehiculos.getForm().reset();
//                        storeTreeVehTaxis.reload();
                        gridWinStoreVehiculos.reload();
                    }
                }
            }
        }
    });
    var columnsRecords = [
        {header: "<b>Organización</b>", width: 110, sortable: true, dataIndex: 'empresa'},
        {header: "<b>Propietario</b>", width: 160, sortable: true, dataIndex: 'propietario'},
        {header: "<b>Vehiculo</b>", width: 150, sortable: true, dataIndex: 'vehiculo'},
        {header: "<b>Servicio</b>", width: 250, sortable: true, dataIndex: 'servicio'},
        {header: "<b>Dias</b>", width: 60, sortable: true, dataIndex: 'mdias'},
        {header: "<b>Kilometros</b>", width: 100, sortable: true, dataIndex: 'mkilometraje'}
    ];
    // declare the source Grid
    gridRecordsVehiculos = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridWinStoreVehiculos,
        columns: columnsRecords,
        enableDragDrop: true,
        stripeRows: true,
        height: 450,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecordVehiculos(selected[0] || null);
                servicioSeleccionado = false;
                Ext.getCmp('mt').disable();
                Ext.getCmp('mk').disable();
                Ext.getCmp('mtyk').disable();
                Ext.getCmp('mtok').disable();
            }
        }
    });
    formPanelGrid_Vehiculos = Ext.create('Ext.form.Panel', {
        width: '30%',
        margins: '0 2 0 0',
        region: 'west',
        autoScroll: true,
        title: '<b>Registros de Vehiculos</b>',
        items: [gridRecordsVehiculos]
    });
    formRecordsVehiculos = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-vehiculos',
        autoScroll: true,
        region: 'center',
        title: '<b>Servicio Mantenimiento</b>',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 40,
        hight: 150,
        margins: '5 0 0 5',
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Registro de Mantenimiento</b>',
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
                            padding: '0 0 15 20',
                            baseCls: 'x-plain',
                            defaults: {
                                labelWidth: 80
                            }
                        },
                        items: [
                            {
                                defaults: {
                                    padding: '10 0 5 5',
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
                                                    select: function(combo, records, eOpts) {
                                                        var listSelected = formRecordsVehiculos.down('[name=idvehiculo]');
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
                                                        fn: function(combo, records, index) {
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
                                                        fn: function(combo, record, index) {
                                                            if (record.length > 0 && record.length !== null) {
                                                                servicioSeleccionado = true;
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
                                                    change: function(field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s1').value;
                                                        if (r1 === true) {
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
                                                    change: function(field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s2').value;
                                                        if (r1 === true) {
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
                                                    change: function(field, newValue, oldValue) {
                                                        var r1 = Ext.getCmp('s3').value;
                                                        if (r1 === true) {
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
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function() {
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
                            padding: '0 0 15 25',
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
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function() {
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
                                                emptyText: 'Seleccionar Fecha...',
                                                listeners: {
                                                    select: function() {
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
                    'beforeexpand': function() {
                        Ext.getCmp('fsreparacion').collapse();
                        Ext.getCmp('fsrepuesto').collapse();
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
                            padding: '5 5 5 30',
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
                                            change: function(field, newValue, oldValue) {
                                                var r = Ext.getCmp('mt').value;
                                                if (r === true && servicioSeleccionado === true) {
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
                                            change: function(field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mk').value;
                                                if (r1 === true && servicioSeleccionado === true) {
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
                                            change: function(field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mtyk').value;
                                                if (r1 === true && servicioSeleccionado === true) {
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
                                            change: function(field, newValue, oldValue) {
                                                var r1 = Ext.getCmp('mtok').value;
                                                if (r1 === true && servicioSeleccionado === true) {
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
                                        xtype: 'datefield',
                                        format: 'Y-m-d',
                                        maxValue: new Date(),
                                        emptyText: 'Seleccionar Fecha...'
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
                title: '<b>Reparacion</b>',
                id: 'fsreparacion',
                autoHeight: true,
                checkboxToggle: true,
                collapsed: true, // fieldset initially collapsed                 disable: true,
                collapsible: true,
                layout: 'hbox',
                padding: '5 5 5 5',
                listeners: {
                    'beforeexpand': function() {
                        Ext.getCmp('fsmantenimiento').collapse();
                        Ext.getCmp('fsrepuesto').collapse();
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
                    padding: '0 0 15 30',
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
                padding: '5 5 5 5',
                listeners: {
                    'beforeexpand': function() {
                        Ext.getCmp('fsmantenimiento').collapse();
                        Ext.getCmp('fsreparacion').collapse();
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
                    padding: '0 0 15 30',
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
                            padding: '0 0 15 0',
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
            create: function(form, data) {
                gridWinStoreVehiculos.insert(0, data);
                gridWinStoreVehiculos.reload();
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
function ventAddMantenimientos() {
    if (!winAddVehiculos) {
        winAddVehiculos = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Servicio  de Mantenimiento',
            iconCls: 'icon-mantenimiento',
            resizable: false,
            width: 1200,
            height: 690,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border', bodyPadding: 5,
                    items: [formPanelGrid_Vehiculos,
                        formRecordsVehiculos]
                }]
        });
    }
    contenedorVehiculos.getForm().reset();
    winAddVehiculos.show();
    var nowDate = new Date();
    Ext.getCmp('mfecha').setValue(formatoFecha(nowDate));
    formRecordsVehiculos.down('#updateVeh').disable();
    formRecordsVehiculos.down('#createVeh').enable();
    formRecordsVehiculos.down('#deleteVeh').disable();
    if (gridRecordsVehiculos.getStore().getCount() === 0) {
        gridRecordsVehiculos.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElVehiculos = document.getElementById('panel-datos-vehiculos');
    var formPanelDropTargetVehiculos = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElVehiculos, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {
            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsVehiculos.body.stopAnimation();
            formRecordsVehiculos.body.highlight();
        }
    });
}

function setActiveRecordVehiculos(record) {
    formRecordsVehiculos.activeRecord = record;
    if (record) {
        storeVeh.load({
            params: {
                cbxEmpresas: record.data.idempresa
            }
        });
        formRecordsVehiculos.down('#updateVeh').enable();
        formRecordsVehiculos.down('#createVeh').disable();
        formRecordsVehiculos.down('#deleteVeh').enable();
        formRecordsVehiculos.getForm().loadRecord(record);
    } else {
        formRecordsVehiculos.down('#updateVeh').disable();
        formRecordsVehiculos.getForm().reset();
    }
}

function onUpdateVehiculos() {
    var active = formRecordsVehiculos.activeRecord,
            form = formRecordsVehiculos.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetVehiculos();
    } else {
    }
}

function onCreateVehiculos() {
    Ext.getCmp('idempresa').setValue(obj_empresa);
    Ext.getCmp('idvehiculo').setValue(obj_vehiculos);
    //    if (Ext.getCmp('mkilometraje').getValue() !== ('') || Ext.getCmp('mdias').getValue() !== ('')) {
    var form = formRecordsVehiculos.getForm();
    if (form.isValid()) {
        console.log("creando");
        formRecordsVehiculos.fireEvent('create', formAdminCompany, form.getValues());
        formRecordsVehiculos.down('#updateVeh').disable();
        form.reset();
    }
    ;
//    } else {
    //        Ext.Msg.alert('Failure', 'Debe Elegir el servicio por: Tiempo o Kilometros');
//    }

}

function onResetVehiculos() {
    setActiveRecordVehiculos(null);
    formRecordsVehiculos.down('#deleteVeh').disable();
    formRecordsVehiculos.down('#createVeh').enable();
    formRecordsVehiculos.getForm().reset();
    Ext.getCmp('mkilometraje').disable();
}

function clearWinVehiculos() {
    formRecordsVehiculos.down('#deleteVeh').disable();
    formRecordsVehiculos.down('#createVeh').enable();
    winAddVehiculos.hide();
}

function onDeleteClickVehiculos() {
    Ext.MessageBox.confirm('Confirmar ', 'Realmente desea Eliminar el Servicio... ?', function(choice) {
        if (choice === 'yes') {
            var selection = gridRecordsVehiculos.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridRecordsVehiculos.store.remove(selection);
                formRecordsVehiculos.down('#deleteVeh').disable();
                formRecordsVehiculos.down('#createVeh').enable();
            }
        }
    });
}


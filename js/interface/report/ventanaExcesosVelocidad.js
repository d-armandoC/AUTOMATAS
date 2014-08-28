var formExcesosVelocidad;
var winExcesosVelocidad;
var bandera = 0;
var storeDetalladoVelocidadPorLimite;
var dateStart;
var dateFinish;
var persona;
var gridViewDataExcesos;
var gridViewDataExcesosTotal;
var gridViewDataExcesosGeneral;
var storeDataVelocidad60a90;
var storeDataExcesosD;
var empresa = 1;
var cbxEmpresasBDExcesos;
var limiteIni;
var limiteFin;
var timeIni1;
var timeFin1;
//variable para los reportes
var reporteporlimite;
var gridVelocidad60a90;
var gridVelocidad90a120;
//variable para fija los valores para las consultas
var horaStart;
var horafinish;
var limiStart;
var limifinish;
Ext.onReady(function() {
    storeDetalladoVelocidadPorLimite = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getViewVelocidadPorLimite.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fecha', 'hora', 'velocidad', 'latitud', 'longitud']
    });
    storeDetalladoVelocidad60a90 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getViewVelocidad60a90.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fechaEcx', 'horaEcx', 'velocidadEcx', 'latitudEcx', 'longitudEcx']
    });
    storeDetalladoVelocidad90a120 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getViewVelocidad90a120.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fecha', 'hora', 'velocidad', 'latitud', 'longitud']
    });
    cbxEmpresasBDExcesos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'idCompanyExcesos',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Empresa...',
        editable: false,
        allowBlank: false,
//        value: 1,
        listeners: {
            select: function(combo, records, eOpts) {
                empresa = records[0].data.id;
            }
        }
    });
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniExcesos',
        name: 'fechaIniExcesos',
        value: new Date(),
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: '   Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinExcesos',
        name: 'fechaFinExcesos',
        vtype: 'daterange',
        value: new Date(),
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        startDateField: 'fechaIniExcesos',
        emptyText: 'Fecha Final...'
    });
    timeIni1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        value: '00:01',
        minValue: 'horaFin',
        maxValue: 'horaFin',
        endDateField: 'horaFin',
        invalidText: 'Hora inválida',
        editable: false,
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'Hora Inicial...'
    });
    timeFin1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: '   Hasta las',
        name: 'horaFin',
        format: 'H:i',
        editable: false,
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        value: '23:59',
        emptyText: 'Hora Final...'
    });
    limiteIni = Ext.create('Ext.form.field.Number', {
        fieldLabel: 'Limite Inicial',
        name: 'limiInifd',
        minValue: 0,
        minText: 'El valor no puede ser negativo',
        maxValue: 'limiFin',
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'limite Inicial...'
    });
    limiteFin = Ext.create('Ext.form.field.Number', {
        fieldLabel: 'Limite Final',
        name: 'limiFinfd',
        id: 'limiFin',
        minValue: 0,
        minText: 'El valor no puede ser negativo',
        maxValue: 120,
        maxText: 'El maximo valor es de 120',
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'limite Final...'
    });
    var btnToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
        }
    });
    var panelButtons = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnToday, btnYesterday]
    });
    formExcesosVelocidad = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    cbxEmpresasBDExcesos
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [{layout: 'hbox', items: [dateIni, dateFin]
                    }, {layout: 'hbox', items: [timeIni1, timeFin1]
                    }, panelButtons]
            }, {
                xtype: 'fieldset',
                title: 'Opciones de Reporte',
                width: '100%',
                layout: 'anchor',
                margin: '10 0 0 0',
                defaults: {
                    anchor: '100%',
                    padding: '0 0 0 0'
                },
                items: [{
                        xtype: 'checkboxgroup',
                        items: [{boxLabel: 'POR LIMITES', name: 'porlimite', inputValue: '1'}],
                        listeners: {
                            change: function(field, newValue) {
                                if (parseInt(newValue['porlimite']) === 1) {
                                    reporteporlimite = 1;
                                    limiteIni.enable();
                                    limiteFin.enable();
                                } else {
                                    reporteporlimite = 0;
                                    limiteIni.disable();
                                    limiteFin.disable();
                                }
                            }
                        }
                    }, {layout: 'hbox', margin: '10 10 20 0', width: '100%', items: [limiteIni, limiteFin]
                    }]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    if (formExcesosVelocidad.getForm().isValid()) {
                        dateStart = dateIni.getRawValue();
                        dateFinish = dateFin.getRawValue();
                        horaStart = timeIni1.getRawValue();
                        horafinish = timeFin1.getRawValue();
                        limiStart = limiteIni.getRawValue();
                        limifinish = limiteFin.getRawValue();
                        obtenerExcesoVelocidad();
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    winExcesosVelocidad.hide();
                }
            }]
    });
});
function showWinExcesosDaily() {
    if (!winExcesosVelocidad) {
        winExcesosVelocidad = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Excesos de Velocidad Totales',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 630,
            height: 380,
            closeAction: 'hide',
            plain: false,
            items: formExcesosVelocidad
        });
    }
    formExcesosVelocidad.getForm().reset();
//    cbxEmpresasBDExcesos
    limiteIni.disable();
    limiteFin.disable();
    winExcesosVelocidad.show();
}
function obtenerExcesoVelocidad() {
    var form = formExcesosVelocidad.getForm();
    //reporte por limites
    if (reporteporlimite === 1) {
        form.submit({
            url: 'php/interface/report/excesoVelocidades/getExcesosVelocidadPorLimite.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                idCompanyExcesos: empresa,
                fechaIni: dateStart, fechaFin: dateFinish,
                horaIni: timeIni1, horaFin: timeFin1,
                limiST: limiStart, limiFI: limifinish
            },
            failure: function(form, action) {
                Ext.MessageBox.show({
                    title: 'Información',
                    msg: action.result.message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            },
            success: function(form, action) {
//                console.log(action.result.data);
                var storeDataVelocidadPorLimite = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['personaExceso', 'placaExceso', 'idEquipoExceso', 'equipoExceso', 'total']
                });
                var gridVelocidadPorLimite = Ext.create('Ext.grid.Panel', {
//                    region: 'north',
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte de velocidades ' + '<br>Por limites: entre ( ' + limiteIni.getRawValue() + ' - ' + limiteFin.getRawValue() + ') km</center>',
                    store: storeDataVelocidadPorLimite,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Persona', width: 290, dataIndex: 'personaExceso', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
                        {text: 'Placa', width: 130, dataIndex: 'placaExceso', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoExceso', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'total', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                            }
                        }], listeners: {
                        itemclick: function(thisObj, record, item, index, e, eOpts) {
//Id del despacho que se esta realizando
                            console.log(record);
                            var reg = record.get('idEquipoExceso');
                            var persona = record.get('personaExceso');
//                            bandera = 1;
                            gridViewDataExcesos.setTitle('<center>Vista de velocidad detallado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                            storeDetalladoVelocidadPorLimite.load({
                                params: {
                                    idEquipo: reg,
                                    fechaIni: dateStart, fechaFin: dateFinish,
                                    horaST: horaStart, horaFI: horafinish,
                                    limiST: limiStart, limiFI: limifinish
                                }
                            });
                        }
                    }
                });
                gridViewDataExcesos = Ext.create('Ext.grid.Panel', {
                    region: 'center',
                    frame: true,
                    width: '55%',
                    title: '<center>Excesos de Velocidad Totales: ',
                    store: storeDetalladoVelocidadPorLimite,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadEcx', align: 'center', xtype: 'numbercolumn',
                            format: '0.00'},
                        {text: 'Fecha', width: 150, dataIndex: 'fecha', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'hora', align: 'center'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                            }
                        }]
                });

                velocidad60a90();//llama a la funcion para realizar la consulta entre velocidades de 60 a 90 km
                velocidad90a120();//llama a la funcion para realizar la consulta entre velocidades de 90 a 120 km
                var gridDataExcesos = Ext.create('Ext.container.Container', {
                    title: 'Excesos de Velocidad ',
                    closable: true,
                    iconCls: 'icon-exceso-vel',
                    layout: 'vbox',
                    fullscreen: true,
                    height: '100%',
                    width: '45%',
                    region: 'west',
                    items: [gridVelocidadPorLimite, gridVelocidad60a90, gridVelocidad90a120]
                });

                var tabExcesos = Ext.create('Ext.container.Container', {
                    title: 'Excesos de Velocidad Detallados',
                    closable: true,
                    iconCls: 'icon-exceso-vel',
                    layout: 'border',
                    fullscreen: true,
                    height: 485,
                    width: 2000,
                    region: 'center',
                    items: [gridDataExcesos, gridViewDataExcesos]
                });
                panelTabMapaAdmin.add(tabExcesos);
                panelTabMapaAdmin.setActiveTab(tabExcesos);
//                panelMapaAdmin.add(tabExcesos);
//                panelMapaAdmin.setActiveTab(tabExcesos);
                winExcesosVelocidad.hide();
            }

        });
    }

}
function velocidad60a90() {
    storeDataVelocidad60a90 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getExcesoVelocidad60a90.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['personaExc', 'placaExc', 'idEquipoExc', 'equipoExc', 'totalExc']
    });
    storeDataVelocidad60a90.load({
        params: {
            idCompanyExcesos: empresa,
            fechaIni: dateStart, fechaFin: dateFinish,
            horaST: horaStart, horaFI: horafinish,
            limiST: limiStart, limiFI: limifinish
        }
    });
    gridVelocidad60a90 = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '100%',
        height: 250,
        title: '<center>Reporte de velocidades: ' + '<br>Entre ( 60 - 90) km</center>',
        store: storeDataVelocidad60a90,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: 'Persona', width: 290, dataIndex: 'personaExc', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
            {text: 'Placa', width: 130, dataIndex: 'placaExc', align: 'center'},
            {text: 'Equipo', width: 130, dataIndex: 'equipoExc', align: 'center'},
            {text: 'Cantidad', width: 130, dataIndex: 'totalExc', align: 'center'},
        ],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                }
            }],
//        
        listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
//Id del despacho que se esta realizando
                var reg = record.get('idEquipoExceso');
                var persona = record.get('personaExceso');
//                            bandera = 1;
                gridViewDataExcesos.setTitle('<center>Vista de velocidad detallado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                storeDetalladoVelocidad60a90.load({
                    params: {
                        idEquipo: reg,
                        fechaIni: dateStart, fechaFin: dateFinish,
                        horaST: horaStart, horaFI: horafinish,
                        limiST: limiStart, limiFI: limifinish
                    }
                });
            }
        }
    });
     gridViewDataExcesos = Ext.create('Ext.grid.Panel', {
                    region: 'center',
                    frame: true,
                    width: '55%',
                    title: '<center>Excesos de Velocidad Totales: ',
                    store: storeDetalladoVelocidad60a90,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadEcx', align: 'center', xtype: 'numbercolumn',
                            format: '0.00'},
                        {text: 'Fecha', width: 150, dataIndex: 'fechaEcx', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'horaEcx', align: 'center'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitudEcx', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitudEcx', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                            }
                        }]
                });

}
function velocidad90a120() {
    storeDataVelocidad90a120 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getExcesoVelocidad90a120.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['personaE', 'placaE', 'idEquipoE', 'equipoE', 'totalE']
    });
    storeDataVelocidad90a120.load({
        params: {
            idCompanyExcesos: empresa,
            fechaIni: dateStart, fechaFin: dateFinish,
            horaST: horaStart, horaFI: horafinish,
            limiST: limiStart, limiFI: limifinish
        }
    });
    gridVelocidad90a120 = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '100%',
        height: 250,
        title: '<center>Reporte de velocidades: ' + '<br>Entre ( 90 - 120) km</center>',
        store: storeDataVelocidad90a120,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: 'Persona', width: 290, dataIndex: 'personaE', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
            {text: 'Placa', width: 130, dataIndex: 'placaE', align: 'center'},
            {text: 'Equipo', width: 130, dataIndex: 'equipoE', align: 'center'},
            {text: 'Cantidad', width: 130, dataIndex: 'totalE', align: 'center'},
        ],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                }
            }], listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
            }
        }
    });

}

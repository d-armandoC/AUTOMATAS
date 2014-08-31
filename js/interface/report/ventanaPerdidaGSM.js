//var contenedorWinPanelVelocidad;
var contenedorWinPanelPerdidadGSM;
//var winVelocidad;
var winPerdidaGSM;
var cbxBusesBDPan1;
var empresa;
//var gridTotalVelocidad;
var gridTotalPerdidaGSM;
//var gridInfVelocidad;
var gridInfVelocidad;
Ext.onReady(function() {

    var cbxEmpresasBDPan1 = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Empresa',
        name: 'cbxEmpresasPan',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar empresa...',
        editable: false,
        allowBlank: false,
//        listeners: {
//            select: function(combo, records, eOpts) {
//                cbxVehBD.enable();
//                cbxVehBD.clearValue();
//                storeVeh.load({
//                    params: {
//                        cbxEmpresas: records[0].data.id
//                    }
//                });
//            }
//        }
    });
    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 530
        }
    });
    var dateIniV = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniPan',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinPan',
        emptyText: 'Fecha inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var dateFinV = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinPan',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniPan',
        emptyText: 'Fecha final...',
        listConfig: {
            minWidth: 450
        }
    });
    var timeIniPan1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinPan1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btn1RecMV1 = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIniV.setValue(formatoFecha(nowDate));
            dateFinV.setValue(formatoFecha(nowDate));
            timeIniPan1.setValue('00:01');
            timeFinPan1.setValue('23:59');
        }
    });
    var btn2RecMV1 = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var nowDate = new Date();
            var año = nowDate.getFullYear();
            var mes = nowDate.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            var dia = nowDate.getDate() - 1;
            if (dia < 10) {
                dia = "0" + dia;
            }

            dateIniV.setValue(año + "-" + mes + "-" + dia);
            dateFinV.setValue(año + "-" + mes + "-" + dia);
            timeIniPan1.setValue('00:01');
            timeFinPan1.setValue('23:59');
        }
    });
    var panelBotonesGenV1 = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMV1]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMV1]
            }]
    });
    contenedorWinPanelPerdidadGSM = Ext.create('Ext.form.Panel', {
        margin:'10 10 10 10',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width: 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBDPan1,
                            dateIniV,
                            dateFinV,
                        ]
                    },
                    {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            //cbxVehBD,
                            timeIniPan1,
                            timeFinPan1

                        ]
                    },
                ]
            },
            panelBotonesGenV1],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {

                    if (contenedorWinPanelPerdidadGSM.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Generando datos....',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinPanelPerdidadGSM.getForm().submit({
                            url: 'php/interface/report/getReportCountPerdidaGSM.php',
                            method: 'POST',
                            waitMsg: 'Comprobando datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No existen datos que mostrar.');
                            },
                            success: function(form, action) {
                                var resultado = action.result;
                                loadGridPerdidaGSM(resultado.countByVelocidad, resultado.fi, resultado.ff, resultado.comp);
                                contenedorWinPanelPerdidadGSM.getForm().reset();
                                winPerdidaGSM.hide();
                            }

                        });
                        contenedorWinPanelPerdidadGSM.getForm().submit({
                            url: 'php/interface/report/getInfPerdidaGPS.php',
                            method: 'POST',
                            waitMsg: 'Comprobando datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No existen mas datos que mostrar.');
                            },
                            success: function(form, action) {
//                               
                                var resultado = action.result;

                                loadGridPerdidaGSM1(
                                        resultado.countByVelocidad1, resultado.fi, resultado.ff, resultado.comp
                                        );
                                panel();
                                contenedorWinPanelPerdidadGSM.getForm().reset();
                                winPerdidaGSM.hide();
                            }

                        });
                    }

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function limpiar_datosPan() {
                    contenedorWinPanelPerdidadGSM.getForm().reset();
                    // cbxBusesBDPan.disable();
                    if (winPerdidaGSM) {
                        winPerdidaGSM.hide();
                    }
                }

            }]
    });
});



function ventanaPerdidaGSM() {
    if (!winPerdidaGSM) {
        winPerdidaGSM = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registros de pérdidas de GSM',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 560,
            height: 220,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinPanelPerdidadGSM]
        });
    }
    contenedorWinPanelPerdidadGSM.getForm().reset();
    var nowDate = new Date();
    contenedorWinPanelPerdidadGSM.down('[name=fechaIni]').setValue(formatoFecha(nowDate));
    contenedorWinPanelPerdidadGSM.down('[name=fechaFin]').setValue(formatoFecha(nowDate));
    contenedorWinPanelPerdidadGSM.down('[name=horaIni]').setValue('00:01');
    contenedorWinPanelPerdidadGSM.down('[name=horaFin]').setValue('23:59');
    winPerdidaGSM.show();
}


function loadGridPerdidaGSM(store, fi, ff, empresa) {
    var stor1 = Ext.create('Ext.data.JsonStore', {
        data: store,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'total']

    });
    var columnTotalPerdidaGSM = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 30}),
        {text: '<b>Equipo</b>', flex: 100, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Total</b>', flex: 100, dataIndex: 'total', align: 'center', },
    ]



    gridTotalPerdidaGSM = Ext.create('Ext.grid.Panel', {
        region: 'west',
        frame:true,
        width: '20%',
        title: '<center><br>Total de Pérdidas de GSM <br>por vehículo</center>',
        store: stor1,
        columnLines: true,
        viewConfig: {
            emptyText: 'No hay datos que mostrar'
        },
        columns: columnTotalPerdidaGSM,
    });
}

function loadGridPerdidaGSM1(records1, fi, ff, empresa) {
    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storeInfPerdidaGSM = Ext.create('Ext.data.JsonStore', {
        data: records1,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'latitud', 'longitud', {name: 'fecha_hora_reg', type: 'date', dateFormat: 'c'}, {name: 'fecha_hora', type: 'date', dateFormat: 'c'}, 'velocidad', 'bat',
            'gsm', 'gps2', 'ign', 'direccion', 'evento', 'id_evento', 'parametro', 'g1', 'g2', 'sal']
    });

    var columnInfPerdidaGSM = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
        {text: '<b>Equipo</b>', width: 80, dataIndex: 'id_equipo', align: 'center',filter: {type: 'string'}},
        {text: '<b>Fecha y hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 140, dataIndex: 'fecha_hora', align: 'center'},
        {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 140, dataIndex: 'fecha_hora_reg', align: 'center'},
        {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 90, cls: 'listview-filesize', renderer: formatSpeed},
        {text: '<b>Batería</b>', width: 70, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GSM</b>', width: 60, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GPS2</b>', width: 60, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>Taxímetro</b>', width: 90, dataIndex: 'g2', align: 'center', renderer: formatStateTaxy, },
        {text: '<b>Pánico</b>', width: 70, dataIndex: 'g1', align: 'center', renderer: formatPanic},
        {text: '<b>Salida</b>', width: 70, dataIndex: 'sal', align: 'center'},
        {text: '<b>Evento</b>', width: 300, dataIndex: 'evento', align: 'center', renderer: formatEvento},
        {text: '<b>Id Evento</b>', width: 90, dataIndex: 'id_evento', align: 'center'},
        {text: '<b>Parámetro</b>', width: 90, dataIndex: 'parametro', align: 'center'}

    ];
    gridInfPerdidaGSM = Ext.create('Ext.grid.Panel', {
        features: [filters],
        region: 'center',
        width: '80%',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Desde ' + fi + ' hasta ' + ff + '<br>Detalles por cada pérdida de GSM</center>',
        store: storeInfPerdidaGSM,
        columnLines: true,
        viewConfig: {
            emptyText: 'No hay datos que mostrar'
        },
        columns: columnInfPerdidaGSM,
    });

}

function panel() {
    var tabPerdidaGSM = Ext.create('Ext.Container', {
        title: 'Reporte de Pérdida de GSM',
        fullscreen: true,
        layout: 'border',
        closable: true,
        height: 485,
        width: 2000,
        region: 'center',
        frame: true,
        iconCls: 'icon-exceso-vel',
        deferreRender: false,
        activeTab: 0,
        items: [
            gridTotalPerdidaGSM,
            gridInfPerdidaGSM

        ]
    });
    panelTabMapaAdmin.add(tabPerdidaGSM);
    panelTabMapaAdmin.setActiveTab(tabPerdidaGSM);
}
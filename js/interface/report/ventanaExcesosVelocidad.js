var contenedorWinPanelVelocidad;
var winVelocidad;
var cbxBusesBDPan1;
var empresa;
var gridTotalVelocidad;
var gridInfVelocidad;
Ext.onReady(function() {

    var cbxEmpresasBDPan1 = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'cbxEmpresasPan',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
    });
    var dateIniV = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniPan',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinPan',
        emptyText: 'Fecha Inicial...',
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
        emptyText: 'Fecha Final...',
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
        emptyText: 'Hora Final...',
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
    contenedorWinPanelVelocidad = Ext.create('Ext.form.Panel', {
        frame: true,
        height: 200,
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

                    if (contenedorWinPanelVelocidad.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Generando Datos....',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinPanelVelocidad.getForm().submit({
                            url: 'php/interface/report/getReportExVeloByDate.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No existen datos que Mostrar.');
                            },
                            success: function(form, action) {
                                var resultado = action.result;
                                loadGridVelocidad(resultado.countByVelocidad, resultado.fi, resultado.ff, resultado.comp);
                                contenedorWinPanelVelocidad.getForm().reset();
                                winVelocidad.hide();
                            }


                        });
                        contenedorWinPanelVelocidad.getForm().submit({
                            url: 'php/interface/report/getReportExcesoVelocidad.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                 Ext.Msg.alert('Error', 'No existen datos que Mostrar.');
                            },
                            success: function(form, action) {
//                               
                                var resultado = action.result;
                                
                                    loadGridVelocidad1(
                                            resultado.countByVelocidad1, resultado.fi, resultado.ff, resultado.comp
                                            );
                                    panel();
                                    contenedorWinPanelVelocidad.getForm().reset();
                                    winVelocidad.hide();


                               

                            }

                        });




                    }

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function limpiar_datosPan() {
                    contenedorWinPanelVelocidad.getForm().reset();
                    // cbxBusesBDPan.disable();
                    if (winVelocidad) {
                        winVelocidad.hide();
                    }
                }

            }]
    });
});



function ventanaExcesoVelocidad() {
    if (!winVelocidad) {
        winVelocidad = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registro de Exceso Velocidad',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinPanelVelocidad]
        });
    }
    contenedorWinPanelVelocidad.getForm().reset();
    winVelocidad.show();
}


function loadGridVelocidad(store, fi, ff, empresa) {
    var stor1 = Ext.create('Ext.data.JsonStore', {
        data: store,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'total']

    });
    var columnTotalVelocidad = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 30}),
        {text: '<b>Equipo</b>', flex: 100, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Total</b>', flex: 100, dataIndex: 'total', align: 'center', },
    ]



    gridTotalVelocidad = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Durante ' + fi + ' Hasta ' + ff + '</center>',
        store: stor1,
        columnLines: true,
        height: 485,
        width: 300,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnTotalVelocidad,
    });
}

function loadGridVelocidad1(records1, fi, ff, empresa) {
    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storeInfVelocidad = Ext.create('Ext.data.JsonStore', {
        data: records1,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'latitud', 'longitud', {name: 'fecha_hora_reg', type: 'date', dateFormat: 'c'}, {name: 'fecha_hora', type: 'date', dateFormat: 'c'}, 'velocidad', 'bat',
            'gsm', 'gps2', 'ign', 'direccion', 'id_evento', 'parametro', 'g1', 'g2', 'sal']
    });

    var columnInfVelocidad = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
        {text: '<b>Equipo</b>', width: 60, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
        {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
        {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 75, cls: 'listview-filesize', renderer: formatSpeed},
        {text: '<b>Bateria</b>', width: 60, dataIndex: 'bat', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GSM</b>', width: 50, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GPS2</b>', width: 50, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>Taximetro</b>', width: 90, dataIndex: 'g2', align: 'center', renderer: formatStateTaxy, },
        {text: '<b>Panico</b>', width: 60, dataIndex: 'g1', align: 'center', renderer: formatPanic},
        {text: '<b>Salida</b>', width: 60, dataIndex: 'sal', align: 'center'},
        {text: '<b>Id Evento</b>', width: 75, dataIndex: 'id_evento', align: 'center'},
        {text: '<b>Parametro</b>', width: 75, dataIndex: 'parametro', align: 'center'}

    ];
    gridInfVelocidad = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Durante ' + fi + ' Hasta ' + ff + '</center>',
        store: storeInfVelocidad,
        columnLines: true,
        height: 485,
        width: 800,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnInfVelocidad,
    });

}

function panel() {
    var tabVelocidad = Ext.create('Ext.Container', {
        title: 'Reporte Exceso Velocidad',
        fullscreen: true,
        layout: 'hbox',
        closable: true,
        height: 485,
        width: 2000,
        region: 'center',
        frame: true,
        iconCls: 'icon-exceso-vel',
        deferreRender: false,
        activeTab: 0,
        items: [
            {
                xtype: 'panel',
                region: 'oeste',
                items: gridTotalVelocidad
            },
            {
                xtype: 'panel',
                region: 'center',
                items: gridInfVelocidad
            }
        ]
    });
    panelMapa.add(tabVelocidad);
    panelMapa.setActiveTab(tabVelocidad);
}
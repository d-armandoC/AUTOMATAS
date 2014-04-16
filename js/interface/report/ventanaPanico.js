var contenedorWinPanelPanico;
var winPanico;
var cbxBusesBDPan;
var empresa1;
var gridTotalPanico;
var gridInfPanico;
Ext.onReady(function() {

    var cbxEmpresasBDPan = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'empresa',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
    });

    var dateIniPanico = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniPanico',
        name: 'fecha_Ini',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var dateFinPanico = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinPanico',
        name: 'fecha_Fin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var timeIniPanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'hora_Ini',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinPanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'hora_Fin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btn1RecPanico = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIniPanico.setValue(formatoFecha(nowDate));
            dateFinPanico.setValue(formatoFecha(nowDate));
            timeIniPanico.setValue('00:01');
            timeFinPanico.setValue('23:59');
        }
    });
    var btn2RecPanico = Ext.create('Ext.button.Button', {
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

            dateIniPanico.setValue(año + "-" + mes + "-" + dia);
            dateFinPanico.setValue(año + "-" + mes + "-" + dia);
            timeIniPanico.setValue('00:01');
            timeFinPanico.setValue('23:59');
        }
    });
    var panelBotonesGenPanico = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecPanico]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecPanico]
            }]
    });
    contenedorWinPanelPanico = Ext.create('Ext.form.Panel', {
        frame: false,
        padding: '5 5 5 5',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
//            labelHeight: 100,
            width: 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBDPan,
                            dateIniPanico,
                            dateFinPanico,
                        ]
                    },
                    {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            timeIniPanico,
                            timeFinPanico

                        ]
                    },
                ]
            },
            panelBotonesGenPanico],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {

                    if (contenedorWinPanelPanico.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Generando Datos....',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinPanelPanico.getForm().submit({
                            url: 'php/interface/report/getCountPanicByDate.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No existen datos que Mostrar.');
                            },
                            success: function(form, action) {
                                var resultado = action.result;
//                            
                                loadGridTotalPanico(resultado.countByPanic, resultado.fi, resultado.ff, resultado.comp);
//                             
                                contenedorWinPanelPanico.getForm().reset();
                                winPanico.hide();

                            }


                        });
                        contenedorWinPanelPanico.getForm().submit({
                            url: 'php/interface/report/getInfPanicByDate.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
//                                Ext.Msg.alert('Error', 'Los campos no guardados.');
                            },
                            success: function(form, action) {
//                               
                                var resultado = action.result;
//                                
                                loadGridInfPanico(
                                        resultado.infByPanico, resultado.fi, resultado.ff, resultado.comp
                                        );
                                panelPanico();
                                contenedorWinPanelPanico.getForm().reset();
                                winPanico.hide();





                            }

                        });




                    }

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function limpiar_datosPan() {
                    contenedorWinPanelPanico.getForm().reset();
                    // cbxBusesBDPan.disable();
                    if (winPanico) {
                        winPanico.hide();
                    }
                }

            }]
    });
});

function ventanaPanicos() {
    if (!winPanico) {
        winPanico = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registro Panicos',
            iconCls: 'icon-reset',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinPanelPanico]
        });
    }
    contenedorWinPanelPanico.getForm().reset();
    winPanico.show();
}
function loadGridTotalPanico(store, fi, ff, empresa) {
    var stor1 = Ext.create('Ext.data.JsonStore', {
        data: store,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'total']

    });
    var columnTotalPanico = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 30}),
        {text: '<b>Equipo</b>', flex: 100, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Total</b>', flex: 100, dataIndex: 'total', align: 'center', },
    ]



    gridTotalPanico = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Durante ' + fi + ' Hasta ' + ff + '</center>',
        store: stor1,
        columnLines: true,
        height: 485,
        width: 300,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnTotalPanico,
    });
}

function loadGridInfPanico(records1, fi, ff, empresa) {
    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storeInfPanico = Ext.create('Ext.data.JsonStore', {
        data: records1,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'latitud', 'longitud', {name: 'fecha_hora_reg', type: 'date', dateFormat: 'c'}, {name: 'fecha_hora', type: 'date', dateFormat: 'c'}, 'velocidad', 'bat',
            'gsm', 'gps2', 'ign', 'direccion', 'id_evento', 'parametro', 'g1', 'g2', 'sal']
    });

    var columnInfPanico = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
        {text: '<b>Equipo</b>', width: 60, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
        {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
        {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 75, cls: 'listview-filesize', renderer: formatSpeed},
        {text: '<b>Bateria</b>', width: 60, dataIndex: 'bat', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GSM</b>', width: 50, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GPS2</b>', width: 50, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>Taximetro</b>', width: 90, dataIndex: 'g2', align: 'center', renderer: formatStateTaxy},
        {text: '<b>Panico</b>', width: 60, dataIndex: 'g1', align: 'center', renderer: formatPanic},
        {text: '<b>Salida</b>', width: 60, dataIndex: 'sal', align: 'center'},
        {text: '<b>Id Evento</b>', width: 75, dataIndex: 'id_evento', align: 'center'},
        {text: '<b>Parametro</b>', width: 75, dataIndex: 'parametro', align: 'center'}

    ];
    gridInfPanico = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Durante ' + fi + ' Hasta ' + ff + '</center>',
        store: storeInfPanico,
        columnLines: true,
        height: 485,
        width: 800,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnInfPanico
    });


}

function panelPanico() {
    var tabVelocidad = Ext.create('Ext.Container', {
        title: 'Reporte Panico',
        fullscreen: true,
        layout: 'hbox',
        closable: true,
        height: 1000,
        width: 2000,
        region: 'center',
        frame: true,
        iconCls: 'icon-reset',
        deferreRender: false,
        activeTab: 0,
        items: [
            {
                xtype: 'panel',
                region: 'oeste',
                items: gridTotalPanico
            },
            {
                xtype: 'panel',
                region: 'center',
                items: gridInfPanico
            }
        ]
    });
    panelMapa.add(tabVelocidad);
    panelMapa.setActiveTab(tabVelocidad);
}
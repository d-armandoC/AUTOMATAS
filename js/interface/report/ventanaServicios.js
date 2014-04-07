var contenedorWinSer;
var winSer;

var cbxEmpresasBDSer;
var cbxBusesBDSer;
var dateIniSer;
var dateFinSer;
var timeIniSer;
var timeFinSer;

Ext.onReady(function() {

    cbxEmpresasBDSer = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresasSer',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDSer.enable();
                cbxBusesBDSer.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDSer = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesSer',
        name: 'cbxBusesSer',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 300
        }
    });

    dateIniSer = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniSer',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinSer',
        emptyText: 'Fecha Inicial...'
    });

    dateFinSer = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinSer',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniSer',
        emptyText: 'Fecha Final...'
    });

    timeIniSer = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinSer = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMSer = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls : 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniSer.setValue(formatoFecha(nowDate));
            dateFinSer.setValue(formatoFecha(nowDate));

            timeIniSer.setValue('00:01');
            timeFinSer.setValue('23:59');
        }
    });

    var btn2RecMSer = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls : 'icon-yesterday',
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
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateIniSer.setValue(año + "-" + mes + "-" + dia);
            dateFinSer.setValue(año + "-" + mes + "-" + dia);

            timeIniSer.setValue('00:01');
            timeFinSer.setValue('23:59');
        }
    });

    var panelBotonesSer = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMSer]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMSer]
            }]
    });

    contenedorWinSer = Ext.create('Ext.form.Panel', {
        frame: true,
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width : 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBDSer,
                            dateIniSer,
                            timeIniSer
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDSer,
                            dateFinSer,
                            timeFinSer
                        ]
                    }]
            },
            panelBotonesSer],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinSer.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinSer.getForm().submit({
                            url: 'php/interface/getDatosGraficosHistoricos.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.MessageBox.hide();
                                Ext.MessageBox.show({
                                    title: 'Error...',
                                    msg: 'No hay un trazo posible en estas fechas y horas...',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            },
                            success: function(form, action) {
                                Ext.MessageBox.hide();
                                var resultado = Ext.JSON.decode(action.response.responseText);

                                limpiarCapasHistorico();
                                dibujarTrazadoHistorico(resultado.datos.coordenadas);
                                lienzosRecorridoHistorico(cbxBusesBDSer.getValue(), resultado.datos.coordenadas);
                                cargarTablaHistorico();

                                limpiar_datosSer();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosSer
            }]
    });
});

function limpiar_datosSer() {
    contenedorWinSer.getForm().reset();
    cbxBusesBDSer.disable();
    if (winSer) {
        winSer.hide();
    }
}

function ventanaServicios() {
    if (!winSer) {
        winSer = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Servicios',
            iconCls: 'icon-servicios',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinSer]
        });
    }
    contenedorWinSer.getForm().reset();
    winSer.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDSer.getValue();
    var unidad = cbxBusesBDSer.getValue();
    var fi = formatoFecha(dateIniSer.getValue());
    var ff = formatoFecha(dateFinSer.getValue());
    var hi = formatoHora(timeIniSer.getValue());
    var hf = formatoHora(timeFinSer.getValue());

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/getDatosHistoricos.php?cbxEmpresas=' + empresa +
                    '&cbxBuses=' + unidad +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['latitud', 'longitud', 'fecha_hora', 'velocidad', 'bateria', 'gsm', 'gps2', 'ign'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                var columnRecorridos = [
                    {text: 'Latitud', flex: 50, dataIndex: 'latitud'},
                    {text: 'Longitud', flex: 50, dataIndex: 'longitud'},
                    {text: 'Fecha', xtype: 'datecolumn', format: 'Y-m-d', flex: 35, dataIndex: 'fecha_hora'},
                    {text: 'Hora', xtype: 'datecolumn', format: 'H:i:s', flex: 35, dataIndex: 'fecha_hora'},
                    {text: 'Velocidad', dataIndex: 'velocidad', align: 'right', flex: 15, cls: 'listview-filesize'},
                    {text: 'Bateria', flex: 15, dataIndex: 'bateria', align: 'center'},
                    {text: 'GSM', flex: 15, dataIndex: 'gsm', align: 'center'},
                    {text: 'GPS2', flex: 15, dataIndex: 'gps2', align: 'center'},
                    {text: 'IGN', flex: 15, dataIndex: 'ign', align: 'center'}
                ]

                var gridHistorico = Ext.create('Ext.grid.Panel', {
                    width: '100%',
                    height: 435,
                    collapsible: true,
                    title: '<center>Recorridos Historico ' + unidad + '</center>',
                    store: store,
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: columnRecorridos
                });

                var tab = Ext.create('Ext.form.Panel', {
                    title: 'Reporte de Datos Históricos...',
                    closable: true,
                    iconCls: 'app-icon',
                    items: gridHistorico
                });

                panelMapa.add(tab);
            }
        }
    });
}
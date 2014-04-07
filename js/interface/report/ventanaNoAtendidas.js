var contenedorWinCar;
var winCar;

var cbxEmpresasBDCar;
var cbxBusesBDCar;
var dateIniCar;
var dateFinCar;
var timeIniCar;
var timeFinCar;

Ext.onReady(function() {

    cbxEmpresasBDCar = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresasCar',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDCar.enable();
                cbxBusesBDCar.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDCar = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesCar',
        name: 'cbxBusesCar',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Veículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 300
        }
    });

    dateIniCar = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniCar',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinCar',
        emptyText: 'Fecha Inicial...'
    });

    dateFinCar = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinCar',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniCar',
        emptyText: 'Fecha Final...'
    });

    timeIniCar = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinCar = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMCar = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls : 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniCar.setValue(formatoFecha(nowDate));
            dateFinCar.setValue(formatoFecha(nowDate));

            timeIniCar.setValue('00:01');
            timeFinCar.setValue('23:59');
        }
    });

    var btn2RecMCar = Ext.create('Ext.button.Button', {
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

            dateIniCar.setValue(año + "-" + mes + "-" + dia);
            dateFinCar.setValue(año + "-" + mes + "-" + dia);

            timeIniCar.setValue('00:01');
            timeFinCar.setValue('23:59');
        }
    });

    var panelBotonesCar = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMCar]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMCar]
            }]
    });

    contenedorWinCar = Ext.create('Ext.form.Panel', {
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
                            cbxEmpresasBDCar,
                            dateIniCar,
                            timeIniCar
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDCar,
                            dateFinCar,
                            timeFinCar
                        ]
                    }]
            },
            panelBotonesCar],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinCar.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinCar.getForm().submit({
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
                                lienzosRecorridoHistorico(cbxBusesBDCar.getValue(), resultado.datos.coordenadas);
                                cargarTablaHistorico();

                                limpiar_datosCar();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosCar
            }]
    });
});

function limpiar_datosCar() {
    contenedorWinCar.getForm().reset();
    cbxBusesBDCar.disable();
    if (winCar) {
        winCar.hide();
    }
}

function ventanaNoAtendidas() {
    if (!winCar) {
        winCar = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Carreras no atendidas',
            iconCls: 'icon-no-atendidos',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinCar]
        });
    }
    contenedorWinCar.getForm().reset();
    winCar.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDCar.getValue();
    var unidad = cbxBusesBDCar.getValue();
    var fi = formatoFecha(dateIniCar.getValue());
    var ff = formatoFecha(dateFinCar.getValue());
    var hi = formatoHora(timeIniCar.getValue());
    var hf = formatoHora(timeFinCar.getValue());

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
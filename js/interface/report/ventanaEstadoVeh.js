var contenedorWinEst;
var winEst;

var cbxEmpresasBDEst;
var cbxBusesBDEst;
var dateIniEst;
var dateFinEst;
var timeIniEst;
var timeFinEst;

Ext.onReady(function() {

    cbxEmpresasBDEst = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresasEst',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Empresa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDEst.enable();
                cbxBusesBDEst.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDEst = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesEst',
        name: 'cbxBusesEst',
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

    dateIniEst = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEst',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEst',
        emptyText: 'Fecha Inicial...'
    });

    dateFinEst = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinEst',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEst',
        emptyText: 'Fecha Final...'
    });

    timeIniEst = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinEst = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMEst = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls : 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniEst.setValue(formatoFecha(nowDate));
            dateFinEst.setValue(formatoFecha(nowDate));

            timeIniEst.setValue('00:01');
            timeFinEst.setValue('23:59');
        }
    });

    var btn2RecMEst = Ext.create('Ext.button.Button', {
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

            dateIniEst.setValue(año + "-" + mes + "-" + dia);
            dateFinEst.setValue(año + "-" + mes + "-" + dia);

            timeIniEst.setValue('00:01');
            timeFinEst.setValue('23:59');
        }
    });

    var panelBotonesEst = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMEst]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMEst]
            }]
    });

    contenedorWinEst = Ext.create('Ext.form.Panel', {
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
                            cbxEmpresasBDEst,
                            dateIniEst,
                            timeIniEst
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDEst,
                            dateFinEst,
                            timeFinEst
                        ]
                    }]
            },
            panelBotonesEst],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinEst.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinEst.getForm().submit({
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
                                lienzosRecorridoHistorico(cbxBusesBDEst.getValue(), resultado.datos.coordenadas);
                                cargarTablaHistorico();

                                limpiar_datosEst();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEst
            }]
    });
});

function limpiar_datosEst() {
    contenedorWinEst.getForm().reset();
    cbxBusesBDEst.disable();
    if (winEst) {
        winEst.hide();
    }
}

function ventanaEstadoDeVehiculos() {
    if (!winEst) {
        winEst = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Estado de vehículos',
            iconCls: 'icon-estado-veh',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinEst]
        });
    }
    contenedorWinEst.getForm().reset();
    winEst.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDEst.getValue();
    var unidad = cbxBusesBDEst.getValue();
    var fi = formatoFecha(dateIniEst.getValue());
    var ff = formatoFecha(dateFinEst.getValue());
    var hi = formatoHora(timeIniEst.getValue());
    var hf = formatoHora(timeFinEst.getValue());

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
                ];

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
var contenedorWinFlota;
var winFlota;

Ext.onReady(function() {

    var storeVeh = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboVeh.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniFlota',
        value: new Date(),
        maxValue: new Date(),
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinFlota',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinFlota',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniFlota',
        emptyText: 'Fecha Final...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIni.setValue(formatoFecha(nowDate));
            dateFin.setValue(formatoFecha(nowDate));

            timeIni.setValue('00:01');
            timeFin.setValue('23:59');
        }
    });

    var yesterday = Ext.create('Ext.button.Button', {
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
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateIni.setValue(año + "-" + mes + "-" + dia);
            dateFin.setValue(año + "-" + mes + "-" + dia);

            timeIni.setValue('00:01');
            timeFin.setValue('23:59');
        }
    });

    var panelBotones = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [today]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterday]
            }]
    });

    contenedorWinFlota = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        items: [{
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
                        xtype: 'combobox',
                        fieldLabel: 'Cooperativa',
                        name: 'cbxEmpresas',
                        store: storeEmpresas,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        editable: false,
                        allowBlank: false,
                        emptyText: 'Seleccionar Cooperativa...',
                        listeners: {
                            select: function(combo, records, eOpts) {

                                //var listSelected = Ext.getCmp('itemselector-field');
                                var listSelected = contenedorWinFlota.down('[name=listVeh]');
                                listSelected.clearValue();
                                listSelected.fromField.store.removeAll();

                                storeVeh.load({
                                    params: {
                                        cbxEmpresas: records[0].data.id
                                    }
                                });
                            }
                        }
                    }]
            }, {
                xtype: 'form',
                bodyStyle: 'padding: 10px 0 10px 0',
                width: 570,
                baseCls: 'x-plain',
                items: [{
                        xtype: 'itemselector',
                        name: 'listVeh',
                        anchor: '97%',
                        height: 170,
                        store: storeVeh,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Vehiculos',
                        toTitle: 'Seleccionados'
                    }]
            }, {
                xtype: 'form',
                baseCls: 'x-plain',
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
                                    dateIni,
                                    timeIni
                                ]
                            }, {
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateFin,
                                    timeFin
                                ]
                            }]
                    }]
            }, panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinFlota.getForm().isValid()) {
                        loadGridFlota();
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosFlota
            }]
    });
});

function limpiar_datosFlota() {
    lienzoGeoCercas.destroyFeatures();
    contenedorWinFlota.getForm().reset();

    //contenedorWinFlota.down('[name=listVeh]').clearValue();
    //contenedorWinFlota.down('[name=listVeh]').fromField.store.removeAll();

    if (winFlota) {
        winFlota.hide();
    }
}

function ventanaFlota() {
    if (!winFlota) {
        winFlota = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte Flota',
            iconCls: 'icon-flota',
            resizable: false,
            width: 600,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinFlota],
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosFlota();
                }
            }
        });
    }
    contenedorWinFlota.getForm().reset();
    winFlota.show();
}

function loadGridFlota() {
    var empresa = contenedorWinFlota.down('[name=cbxEmpresas]').getValue();
    var listVeh = contenedorWinFlota.down('[name=listVeh]').getValue();
    var fi = formatoFecha(contenedorWinFlota.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorWinFlota.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorWinFlota.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorWinFlota.down('[name=horaFin]').getValue());

    Ext.MessageBox.show({
        title: "Obteniendo Datos",
        msg: "Reportes",
        progressText: "Obteniendo...",
        wait: true,
        waitConfig: {
            interval: 200
        }
    });

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportFlota.php?cbxEmpresas=' + empresa +
                    '&listVeh=' + listVeh +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['vehiculo', 'distancia', 'vel_max', 'vel_prom', 'time_rodando', 'time_detenido', 'paradas', 'percent_rodando', 'percent_detenido'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records.length > 0) {
                    var columnFlota = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Vehiculo', flex: 60, dataIndex: 'vehiculo'},
                        {text: 'Distancia (Km)', flex: 40, dataIndex: 'distancia', align: 'center'},
                        {text: 'Velocidad Max (Km/h)', flex: 40, dataIndex: 'vel_max', align: 'center'},
                        {text: 'Velocidad Prom (Km/h)', flex: 40, dataIndex: 'vel_prom', align: 'center'},
                        {text: 'Tiempo Rodando', flex: 30, dataIndex: 'time_rodando', align: 'center'},
                        {text: 'Tiempo Detenido', flex: 30, dataIndex: 'time_detenido', align: 'center'},
                        {text: 'Paradas', flex: 20, dataIndex: 'paradas', align: 'center'},
                        {text: '% Rodando', flex: 30, dataIndex: 'percent_rodando', align: 'center'},
                        {text: '% Detenido', flex: 30, dataIndex: 'percent_detenido', align: 'center'}
                    ]

                    var gridFlota = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 455,
                        collapsible: true,
                        title: '<center>Reporte de  Flota</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnFlota
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Flota',
                        closable: true,
                        iconCls: 'icon-flota',
                        items: gridFlota
                    });

                    panelMapa.add(tab);
                    panelMapa.setActiveTab(tab);

                    limpiar_datosFlota();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No hay Datos en estas fechas y horas...',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }

            }
        }
    });
}
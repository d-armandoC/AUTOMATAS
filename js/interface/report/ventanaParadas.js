var contenedorWinPar;
var winPar;

Ext.onReady(function() {

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxVehBD.enable();
                cbxVehBD.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo:',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 300
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        value: new Date(),
        maxValue: new Date(),
        id: 'fechaIniPar',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinPar',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinPar',
        value: new Date(),
        maxValue: new Date(),
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniPar',
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

    var yesterdey = Ext.create('Ext.button.Button', {
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
                items: [yesterdey]
            }]
    });

    contenedorWinPar = Ext.create('Ext.form.Panel', {
        frame: true,
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
                            cbxEmpresasBD,
                            dateIni,
                            timeIni
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxVehBD,
                            dateFin,
                            timeFin
                        ]
                    }]
            },
            panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinPar.getForm().isValid()) {
                        loadGridStop();
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosPar
            }]
    });
});

function limpiar_datosPar() {
    contenedorWinPar.getForm().reset();
    contenedorWinPar.down('[name=cbxVeh]').disable();

    if (winPar) {
        winPar.hide();
    }
}

function ventanaParadas() {
    if (!winPar) {
        winPar = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Paradas',
            iconCls: 'icon-stop',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinPar],
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosPar();
                }
            }
        });
    }
    contenedorWinPar.getForm().reset();
    winPar.show();
}


function loadGridStop() {
    var empresa = contenedorWinPar.down('[name=cbxEmpresas]').getValue();
    var idEqp = contenedorWinPar.down('[name=cbxVeh]').getValue();
    var fi = formatoFecha(contenedorWinPar.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorWinPar.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorWinPar.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorWinPar.down('[name=horaFin]').getValue());

    var vehiculo = contenedorWinPar.down('[name=cbxVeh]').getRawValue();

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
            url: 'php/interface/report/getReportStop.php?cbxEmpresas=' + empresa +
                    '&cbxVeh=' + idEqp +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['latitud', 'longitud', 'fecha_hora', 'velocidad', 'bateria', 'gsm', 'gps2', 'ign', 'evt', 'direccion'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records.length > 0) {
                    var columnEvets = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Fecha', xtype: 'datecolumn', format: 'd-m-Y', width: 75, dataIndex: 'fecha_hora', align: 'center'},
                        {text: 'Hora', xtype: 'datecolumn', format: 'H:i:s', width: 75, dataIndex: 'fecha_hora', align: 'center'},
                        {text: 'Vel. (Km/h)', dataIndex: 'velocidad', align: 'right', width: 75, cls: 'listview-filesize'},
                        {text: 'Bateria', width: 50, dataIndex: 'bateria', align: 'center'},
                        {text: 'GSM', width: 50, dataIndex: 'gsm', align: 'center'},
                        {text: 'GPS2', width: 50, dataIndex: 'gps2', align: 'center'},
                        {text: 'IGN', width: 50, dataIndex: 'ign', align: 'center'},
                        {text: 'Evento', width: 150, dataIndex: 'evt'},
                        {text: 'Direccion', flex: 300, dataIndex: 'direccion'},
                        {text: 'Latitud', width: 150, dataIndex: 'latitud'},
                        {text: 'Longitud', width: 150, dataIndex: 'longitud'},
                    ]

                    var gridEvents = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 455,
                        collapsible: true,
                        title: '<center>Reporte de Paradas: ' + vehiculo + '</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnEvets,
                        listeners: {
                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                panelMapa.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        }
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Paradas',
                        closable: true,
                        iconCls: 'icon-stop',
                        items: gridEvents
                    });

                    panelMapa.add(tab);
                    panelMapa.setActiveTab(tab);

                    limpiar_datosPar();
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
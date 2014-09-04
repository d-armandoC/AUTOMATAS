var contenedorwinEvt;
var winEvt;

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
        fields: [{name: 'value', mapping: 'id'}, 'text']
    });

    var storeEventos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboEventos.php',
            reader: {
                type: 'json',
                root: 'eventos'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
    });

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                var listSelected = contenedorwinEvt.down('[name=listVeh]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();

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
        id: 'fechaIniEvt',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEvt',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEvt',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEvt',
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

    contenedorwinEvt = Ext.create('Ext.form.Panel', {
        bodyStyle : 'padding: 10px; background-color: #DFE8F6',
        baseCls : 'x-plain',
        frame: false,
        padding: '5 5 5 5',
        items: [{
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
                                    cbxEmpresasBD,
                                ]
                            }]
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
                        height: 150,
                        store: storeVeh,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Vehiculos',
                        toTitle: 'Seleccionados'
                    }, {
                        xtype: 'itemselector',
                        name: 'listEvt',
                        anchor: '97%',
                        height: 150,
                        store: storeEventos,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Eventos',
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
                    if (contenedorwinEvt.getForm().isValid()) {
                        loadGridEvents();
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEvt
            }]
    });
});

function limpiar_datosEvt() {
    contenedorwinEvt.getForm().reset();

    if (winEvt) {
        winEvt.hide();
    }
}

function ventanaEventos() {
    if (!winEvt) {
        winEvt = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Eventos',
            iconCls: 'icon-eventos',
            resizable: false,
            width: 600,
            height: 550,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinEvt],
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosEvt();
                }
            }
        });
    }
    contenedorwinEvt.getForm().reset();
    winEvt.show();
}


function loadGridEvents() {
    
    var empresa = contenedorwinEvt.down('[name=cbxEmpresas]').getValue();
    var listVeh = contenedorwinEvt.down('[name=listVeh]').getValue();
    var listEvt = contenedorwinEvt.down('[name=listEvt]').getValue();
    var fi = formatoFecha(contenedorwinEvt.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinEvt.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinEvt.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinEvt.down('[name=horaFin]').getValue());
    var nameEmp = contenedorwinEvt.down('[name=cbxEmpresas]').getRawValue();

    Ext.MessageBox.show({
        title: "Cargando....",
        msg: "Procesando Datos",
        progressText: "Obteniendo...",
        wait: true,
        waitConfig: {
            interval: 150
        }
    });
    function formato(val) {
        if (val === '1') {
            return '<span style="color:green;">SI</span>';
        } else {
            return '<span style="color:red;">NO</span>';
        }
    }
    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportEvent.php?cbxEmpresas='+empresa +
                    '&listVeh=' + listVeh +
                    '&listEvt=' + listEvt +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['vehiculor', 'latitudr', 'longitudr', 'fecha_horar', 'velocidadr', 'bateriar', 'gsmr', 'gps2r', 'ignr', 'evtr', 'direccionr'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();
               
                if (records !== null && records.length>0) {
                    var columnEvets = [
                        Ext.create('Ext.grid.RowNumberer', {text: 'N°', width: 48}),
                        {text: '<b>Vehiculo</b>', width: 200, dataIndex: 'vehiculor', tooltip: 'vehiculo de la Empresa'},
                        {text: '<b>Fecha</b>', xtype: 'datecolumn', format: 'd-m-Y', width: 85, dataIndex: 'fecha_horar', align: 'center', tooltip: 'Fecha'},
                        {text: '<b>Hora</b>', xtype: 'datecolumn', format: 'H:i:s', width: 75, dataIndex: 'fecha_horar', align: 'center', tooltip: 'Hora'},
                        {text: '<b>Vel. (Km/h)</b>', dataIndex: 'velocidadr', align: 'right', width: 105, cls: 'listview-filesize', renderer: formatSpeed, tooltip: 'Velocidad'},
                        {text: '<b>Bateria</b>', width: 75, dataIndex: 'bateriar', align: 'center', renderer: formato, tooltip: 'Bateria'},
                        {text: '<b>GSM</b>', width: 65, dataIndex: 'gsmr', align: 'center', renderer: formato, tooltip: 'GSM'},
                        {text: '<b>GPS2</b>', width: 65, dataIndex: 'gps2r', align: 'center', renderer: formato, tooltip: 'GPS2'},
                        {text: '<b>IGN</b>', width: 65, dataIndex: 'ignr', align: 'center', renderer: formato, tooltip: 'IGN'},
                        {text: '<b>Evento</b>', width: 250, dataIndex: 'evtr', tooltip: 'Evento'},
                        {text: '<b>Direccion</b>', width: 300, dataIndex: 'direccionr', tooltip: 'Direccion'},
                        {text: '<b>Latitud</b>', width: 150, dataIndex: 'latitudr', tooltip: 'Latitud'},
                        {text: '<b>Longitud</b>', width: 150, dataIndex: 'longitudr', tooltip: 'Longitud'}
                    ]

                    var gridEvents = Ext.create('Ext.grid.Panel', {
                        width: '100%',
//                        height: 485,
                        collapsible: true,
                        autoScroll: true,
                        height: 435,
                        //width: 800,
                        title: '<center>Reporte de Eventos: ' + nameEmp + '</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnEvets,
                        listeners: {
                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        }
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Eventos',
                        closable: true,
                        iconCls: 'icon-eventos',
                        items: gridEvents
                    });

                    panelTabMapaAdmin.add(tab);
                    panelTabMapaAdmin.setActiveTab(tab);

                    limpiar_datosEvt();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No hay datos a mostrar en su Petición',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                   
                }

            }
        }
    });
}
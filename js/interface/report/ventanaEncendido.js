var contenedorwinEnc;
var winEnc;

Ext.onReady(function() {

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
            minWidth : 300
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEnc',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEnc',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEnc',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEnc',
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
        iconCls : 'icon-today',
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

    contenedorwinEnc = Ext.create('Ext.form.Panel', {
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
                    cbxEmpresasBD,
                    dateIni,
                    timeIni
                ]            
            },{
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
                    if (contenedorwinEnc.getForm().isValid()) {
                        loadGridEnc();                        
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEnc
            }]
    });
});

function limpiar_datosEnc() {
    contenedorwinEnc.getForm().reset();
    contenedorwinEnc.down('[name=cbxVeh]').disable();

    if (winEnc) {
        winEnc.hide();
    }
}

function ventanaEncendido() {
    if (!winEnc) {
        winEnc = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Encendido y Apagado',
            iconCls: 'icon-on-off',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinEnc],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosEnc();
                }
            }
        });
    }
    contenedorwinEnc.getForm().reset();
    winEnc.show();
}


function loadGridEnc() {
    var empresa = contenedorwinEnc.down('[name=cbxEmpresas]').getValue();
    var idEqp = contenedorwinEnc.down('[name=cbxVeh]').getValue();    
    var fi = formatoFecha(contenedorwinEnc.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinEnc.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinEnc.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinEnc.down('[name=horaFin]').getValue());

    var vehiculo = contenedorwinEnc.down('[name=cbxVeh]').getRawValue();

    Ext.MessageBox.show({
        title : "Obteniendo Datos",
        msg : "Reportes",
        progressText : "Obteniendo...",                        
        wait : true,
        waitConfig : {
            interval:200
        }
    });

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportEncApag.php?cbxEmpresas=' + empresa +
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
                        {text: 'Evento', width: 250, dataIndex: 'evt'},
                        {text: 'Direccion', flex: 300, dataIndex: 'direccion'},
                        {text: 'Latitud', width: 150, dataIndex: 'latitud'},
                        {text: 'Longitud', width: 150, dataIndex: 'longitud'}
                    ]

                    var gridEvents = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 455,
                        collapsible: true,
                        title: '<center>Reporte de Encendido/Apagado ' + vehiculo + '</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnEvets,
                        listeners : {
                            itemcontextmenu : function( thisObj, record, item, index, e, eOpts ){
                                panelMapa.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        }
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Enc/Apag',
                        closable: true,
                        iconCls: 'icon-on-off',
                        items: gridEvents
                    });

                    panelMapa.add(tab);
                    panelMapa.setActiveTab(tab);

                    limpiar_datosEnc();
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
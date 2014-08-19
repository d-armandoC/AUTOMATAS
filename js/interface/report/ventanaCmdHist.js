var contenedorwinCmdHist;
var winCmdHist;

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
        id: 'fechaIniCmdHist',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinCmdHist',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinCmdHist',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniCmdHist',
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

    var yesterdey = Ext.create('Ext.button.Button', {
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
            items: [yesterdey]
        }]
    });

    contenedorwinCmdHist = Ext.create('Ext.form.Panel', {
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
                    if (contenedorwinCmdHist.getForm().isValid()) {
                        loadGridCmdHist();                        
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosCmdHist
            }]
    });
});

function limpiar_datosCmdHist() {
    contenedorwinCmdHist.getForm().reset();
    contenedorwinCmdHist.down('[name=cbxVeh]').disable();

    if (winCmdHist) {
        winCmdHist.hide();
    }
}

function ventanaCmdHistorial() {
    if (!winCmdHist) {
        winCmdHist = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Paradas',
            iconCls: 'icon-cmd-hist',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinCmdHist],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosCmdHist();
                }
            }
        });
    }
    contenedorwinCmdHist.getForm().reset();
    winCmdHist.show();
}


function loadGridCmdHist() {
    var empresa = contenedorwinCmdHist.down('[name=cbxEmpresas]').getValue();
    var idEqp = contenedorwinCmdHist.down('[name=cbxVeh]').getValue();    
    var fi = formatoFecha(contenedorwinCmdHist.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinCmdHist.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinCmdHist.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinCmdHist.down('[name=horaFin]').getValue());

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
            url: 'php/interface/report/cmd/getReportCmd.php?cbxEmpresas=' + empresa +
                    '&cbxVeh=' + idEqp +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'cmd_hist'
            }
        },
        fields: ['usuario', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records.length > 0) {                    
                    var columnCmdHist = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Usuario', width: 150, dataIndex: 'usuario'},
                        {text: 'Comando', flex: 150, dataIndex: 'comando'},                        
                        {text: 'Respuesta', dataIndex: 'respuesta', flex: 100},
                        {text: 'Fecha Creacion', width: 150, dataIndex: 'fecha_creacion'},
                        {text: 'Fecha Envio', width: 150, dataIndex: 'fecha_envio'},
                        {text: 'Estado', width: 100, dataIndex: 'estado'}
                    ]

                    var gridCmdHist = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 435,
                        collapsible: true,
                        title: '<center>Reporte de Comandos Enviados ' + idEqp + '</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnCmdHist
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Comandos',
                        closable: true,
                        iconCls: 'icon-cmd-hist',
                        items: gridCmdHist
                    });

                    panelMapa.add(tab);
                    panelMapa.setActiveTab(tab);

                    limpiar_datosCmdHist();
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
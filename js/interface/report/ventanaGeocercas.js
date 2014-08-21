var contenedorwinRepGeo;
var winRepGeo;

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
                cbxGeoBD.clearValue();
                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
                storeGeo.load({
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
        },
        listeners : {
            select: function(combo, records, eOpts) {
                cbxGeoBD.enable();
            }
        }
    });

    var cbxGeoBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Geocerca:',        
        name: 'cbxGeo',
        store: storeGeo,
        valueField: 'id',
        displayField: 'nombre',
        queryMode: 'local',
        emptyText: 'Seleccionar Geocerca...',
        disabled: false,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 325
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniGeo',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinGeo',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinGeo',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniGeo',
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

    contenedorwinRepGeo = Ext.create('Ext.form.Panel', {
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
                    cbxGeoBD
                ]
            },{
                columnWidth: .5,
                baseCls: 'x-plain',
                items: [
                    cbxVehBD                    
                ]
            }]
        },{
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
        },
        panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinRepGeo.getForm().isValid()) {
                        loadGridGeo();                        
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosGeo
            }]
    });
});

function limpiar_datosGeo() {
    contenedorwinRepGeo.getForm().reset();
    contenedorwinRepGeo.down('[name=cbxVeh]').disable();
    contenedorwinRepGeo.down('[name=cbxGeo]').disable();

    if (winRepGeo) {
        winRepGeo.hide();
    }
}

function ventanaGeocercas() {
    if (!winRepGeo) {
        winRepGeo = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Geocercas',
            iconCls: 'icon-report-geo',
            resizable: false,
            width: 560,
            height: 210,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinRepGeo],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosGeo();
                }
            }
        });
    }
    contenedorwinRepGeo.getForm().reset();
    winRepGeo.show();
}


function loadGridGeo() {
    var empresa = contenedorwinRepGeo.down('[name=cbxEmpresas]').getValue();
    var idEqp = contenedorwinRepGeo.down('[name=cbxVeh]').getValue();
    var idGeo = contenedorwinRepGeo.down('[name=cbxGeo]').getValue();    
    var fi = formatoFecha(contenedorwinRepGeo.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinRepGeo.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinRepGeo.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinRepGeo.down('[name=horaFin]').getValue());

    var vehiculo = contenedorwinRepGeo.down('[name=cbxVeh]').getRawValue();

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
            url: 'php/interface/report/getReportGeo.php?cbxEmpresas=' + empresa +
                    '&cbxVeh=' + idEqp +
                    '&cbxGeo=' + idGeo +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['id_geocerca', 'geocerca', 'id_equipo', 'placa', 'vehiculo', 'accion', 'fecha_hora', 'notificada'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records.length > 0) {                    
                    var columnGeo = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Geocerca', flex: 50, dataIndex: 'geocerca'},
                        {text: 'Equipo', flex: 10, dataIndex: 'id_equipo'},
                        {text: 'Placa', flex: 10, dataIndex: 'placa'},
                        {text: 'Vehiculo', flex: 50, dataIndex: 'vehiculo'},
                        {text: 'Accion', flex: 1, dataIndex: 'accion'},
                        {text: 'Fecha', xtype: 'datecolumn', format: 'd-m-Y', flex: 35, dataIndex: 'fecha_hora'},
                        {text: 'Hora', xtype: 'datecolumn', format: 'H:i:s', flex: 35, dataIndex: 'fecha_hora'},
                        {text: 'Notificada', flex: 20, dataIndex: 'notificada', align: 'center'}
                    ]

                    var gridGeocercas = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 435,
                        collapsible: true,
                        title: '<center>Reporte de Geocercas: ' + vehiculo + '</center>',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnGeo
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Geocercas',
                        closable: true,
                        iconCls: 'icon-report-geo',
                        items: gridGeocercas
                    });

                    panelMapa.add(tab);
                    panelMapa.setActiveTab(tab);

                    limpiar_datosGeo();
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
var contenedorWinPanelMantenimiento;
var winMantenimiento;
var cbxBusesBDPan;
var empresa1;
var gridTotalMantenimiento;
var gridInfMantenimiento;
Ext.onReady(function() {


    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa:',
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
    var servicios = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Servicio:',
        name: 'cbxServicio',
        store: storeVehiculosservicios,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar un servicio...',
        editable: false,
        allowBlank: false
    });
    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
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
            minWidth: 450
        }
    });
    var dateIniMan = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniMan',
        value: new Date(),
        maxValue: new Date(),
        name: 'fecha_Ini_Man',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinMan',
        emptyText: 'Fecha Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var dateFinMan = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinMan',
        name: 'fecha_Fin_Man',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniMan',
        emptyText: 'Fecha Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var timeIniMan = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'hora_Ini_Man',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinMan = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'hora_Fin_Man',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btn1RecMan = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIniMan.setValue(formatoFecha(nowDate));
            dateFinMan.setValue(formatoFecha(nowDate));
            timeIniMan.setValue('00:01');
            timeFinMan.setValue('23:59');
        }
    });
    var btn2RecMan = Ext.create('Ext.button.Button', {
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

            dateIniMan.setValue(año + "-" + mes + "-" + dia);
            dateFinMan.setValue(año + "-" + mes + "-" + dia);
            timeIniMan.setValue('00:01');
            timeFinMan.setValue('23:59');
        }
    });
    var panelBotonesGenMan = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMan]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMan]
            }]
    });
    contenedorWinPanelMantenimiento = Ext.create('Ext.form.Panel', {
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
                            cbxEmpresasBD,
                            //servicios,
                            dateIniMan,
                            dateFinMan
                        ]
                    },
                    {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxVehBD,
                            timeIniMan,
                            timeFinMan

                        ]
                    },
                ]
            },
            panelBotonesGenMan],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {

                    if (contenedorWinPanelMantenimiento.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Generando Datos....',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });
                        contenedorWinPanelMantenimiento.getForm().submit({
                            url: 'php/interface/report/getCountMantenimientocByDate.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('failure', 'No hay Datos a Mostrar en Estas Fechas.');
                            },
                            success: function(form, action) {
                                var resultado = action.result;
                                loadGridTotalMantenimiento(resultado.countByMantenimiento, resultado.fi, resultado.ff, resultado.comp);
                                contenedorWinPanelMantenimiento.getForm().reset();
                            }
                        });
                    }

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function limpiar_datosPan() {
                    contenedorWinPanelMantenimiento.getForm().reset();
                    // cbxBusesBDPan.disable();
                    if (winMantenimiento) {
                        winMantenimiento.hide();
                    }
                }

            }]
    });
});
function  ventanaMantenimiento() {
    if (!winMantenimiento) {
        winMantenimiento = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registro Mantenimiento',
            iconCls: 'icon-config',
            resizable: false,
            width: 560,
            height: 250,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinPanelMantenimiento]
        });
    }
    contenedorWinPanelMantenimiento.getForm().reset();
    winMantenimiento.show();
}
function loadGridTotalMantenimiento(store, fi, ff, empresa) {
    var stor1 = Ext.create('Ext.data.JsonStore', {
        data: store,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['empresa', 'vehiculo', 'total']

    });

    gridTotalMantenimiento = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + "<br>" + 'Durante ' + fi + ' Hasta ' + ff + '</center>',
        store: stor1,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 30}),
            {text: '<b>Empresa</b>', width: 250, dataIndex: 'empresa', align: 'center'},
            {text: '<b>Vehiculo</b>', width: 250, dataIndex: 'vehiculo', align: 'center'},
            {text: '<b>Cantidad Mantenimientos</b>', width: 250, dataIndex: 'total', align: 'center'}],
    });

    var tabExcesos1 = Ext.create('Ext.container.Container', {
        title: 'Reporte Mantenimiento General',
        closable: true,
        iconCls: 'icon-config',
        layout: 'border',
        fullscreen: true,
        height: 485,
        width: 2000,
        region: 'center',
        items: [gridTotalMantenimiento]
    });
    panelTabMapaAdmin.add(tabExcesos1);
    panelTabMapaAdmin.setActiveTab(tabExcesos1);
    winMantenimiento.hide();
}



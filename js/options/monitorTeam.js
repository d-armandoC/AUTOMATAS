Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-4.2.2/extjs-build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'Ext.ux.CheckColumn',
    'Ext.chart.*'
]);

var refresh = false;
var timeRefresh = 15;

Ext.onReady(function() {

    Ext.tip.QuickTipManager.init();

    var menuRefresh = Ext.create('Ext.menu.Menu', {
        width: 100,
        margin: '0 0 10 0',
        items: [
            {group: 'time-refresh', text: '15 seg.', checked: false, inputValue: 15},
            {group: 'time-refresh', text: '20 seg.', checked: false, inputValue: 20},
            {group: 'time-refresh', text: '30 seg.', checked: false, inputValue: 30},
            {group: 'time-refresh', text: '1 min.', checked: false, inputValue: 60}, '-',
            {group: 'time-refresh', text: 'Nunca', checked: true, inputValue: false}
        ],
        listeners: {
            click: function(menu, item, e, eOpts) {
                var valor = item.inputValue;
                if (valor) {
                    refresh = true;
                    timeRefresh = valor;
                } else {
                    refresh = false;
                }
            }
        }
    });

    var filters = {
        ftype: 'filters',
        // encode and local configuration options defined previously for easier reuse
        encode: false, // json encode the filter query
        local: true, // defaults to false (remote filtering)

        // Filters are most naturally placed in the column definition, but can also be
        // added here.
        filters: [{
                type: 'boolean',
                dataIndex: 'visible'
            }]
    };

    var storeStateEqp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEqp.php',
            reader: {
                type: 'json',
                root: 'stateEqp'
            }
        },
        fields: ['empresa', 'idEquipo', {name: 'vehiculo', type: 'int'}, 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'bateria', 'estado',
            {name: 'fechaEstado', type: 'string'}, 'gsm', 'gps2', 'vel', 'activo', 'ign', 'taximetro', 'panico']/*,
        groupField: 'empresa'*/
    });

    var storeProblemEqp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getProblemEqp.php',
            reader: {
                type: 'json',
                root: 'problemEqp'
            }
        },
        fields: ['empresa', 'idEquipo', {name: 'vehiculo', type: 'int'}, 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'bateria', 'estado',
            {name: 'fechaEstado', type: 'string'}, 'gsm', 'gps2', 'vel', 'activo', 'ign', 'taximetro', 'panico']
    });

    var storeStateEqpUdp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEqpUdp.php',
            reader: {
                type: 'json',
                root: 'stateEqpUdp'
            }
        },
        fields: ['empresa', 'idEquipo', 'vehiculo', 'velocidad', 'fechaConect', 'timeDesconect',
            'encabezado', 'estadoUnidad', 'estadoMecanico']
    });

    var storeStateEmp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEmp.php',
            reader: {
                type: 'json',
                root: 'stateEmp'
            }
        },
        fields: ['empresa', 'ip', 'min_atras', 'ini_conex']
    });

    var storeEmpresasList = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/listFilters/listEmpresas.php',
            reader: {
                type: 'array'
            }
        },
        fields: ['id', 'text']
    });

    var storeCantEqp = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getCantEqp.php',
            reader: {
                type: 'json',
                root: 'cantEqp'
            }
        },
        fields: ['conect', 'desco', 'total', 'empresa']
    });

    var gridStateEqpSKP = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Estado de Equipos</b>',
        store: storeStateEqp,
        iconCls: 'icon-skp',
        columnLines: true,
        features: [/*{
                id: 'group-skp',
                ftype: 'groupingsummary',
                groupHeaderTpl: '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu: false
            },*/ filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {text: '<b>Equipo</b>', width: 60, dataIndex: 'idEquipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 60, dataIndex: 'vehiculo', filter: {type: 'numeric'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 140, dataIndex: 'fhCon', align: 'center'},
            {text: '<b>Fecha Ult Trama</b>', width: 140, dataIndex: 'fhDes', align: 'center'},
            {text: '<b>Tmp Conex.</b>', width: 70, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center'},
            {text: '<b>Tmp Desc.</b>', width: 60, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Bateria</b>', width: 50, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GSM</b>', width: 50, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GPS2</b>', width: 50, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>Vel (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 75, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 50, dataIndex: 'activo', renderer: formatLock, align: 'center'},
            {text: '<b>Taxímetro</b>', width: 90, dataIndex: 'taximetro', renderer: formatStateTaxy, align: 'center', filterable: true},
            {text: '<b>Pánico</b>', width: 90, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'estado', filter: {type: 'string'}},
            {text: '<b>Fecha Estado</b>', width: 100, dataIndex: 'fechaEstado', align: 'center'}
        ],
        listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                panelEste.down('[name=equipo]').setValue(record.data.idEquipo);
                panelEste.down('[name=estado]').setValue(record.data.estado);
                panelEste.down('[name=date]').setValue(record.data.fechaEstado);
            }
        }
    });

    var gridProblemEqpSKP = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Equipos Pasivos</b>',
        store: storeProblemEqp,
        iconCls: 'icon-problem',
        multiSelect: true,
        columnLines: true,
        features: [filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {text: '<b>Equipo</b>', width: 60, dataIndex: 'idEquipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 60, dataIndex: 'vehiculo', filter: {type: 'numeric'}, align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 140, dataIndex: 'fhCon', align: 'center'},
            {text: '<b>Fecha Ult Trama</b>', width: 140, dataIndex: 'fhDes', align: 'center'},
            {text: '<b>Tmp Conex.</b>', width: 70, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center'},
            {text: '<b>Tmp Desc.</b>', width: 60, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Bateria</b>', width: 50, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GSM</b>', width: 50, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GPS2</b>', width: 50, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>Vel (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 75, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 50, dataIndex: 'activo', renderer: formatLock, align: 'center'},
            {text: '<b>Taxímetro</b>', width: 90, dataIndex: 'taximetro', renderer: formatStateTaxy, align: 'center', filterable: true},
            {text: '<b>Pánico</b>', width: 90, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'estado', filter: {type: 'string'}},
            {text: '<b>Fecha Estado</b>', width: 100, dataIndex: 'fechaEstado', align: 'center'}
        ],
        listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                panelEste.down('[name=equipo]').setValue(record.data.idEquipo);
                panelEste.down('[name=estado]').setValue(record.data.estado);
                panelEste.down('[name=date]').setValue(record.data.fechaEstado);
            }
        }
    });

    var gridStateEqpUdp = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Estado de Equipos Fastrack</b>',
        iconCls: 'icon-fastrack',
        split: true,
        store: storeStateEqpUdp,
        columnLines: true,
        features: [filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35}),
            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', align: 'center', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
            {text: '<b>Equipo</b>', width: 60, dataIndex: 'idEquipo', align: 'center', filter: {type: 'string'}},
            {text: '<b>Vehículo</b>', width: 60, dataIndex: 'vehiculo', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Fecha y Hora Conex.</b>', width: 120, dataIndex: 'fechaConect', align: 'center'},
            {text: '<b>Estado</b>', width: 90, dataIndex: 'timeDesconect', align: 'center', renderer: formatState},
            {text: '<b>Tmp Desc.</b>', width: 50, dataIndex: 'timeDesconect', align: 'center'},
            {text: '<b>Encabezado</b>', width: 120, dataIndex: 'encabezado', align: 'center'},
            {text: '<b>Velocidad</b>', width: 60, dataIndex: 'velocidad', align: 'center', renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Estado Unidad</b>', width: 140, dataIndex: 'estadoUnidad', align: 'center', renderer: formatStateMec},
            {text: '<b>Estado Mecánico</b>', width: 140, dataIndex: 'estadoMecanico', align: 'center', renderer: formatStateMec}
        ],
        listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                panelEste.down('[name=equipo]').setValue(record.data.idEquipo);
                panelEste.down('[name=estado]').setValue(record.data.estado);
                panelEste.down('[name=date]').setValue(record.data.fechaEstado);
            }
        }
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'east',
        title: '<b>Configuraciones</b>',
        iconCls: 'icon-config',
        frame: true,
        split: true,
        width: '28%',
        collapsible: true,
        layout: 'border',
        items: [{
                region: 'north',
                frame: true,
                bodyPadding: 10,
                title: '<b>Asignar Estado al Equipo</b>',
                defaults: {
                    labelWidth: 75,
                    width: 300
                },
                items: [
                    {xtype: 'textfield', fieldLabel: '<b>Equipo</b>', name: 'equipo', allowBlank: false},
                    {xtype: 'textarea', fieldLabel: '<b>Estado</b>', name: 'estado'},
                    {xtype: 'datefield', fieldLabel: '<b>Fecha</b>', name: 'date', format: 'Y-m-d'}
                ],
                dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'footer',
                        items: [{
                                text: 'Vitacora',
                                iconCls: 'icon-vita-eqp',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/getVitacoraEqp.php',
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: action.result.msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    var storeVitacora = Ext.create('Ext.data.Store', {
                                                        fields: ['estado', 'fechaEstado', 'fechaHoraReg', 'tecnico'],
                                                        data: action.result.vitaStateEqp
                                                    });

                                                    var windowVitacora = Ext.create('Ext.window.Window', {
                                                        title: 'Vitacora de Equipo: ' + panelEste.down('[name=equipo]').getValue(),
                                                        iconCls: 'icon-vita-eqp',
                                                        height: 400,
                                                        width: 600,
                                                        layout: 'form',
                                                        items: [{
                                                                xtype: 'grid',
                                                                height: 300,
                                                                border: false,
                                                                columns: [
                                                                    {text: '<b>Técnico</b>', width: 150, dataIndex: 'tecnico'},
                                                                    {text: '<b>Estado</b>', flex: 1, dataIndex: 'estado'},
                                                                    {text: '<b>Fecha Estado</b>', width: 100, dataIndex: 'fechaEstado'},
                                                                    {text: '<b>Fecha de Registro</b>', width: 150, dataIndex: 'fechaHoraReg'}
                                                                ],
                                                                store: storeVitacora,
                                                                listeners: {
                                                                    select: function(thisObj, record, index, eOpts) {
                                                                        windowVitacora.down('[name=estado]').setValue(record.data.estado);
                                                                    }
                                                                }
                                                            }, {
                                                                xtype: 'textarea',
                                                                grow: true,
                                                                name: 'estado'
                                                            }]
                                                    }).show();
                                                }
                                            });
                                        }
                                    });
                                }
                            }, '->', {
                                iconCls: 'icon-skp',
                                tooltip: '<b>Devolver a Estado de Equipos</b>',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/setProblem.php',
                                                params: {
                                                    problem: 0
                                                },
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: 'No fue posible Actualizar Estado',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    Ext.example.msg("Mensaje", 'Vehiculo devuelto a la Lista de Estados Correctamente...');
                                                    form.reset();
                                                    window.loadTask.delay(500, function() {
                                                        storeStateEqp.reload();
                                                        storeProblemEqp.reload();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }, '-', {
                                iconCls: 'icon-problem',
                                tooltip: '<b>Enviar a la Lista de Eqp. Pasivos</b>',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/setProblem.php',
                                                params: {
                                                    problem: 1
                                                },
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: 'No fue posible Actualizar Estado',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    Ext.example.msg("Mensaje", 'Vehiculo Enviado a Lista de Problemas Correctamente...');
                                                    form.reset();
                                                    window.loadTask.delay(500, function() {
                                                        storeStateEqp.reload();
                                                        storeProblemEqp.reload();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }, '-', {
                                iconCls: 'icon-unlock',
                                tooltip: '<b>Desbloquear Unidad</b>',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/setBloqueo.php',
                                                params: {
                                                    bloqueo: 0
                                                },
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: 'No fue posible Actualizar Estado',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    Ext.example.msg("Mensaje", 'Vehiculo Desbloqueado Correctamente...');
                                                    form.reset();
                                                    window.loadTask.delay(500, function() {
                                                        storeStateEqp.reload();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }, '-', {
                                iconCls: 'icon-lock',
                                tooltip: '<b>Bloquear Unidad</b>',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/setBloqueo.php',
                                                params: {
                                                    bloqueo: 1
                                                },
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: 'No fue posible Actualizar Estado',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    Ext.example.msg("Mensaje", 'Vehiculo Bloqueado Correctamente...');
                                                    form.reset();
                                                    window.loadTask.delay(500, function() {
                                                        storeStateEqp.reload();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }, '-', {
                                text: '<b>Asignar</b>',
                                tooltip: '<b>Asignar Estado</b>',
                                iconCls: 'icon-check',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    window.loadTask.delay(500, function() {
                                        if (form.isValid()) {
                                            form.submit({
                                                url: 'php/interface/monitoring/setState.php',
                                                failure: function(form, action) {
                                                    Ext.MessageBox.show({
                                                        title: 'Error...',
                                                        msg: 'No fue posible Actualizar Estado',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                },
                                                success: function(form, action) {
                                                    Ext.example.msg("Mensaje", 'Estado Modificado Correctamente...');
                                                    form.reset();
                                                    window.loadTask.delay(500, function() {
                                                        storeStateEqp.reload();
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }]
                    }]
            }, {
                region: 'center',
                xtype: 'grid',
                store: storeCantEqp,
                columns: [
                    {text: '<b>Empresa</b>', flex: 2, dataIndex: 'empresa', renderer: formatCompany},
                    {text: '<b>Conectados</b>', flex: 2, dataIndex: 'conect', align: 'center'},
                    {text: '<b>Desconectados</b>', flex: 2, dataIndex: 'desco', align: 'center'},
                    {text: '<b>Total</b>', flex: 1, dataIndex: 'total', align: 'center'}
                ],
                viewConfig: {
                    emptyText: '<center>No hay datos que Mostrar</center>',
                    loadMask: false,
                    preserveScrollOnRefresh: true
                }
            }, {
                region: 'south',
                xtype: 'grid',
                height: '30%',
                store: storeStateEmp,
                columns: [
                    {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', renderer: formatCompany},
                    {text: '<b>Ini. Conex.</b>', width: 130, dataIndex: 'ini_conex'},
                    {text: '<b>Min. Atras</b>', width: 60, dataIndex: 'min_atras'},
                    {text: '<b>Ip</b>', flex: 100, dataIndex: 'ip'}
                ],
                viewConfig: {
                    emptyText: '<center>No hay datos que Mostrar</center>',
                    loadMask: false,
                    preserveScrollOnRefresh: true
                }
            }],
        tools: [{
                type: 'expand',
                tooltip: '<b>Tiempo de Recarga.</b>',
                callback: function(owner, tool, event) {
                    menuRefresh.showBy(tool.el);
                }
            }, {
                type: 'refresh',
                tooltip: '<b>Refrescar Datos.<b>',
                handler: function(event, toolEl, panelHeader) {
                    Ext.example.msg('Mensaje', 'Datos Recargados Correctamente.');
                    window.loadTask.delay(500, function() {
                        storeStateEqp.reload();
                        storeStateEqpUdp.reload();
                        storeProblemEqp.reload();
                    });
                }
            }]
    });

    var panelCentral = Ext.create('Ext.tab.Panel', {
        region: 'center',
        deferreRender: false,
        activeTab: 0,
        items: [gridStateEqpSKP, gridStateEqpUdp, gridProblemEqpSKP]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelCentral, panelEste]
    });

    reloadStateEqpByItems(storeStateEqp);
    reloadStateEqpByItems(storeStateEqpUdp);
    reloadStateEqpByItems(storeProblemEqp);
    reloadStateEqpByItems(storeCantEqp);
    reloadStore(storeStateEmp, 20);
    checkRolSesion(idRolKTaxy);
});

function reloadStateEqpByItems(store) {
    setTimeout(function() {
        reloadStateEqpByItems(store);
        if (refresh) {
            store.reload();
        }
    }
    , timeRefresh * 1000);
}

function formatStateConect(val) {
    if (val > 3) {
        return '<span style="color:red;">Disconect</span>';
    } else {
        return '<span style="color:green;">Conect</span>';
    }
}
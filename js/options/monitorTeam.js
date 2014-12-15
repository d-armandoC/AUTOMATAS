
Ext.Loader.setConfig({
    enabled: true
});
var refresh = false;
var timeRefresh = 15;
var bandera = false;
var labelInformativo = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelDatos = Ext.create('Ext.form.Label', {
    text: 'DATOS:',
    style: {
        color: 'RED'
    }
});
var labelRegistro = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelEquipo = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelFecha = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'black'
    }
});
var labelUsuario = Ext.create('Ext.form.Label', {
    text: '',
    margin: '0 0 8 0',
    style: {
        color: 'black'
    }
});
var winReporte;
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
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
    'Ext.ToolTip',
    'Ext.Component'
]);
var cantidadMegas;
var tabla = '';
var tabla1 = '';
var mensajeTabla = '';
var cantidadPrecio;
var storeStateEqp;
var storeStateEqpUdp;
var idEquipo;
var idEquipo1;
var IdVehiculo;
var estadoVeh = '';
var estadoEqui = '';
var val = 1;
var mensaje = '';
var mensajeEqui = '';
var fechaV = '';
var fechaE = '';
var usuarioV = '';
var usuarioE = '';
var gridStateEqpSKP;
var gridStateEqpSKPPasivos;
Ext.Loader.setConfig({
    enabled: true
});
var storeDataInvalid;
var refresh = false;
var timeRefresh = 15;
var equipo;
var estado;
var fechaEstado;
var panelOeste;
var panelMapa;
var tabPanelReports;
var gridListaNegra;
Ext.onReady(function() {
    Ext.apply(Ext.form.field.VTypes, {
        campos: function(val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñÑÁÉÍÓÚ\s*]{3,250}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposText: 'Solo carateres alfa numéricos',
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
        fields: ['activo', 'id_vehiculo', 'empresa', 'idEquipo', 'vehiculo', 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'bateria', 'comentario',
            'fechaEstado', 'gsm', 'gps2', 'vel', 'ign', 'taximetro', 'panico', {name: 'equipo', type: 'string'}, 'estadoE', 'estadoV', 'fecha_hora_estadoE', 'fecha_hora_estadoV']/*,
             groupField: 'empresa'*/
    });
    //para pasivos
    //
    var storeStateEqpPasivos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getStateEqpPasivos.php',
            reader: {
                type: 'json',
                root: 'stateEqpPasivos'
            }
        },
        fields: ['activo', 'id_vehiculo', 'empresa', 'idEquipo', 'vehiculo', 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'bateria', 'comentario',
            'fechaEstado', 'gsm', 'gps2', 'vel', 'ign', 'taximetro', 'panico', {name: 'equipo', type: 'string'}, 'estadoE', 'estadoV', 'fecha_hora_estadoE', 'fecha_hora_estadoV']/*,
             groupField: 'empresa'*/
    });
//lista negra

    var storeListaNegra = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getListaNegra.php',
            reader: {
                type: 'json',
                root: 'stateEqp'
            }
        },
        fields: ['activo', 'id_vehiculo', 'empresa', 'idEquipo', 'vehiculo', 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'bateria', 'comentario',
            'fechaEstado', 'gsm', 'gps2', 'vel', 'ign', 'taximetro', 'panico', {name: 'equipo', type: 'string'}, 'estadoE', 'estadoV', 'fecha_hora_estadoE', 'fecha_hora_estadoV']/*,
             groupField: 'empresa'*/
    });
    storeDataInvalid = Ext.create('Ext.data.JsonStore', {
        //autoDestroy : true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getDataInvalid.php',
            reader: {
                type: 'json',
                root: 'dataInvalid'
            }
        },
        fields: ['descripcionDI', 'fecha_hora_regDI', 'equipoDI', 'megasDI', 'precioDI', 'tramaDI', 'excepcionDI']
//
        , listeners: {///El Load  Obtiene los datos en arreglo 
            load: function(thisObj, records, successful, eOpts) {
//                console.log(records);
                var cantidadMegas = 0;
                var cantidadPrecio = 0;
                for (var i = 0; i < records.length; i++) {
                    cantidadMegas = cantidadMegas + records[i].data.megasDI;
                    cantidadPrecio = cantidadPrecio + records[i].data.precioDI;
//                    console.log(records.data.megasDI);
                }
                Ext.getCmp('form-info').setTitle('Datos Inválidos de Equipos:  ' + cantidadMegas.toFixed(4) + ' Mb');
            }
        }
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
            },
        },
        fields: ['conect', 'desco', 'total', 'empresa']
    });
    var storeUserConect = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getUserConect.php',
            reader: {
                type: 'json',
                root: 'userConect'
            }
        },
        fields: ['usuarioConect', 'rolConect', 'empresaConect', 'fechaHoraConect', 'conectadoConect', 'ipConect', 'longitudConect', 'latitudConect'
        ]
    });
    var ActionVista = Ext.create('Ext.Action', {
        iconCls: 'icon-info', // Use a URL in the icon config
        text: 'Mostrar Información',
        disabled: false,
        handler: function(widget, event) {
            var rec = gridStateEqpSKP.getSelectionModel().getSelection()[0];
            if (rec) {
                winReporte.show();
            } else {
                var rec = gridStateEqpSKPPasivosP.getSelectionModel().getSelection()[0];
                winReporte.show();
            }
        }
    });
    var contextMenu = Ext.create('Ext.menu.Menu', {
        items: [
            ActionVista
        ]
    });
    gridStateEqpSKP = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Estado de Equipos</b>',
        store: storeStateEqp,
        iconCls: 'icon-skp',
        columnLines: true,
        multiSelect: true,
        features: [filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function(event, toolEl, panelHeader) {
                    storeStateEqp.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
//            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {text: '<b>Equipo</b>', width: 65, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 95, dataIndex: 'vehiculo', align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 140, dataIndex: 'fhCon', align: 'center'},
            {text: '<b>Fecha Ult Trama</b>', width: 140, dataIndex: 'fhDes', align: 'center'},
            {text: '<b>Tmp Conex.</b>', width: 110, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 100, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center'},
            {text: '<b>Tmp Desc.</b>', width: 110, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Bateria</b>', width: 75, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>IGN</b>', width: 65, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GSM</b>', width: 65, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GPS</b>', width: 65, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>Velocidad (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 100, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 65, dataIndex: 'activo', renderer: formatLock, align: 'center'},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true},
            {text: '<b>Pánico</b>', width: 100, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true},
//            {text: '<b>Fecha Comentario</b>', width: 150, dataIndex: 'fechaEstado', align: 'center'}
        ],
        listeners: {
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    ActionVista.enable();
                } else {
                    ActionVista.disable();
                }
            },
            activate: function(este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function(thisObj, record, item, index, e, eOpts) {
//                gridStateEqpSKP.tooltip.body.update("Click tDerecho para ver información");
                winReporte.hide();
            },
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
//                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + record.data.fhCon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + record.data.fhDes + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').enable();
                panelOeste.down('#desbloquear').disable();
                panelOeste.down('#poner').enable();
                panelOeste.down('#quitar').disable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensaje = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                estadoVeh = record.data.estadoV;
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                usuarioE = 'Modificado por: ' + record.data.usuarioE;
                usuarioV = 'Modificado por: ' + record.data.usuarioV;
                labelRegistro.setText(mensaje);
                labelEquipo.setText(mensajeEqui);
                fechaE = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoE;
                fechaV = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoV;
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });
    var view = gridStateEqpSKP.getView();
    var tip = Ext.create('Ext.tip.ToolTip', {
        // The overall target element.
        target: view.el,
        // Each grid row causes its own separate show and hide.
        delegate: view.itemSelector,
        // Moving within the row should not hide the tip.
        trackMouse: true,
        // Render immediately so that tip.body can be referenced prior to the first show.
//        renderTo: Ext.getBody(),
        listeners: {
            // Change content dynamically depending on which element triggered the show.
            beforeshow: function updateTipBody(tip) {
                tip.update('Dar click derecho ');
            }
        }
    });
    ///equiposPsivos
    //


    gridStateEqpSKPPasivos = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Equipos Pasivos</b>',
        store: storeStateEqpPasivos,
        iconCls: 'icon-reten',
        columnLines: true,
        multiSelect: true,
        features: [filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function(event, toolEl, panelHeader) {
                    storeStateEqpPasivos.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
//            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {text: '<b>Equipo</b>', width: 65, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 95, dataIndex: 'vehiculo', align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 140, dataIndex: 'fhCon', align: 'center'},
            {text: '<b>Fecha Ult Trama</b>', width: 140, dataIndex: 'fhDes', align: 'center'},
            {text: '<b>Tmp Conex.</b>', width: 100, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 110, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center'},
            {text: '<b>Tmp Desc.</b>', width: 85, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Bateria</b>', width: 75, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>IGN</b>', width: 65, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GSM</b>', width: 65, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GPS</b>', width: 65, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>Velocidad (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 130, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 65, dataIndex: 'activo', renderer: formatLock, align: 'center'},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true},
            {text: '<b>Pánico</b>', width: 150, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true},
//            {text: '<b>Fecha Comentario</b>', width: 150, dataIndex: 'fechaEstado', align: 'center'}
        ],
        listeners: {
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    ActionVista.enable();
                } else {
                    ActionVista.disable();
                }
            },
            activate: function(este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function(thisObj, record, item, index, e, eOpts) {
//                gridStateEqpSKP.tooltip.body.update("Click tDerecho para ver información");
                winReporte.hide();
            },
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
//                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + record.data.fhCon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + record.data.fhDes + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').disable();
                panelOeste.down('#desbloquear').enable();
                panelOeste.down('#poner').disable();
                panelOeste.down('#quitar').disable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensaje = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                estadoVeh = record.data.estadoV;
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                usuarioE = 'Modificado por: ' + record.data.usuarioE;
                usuarioV = 'Modificado por: ' + record.data.usuarioV;
                labelRegistro.setText(mensaje);
                labelEquipo.setText(mensajeEqui);
                fechaE = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoE;
                fechaV = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoV;
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });

    gridListaNegra = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<b>Equipos en Lista Negra</b>',
        store: storeListaNegra,
        iconCls: 'icon-estado-veh',
        columnLines: true,
        activeItem:0,
        multiSelect: true,
        features: [filters],
        listeners: {
            select: function() {
            console.log('selccionado');
            }
        },
        
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            preserveScrollOnRefresh: true,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function(event, toolEl, panelHeader) {
                    storeListaNegra.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', width: 35, align: 'center'}),
//            {text: '<b>Empresa</b>', width: 100, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
            {text: '<b>Equipo</b>', width: 65, dataIndex: 'equipo', filter: {type: 'string'}, align: 'center'},
            {text: '<b>Vehículo</b>', width: 95, dataIndex: 'vehiculo', align: 'center'},
            {text: '<b>Fecha Conexión</b>', width: 140, dataIndex: 'fhCon', align: 'center'},
            {text: '<b>Fecha Ult Trama</b>', width: 140, dataIndex: 'fhDes', align: 'center'},
            {text: '<b>Tmp Conex.</b>', width: 100, dataIndex: 'tmpcon', align: 'center', filter: {type: 'numeric'}},
            {text: '<b>Estado</b>', width: 110, dataIndex: 'tmpdes', renderer: formatStateConect, align: 'center'},
            {text: '<b>Tmp Desc.</b>', width: 85, dataIndex: 'tmpdes', align: 'center', renderer: formatTmpDes, filter: {type: 'numeric'}},
            {text: '<b>Bateria</b>', width: 75, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>IGN</b>', width: 65, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GSM</b>', width: 65, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>GPS</b>', width: 65, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2, filter: {type: 'numeric'}},
            {text: '<b>Velocidad (Km/h)</b>', dataIndex: 'vel', align: 'center', width: 130, renderer: formatSpeed, filter: {type: 'numeric'}},
            {text: '<b>Activo</b>', width: 65, dataIndex: 'activo', renderer: formatLock, align: 'center'},
            {text: '<b>Comentario Vehículo</b>', width: 160, dataIndex: 'estadoV', align: 'center', filterable: true},
            {text: '<b>Comentario Equipo</b>', width: 160, dataIndex: 'estadoE', align: 'center', filterable: true},
            {text: '<b>Pánico</b>', width: 150, dataIndex: 'panico', renderer: formatPanic, align: 'center', filterable: true},
//            {text: '<b>Fecha Comentario</b>', width: 150, dataIndex: 'fechaEstado', align: 'center'}
        ],
        listeners: {
            selectionchange: function(sm, selections) {
                if (selections.length) {
                    ActionVista.enable();
                } else {
                    ActionVista.disable();
                }
            },
            activate: function(este, eOpts) {
                panelOeste.show();
            },
            itemdblclick: function(thisObj, record, item, index, e, eOpts) {
                gridStateEqpSKP.tooltip.body.update("Click Derecho para ver información");
                winReporte.hide();
            },
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                tabla = "<div style=' margin:auto ;padding:1em '>"
                        + "<table>"
//                        + "<tr><td>&nbsp</td><td><b>Empresa:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Equipo:" + '<td> </td>' + '<td>' + record.data.equipo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Vehículo:" + '<td> </td>' + '<td>' + record.data.vehiculo + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Conexión:" + '<td> </td>' + '<td>' + record.data.fhCon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Fecha Ult.Trama:" + '<td> </td>' + '<td>' + record.data.fhDes + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Conexión:" + '<td> </td>' + '<td>' + record.data.tmpcon + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Estado:" + '<td> </td>' + '<td>' + formatStateConect(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Tiempo Desconectado:" + '<td> </td>' + '<td>' + formatTmpDes(record.data.tmpdes) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Batería:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.bateria) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GSM:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gsm) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>GPS:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.gps2) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>IGN:" + '<td> </td>' + '<td>' + formatBatIgnGsmGps2(record.data.ign) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Velocidad:" + '<td> </td>' + '<td>' + record.data.vel + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Activo:" + '<td> </td>' + '<td>' + formatLock(record.data.activo) + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Vehículo:" + '<td> </td>' + '<td>' + record.data.estadoV + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Comentario Equipo:" + '<td> </td>' + '<td>' + record.data.estadoE + "</td></tr>"
                        + "<tr><td>&nbsp</td><td><b>Pánico:" + '<td> </td>' + '<td>' + formatPanic(record.data.panico) + "</td></tr>"
                        + "</table>"
                        + "<br/>"
                        + "</div>";
                panelOeste.down('#bloquear').disable();
                panelOeste.down('#desbloquear').disable();
                panelOeste.down('#poner').disable();
                panelOeste.down('#quitar').enable();
                Ext.getCmp('contenedoresg').update(tabla);
                labelFecha.setText('');
                labelUsuario.setText('');
                mensaje = 'Vehículo: ' + record.data.vehiculo;
                mensajeEqui = 'Equipo: ' + record.data.equipo;
                estadoEqui = record.data.estadoE;
                estadoVeh = record.data.estadoV;
                idEquipo = record.data.idEquipo;
                idEquipo1 = record.data.idEquipo;
                IdVehiculo = record.data.id_vehiculo;
                usuarioE = 'Modificado por: ' + record.data.usuarioE;
                usuarioV = 'Modificado por: ' + record.data.usuarioV;
                labelRegistro.setText(mensaje);
                labelEquipo.setText(mensajeEqui);
                fechaE = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoE;
                fechaV = 'Fecha de Modificación: ' + record.data.fecha_hora_estadoV;
                panelOeste.down('#b1').enable();
                panelOeste.down('#b2').enable();
                if (val === 1) {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                    labelFecha.setText(fechaV);
                    labelUsuario.setText(usuarioV);
                } else {
                    panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                    labelFecha.setText(fechaE);
                    labelUsuario.setText(usuarioE);
                }
            }
        }
    });
    var gridDataInvalid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        id: 'form-info',
        title: 'Datos Inválidos de Equipos:0000Mb ',
        iconCls: 'icon-feed-error',
        store: storeDataInvalid,
        columnLines: true,
        defaults:{xtype:'textfield'},
        bodyStyle:'padding: 10px',
        features: [filters],
        viewConfig: {
            emptyText: '<center>No hay datos que Mostrar</center>',
            loadMask: false,
            enableTextSelection:true,
            preserveScrollOnRefresh: false
        },
        tools: [{
                type: 'refresh',
                tooltip: 'Refrescar Datos',
                handler: function(event, toolEl, panelHeader) {
                    storeDataInvalid.reload();
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {text: 'Descripción', width: 200, dataIndex: 'descripcionDI', filter: {type: 'string'}, align: 'center'},
            {text: 'Fecha y Hora de Registro', width: 200, dataIndex: 'fecha_hora_regDI', align: 'center'},
            {text: 'Equipo', width: 150, dataIndex: 'equipoDI', filter: {type: 'string'}, align: 'center'},
            {text: 'Trama', width: 240, dataIndex: 'tramaDI', align: 'center'}, {text: 'Excepcion', width: 240, dataIndex: 'excepcionDI', align: 'center'}, {text: 'Tamaño/Mb', width: 100, dataIndex: 'megasDI', align: 'center'}, {text: 'Precio/Mb', width: 100, dataIndex: 'precioDI', align: 'center'},
        ], listeners: {
            activate: function(este, eOpts) {
                panelOeste.hide();
                winReporte.hide();
            }}

    });
    var panelCentral = Ext.create('Ext.tab.Panel', {
        region: 'center',
        deferreRender: false,
        activeTab: 0,
        items: [gridStateEqpSKP, gridStateEqpSKPPasivos, gridListaNegra, gridDataInvalid],
    });
    tabPanelReports = Ext.create('Ext.tab.Panel', {
        region: 'south',
        height: '45%',
        activeTab: 2,
        items: [{
                region: 'center',
                xtype: 'grid',
                iconCls: 'icon-cantidad',
                title: 'Cantidad de Equipos',
                columnLines: true,
                store: storeCantEqp,
                columns: [
                    {text: 'Organización ', width: 150, dataIndex: 'empresa', renderer: formatCompany},
                    {text: 'Conectados', width: 100, dataIndex: 'conect', align: 'center'},
                    {text: 'Desconectados', width: 150, dataIndex: 'desco', align: 'center'},
                    {text: 'Total', width: 100, dataIndex: 'total', align: 'center'}
                ],
                viewConfig: {
                    emptyText: '<center>No hay datos que Mostrar</center>',
                    loadMask: false
                }
            }
            ,{
                xtype: 'grid',
                height: '30%',
                iconCls: 'icon-user',
                title: 'Conectados',
                columnLines: true,
                store: storeUserConect,
                columns: [
                    {text: 'Usuario', width: 150, dataIndex: 'usuarioConect', align: 'center'},
                    {text: 'Rol', width: 125, dataIndex: 'rolConect', align: 'center'},
                    {text: 'Empresa', width: 150, dataIndex: 'empresaConect', renderer: formatCompany, align: 'center'},
                    {text: 'Fecha y Hora', width: 150, dataIndex: 'fechaHoraConect', align: 'center'},
                    {text: 'Estado', width: 100, dataIndex: 'conectadoConect', renderer: formatStateUser, align: 'center'},
                    {text: 'Ip', width: 100, dataIndex: 'ipConect', align: 'center'}
                ],
                viewConfig: {
                    emptyText: '<center>No hay datos que Mostrar</center>',
                    loadMask: false
                },
                listeners: {
                    select: function(thisObject, record, item, index, e, eOpts) {
                        var lon = record.data.longitudConect;
                        var lat = record.data.latitudConect;
                        if (lon !== "0" && lon !== "") {
                            tabPanelReports.setActiveTab(2);
                            localizarDireccion(lon, lat, 17);
                        } else {
                            Ext.example.msg("Error", "El Usuario no Tiene Coordenadas Correctas");
                        }
                    }
                }
            },
            Ext.create('Ext.form.Panel', {
                title: 'Mapa',
                frame: true,
                iconCls: 'icon-mapa',
                html: '<div id="map"></div>'
            })
        ]
    });
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
    estado = Ext.create('Ext.form.field.TextArea', {
        fieldLabel: '<b>Comentario</b>',
        name: 'stadoEqp',
        vtype: 'campos',
        width: 350,
        height: 70
    });
    panelOeste = Ext.create('Ext.form.Panel', {
        region: 'east',
        title: 'Configuración',
        iconCls: 'icon-config',
        name: 'panelEste',
        width: '30%',
        frame: true,
        split: true,
        collapsible: true,
        layout: 'border',
        tbar: ['->', {
                xtype: 'label',
                html: '<iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1" frameborder="0" width="98" height="20" allowTransparency="true"></iframe>'
            }],
        items: [{
                xtype: 'form',
                region: 'north',
                height: '55%',
                autoScroll: true,
                bodyPadding: 10,
                title: 'Asignar Comentario al Vehiculo',
                iconCls: 'icon-obtener',
                tools: [{
                        type: 'expand',
                        tooltip: '<b>Tiempo de actualización.</b>',
                        callback: function(owner, tool, event) {
                            menuRefresh.showBy(tool.el);
                        }
                    }, {
                        type: 'refresh',
                        tooltip: '<b>Actualizar datos.<b>',
                        handler: function(event, toolEl, panelHeader) {
                            Ext.example.msg('Mensaje', 'Datos actualizados correctamente.');
                            storeStateEqp.reload();
                            storeUserConect.reload();
                            storeCantEqp.reload();
                        }
                    }],
                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '<b>Criterios</b>',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [{boxLabel: 'Por Vehiculo ', name: 'rb', inputValue: '1', checked: true}, {boxLabel: 'Por Equipo', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        idEquipo = IdVehiculo;
                                        panelOeste.down('[name=stadoEqp]').setValue(estadoVeh);
                                        val = 1;
                                        labelFecha.setText(fechaV);
                                        labelUsuario.setText(usuarioV);
                                        break;
                                    case 2:
                                        panelOeste.down('[name=stadoEqp]').setValue(estadoEqui);
                                        val = 2;
                                        labelFecha.setText(fechaE);
                                        labelUsuario.setText(usuarioE);
                                        break;
                                }

                            }
                        }
                    },
                    {
                        xtype: 'panel',
                        margin: '5 5 5 5',
                        border: false,
                        layout: 'vbox',
                        bodyStyle: {
                            background: '#ffc'
                        },
                        items: [labelDatos, estado, labelRegistro, labelEquipo,
                            labelFecha, labelUsuario]
                    }, labelInformativo
                ],
                dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'footer',
                        items: [{
                                xtype: 'button',
                                iconCls: 'icon-vita-eqp',
                                tooltip: '<b>Agregar Bitácora</b>',
                                text: 'Bitácora',
                                id: 'b1',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                      Visualizar Los comentarios de la Bitacora";
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/getVitacoraEqp.php',
                                            params: {
                                                idEquipo: idEquipo,
                                            },
                                            failure: function(form, action) {
                                                Ext.example.msg("Mensaje", 'No hay registros de Estado');
                                            },
                                            success: function(form, action) {
                                                var storeVitacora = Ext.create('Ext.data.Store', {
                                                    fields: ['equipoVtc', 'estadoVtc', 'fechaHoraReg', 'tecnicoVtc'],
                                                    data: action.result.vitaStateEqp
                                                });
                                                var windowVitacora = Ext.create('Ext.window.Window', {
                                                    title: 'Vitácora:<br> ' + mensaje + '-' + mensajeEqui,
                                                    iconCls: 'icon-vita-eqp',
                                                    height: 430,
                                                    width: 700,
                                                    layout: 'form',
                                                    items: [{
                                                            xtype: 'grid',
                                                            height: 250,
                                                            border: false,
                                                            columns: [
                                                                Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                                                //                                                        {text: '<b>Equipo</b>', width: 220, dataIndex: 'equipoVtc', aling: 'center'},
                                                                {text: '<b>Estado</b>', width: 200, dataIndex: 'estadoVtc'},
                                                                {text: '<b>Fecha de estado</b>', width: 200, dataIndex: 'fechaHoraReg', aling: 'center'},
                                                                {text: '<b>Nombres del Tecnico</b>', width: 250, dataIndex: 'tecnicoVtc', aling: 'center'}
                                                            ],
                                                            store: storeVitacora,
                                                            listeners: {
                                                                select: function(thisObj, record, index, eOpts) {
                                                                    windowVitacora.down('[name=estado]').setValue(record.data.estadoVtc);
                                                                }
                                                            }
                                                        }, {
                                                            xtype: 'textarea',
                                                            grow: true,
                                                            //                                                    fieldLabel: '<b>Comentario</b>',
                                                            editable: false,
                                                            name: 'estado'
                                                        }, {
                                                            xtype: 'button',
                                                            text: 'Cerrar',
                                                            margin: '5 5 10 5',
                                                            iconCls: 'icon-cancel',
                                                            handler: function() {
                                                                windowVitacora.hide();
                                                            }}]
                                                }).show();
                                            }
                                        });
                                    }

                                }
                            },
                            {
                                iconCls: 'icon-list',
                                id: 'poner',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                    \n\
                                                                  Enviar Equipo a Lista Negra";
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setEstado.php',
                                            params: {
                                                estado: 0,
                                                idEquipo: idEquipo1
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
                                                Ext.example.msg("Mensaje", 'Vehiculo en Lista Negra Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                                storeListaNegra.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                iconCls: 'icon-acept',
                                id: 'quitar',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                    \n\
                                                                 Quitar el Equipo de Lista Negra";
                                            labelInformativo.setText('');
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setEstado.php',
                                            params: {
                                                estado: 1,
                                                idEquipo: idEquipo
                                            }, failure: function(form, action) {
                                                Ext.MessageBox.show({
                                                    title: 'Error...',
                                                    msg: 'No fue posible Actualizar Estado',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            }, success: function(form, action) {
                                                Ext.example.msg("Mensaje", 'Vehiculo Eliminado de Lista Negra Correctamente...');
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                                storeListaNegra.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                iconCls: 'icon-lock',
                                id: 'bloquear',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                    \n\
                                            Enviar a Estado pasivo el Equipo";
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setBloqueo.php',
                                            params: {
                                                bloqueo: 0,
                                                idEquipo: idEquipo1

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
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                iconCls: 'icon-unlock',
                                id: 'desbloquear',
                                tooltip: '<b>Desbloquear Unidad</b>',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                    \n\
                                                Volver a Estado Activo el Equipo";
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    if (form.isValid()) {
                                        form.submit({
                                            url: 'php/interface/monitoring/setBloqueo.php',
                                            params: {
                                                bloqueo: 1,
                                                idEquipo: idEquipo1
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
                                                storeStateEqpPasivos.reload();
                                                storeStateEqp.reload();
                                            }
                                        });
                                    }

                                }
                            }, {
                                text: 'Asignar',
                                id: 'b2',
                                iconCls: 'icon-check',
                                listeners: {
                                    mouseover: function() {
                                        if (!this.mousedOver) {
                                            var string = "***********************************************************************\n                                                                    \n\
                                               Asignar Comentario a los Equipos";
                                            labelInformativo.setText('');
                                            labelInformativo.setText(string);
                                        } else {
                                            labelInformativo.setText('');
                                        }
                                    }
                                },
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    var comentario = panelOeste.down('[name=stadoEqp]').getValue();
                                    if (comentario !== "") {
                                        if (comentario !== estadoEqui && comentario !== estadoVeh) {
                                            if (form.isValid()) {
                                                form.submit({
                                                    url: 'php/interface/monitoring/setState.php',
                                                    params: {
                                                        idEquipo: idEquipo,
                                                        idvehiculo: IdVehiculo
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
                                                        Ext.example.msg("Mensaje", 'Estado Modificado Correctamente');
                                                        form.reset();
                                                        panelOeste.down('[name=stadoEqp]').setValue('');
                                                        labelEquipo.setText('');
                                                        labelRegistro.setText('');
                                                        labelFecha.setText('');
                                                        labelUsuario.setText('');
                                                        storeStateEqp.reload();
                                                        storeStateEqpUdp.reload();
                                                    }
                                                });
                                            }
                                        } else {
                                            Ext.example.msg("Mensaje", 'Debe ingresar un comentario diferente ');
                                        }
                                    } else {
                                        Ext.example.msg("Mensaje", 'Debe ingresar un comentario');
                                    }
                                }
                            }
                        ]}]
            }
            , tabPanelReports]
    });
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelCentral, panelOeste]
    });
    var tab = Ext.create('Ext.form.Panel', {
        //contenedoresg
        id: 'contenedoresg',
        name: 'contenedoresg',
        items: [
            {
                id: 'contenido2',
                html: ""
            }
        ]
        ,
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar',
                handler: limpiarPanelG
            }
        ]
    });
    winReporte = Ext.create('Ext.window.Window', {
        layout: 'fit', title: 'Estado de Equipos',
        iconCls: 'icon-company',
        resizable: false, width: 400,
        height: 500,
        closeAction: 'hide',
        plain: false, items: tab
    });
    panelOeste.down('#b1').disable();
    panelOeste.down('#b2').disable();
    panelOeste.down('#bloquear').disable();
    panelOeste.down('#desbloquear').disable();
    panelOeste.down('#poner').disable();
    panelOeste.down('#quitar').disable();
    reloadStateEqpByItems(storeStateEqp);
//    reloadStateEqpByItems(storeStateEqpUdp);
    reloadStore(storeUserConect, 60);
    reloadStateEqpByItems(storeCantEqp);
//    reloadStore(storeVehReten, 15);
    reloadStore(storeDataInvalid, 60);
    checkRolSesion(idRolKarview);
    if (idRolKarview === 1) {
        panelOeste.setVisible(true);
    } else {
        panelOeste.setVisible(false);
    }
    setTimeout(function() {
        tabPanelReports.setActiveTab(0);
    }, 0);
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
function limpiarPanelG() {
    Ext.getCmp('contenedoresg').update('');
    if (winReporte) {
        winReporte.hide();
    }

}
function addTooltip(value, metadata, record, rowIndex, colIndex, store) {
    metadata.attr = 'ext:qtip="' + 'value' + '"';
    return value;
}
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

function formatStateUser(val) {
    if (val === 0) {
        return '<span style="color:red;">Desconectado</span>';
    } else {
        return '<span style="color:green;">Conectado</span>';
    }
}























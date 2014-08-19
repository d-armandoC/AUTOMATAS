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
    'Ext.ux.Spotlight'
]);

var idEstacion;
var panelMapa;

var drawControls;
var required = '<span style="color:red;font-weight:bold" data-qtip="Requerido">*</span>';

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

var idEqpMen;

var spot = Ext.create('Ext.ux.Spotlight', {
    easing: 'easeOut',
    duration: 500
});

Ext.onReady(function() {
    var idEqpMen, nameVeh;

    Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },
        daterangeText: 'Start date must be less than end date',
        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Passwords do not match',
        cedulaValida: function(val, field) {
            if (val.length !== 10) {
                return false;
            }

            if (val.length === 10) {
                if (check_cedula(val)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        cedulaValidaText: 'Numero de Cedula Invalida',
        placaValida: function(val, field) {
            var partes = val.split("-");
            if (partes.length === 2) {
                return false;
            }
            return true;
        },
        placaValidaText: 'No utilice interfaceones'
    });

    Ext.tip.QuickTipManager.init();

    var administracion = Ext.create('Ext.button.Button', {
        text: 'Administración',
        iconCls: 'icon-config',
        scope: this,
        menu: [
            
//            {text: 'Usuarios', iconCls: 'icon-user', handler: function() {
//                    ventAddUser();
//                }},
//            {
//                text: 'Vehiculos',
//                iconCls: 'icon-add-car',
//                menu: [
//                    {text: 'Administrar', iconCls: 'icon-car', handler: function() {
//                            ventAddVehiculo();
//                        }},
//                    {text: 'Enviar CMD', iconCls: 'icon-cmd', handler: function() {
//                            ventComands();
//                        }},
//                    {text: 'CMD Enviados', iconCls: 'icon-cmd-hist', handler: function() {
//                            ventanaCmdHistorial();
//                        }}
//                ]
//            }
            ,
            {text: 'Personal', iconCls: 'icon-personal', handler: function() {
                    ventAddPersonal();
                }}, '-',
            {text: 'Envio Email', iconCls: 'icon-email', handler: function() {
                    ventanaEnvioMail();
                }},
            {text: 'Mantenimientos', iconCls: 'icon-add-geo', handler: function() {
                   // ventAddMantenimientos();
                        Ext.MessageBox.show({
                                title: ' IMPORTANTE',
                                msg: 'ESTAMOS TRABAJANDO PARA UN MEJOR SERVICIO.....',
                                icon: Ext.MessageBox.OK,
                                buttons: Ext.Msg.OK
                            });
                   
                }}
        ]
    });

    var geocerca = Ext.create('Ext.button.Button', {
        text: 'Geocercas',
        scope: this,
        iconCls: 'icon-geocerca',
        menu: [
            {text: 'Ver', iconCls: 'icon-find-geo', handler: function() {
                    ventanaVerGeo();
                }},
            {text: 'Agregar', iconCls: 'icon-add-geo', handler: function() {
                    ventanaAddGeo();
                }}, '-',
            {text: 'Envio Mails', iconCls: 'icon-email', handler: function() {
                    ventanaEnvioMailGeo();
                }}
        ]
    });

    var extra = Ext.create('Ext.button.Button', {
        text: 'Extra',
        scope: this,
        icon: 'img/table_refresh.png',
        menu: [
            {text: 'Vehiculos en Lugares', iconCls: 'icon-vehiculos_lugar', handler: function() {
                    ventanaVehLugares();
                }},
            {text: 'Cuenta Usuario', iconCls: 'icon-user-add', handler: function() {
                    ventanaCambiarContrasenia();
                }},
            '-',
            {text: 'Videos',
                iconCls: 'icon-video',
                handler: showVideo
            },
            {text: 'Creditos', iconCls: 'icon-credits', handler: function() {
                    credits();
                    spot.show('panel-credit');
                }}
        ]
    });

    var editPosEmp = Ext.create('Ext.button.Button', {
        text: 'Editar Empresas',
        iconCls: 'icon-edit',
        scope: this,
        handler: function() {
            ventanaEditarPuntos();
        }
    });

    var monitoreo = Ext.create('Ext.button.Button', {
            text: 'Monitoreo', iconCls: 'icon-monitoreo', handler: function() {
                    window.open('monitorTeam.php');
                }
            
    });

    var salir = Ext.create('Ext.button.Button', {
        text: 'Salir',
        scope: this,
        icon: 'img/salir.png',
          handler: function() {
            Ext.MessageBox.confirm('Exit', 'Desea Salir del Sistema ?', function(choice) {
                if (choice === 'yes') {
                    window.location = 'php/login/logout.php';
                }
            });
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [{
                text: 'Menú',
                icon: 'img/menu.png',
                menu: [{
                        text: 'Reportes',
                        iconCls: 'icon-general',
                        menu: [
//                            {text: 'Asignacion Central', iconCls: 'icon-asignacion', handler: function() {
//                                    ventanaAsignacion();
//                                }}
////                            ,
//                            {text: 'Carreas Realizadas', iconCls: 'icon-informe', handler: function() {
//                                   carerrasRealizadas();
//                                }}
////                            ,
//                            {text: 'Carreras No Atendidas', iconCls: 'icon-no-atendidos', handler: function() {
//                                    ventanaNoAtendidas();
//                                }}
                            ,
                            {text: 'Registros de Panico', iconCls: 'icon-reset', handler: function() {
                                    ventanaPanicos();
                                }},
                            {text: 'Excesos de Velocidad', iconCls: 'icon-exceso-vel', handler: function() {
                                    ventanaExcesoVelocidad();
                                }}
//                            ,
//                            {text: 'Servicios', iconCls: 'icon-servicios', handler: function() {
//                                    ventanaServicios();
//                                }}
//                            ,
//                            {text: 'Estado de Vehiculos', iconCls: 'icon-estado-veh', handler: function() {
//                                    ventanaEstadoDeVehiculos();
//                                }}
//                            ,
//                            {text: 'Franjas Horarias', iconCls: 'icon-franjas-hor', handler: function() {
//                                    ventanaFranjasHorarias();
//                                }}
//                            ,
//                            {text: 'Trabajo por Flota', iconCls: 'icon-trab-flota', handler: function() {
//                                    ventanaTrabajoPorFlota();
//                                }}
                            ,
                            {text: 'Recorridos General', iconCls: 'icon-all-flags', handler: function() {
                                    ventanaBanderas();
                                }}
                            ,
                            {text: 'Eventos', iconCls: 'icon-eventos', handler: function() {
                                    ventanaEventos();
                                }}
                            ,
//                            {text: 'Geocercas', iconCls: 'icon-report-geo', handler: function() {
//                                    ventanaGeocercas();
//                                }},
//                            {text: 'Taximetro', iconCls: 'icon-taximetro', handler: function() {
//                                    ventanaTaximetro();
//                                }}
                        ]
                    },
//                    {text: 'Estadisticas', iconCls: 'icon-statistics', handler: function() {
//                            window.open('statistics.php');
//                        }}
                    , '-',
                    {text: 'Limpiar Mapa', iconCls: 'icon-limpiar-mapa', handler: function() {
                            limpiarCapasAll();
                        }},
                    {text: 'Simbologia', iconCls: 'icon-edit', handler: function() {
                            ventanaSimbologia();
                        }}
                ]
            },
            geocerca,
            editPosEmp,
           // extra,
            //monitoreo,
            administracion,
            salir, '->', {
                xtype: 'image',
                src: getNavigator(),
                width: 16,
                height: 16,
                margin: '0 5 0 0'
            }
        ]
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        deferreRender: false,
        activeTab: 0,
        items: [{
                layout: 'hbox',
                bodyStyle: {
                    background: '#add2ed'
                },
                items: [{
                        xtype: 'label',
                        html: '<a href="http://www.kradac.com" target="_blank"><img src="img/k-taxy.png" width="250" height="64"></a>'
                    }, {
                        xtype: 'label',
                        padding: '15 0 0 0',
                        style: {
                            color: '#157fcc'
                        },
                        html: '<section id="panelNorte">' +
                                '<center><strong id="titulo">Sistema de Rastreo Vehicular</strong></center>' +
                                '<strong id="subtitulo">Bienvenido al Sistema: ' + personKarview + '</strong>' +
                                '</section>'
                    }]
            },
            barraMenu]
    });

    var winSearchVeh = Ext.create('Ext.window.Window', {
        layout: 'fit',
        title: 'Buscar Vehiculo',
        iconCls: 'icon-car',
        width: 300,
        height: 125,
        closeAction: 'hide',
        plain: false,
        items: [{
                xtype: 'form',
                frame: true,
                items: [{
                        xtype: 'combobox',
                        fieldLabel: 'Cooperativa',
                        name: 'cbxEmpresas',
                        store: storeEmpresas,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        emptyText: 'Seleccionar Cooperativa...',
                        editable: false,
                        allowBlank: false,
                        listConfig: {
                            minWidth: 160
                        },
                        listeners: {
                            select: function(combo, records, eOpts) {
                                this.up('form').down('[name=cbxVeh]').enable();
                                this.up('form').down('[name=cbxVeh]').clearValue();

                                storeVeh.load({
                                    params: {
                                        cbxEmpresas: records[0].data.id
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'combobox',
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
                            minWidth: 450
                        }
                    }],
                buttons: [{
                        text: 'Buscar',
                        iconCls: 'icon-search-veh',
                        handler: function() {
                            if (this.up('form').getForm().isValid()) {
                                var capa = this.up('form').down('[name=cbxEmpresas]').getValue();
                                var idEqpCoop = this.up('form').down('[name=cbxVeh]').getValue();

                                buscarEnMapa(capa, idEqpCoop);
                            } else {
                                Ext.example.msg('Error', 'Escoja un Vehiculo');
                            }
                        }
                    }]
            }]
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        id: 'west_panel',
        title: 'Facetas Karview',
        iconCls: 'icon-facetas',
        frame: true,
        width: 240,
        split: true,
        collapsible: true,
        layout: 'accordion',
        border: false,
        layoutConfig: {
            animate: false
        },
        items: [{
                xtype: 'treepanel',
                id: 'veh-taxis-tree',
                rootVisible: false,
                title: 'Empresas',
                autoScroll: true,
                iconCls: 'icon-tree-company',
                store: storeTreeVehTaxis,
                columns: [
                    {xtype: 'treecolumn', text: 'Central', flex: 4, sortable: true, dataIndex: 'text'}/*,
                     {text: 'Estado', flex: 1, dataIndex: 'estado', sortable: true, renderer: formatState}*/
                ],
                tools: [{
                        type: 'help',
                        handler: function() {
                            // show help here
                        }
                    }, {
                        type: 'refresh',
                        itemId: 'refresh_taxis',
                        tooltip: 'Recargar Datos',
                        //hidden: true,
                        handler: function() {
                            var tree = Ext.getCmp('veh-taxis-tree');
                            reloadTree(tree, 'Vehiculos', storeTreeVehTaxis);
                        }
                    }, {
                        type: 'search',
                        tooltip: 'Buscar Vehiculo',
                        handler: function(event, target, owner, tool) {
                            // do search                    
                            //owner.child('#refresh_taxis').show();
                            winSearchVeh.showAt(event.getXY());
                        }
                    }],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function(thisObject, record, item, index, e, eOpts) {
                        var aux = record.internalId;

                        var capa = aux.split('_')[0];
                        var idEqpCoop = aux.split('_')[1];

                        buscarEnMapa(capa, idEqpCoop);
                    },
                    itemcontextmenu: function(thisObject, record, item, index, e, eOpts) {
                        idEqpMen = record.internalId;
                        nameVeh = record.data.text;
                        if (idEqpMen.indexOf('ext-record') === -1) {
                            menuContext.showAt(e.getXY());
                        } else {
                            idEqpMen = '';
                            nameVeh = '';
                        }
                    }
                }
            }]
    });

    var menuContext = Ext.create('Ext.menu.Menu', {
        items: [
            {id: 'optTaxi1', text: 'Hoy', iconCls: 'icon-today'},
            {id: 'optTaxi2', text: 'Ayer', iconCls: 'icon-yesterday'},
            {id: 'optTaxi3', text: 'Carreras', iconCls: 'icon-taximetro'},
            {id: 'optTaxi4', text: 'Recorrido', iconCls: 'icon-all-flags'}
        ],
        listeners: {
            click: function(menu, item, e, eOpts) {
                var coopEqp = idEqpMen.split('_');
                var coop = coopEqp[0];
                var eqp = coopEqp[1];

                if (item.id === 'optTaxi4') {
                    ventanaBanderasClick(coop, eqp);
                } else if (item.id === 'optTaxi3') {
                    //ventanaRecorridosCarr(idEqpMen);
                } else {
                    //fecha actual
                    var nowDate = new Date();
                    if (item.id === 'optTaxi2') {
                        nowDate.setDate(nowDate.getDate() - 1);
                    } else {
                        nowDate.setMinutes(nowDate.getMinutes() + 10);
                    }

                    var año = nowDate.getFullYear();
                    var mes = nowDate.getMonth() + 1;
                    if (mes < 10) {
                        mes = "0" + mes;
                    }
                    var dia = nowDate.getDate();

                    var fi = formatoFecha(nowDate);
                    var hi = '00:01';
                    var ff = formatoFecha(nowDate);
                    var hf = (item.id === 'optTaxi2') ? '23:59' : nowDate.getHours() + ":" + nowDate.getMinutes();

                    panelEste.getForm().submit({
                        url: 'php/interface/report/getDataFlags.php',
                        waitMsg: 'Extrayendo coordenadas...',
                        params: {
                            nameVeh: nameVeh,
                            cbxVeh: eqp,
                            fechaIni: fi,
                            fechaFin: ff,
                            horaIni: hi,
                            horaFin: hf
                        },
                        failure: function(form, action) {
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: action.result.message,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function(form, action) {
                            var resultado = action.result;

                            limpiarCapasHistorico();
                            dibujarTrazadoHistorico(resultado.puntos);
                            lienzosRecorridoHistorico(eqp, resultado.puntos);
                        }
                    });
                }
            }
        }
    });

    var toolBarOnMap = Ext.create('Ext.toolbar.Toolbar', {
        region: 'north',
        border: true,
        items: [{
                xtype: 'combo',
                width: '86%',
                padding: '0 0 0 5',
                store: storeDirecciones,
                fieldLabel: '<b>Dirección</b>',
                displayField: 'todo',
                typeAhead: false,
                hideTrigger: true,
                emptyText: 'Ciudad,Barrio,Avenida Principal,Avenida Secundaria',
                listConfig: {
                    loadingText: 'Buscando...',
                    emptyText: 'No ha encontrado resultados parecidos.',
                    // Custom rendering template for each item
                    getInnerTpl: function() {
                        return '<b>{pais} , {ciudad}:</b><br>{barrio} , {avenidaP} , {avenidaS}';
                    }
                },
                listeners: {
                    select: function(thisObject, record, eOpts) {
                        var longitud = record[0].data.longitud;
                        var latitud = record[0].data.latitud;
                        var zoom = 18;
                        localizarDireccion(longitud, latitud, zoom);
                    }
                },
                pageSize: 10
            }, {
                xtype: 'button',
                iconCls: 'icon-geoloc',
                tooltip: 'Ubicar mi Posición',
                handler: function() {
                    getLocation();
                }
            }, {
                xtype: 'splitbutton',
                text: 'Cooperativas',
                iconCls: 'icon-central',
                menu: menuCoop,
                handler: function() {
                    this.showMenu();
                }
            }]
    });

    panelMapa = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [{
                title: 'Mapa',
                id: 'panelMapaTab',
                iconCls: 'icon-mapa',
                html: '<div id="map"></div>'
            }]
    });

    storeEventos = Ext.create('Ext.data.JsonStore', {
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'eventos'
            }
        },
        fields: ['fecha_hora', 'vehiculo', 'evento', {name: 'velocidad', type: 'float'}, 'direccion', 'coordenadas']
    });

    var gridEventos = Ext.create('Ext.grid.GridPanel', {
        region: 'south',
        title: "Ultimos Reportes de Vehiculos",
        collapsible: true,
        collapsed: true,
        split: true,
        height: 200,
        autoScroll: true,
        frame: true,
        store: storeEventos,
        features: [filters],
        columns: [
            {header: "Fecha-Hora", flex: 60, sortable: true, dataIndex: "fecha_hora"},
            {header: "Vehiculo", flex: 75, sortable: true, dataIndex: "vehiculo", filter: {type: 'string'}},
            {header: "Evento", flex: 125, sortable: true, dataIndex: "evento"},
            {header: "Vel (Km/h)", flex: 25, sortable: true, dataIndex: "velocidad", filter: {type: 'numeric'}},
            {header: "Direccion", flex: 175, sortable: true, dataIndex: "direccion", filter: {type: 'string'}},
            {header: "Coordenadas", flex: 20, sortable: true, dataIndex: "coordenadas"}
        ],
        listeners: {
            itemclick: function(thisObject, record, item, index, e, eOpts) {
                var g = record.data.coordenadas.split(",");
                panelMapa.setActiveTab(0);
                localizarDireccion(g[0], g[1], 15);
            }
        }
    });

    panelCentral = Ext.create('Ext.form.Panel', {
        region: 'center',
        layout: 'border',
        items: [
            toolBarOnMap,
            panelMapa,
            gridEventos
        ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelEste, panelCentral]
    });

    storeEmpresas.load();
});

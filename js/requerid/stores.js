//Modelos para Store y JsonStore
Ext.define('vehModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'text'},
        {name: 'iconCls'},
        {name: 'id'},
        {name: 'leaf'},
        {name: 'estado'}
    ],
    proxy: {
        type: 'ajax',
        url: 'php/tree/getTreeVehiculos.php',
        format: 'json'
    }
});

Ext.define('eventos', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'fecha_hora'},
        {name: 'vehiculo'},
        {name: 'evento'},
        {name: 'velocidad'},
        {name: 'direccion'},
        {name: 'coordenadas'}
    ]
});

Ext.define("direcciones", {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url: 'php/extra/getDirecciones.php',
        reader: {
            type: 'json',
            root: 'direccion'
        }
    },
    fields: [
        {name: 'todo'},
        {name: 'pais'},
        {name: 'ciudad'},
        {name: 'barrio'},
        {name: 'avenidaP'},
        {name: 'avenidaS'},
        {name: 'latitud'},
        {name: 'longitud'}
    ]
});

//Store Direcciones
var storeDirecciones = Ext.create('Ext.data.Store', {
    pageSize: 10,
    model: 'direcciones'
});

var storeTreeVehTaxis = Ext.create('Ext.data.TreeStore', {
    model: 'vehModel'
            //Es por si no se recibiera nombre
            //desde la consulta
            /*root: {
             text : 'Buses Loja',
             expanded: true
             }*/
});

//Store para combobox

var storeEmpresas = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEmpresas.php',
        reader: {
            type: 'json',
            root: 'empresas'
        }
    },
    fields: ['id', 'idTipoEmpresa', 'text', 'latitud', 'longitud', 'direccion', 'telefono', 'email', 'icon'],
    listeners: {
        load: function(thisObject, records, successful, eOpts) {
            if (successful) {
                lienzoCentral.destroyFeatures();
                addCompanyToCanvas(records);
            } else {
                Ext.example.msg('Error', 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.')
            }
        }
    }
});

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
    fields: ['id', 'text']
});

var storeGeo = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboGeocercas.php',
        reader: {
            type: 'json',
            root: 'adminGeo'
        }
    },
    fields: ['id', 'nombre']
});

var storePersonas = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboPersonas.php',
        reader: {
            type: 'json',
            root: 'personas'
        }
    },
    fields: ['id', 'text', 'idEmpleo', 'empresa', 'mail']
});

var storeMails = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    fields: ['id_persona', 'persona', 'email', 'evt1', 'evt2', 'evt3', 'evt4', 'evt5', 'evt6',
        'evt7', 'evt8', 'evt9', 'evt10', 'evt11', 'evt12', 'evt13', 'evt14', 'evt15', 'evt16', 'evt17', 'evt18'],
    proxy: {
        type: 'ajax',
        url: 'php/administracion/email/getMails.php',
        reader: {
            type: 'json',
            root: 'envio_mails'
        }
    }
});

var storeMailsGeo = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    fields: ['id_persona', 'id_geocerca', 'persona', 'email', 'in_geo', 'out_geo'],
    proxy: {
        type: 'ajax',
        url: 'php/interface/adminGeo/email/getMails.php',
        reader: {
            type: 'json',
            root: 'envio_mails_geo'
        }
    }
});

var storePosEmpresas = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: "php/interface/monitoring/getLatLonEmp.php",
        reader: {
            type: 'json',
            root: 'pos_emp'
        }
    },
    fields: [
        {name: 'id_empresa'},
        {name: 'empresa'},
        {name: 'latitud', type: 'float'},
        {name: 'longitud', type: 'float'}
    ],
    timeout: 1000,
    failure: function(form, action) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'Precione F5 para actualizar la página...',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});

//Stores para filtros de Tablas

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

var storeMarVehList = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listMarcaVehiculo.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});

var storeTipoVehList = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listTipoVeh.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});

var storeRolUserList = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listRolUser.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});

var storeGeocercas = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/adminGeo/geoLoad.php',
        reader: {
            type: 'json',
            root: 'adminGeo'
        }
    },
    fields: ['id_geocerca', 'geocerca', 'desc_geo', 'empresa', 'id_empresa']
});

var menuCoop = Ext.create('Ext.menu.Menu', {
    items: [],
    listeners: {
        click: function(menu, item, e, eOpts) {
            for (var i = 0; i < showCoopMap.length; i++) {
                if (showCoopMap[i][0] == item.getItemId()) {
                    showCoopMap[i][2] = item.checked;

                    if (!item.checked) {
                        Ext.create('Ext.data.Store', {
                            autoLoad: true,
                            model: 'ultimos_gps',
                            proxy: {
                                type: 'ajax',
                                url: 'php/interface/monitoring/ultimosGPS.php?listCoop=' + showCoopMap[i][0],
                                reader: {
                                    type: 'json',
                                    root: 'dataGps'
                                }
                            },
                            fields: ['idCoop', 'idEqp', 'nombre', 'lat', 'lon', 'fec', 'hor', 'vel', 'dir', 'evt', 'idEvt', 'icon'],
                            listeners: {
                                load: function(thisObject, records, successful, eOpts) {
                                    if (records != null) {
                                        if (records.length > 0) {
                                            for (var i = 0; i < records.length; i++) {
                                                var taxiFeature = vectorKRC.getFeatureById(records[i].data.idEqp);
                                                if (taxiFeature != null) {
                                                    vectorKRC.removeFeatures(taxiFeature);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }
});
var showCoopMap = new Array();
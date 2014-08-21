//Modelos para Store y JsonStore

var menuCoop;
var showCoopMap = new Array();

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


var storeVehiculosservicios = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboServicios.php',
        reader: {
            type: 'json',
            root: 'veh'
        }
    },
    fields: [{name: 'value', mapping: 'id'}, {name: 'text'}, {name: 'tiempo'}, {name: 'kilometro'}],
});


var storeDevice = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEquipos.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});


var storeEmpresas = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEmpresas.php',
        reader: {
            type: 'json',
            root: 'empresas'
        }
    },
    fields: ['id', 'idTipoEmpresa', 'text', 'latitud', 'longitud', 'direccion', 'telefono', 'email'],
    listeners: {
        load: function(thisObject, records, successful, eOpts) {
            
            for (var i = 0; i < records.length; i++) {
                var dataCoop = records[i].data;
                showCoopMap[i] = [dataCoop.id, dataCoop.text, false];
                
            }
            for (var i = 0; i < showCoopMap.length; i++) {
                if (showCoopMap[i][0] >=1) {
//                    console.log(showCoopMap[i][0]+'po1');
//                    console.log(showCoopMap[i][1]+'po2');
//                    console.log(showCoopMap[i][2]+'pos3');
                    menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
                }
            }

//            getCoopMenu();

            // var dataCoop = records[0].data;

//            if (successful) {
//                lienzoCentral.destroyFeatures();
//                addCompanyToCanvas(records);
//            } else {
//                Ext.example.msg('Error', 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.')
//            }

//   if (successful && typeof idRolKBus !== 'undefined') {
//                for (var i = 0; i < records.length; i++) {
//                    var dataCoop = records[i].data;
//                    if (idRolKBus === 2 || idRolKBus === 4) {
//                        showCoopMap[i] = [dataCoop.id, dataCoop.text, true];
//                        // Centrar el Mapa
//                        /*var lonLat = new OpenLayers.LonLat(dataCoop.longitud, dataCoop.latitud).transform(new OpenLayers.Projection("EPSG:4326"),
//                         map.getProjectionObject());
//                         map.setCenter(lonLat, 13);*/
//                    } else {
//                        showCoopMap[i] = [dataCoop.id, dataCoop.text, false];
//                    }
//                }
//                storeVehicle.load({
//                    params: {
//                        idCompany: 1
//                    }
//                });
//                getCoopMenu();
//            }
        }
    }
});

var store_equipo = Ext.create('Ext.data.Store', {
    //autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEquipo.php',
        reader: {
            type: 'json',
            root: 'equipo'
        }
    },
    fields: ['id', 'text']
});

var storetipo_equipo_vehiculo = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboTipoEquipoVehiculo.php',
        reader: {
            type: 'json',
            root: 'tipo_veh'
        }
    },
    fields: ['id', 'text']
});



var storeTypeDevice = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboTipoEquipoVehiculo.php',
        reader: {
            type: 'json',
            root: 'interfaz_veh'
        }
    },
    fields: ['id', 'text']
});

var storetipo_operadora_vehiculo = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboTipoOperadoraVehiculo.php',
        reader: {
            type: 'json',
            root: 'operadora_veh'
        }
    },
    fields: ['id', 'text']

});


var storeclasseVehiculo = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboClassVehiculo.php',
        reader: {
            type: 'json',
            root: 'class_veh'
        }
    },
    fields: ['id', 'text']
});


var storeTipoEstado = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboTipoEstadoVehiculo.php',
        reader: {
            type: 'json',
            root: 'estado_veh'
        }
    },
    fields: ['id', 'text']
});



var storeVeh = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    //autoDestroy: true,
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
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboGeocercas.php',
        reader: {
            type: 'json',
            root: 'adminGeo'
        }
    },
    fields: [{name: 'id', type: 'int'}, {name: 'text', type: 'string'}]
});
var storeMensajeGeos = Ext.create('Ext.data.Store', {
    proxy: {
        type: 'ajax',
        url: 'php/interface/geosAdministrador/obtenerGeosMensajes.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [
        {name: 'estado', type: 'string'},
        {name: 'state', type: 'boolean'}
    ]
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
    fields: ['id', 'text', 'empresa', 'mail']
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


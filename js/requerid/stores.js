//Modelos para Store y JsonStore

var showCoopMap = new Array();
var menuCoop;

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

var storeVeh = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboVeh.php',
        reader: {
            type: 'json',
            root: 'veh'
        }
    },
    fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
});

var storeTreeVehTaxis = Ext.create('Ext.data.TreeStore', {
    model: 'vehModel'
});

//Store para combobox
var storeEventos1 = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/UltimosReporVehiculos/UltimosReportesVehicculos.php',
        reader: {
            type: 'json',
            root: 'eventos'
        }
    },
    fields: ['usuarioE', 'usuarioV', 'vehiculo', 'equipo', 'fhCon', 'fhDes', 'tmpcon', 'tmpdes', 'sky_evento', {name: 'vel', type: 'float'}]
});

var storeVeh = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboVeh.php',
        reader: {
            type: 'json',
            root: 'veh'
        }
    },
    fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
});

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

var storeServicios = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEstandarsDisponibles.php',
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

var storeViewPanico = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    storeId: 'MyStore',
    proxy: {
        type: 'ajax',
        url: 'php/interface/report/panicos/getViewPanicos.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['fecha', 'hora', 'evento', 'latitud', 'longitud', 'velocidad']
});



var storeEmpresaPanicos = Ext.create('Ext.data.Store', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEmpresas.php',
        reader: {
            type: 'json',
            root: 'empresas'
        }
    },
    fields: ['id', 'text']
});

var storeViewEncendidoApag = Ext.create('Ext.data.Store', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/report/encendidoApagado/getReportEncApag.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['fechaEA', 'horaEA', 'eventoEA', 'velocidadEA', 'latitudEA', 'longitudEA', 'bateriaEA', 'gsmEA', 'gpsEA', 'direccionEA']
});


var storeEmpresas = Ext.create('Ext.data.Store', {
    autoLoad: true,
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboEmpresas.php',
        reader: {
            type: 'json',
            root: 'empresas'
        }
    },
    fields: ['id', 'idTipoEmpresa', 'text','acronimo' ,'latitud', 'longitud', 'direccion', 'telefono', 'email'],
    listeners: {
        load: function (thisObject, records, successful, eOpts) {
            for (var i = 0; i < records.length; i++) {
                var dataCoop = records[i].data;
                showCoopMap[i] = [dataCoop.id, dataCoop.text, false];
            }
            for (var i = 0; i < showCoopMap.length; i++) {
                if (typeof menuCoop !== 'undefined') {
                    menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
                }
            }
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

var storeVeh = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
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
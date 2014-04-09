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
    'Ext.ux.CheckColumn'
]);

var menuContext;

Ext.onReady(function() {

    menuContext = Ext.create('Ext.menu.Menu', {
        items: [
            {id: 'optTaxi1', text: 'Solicitar Carrera', iconCls : 'icon-taximetro'}
        ],
        listeners: {
            click: function(menu, item, e, eOpts) {                

                if (item.id == 'optTaxi1') {                    
                    localizarDireccion(lon, lat, 17);
                    Ext.Ajax.request({
                        url: 'php/roles/usuarios/setSolicitud.php',
                        params : {
                            latitud : lat,
                            longitud : lon,
                        },
                        success: function(response, opts){                            
                            Ext.example.msg("Mensaje", "Solicitud Realizada Correctamente");
                        }
                    });
                }
            }
        }
    });

    var salir = Ext.create('Ext.button.Button', {
        text : 'Salir',        
        scope : this,
        icon : 'img/salir.png',
        handler: function(){
            window.location = 'php/login/logout.php';
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {        
        width   : '100%',        
        items   : salir
    });

    var panelMapa = Ext.create('Ext.form.Panel', {
        region : 'center',
        title: 'Mapa',
        iconCls : 'icon-mapa',
        html : '<div id="map"></div>'        
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region : 'north',
        items : [{
            html : '<section id="panelNorte">'+
                        '<center><strong id="titulo">SISTEMA DE RASTREO VEHICULAR</strong></center>'+
                        '<strong id="subtitulo">Bienvenido al Sistema:: '+personKarview+'</strong>'+
                    '</section>'
        },barraMenu]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelMapa]
    });    
});
var map;

var lat = - 3.9912;
var lon = - 79.20733;
var zoom = 14;

var toMercator = OpenLayers.Projection.transforms['EPSG:900913']['EPSG:4326'];

var lienzoLocalizar = new OpenLayers.Layer.Vector('Direcciones');
var styleLocalizacion = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

Ext.onReady(function(){
    capturarPosicion = false;
    
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
            OpenLayers.Control.prototype.initialize.apply(this, arguments);
            this.handler = new OpenLayers.Handler.Click(this, {
                'click': this.trigger
            }, this.handlerOptions);
        },

        trigger: function(e) {        
            //Capturar Punto de Referencia            
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux =  new OpenLayers.Geometry.Point( coord.lon, coord.lat );
            aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
                new OpenLayers.Projection( "EPSG:4326" ) );
            lon = aux.x;
            lat = aux.y;            
            
            menuContext.show();
        }
    });

    //Limitar navegabilidad en el mapa
    /*var extent = new OpenLayers.Bounds();
    extent.extend(new OpenLayers.LonLat(-80.84441,-3.03400));
    extent.extend(new OpenLayers.LonLat(-78.18123,-4.54600));
    
    extent.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ));*/

    var options = {
        controls : [
        new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
        new OpenLayers.Control.Zoom(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.LayerSwitcher()
        ],
        units: 'm',
        numZoomLevels : 19,
        maxResolution : 'auto'/*,
        restrictedExtent : extent,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
            20037508.34, 20037508.34)*/
    };

    map = new OpenLayers.Map('map', options);

    // Mapa sobre el que se trabaja
    var osm = new OpenLayers.Layer.OSM();
    var gmap = new OpenLayers.Layer.Google("Google Streets");
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
    );   
    
    map.addLayers([osm, gmap, ghyb]);    
    //map.addLayer(lienzoLocalizar, layerCache);
    map.addLayer(lienzoLocalizar);

    // Centrar el Mapa
    var lonLat = new OpenLayers.LonLat( lon, lat ).transform( new OpenLayers.Projection( "EPSG:4326" ),
        map.getProjectionObject() );
    map.setCenter ( lonLat, zoom );

    //Restringe la posibilidad de hacer zoom mas alla
    //de la zona de Loja
    /*map.events.register('zoomend', this, function() {
        if (map.getZoom() < 7){
            map.zoomTo(7);
        }
    });*/

    map.events.register('click', map, function(e){        
        var coord = map.getLonLatFromViewPortPx(e.xy);
        var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
        aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
        lat = aux.y;
        lon = aux.x;

        var posXY = new Array(2);
        posXY[0] = window.event.clientX;
        posXY[1] = window.event.clientY;        
        menuContext.showAt(posXY);
    });

    //map.zoomToMaxExtent();

    //cargarCapas();

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
});

function centrarMapa(ln, lt, zoom){    
    //zoom max = 18
    var nivelZoom = zoom;
    var lonlatCenter = new OpenLayers.LonLat(ln,lt);
    map.setCenter ( lonlatCenter, nivelZoom );
}

function localizarDireccion(ln, lt, zoom){
    var punto = new OpenLayers.Geometry.Point(ln,lt);
    punto.transform(new OpenLayers.Projection( "EPSG:4326" ),
        map.getProjectionObject());
    map.setCenter(punto, zoom);

    var pulsate = function(feature) {
        var point = feature.geometry.getCentroid(),
            bounds = feature.geometry.getBounds(),
            radius = Math.abs((bounds.right - bounds.left)/2),
            count = 0,
            grow = 'up';

        var resize = function(){
            if (count>16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval/radius;
            switch(count) {
                case 4:
                case 12:
                    grow = 'down'; break;
                case 8:
                    grow = 'up'; break;
            }
            if (grow!=='up') {
                ratio = - Math.abs(ratio);
            }
            feature.geometry.resize(1+ratio, point);
            lienzoLocalizar.drawFeature(feature);
            count++;
        };
        window.resizeInterval = window.setInterval(resize, 50, point, radius);
    };    

    lienzoLocalizar.removeAllFeatures();
    var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(punto.x, punto.y),
            50,
            40,
            0
        ),
        {},
        styleLocalizacion
    );
    lienzoLocalizar.addFeatures([
        new OpenLayers.Feature.Vector(
            punto,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        circle
    ]);
    map.zoomToExtent(lienzoLocalizar.getDataExtent());
    pulsate(circle);
}
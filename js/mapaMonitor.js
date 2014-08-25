var map;

// coordenadas para centrar Loja
//var lat = - 3.9912;
//var lon = - 79.20733;
//var zoom = 14;
var lat = -1.9912;
var lon = -79.20733;
var zoom = 7;
var toMercator = OpenLayers.Projection.transforms['EPSG:900913']['EPSG:4326'];

var lienzoLocalizar = new OpenLayers.Layer.Vector('Direcciones');
var styleLocalizacion = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

Ext.onReady(function(){

    var options = {
        controls : [
        new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
        new OpenLayers.Control.Zoom(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.LayerSwitcher()
        ],
        units: 'm',
        numZoomLevels : 22,
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
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22}
    );
    
    map.addLayers([osm, gmap,ghyb]);    
    map.addLayer(lienzoLocalizar);

    // Centrar el Mapa
    var lonLat = new OpenLayers.LonLat( lon, lat).transform( new OpenLayers.Projection( "EPSG:4326" ),
        map.getProjectionObject() );
    map.setCenter ( lonLat, zoom);
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
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function dibujarTrazadoHistorico(json){
    iconosInicioFin(json);
    
    var puntosRuta = new Array();

    for (i = 0; i < json.length; i++ ) {
        var dataRuta = json[i];
        
        var pt = new OpenLayers.Geometry.Point(dataRuta.longitud, dataRuta.latitud);
        pt.transform( new OpenLayers.Projection( "EPSG:4326" ),new OpenLayers.Projection( "EPSG:900913" ) );
        puntosRuta.push(pt);
    }
    
    var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
    //Estilo de Linea de Recorrido
    var style = {
        strokeColor: '#0174DF',
        strokeOpacity: 0.3,
        strokeWidth: 5
    };

    var lineFeature = lienzoRecorridoHistorico.getFeatureById( "historico" );
    if (lineFeature != null){
        lineFeature.destroy();
    }

    lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
    lineFeature.id = "historico";
    lienzoRecorridoHistorico.addFeatures([lineFeature]);
}

/**
 * Permite dibujar los iconos de inicio y fin en la ruta para diferenciar hacia
 * donde es la trayectoria del recorrido
 */
function iconosInicioFin(json){
    //punto Inicial y Final
    var size = new OpenLayers.Size(32, 32);
    var iconIni = new OpenLayers.Icon(
        'img/inicio.png',
        size, null, 0);

    var iconFin = new OpenLayers.Icon(
        'img/fin.png',
        size, null, 0);

    markerInicioFin.clearMarkers();

    var filIni = json[0];

    var pInicio = new OpenLayers.LonLat(filIni.longitud, filIni.latitud);
    pInicio.transform(new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );

    centrarMapa(pInicio.lon,pInicio.lat, 13);

    markerInicioFin.addMarker(new OpenLayers.Marker(pInicio, iconIni));

    var filFin = json[json.length-1];

    var pFin = new OpenLayers.LonLat(filFin.longitud, filFin.latitud);
    pFin.transform(new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );    
    
    markerInicioFin.addMarker(new OpenLayers.Marker(pFin, iconFin));
}
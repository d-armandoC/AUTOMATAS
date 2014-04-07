var map;
var obtener = false;
var form;

// coordenadas para centrar Ecuador
var lat = -1.9912;
var lon = -79.20733;
var zoom = 7;

/*if (id_rol != 1) {
 // coordenadas para centrar Loja
 var lat = - 3.9912;
 var lon = - 79.20733;
 var zoom = 13;
 }*/

var lienzoRecorridoHistorico;
var lienzoPuntosRec;

var lienzoCentral;
var lienzoSolicitudes;

//Lienzos por Cooperativa
var vectorKRC;
var distanciaKM;

var drawControls;
var polygonControl;
//var selectControl;
var selectCtrl;

var capturarPosicion;
var markerInicioFin;
var lienzoGeoCercas;
var markerEdificios;

var dragFeature;
var toMercator = OpenLayers.Projection.transforms['EPSG:900913']['EPSG:4326'];

var lienzoLocalizar = new OpenLayers.Layer.Vector('Direcciones');
var styleLocalizacion = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

Ext.onReady(function() {
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
            if (capturarPosicion) {
                var coord = map.getLonLatFromViewPortPx(e.xy);
                var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
                aux.transform(new OpenLayers.Projection("EPSG:900913"),
                        new OpenLayers.Projection("EPSG:4326"));
                xpos = aux.x;
                ypos = aux.y;
                capturarPosicion = false;
                RQ3_getWin();
            }
        }
    });

    //Limitar navegabilidad en el mapa
    /*var extent = new OpenLayers.Bounds();
     extent.extend(new OpenLayers.LonLat(-80.84441,-3.03400));
     extent.extend(new OpenLayers.LonLat(-78.18123,-4.54600));
     
     extent.transform( new OpenLayers.Projection( "EPSG:4326" ),
     new OpenLayers.Projection( "EPSG:900913" ));*/

    var options = {
        controls: [
            new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
            new OpenLayers.Control.Zoom(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.OverviewMap(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.KeyboardDefaults()
        ],
        units: 'm',
        numZoomLevels: 19,
        maxResolution: 'auto'/*,
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

    /*var layerCache = new OpenLayers.Layer.TileCache("TileCache Layer",
     ["http://c0.tilecache.osgeo.org/wms-c/cache/",
     "http://c1.tilecache.osgeo.org/wms-c/cache/",
     "http://c2.tilecache.osgeo.org/wms-c/cache/",
     "http://c3.tilecache.osgeo.org/wms-c/cache/",
     "http://c4.tilecache.osgeo.org/wms-c/cache/"],
     "basic",
     {
     serverResolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625,
     0.0439453125, 0.02197265625, 0.010986328125,
     0.0054931640625, 0.00274658203125, 0.001373291015625,
     0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
     0.0000858306884765625, 0.00004291534423828125, 0.000021457672119140625],
     buffer: 4
     }
     );*/

    map.addLayers([osm, gmap, ghyb]);
    //map.addLayer(lienzoLocalizar, layerCache);
    map.addLayer(lienzoLocalizar);

    // Centrar el Mapa
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject());
    map.setCenter(lonLat, zoom);

    //Restringe la posibilidad de hacer zoom mas alla
    //de la zona de Loja
    /*map.events.register('zoomend', this, function() {
     if (map.getZoom() < 7){
     map.zoomTo(7);
     }
     });*/

    map.events.register('click', map, function(e) {
        if (obtener) {
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
            aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            latitud.setValue(aux.y);
            longitud.setValue(aux.x);
            //form.getForm()._fields.items[5].setValue(aux.y);
            //form.getForm()._fields.items[6].setValue(aux.x);
            //console.log("[Latitud: "+aux.y+"::"+coord.lon+"] ; [Longitud: "+aux.x+"::"+coord.lat+"]");
        }
    });

    //map.zoomToMaxExtent();

    cargarCapas();
});

function buscarEnMapa(capa, idEqpCoop) {
    var lienzoP;
    if (capa === 'coop') {
        lienzoP = map.getLayer('coopLayer');
    } else {
        lienzoP = map.getLayer('KRCLayer');
    }

    if (lienzoP === null) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'Parametros no validos',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
        return null;
    } else {
        if (lienzoP.getVisibility()) {
            var objeto = lienzoP.getFeatureById(idEqpCoop);
            if (objeto === null) {
                if (Ext.getCmp(capa) === undefined) {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: 'Activando Capa.. Espere un Momento, por favor.',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else {
                    if (!Ext.getCmp(capa).checked) {
                        for (var i = 0; i < showCoopMap.length; i++) {
                            if (showCoopMap[i][0] == capa) {
                                Ext.getCmp(capa).checked = true;
                                showCoopMap[i][2] = true;
                            }
                        }

                        var barra = Ext.create('Ext.ProgressBar', {
                            width: 300
                        });

                        var windowBarra = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: 'Cargando Capa...',
                            items: barra,
                            closable: false
                        }).show();

                        barra.wait({
                            interval: 1000,
                            duration: 5000,
                            increment: 5,
                            text: 'Cargando...',
                            fn: function() {
                                barra.updateText('Hecho!');
                                windowBarra.close();
                                buscarEnMapa(capa, idEqpCoop);
                            }
                        });
                    } else {
                        Ext.example.msg('Mensaje', 'El Vehiculo no se encuentra en el Mapa.');
                    }
                }
            } else {
                /* if (capa != 'coop') {                    
                 onVehiculoSelect(objeto); //Activar Globo                    
                 }*/

                centrarMapa(objeto.geometry.x, objeto.geometry.y, 17);
            }
        } else {
            Ext.MessageBox.show({
                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa <br>en la parte derecha (+)',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
    }
}

function centrarMapa(ln, lt, zoom) {
    //zoom max = 18
    var nivelZoom = zoom;
    var lonlatCenter = new OpenLayers.LonLat(ln, lt);
    map.setCenter(lonlatCenter, nivelZoom);
}

function localizarDireccion(ln, lt, zoom) {
    var punto = new OpenLayers.Geometry.Point(ln, lt);
    punto.transform(new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject());
    map.setCenter(punto, zoom);

    var pulsate = function(feature) {
        var point = feature.geometry.getCentroid(),
                bounds = feature.geometry.getBounds(),
                radius = Math.abs((bounds.right - bounds.left) / 2),
                count = 0,
                grow = 'up';

        var resize = function() {
            if (count > 16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval / radius;
            switch (count) {
                case 4:
                case 12:
                    grow = 'down';
                    break;
                case 8:
                    grow = 'up';
                    break;
            }
            if (grow !== 'up') {
                ratio = -Math.abs(ratio);
            }
            feature.geometry.resize(1 + ratio, point);
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

/**
 * Activa la capa de recorridos para poder dibujar en el mapa estos
 */
function capaRecorridos() {
    /**
     * Inicializar la capa para los recorridos
     */
    lienzoRecorridoHistorico = new OpenLayers.Layer.Vector("Recorridos Hist");
    markerInicioFin = new OpenLayers.Layer.Markers("Inicio-Fin");

    // create a color table for state FIPS code
    var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    var code, fips = {};
    for (var i = 1; i <= 66; ++i) {
        code = "0" + i;
        code = code.substring(code.length - 2);
        fips[code] = {fillColor: colors[i % colors.length]};
    }
    // add unique value rules with your color lookup
    styleMap.addUniqueValueRules("default", "STATE_FIPS", fips);

    // create a vector layer using the canvas renderer (where available)
    var wfs = new OpenLayers.Layer.Vector("States", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: "http://v2.suite.opengeo.org/geoserver/wfs",
            featureType: "states",
            featureNS: "http://usa.opengeo.org"
        }),
        styleMap: styleMap,
        renderers: ["Canvas", "SVG", "VML"]
    });

    map.addLayers([
        lienzoRecorridoHistorico,
        markerInicioFin
    ]);
}

function edificios() {
    var size = new OpenLayers.Size(32, 41);

    var calculateOffset = function(size) {
        return new OpenLayers.Pixel(-(size.w / 2), -size.h);
    };

    var iconMun = new OpenLayers.Icon(
            'img/muni.png',
            size, null, calculateOffset);

    var iconTal = new OpenLayers.Icon(
            'img/taller.png',
            size, null, calculateOffset);

    markerEdificios.clearMarkers();

    var pMun = new OpenLayers.LonLat(-79.20276, -4.01231);
    var pTal = new OpenLayers.LonLat(-79.20593, -4.03841);

    pMun.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));

    pTal.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));


    markerEdificios.addMarker(new OpenLayers.Marker(pTal, iconTal));
    markerEdificios.addMarker(new OpenLayers.Marker(pMun, iconMun));

}

function getDateGeo(fig) {

    trazando = 0;

    estadoControlD('polygon');

    var geom = fig.geometry; //figura
    var area = geom.getArea() / 1000     //area km
    var vert = geom.getVertices();  //vertices

    area = Math.round(area * 100) / 100;

    contenedorWinAddGeo.down('[name=area]').setValue(area + ' km2');

    var coordP = '';

    for (var i = 0; i < vert.length; i++) {
        vert[i] = vert[i].transform(new OpenLayers.Projection('EPSG:900913'),
                new OpenLayers.Projection('EPSG:4326'));
        coordP += vert[i].x + ',' + vert[i].y;

        if (i != vert.length - 1) {
            coordP += ';';
        }

    }

    vertPolygon = coordP;
    if (isLugar) {
        winVehiculosLugares.show();
        panelVehiculosLugares.submit({
            url: 'php/extra/getVehiculos.php',
            waitMsg: 'Comprobando Datos...',
            params: {
                coord: vertPolygon
            },
            failure: function(form, action) {
                Ext.MessageBox.show({
                    title: "Problemas",
                    msg: "No se ha encontrado vehiculos en esas horas.",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                })
            },
            success: function(form, action) {
                Ext.example.msg('Mensaje', 'Vehiculos Encontrados.');
                var resultado = action.result;
                var puntos = Ext.JSON.decode(resultado.string).puntos;
                gridVehiculos.getStore().loadData(puntos);
            }
        });

        isLugar = false;
    } else {
        winAddGeo.show();
    }
}

function estadoControlD(flag) {
    for (var key in drawControls) {
        var control = drawControls[key];
        if (flag == key) {
            if (control.active == null || !control.active) {
                control.activate();
                lienzoGeoCercas.destroyFeatures(); // borrar capa
            } else {
                control.deactivate();
            }
        }
    }
}

/**
 * Activa el control para arrastrar los puntos de una ruta para editarlos de 
 * forma manual
 */
function permitirArrastrarPuntosRutas() {
    //--Add a drag feature control to move features around.
    dragFeature = new OpenLayers.Control.DragFeature(lienzoCentral, {
        // onStart: iniciarArrastre,
        onDrag: arrastrar,
        onComplete: finalizarArrastre
    });
    map.addControl(dragFeature);
}

/**
 * Bloquea el arrastre de los puntos
 */
function activarArrastrePuntos(activar) {
    if (dragFeature != undefined) {
        if (activar) {
            dragFeature.activate();
            //console.info('activar');
        } else {
            dragFeature.deactivate();
            //console.info('desactivar');
        }
    }
}

/**
 * Captura el movimiento del feature de un punto de la ruta dibujada
 */
function arrastrar(feature, pixel) {
    var aux = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform(new OpenLayers.Projection("EPSG:900913"),
            new OpenLayers.Projection("EPSG:4326"));
    storePosEmpresas.getAt(storePosEmpresas.find('id_empresa', feature.id)).set('latitud', aux.y);
    storePosEmpresas.getAt(storePosEmpresas.find('id_empresa', feature.id)).set('longitud', aux.x);
}

/**
 * Se ejecuta al finalizar el movimiento del feature seleccionado
 */
function finalizarArrastre(feature, pixel) {
//storePuntos.commitChanges();
}

function setOptions(options) {
    polygonControl.handler.setOptions(options);
}

function setSize(fraction) {
    var radius = fraction * map.getExtent().getHeight();
    polygonControl.handler.setOptions({radius: radius,
        angle: 0});
}
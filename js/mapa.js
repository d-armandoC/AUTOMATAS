var map;
var lienzoPointRoute;
var lienzoPoinTravel;
var lienzoPointRouteManual;
var lienzoLineRoute;
var lienzoLineTravel;
var lienzoLineRouteManual;
var lienzoEstaciones;
var lienzoVehicle;
//para controlar la busqueda de los vehiculos en lugares
var vehiLugares = false;
///para ver las cordenada
var coordenadasGeos;

var markerInicioFin;
var dragFeature;
var toMercator;

var lienzoLocalizar;
var styleLocalizacion = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

var lat = -1.9912;
var lon = -79.20733;
var zoom = 7;

var lines;
var drawLine;
var modifyLine;


function loadMap() {
    if (connectionMap()) {
        Ext.onReady(function() {
            toMercator = OpenLayers.Projection.transforms['EPSG:900913']['EPSG:4326'];
            lienzoLocalizar = new OpenLayers.Layer.Vector('Direcciones');
            lines = new OpenLayers.Layer.Vector("Lines", {
                styleMap: new OpenLayers.StyleMap({
                    pointRadius: 3,
                    strokeColor: "#ff3300",
                    strokeWidth: 3,
                    fillOpacity: 0
                })
            });
            var options = {
                controls: [
                    new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
                    new OpenLayers.Control.Zoom(),
                    new OpenLayers.Control.KeyboardDefaults(),
                    new OpenLayers.Control.LayerSwitcher()
                ],
                units: 'm',
                numZoomLevels: 22,
                maxResolution: 'auto'
            };

            map = new OpenLayers.Map('map', options);

            // Mapa sobre el que se trabaja
            var osm = new OpenLayers.Layer.OSM();
            var gmap = new OpenLayers.Layer.Google("Google Streets");
            var ghyb = new OpenLayers.Layer.Google(
                    "Google Hybrid",
                    {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22}
            );

            map.addLayers([osm, gmap, ghyb]);
            map.addLayer(lienzoLocalizar);

            // Centrar el Mapa
            var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject());
            map.setCenter(lonLat, zoom);

            map.events.register('click', map, function(e) {
//                if (positionPoint) {
//                    var coord = map.getLonLatFromViewPortPx(e.xy);
//                    var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
//                    aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
//                    Ext.getCmp('latPoint').setValue(aux.y);
//                    Ext.getCmp('lonPoint').setValue(aux.x);
//
//                    winAdminPoint.show();
//                    positionPoint = false;
//                }
            }
            );

            var styleVehicle = new OpenLayers.StyleMap({
                externalGraphic: "${iconLast}",
                graphicWidth: 16,
                graphicHeight: 16,
                fillOpacity: 0.85,
                idCompanyLast: "${idCompanyLast}",
                companyLast: "${companyLast}",
                idDeviceLast: "${idDeviceLast}",
                muniRegLast: "${muniRegLast}",
                dateTimeLast: "${dateTimeLast}",
                speedLast: "${speedLast}",
                addressLast: "${addressLast}",
                label: "${placaLast}",
                fontColor: "${favColor}",
                fontSize: "13px",
                fontFamily: "Times New Roman",
                fontWeight: "bold",
                labelAlign: "${align}",
            });
            var styleRoute = new OpenLayers.StyleMap({
                fillOpacity: 0.7,
                pointRadius: 8,
                idPunto: "${idTravel}",
                geo: '${geo}',
                punto: "${punto}",
                ordPt: "${ordPt}",
                label: "${idTravel}",
                dir: "${direccion}",
                fontColor: "white",
                fillColor: "${color}", //#003DF5
                strokeColor: "#FFFFFF",
                strokeOpacity: 0.7,
                fontSize: "12px",
                fontFamily: "Times New Roman",
                fontWeight: "bold"
            });

            var styleTravel = new OpenLayers.StyleMap({
                fillOpacity: 0.7,
                pointRadius: 8,
                idTravel: "${idTravel}",
                label: "${idTravel}",
                companyTravel: "${companyTravel}",
                muniRegTravel: "${muniRegTravel}",
                dateTimeTravel: "${dateTimeTravel}",
                speedTravel: "${speedTravel}",
                fontColor: "white",
                fillColor: "${colorTravel}",
                strokeColor: "#FFFFFF",
                strokeOpacity: 0.7,
                fontSize: "12px",
                fontFamily: "Times New Roman",
                fontWeight: "bold"
            });

            var styleRouteManual = new OpenLayers.StyleMap({
                fillOpacity: 0.7,
                pointRadius: 8,
                label: "${idOrderPointManual}",
                pointManual: "${pointManual}",
                muniRegManual: "${muniRegManual}",
                dateManual: "${dateManual}",
                timeDebManual: "${timeDebManual}",
                timeLlManual: "${timeLlManual}",
                differenceManual: "${differenceManual}",
                speedManual: "${speedManual}",
                fontColor: "white",
                fillColor: "#03b003",
                strokeColor: "#FFFFFF",
                strokeOpacity: 0.7,
                fontSize: "12px",
                fontFamily: "Times New Roman",
                fontWeight: "bold"
            });

            lienzoPointRoute = new OpenLayers.Layer.Vector('Puntos de Ruta', {
                eventListeners: {
                    featureselected: function(evt) {
                        var feature = evt.feature;
                        var placa = feature.attributes.placa;
                        var direccion = feature.attributes.direccion;
                        var velocidad = feature.attributes.velocidad;
                        var latitud = feature.attributes.latitud;
                        var longitud = feature.attributes.longitud;
                        var evento = feature.attributes.evenvto;
                        var contenidoAlternativo =
                                "<section>" +
                                "<b>Vehiculo: </b>" + placa.toString() + "<br>" +
                                "<b>Velocidad: </b>" + velocidad.toString() + "</br>" +
                                "<b>Latitud: </b>" + latitud.toString() + "</br>" +
                                "<b>Longitud: </b>" + longitud.toString() + "</br>" +
                                "<b>Dirección: </b>" + direccion.toString() + "</br>" +
                                "<b>Evento: </b>" + evento.toString() + "</br>" +
                                "</section>";

                        var popup = new OpenLayers.Popup.FramedCloud("popup",
                                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                new OpenLayers.Size(200, 60),
                                contenidoAlternativo,
                                null,
                                true, function(evt) {
                                    feature.popup.destroy();
                                }
                        );

                        popup.setBackgroundColor('#dbe6f3');
                        feature.popup = popup;
                        feature.attributes.poppedup = true;
                        map.addPopup(popup);
                    },
                    featureunselected: function(evt) {
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        //feature.popup.destroy();
                        feature.popup = null;
                    }
                },
                styleMap: styleRoute
            });

            lienzoPointRoute.id = 'pointLayer';

            lienzoPoinTravel = new OpenLayers.Layer.Vector('Puntos de Recorrido', {
                eventListeners: {
                    featureselected: function(evt) {
                        var feature = evt.feature;

                        var idTravel = feature.attributes.idTravel;
                        var companyTravel = feature.attributes.companyTravel;
                        var muniRegTravel = feature.attributes.muniRegTravel;
                        var dateTimeTravel = feature.attributes.dateTimeTravel;
                        var speedTravel = feature.attributes.speedTravel;

                        var contenidoAlternativo =
                                "<section>" +
                                "<b>Id: </b>" + idTravel.toString() + "<br>" +
                                "<b>Empresa: </b>" + companyTravel.toString() + "<br>" +
                                "<b>Unidad: </b>" + muniRegTravel.toString() + "<br>" +
                                "<b>Fecha y Hora: </b>" + dateTimeTravel.toString() + "<br>" +
                                "<b>Velocidad: </b>" + speedTravel.toString() + " Km/h<br>" +
                                "</section>";


                        var popup = new OpenLayers.Popup.FramedCloud("popup",
                                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                new OpenLayers.Size(200, 150),
                                contenidoAlternativo,
                                null,
                                true,
                                function(evt) {
                                    feature.popup.destroy();
                                }
                        );

                        popup.setBackgroundColor('#dbe6f3');
                        feature.popup = popup;
                        feature.attributes.poppedup = true;
                        map.addPopup(popup);
                    },
                    featureunselected: function(evt) {
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup = null;
                    }
                },
                styleMap: styleTravel
            });

            lienzoPointRouteManual = new OpenLayers.Layer.Vector('Puntos Ruta Manual', {
                eventListeners: {
                    featureselected: function(evt) {
                        var feature = evt.feature;

                        var muniRegManual = feature.attributes.muniRegManual;
                        var pointManual = feature.attributes.pointManual;
                        var dateManual = feature.attributes.dateManual;
                        var timeDebManual = feature.attributes.timeDebManual;
                        var timeLlManual = feature.attributes.timeLlManual;
                        var differenceManual = feature.attributes.differenceManual;
                        var speedManual = feature.attributes.speedManual;
                        if (speedManual === "") {
                            speedManual = "0";
                        }

                        var contenidoAlternativo =
                                "<section>" +
                                "<b>Vehiculo: </b>" + muniRegManual.toString() + "<br>" +
                                "<b>Punto: </b>" + pointManual.toString() + "<br>" +
                                "<b>Fecha: </b>" + dateManual.toString() + "<br>" +
                                "<b>Hora Debio Llegar: </b>" + timeDebManual.toString() + "<br>" +
                                "<b>Hora Llego: </b>" + timeLlManual.toString() + "<br>" +
                                "<b>Diferencia: </b>" + differenceManual.toString() + "<br>" +
                                "<b>Velocidad: </b>" + speedManual.toString() + " Km/h<br>" +
                                "</section>";

                        var popup = new OpenLayers.Popup.FramedCloud("popup",
                                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                new OpenLayers.Size(225, 150),
                                contenidoAlternativo,
                                null,
                                true,
                                function(evt) {
                                    feature.popup.destroy();
                                }
                        );

                        popup.setBackgroundColor('#dbe6f3');//Color de fondo de la ventanita de
                        feature.popup = popup;
                        feature.attributes.poppedup = true;
                        map.addPopup(popup);
                    },
                    featureunselected: function(evt) {
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup = null;
                    }
                },
                styleMap: styleRouteManual
            });

            lienzoVehicle = new OpenLayers.Layer.Vector("Vehiculos", {
                eventListeners: {
                    featureselected: function(evt) {
                        onVehiculoSelect(evt);
                    },
                    featureunselected: function(evt) {
                        onVehiculoUnselect(evt);
                    }
                },
                styleMap: styleVehicle
            });
            lienzoVehicle.id = 'vehicleLayer';

            //Comportamiento de los Elementos de la Capa
            var selectFeatures = new OpenLayers.Control.SelectFeature(
                    [lienzoPointRoute, lienzoPoinTravel, lienzoPointRouteManual, lienzoVehicle], {
                hover: false,
                autoActivate: true
            });

            lienzoLineRoute = new OpenLayers.Layer.Vector("Linea de Ruta");
            lienzoLineTravel = new OpenLayers.Layer.Vector("Linea de Recorrido");
            lienzoLineRouteManual = new OpenLayers.Layer.Vector("Linea de Ruta Manual");
            markerInicioFin = new OpenLayers.Layer.Markers("Inicio-Fin");
//            polygonControl = new OpenLayers.Control.DrawFeature(lienzoGeoCercas,OpenLayers.Handler.RegularPolygon,{handlerOptions: polyOptions,featureAdded: getDateGeo}
//            );
            drawLine = new OpenLayers.Control.DrawFeature(lines, OpenLayers.Handler.Polygon, {featureAdded: getDataRoute});
            modifyLine = new OpenLayers.Control.ModifyFeature(lines);


            map.addLayers([
                lienzoVehicle,
                lienzoLineTravel,
                lienzoPoinTravel,
                lienzoLineRoute,
                lienzoPointRoute,
                lienzoLineRouteManual,
                lienzoPointRouteManual,
                markerInicioFin,
                lines
            ]);

            map.addControl(selectFeatures);
            map.addControl(drawLine);
            map.addControl(modifyLine);
            selectFeatures.activate();

            graficarCoop();
        });









    } else {
        Ext.getCmp('panel-map').add({
            region: 'center',
            xtype: 'image',
            src: 'img/no_network.png'

        });
    }
}

function graficarCoop() {
    var coopToShow = "";
    for (var i = 0; i < showCoopMap.length; i++) {
        if (showCoopMap[i][2]) { // 0: AS :: 1: ANDINASUR :: 2: true/false (isChecked)
            coopToShow += showCoopMap[i][0] + ",";
        }
    }
    if (coopToShow !== "") {
        var form = Ext.create('Ext.form.Panel');
        form.getForm().submit({
            url: 'php/interface/monitoring/ultimosGPS.php',
            params: {
                listCoop: coopToShow.substring(0, coopToShow.length - 1)
            },
            failure: function(form, action) {
                Ext.example.msg('Mensaje', action.result.message);
            },
            success: function(form, action) {
                addVehiculosToCanvas(action.result.dataGps);
//                console.log(action.result.dataGps);
            }
        });
    }
    setTimeout(function() {

        graficarCoop(coopToShow);
    }
    , 5 * 1000);
}

function getEstaciones() {
    Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/core/getEstaciones.php',
            reader: {
                type: 'json'
            }
        },
        fields: ['d'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {
                var obj = records[0].data;
                if (obj.d.length > 0) {
                    graficarEstaciones(obj.d);
                }
            }
        }
    });
}

function onVehiculoSelect(evt) {
    var feature;
    if (evt.feature === undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    var vehiculoLast = feature.attributes.vehiculoLast;
    var companyLast = feature.attributes.companyLast;
    var dateTimeLast = feature.attributes.dateTimeLast;
    var speedLast = feature.attributes.speedLast;
    var addressLast = feature.attributes.addressLast;
    if (addressLast === "") {
        addressLast = "No Definida.";
    }

    var contenidoAlternativo =
            "<section>" +
            "<b>Empresa: </b>" + companyLast + "<br>" +
            "<b>Vehiculo: </b>" + vehiculoLast + "<br>" +
            "<b>Fecha y Hora: </b>" + dateTimeLast + "<br>" +
            "<b>Velocidad: </b>" + speedLast + " Km/h<br>" +
            "<b>Dirección: </b>" + addressLast + "<br>" +
            "</section>";

    var popup = new OpenLayers.Popup.Anchored("popup",
            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
            new OpenLayers.Size(255, 125),
            contenidoAlternativo,
            null,
            true, function() {
                map.removePopup(feature.popup);
                feature.attributes.poppedup = false;
            }
    );

    popup.setBackgroundColor('#add2ed');
    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup(popup);
}

function onVehiculoUnselect(evt) {
    var feature;
    if (evt.feature === undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.attributes.poppedup = false;
    feature.popup = null;
}

//Grafica los vehiculos luego de consultar a la BD
function addVehiculosToCanvas(cordGrap) {
    for (var i = 0; i < cordGrap.length; i++) {
        // Extraigo columnas
        var datosVeh = cordGrap[i];
        var idVehicle = datosVeh.idVehiculo;

        //Extracción dependiendo del Layer
        var vehicleFeature = lienzoVehicle.getFeatureById('last' + idVehicle);

        //Crear un nuevo elemento para el taxi que no existe
        if (vehicleFeature === null) {
            // Coordenadas
            var x = datosVeh.lon;
            var y = datosVeh.lat;
            // Posicion lon : lat
            var point = new OpenLayers.Geometry.Point(x, y);

            // Transformacion de coordendas
            point.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
            var dateTimeLast = new Date(datosVeh.dateTimeLast);

            vehicleFeature = new OpenLayers.Feature.Vector(point, {
                iconLast: 'img/' + datosVeh.icono,
                idCompanyLast: datosVeh.idCoop,
                companyLast: datosVeh.company,
                idDeviceLast: datosVeh.equipo,
                placaLast: datosVeh.placa,
                vehiculoLast: datosVeh.nombre_vehiculo,
                dateTimeLast: Ext.Date.format(dateTimeLast, 'Y-m-d H:i:s'),
                speedLast: datosVeh.vel,
                addressLast: datosVeh.dir,
                favColor: 'blue',
                align: "lt"
            });

            // Se coloca el ID de veh�culo a la imagen            
            vehicleFeature.id = 'last' + idVehicle;
            //Se añade a la capa que corresponda
            lienzoVehicle.addFeatures([vehicleFeature]);
        } else {
            // Comprobar si los datos graficados estan desactualizados
            var dateTimeLast = new Date(datosVeh.fec);
            if (vehicleFeature.attributes.hora !== Ext.Date.format(datosVeh.fec, 'H:i:s')) {
                var poppedup = false;
                poppedup = vehicleFeature.attributes.poppedup;

                // Nuevo punto
                var newPoint = new OpenLayers.LonLat(datosVeh.lon, datosVeh.lat);
                newPoint.transform(new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:900913"));
                // Asignamos icono y Movemos el vehiculo 
                vehicleFeature.attributes.iconLast = "img/" + datosVeh.icono;
                vehicleFeature.move(newPoint);

                if (poppedup) {
                    onVehiculoUnselect(vehicleFeature);
                    // Actualizamos Datos
                    vehicleFeature.attributes.dateTimeLast = Ext.Date.format(dateTimeLast, 'Y-m-d H:i:s');
                    vehicleFeature.attributes.speedLast = datosVeh.vel;
                    vehicleFeature.attributes.addressLast = datosVeh.dir;

                    onVehiculoSelect(vehicleFeature);
                } else {
                    // Actualizamos Datos
                    vehicleFeature.attributes.dateTimeLast = Ext.Date.format(dateTimeLast, 'Y-m-d H:i:s');
                    vehicleFeature.attributes.speedLast = datosVeh.vel;
                    vehicleFeature.attributes.addressLast = datosVeh.dir;
                }
            }
        }
    }
}

function getVehicleByRoute(idRoute) {
    var form = Ext.create('Ext.form.Panel');
    form.getForm().submit({
        url: 'php/gui/draw/getVehicleByRoute.php',
        params: {
            idRoute: idRoute
        },
        failure: function(form, action) {
            Ext.getCmp('numVehicle').update("<b>Número de buses:</b> 0");
        },
        success: function(form, action) {
            var resultado = action.result;
            if (typeof idRolKBus !== 'undefined') {

                if (idRolKBus !== 5) {
                    Ext.getCmp('numVehicle').update("<b>Número de buses:</b> " + resultado.data.length);
                }

                addVehiculosToCanvas(resultado.data);
            } else {
                addVehiculosToCanvas(resultado.data);
            }
        }
    });
}

function graficarEstaciones(datos) {
    var filas = datos.split("#");
    lienzoEstaciones.destroyFeatures();
    for (var i = 0; i < filas.length - 1; i++) {
        var dat = filas[i].split("%");

        //lon - lat
        var punto = new OpenLayers.Geometry.Point(dat[2], dat[1]);

        // Creación del punto
        // Transformación de coordendas
        punto.transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913"));

        var pointFeature = new OpenLayers.Feature.Vector(punto, {
            codigo: dat[0],
            estacion: dat[3],
            latitud: dat[1],
            longitud: dat[2],
            poppedup: false,
            favColor: 'red',
            align: "left"
        });

        // Se coloca el ID de la central
        pointFeature.id = dat[0];

        // Anadir  central al mapa
        lienzoEstaciones.addFeatures([pointFeature]);
    }
}

function buscarEnMapa(idCompany, idVehicle) {
    var lienzoP = map.getLayer('vehicleLayer');
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
            var objeto = lienzoP.getFeatureById(idVehicle);
            if (objeto === null) {
                var cmp = menuCoop.down("[itemId=" + idCompany + "]");
                if (cmp === undefined) {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: 'Activando Capa.. Espere un Momento, por favor.',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                } else {
                    if (!cmp.checked) {
                        for (var i = 0; i < showCoopMap.length; i++) {
                            if (showCoopMap[i][0] === idCompany) {
                                cmp.checked = true;
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
                            duration: 7000,
                            increment: 7,
                            text: 'Cargando...',
                            fn: function() {
                                barra.updateText('Hecho!');
                                windowBarra.close();
                                buscarEnMapa(idCompany, idVehicle);
                            }
                        });
                    } else {
                        Ext.example.msg('Mensaje', 'El Vehiculo no se encuentra en el Mapa.');
                    }
                }
            } else {
                centrarMapa(objeto.geometry.x, objeto.geometry.y, 17);
            }
        } else {
            Ext.MessageBox.show({
                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa de la Cooperativa.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
    }
}

function searchByVehicle(idVehicle) {
    var lienzoP = map.getLayer('vehicleLayer');
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
            var objeto = lienzoP.getFeatureById(idVehicle);
            if (objeto === null) {
                Ext.example.msg('Mensaje', 'El Vehiculo no se encuentra en el Mapa.');
            } else {
                centrarMapa(objeto.geometry.x, objeto.geometry.y, 17);
            }
        } else {
            Ext.MessageBox.show({
                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa de la Cooperativa.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
}

function buscarParadas(idPointMap) {
    var lienzoP = map.getLayer('pointLayer');

    if (lienzoP === null) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'Parametros no validos',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
        return false;
    } else {
        if (lienzoP.getVisibility()) {
            var parada = lienzoP.getFeatureById(idPointMap);
            if (parada === null) {
                return false;
            } else {
                //onFeatureSelect(vehiculo); //Activar Globo
                centrarMapa(parada.geometry.x, parada.geometry.y, 17);
                return true;
            }
        } else {
            Ext.MessageBox.show({
                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa <br>en la parte derecha (+)',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }
    }
}

function centrarMapa(ln, lt, zoom) {
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





function lienzoPoints(idPointMap) {
    if (!buscarParadas('point' + idPointMap)) {
        var form = Ext.create('Ext.form.Panel');
        form.getForm().submit({
            url: 'php/gui/draw/getPoints.php',
            failure: function(form, action) {
                Ext.MessageBox.show({
                    title: 'Información.',
                    msg: action.result.msg,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            },
            success: function(form, action) {
                var resultado = action.result;
                var coordPuntos = resultado.data;

                var features = new Array();

                for (var i = 0; i < coordPuntos.length; i++) {
                    var dataRuta = coordPuntos[i];

                    var pt = new OpenLayers.Geometry.Point(dataRuta.longitudPoint, dataRuta.latitudPoint);
                    pt.transform(new OpenLayers.Projection("EPSG:4326"),
                            new OpenLayers.Projection("EPSG:900913"));

                    var puntoMap = new OpenLayers.Feature.Vector(pt, {
                        idPunto: dataRuta.idPoint,
                        geo: dataRuta.geoSkpPoint,
                        punto: dataRuta.pointPoint,
                        ordPt: dataRuta.orderPoint,
                        dir: dataRuta.addressPoint,
                        color: dataRuta.colorPoint,
                        poppedup: false
                    });

                    puntoMap.id = 'point' + dataRuta.idPoint;

                    features.push(puntoMap);
                }

                lienzoPointRoute.addFeatures(features);
                buscarParadas('point' + idPointMap);
            }
        });
    }
}

/* 
 * Dibuja el trazado de una ruta manual en el mapa
 */





function drawLineRoute(json, idRuta) {

    markerStartFinish(json);

    var puntosRuta = new Array();

    for (var i = 0; i < json.length; i++) {
        var dataRuta = json[i];

        var pt = new OpenLayers.Geometry.Point(dataRuta.longitudLine, dataRuta.latitudLine);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRuta.push(pt);
    }

    if (puntosRuta.length > 0) {
        var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
        //Estilo de Linea de Recorrido
        var style = {
            strokeColor: dataRuta.colorLine,
            strokeOpacity: 1,
            strokeWidth: 4
        };

        var lineFeature = lienzoLineRoute.getFeatureById("trazado");

        lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
        lienzoLineRoute.addFeatures([lineFeature]);
        for (var i = 0; i < showRouteMap.length; i++) {
            if (showRouteMap[i][0] === idRuta) {
                showRouteMap[i][1] = lineFeature;
            }
        }
    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'Ups... Datos no encontrados',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}


////////////////
function drawRutaMapa(json) {
    iconosInicioFin(json);
    var puntosRec = new Array();
    for (var i = 0; i < json.length; i++) {
        var dataRec = json[i];
        var pt = new OpenLayers.Geometry.Point(dataRec.longitud, dataRec.latitud);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRec.push(pt);
    }
    if (puntosRec.length > 0) {
        var ruta = new OpenLayers.Geometry.LineString(puntosRec);
        //Estilo de Linea de Recorrido
        var style = {
            strokeColor: '#190707',
            strokeOpacity: 1,
            strokeWidth: 2
        };

        var lineFeature = lienzoLineTravel.getFeatureById("lineTravel");
        if (lineFeature !== null) {
            lineFeature.destroy();
        }

        lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
        lineFeature.id = "lineTravel";
        lienzoLineTravel.addFeatures([lineFeature]);
    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'Ups... Datos no encontrados',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}




function drawLineTravel(json, isSkp) {
    var puntosRec = new Array();
    for (var i = 0; i < json.length; i++) {
        var dataRec = json[i];
        var pt;
        if (!isSkp) {
            if (dataRec.idEnc !== "X") {
                pt = new OpenLayers.Geometry.Point(dataRec.longitudData, dataRec.latitudData);
            }
        } else {
            pt = new OpenLayers.Geometry.Point(dataRec.longitudData, dataRec.latitudData);
        }
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRec.push(pt);
    }

    if (puntosRec.length > 0) {
        var ruta = new OpenLayers.Geometry.LineString(puntosRec);
        //Estilo de Linea de Recorrido
        var style = {
            strokeColor: '#9c42db',
            strokeOpacity: 1,
            strokeWidth: 2
        };

        var lineFeature = lienzoLineTravel.getFeatureById("lineTravel");
        if (lineFeature !== null) {
            lineFeature.destroy();
        }

        lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
        lineFeature.id = "lineTravel";
        lienzoLineTravel.addFeatures([lineFeature]);

    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'Ups... Datos no encontrados',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}

function drawLineRouteManual(json) {
    var puntosRecRuta = new Array();

    for (var i = 0; i < json.length - 3; i++) {
        var dataRecRuta = json[i];
        var pt = new OpenLayers.Geometry.Point(dataRecRuta.longitud, dataRecRuta.latitud);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRecRuta.push(pt);
    }

    if (puntosRecRuta.length > 0) {
        var ruta = new OpenLayers.Geometry.LineString(puntosRecRuta);
        //Estilo de Linea de Recorrido
        var style = {
            strokeColor: '#43ca43',
            strokeOpacity: 1,
            strokeWidth: 2
        };

        var lineFeature = lienzoLineRouteManual.getFeatureById("rutaManual");
        if (lineFeature !== null) {
            lineFeature.destroy();
        }

        lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
        lineFeature.id = "rutaManual";
        lienzoLineRouteManual.addFeatures([lineFeature]);

    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'Ups... Datos no encontrados',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}

function drawPoligonoGeocerca(dataRoute) {
    var puntosRuta = new Array();
    var json = dataRoute.split(";");
    var pos = json[0].split(",");
    var i = 0;
    for (i = 0; i <= json.length; i++) {
        if (i <json.length - 1) {
            var dataRuta = json[i].split(",");
            var pt = new OpenLayers.Geometry.Point(dataRuta[0], dataRuta[1]);
            pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
            puntosRuta.push(pt);
        }
        if (i === json.length) {
            var pt = new OpenLayers.Geometry.Point(pos[0], pos[1]);
            pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
            puntosRuta.push(pt);
        }

    }
    var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
    var style = {
        strokeColor: "#DF3A01",
        strokeOpacity: 5,
        strokeWidth: 3
    };
    var lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
    lines.addFeatures([lineFeature]);
}

function drawPointsRoute(coordPuntos, idRuta) {

    var features = new Array();
    var cont = 0;
    for (var i = 0; i < coordPuntos.length; i++) {
        var dataRuta = coordPuntos[i];
        cont = cont + 1;
        var pt = new OpenLayers.Geometry.Point(dataRuta.longitud, dataRuta.latitud);
        pt.transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913"));

        var puntoMap = new OpenLayers.Feature.Vector(pt, {
            idTravel: cont,
            placa: dataRuta.placa,
            empresa: dataRuta.company,
            direccion: dataRuta.direccion,
            velocidad: dataRuta.velocidad,
            latitud: dataRuta.latitud,
            longitud: dataRuta.longitud,
            evenvto: dataRuta.evento,
            color: dataRuta.color,
            poppedup: false
        });
        puntoMap.id = 'route' + i;

        features.push(puntoMap);
    }

    lienzoPointRoute.addFeatures(features);
}

function iconosInicioFin(json) {
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
    pInicio.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));

    centrarMapa(pInicio.lon, pInicio.lat, 13);

    markerInicioFin.addMarker(new OpenLayers.Marker(pInicio, iconIni));

    var filFin = json[json.length - 1];

    var pFin = new OpenLayers.LonLat(filFin.longitud, filFin.latitud);
    pFin.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));

    markerInicioFin.addMarker(new OpenLayers.Marker(pFin, iconFin));
}




function drawPointsTravel(coordPuntos, isSkp) {

    var features = new Array();
    for (var i = 0; i < coordPuntos.length; i++) {
        var dataRec = coordPuntos[i];

        if (isSkp) {
            var pt = new OpenLayers.Geometry.Point(dataRec.longitudData, dataRec.latitudData);
            pt.transform(new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));

            var puntoMap = new OpenLayers.Feature.Vector(pt, {
                idTravel: dataRec.idData,
                companyTravel: dataRec.companyData,
                muniRegTravel: dataRec.muniRegData,
                dateTimeTravel: Ext.Date.format(new Date(dataRec.dateTimeData), 'Y-m-d H:i:s'),
                speedTravel: dataRec.speedData,
                poppedup: false,
                colorFondo: dataRec.colorData
            });

            puntoMap.id = "travel" + i; //El id necesita tener una letra        

            features.push(puntoMap);
        } else {
            if (dataRec.idEnc !== "X") {
                var pt = new OpenLayers.Geometry.Point(dataRec.longitudData, dataRec.latitudData);
                pt.transform(new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:900913"));

                var color = "#9c42db";
                if (dataRec.velocidad > 90) {//Limites excesos de velocidad
                    color = "#FF8900";
                } else {
                    color = "#FFFF00";
                }

                var puntoMap = new OpenLayers.Feature.Vector(pt, {
                    idTravel: dataRec.idData,
                    companyTravel: dataRec.companyData,
                    muniRegTravel: dataRec.muniRegData,
                    dateTimeTravel: Ext.Date.format(new Date(dataRec.dateTimeData), 'Y-m-d H:i:s'),
                    speedTravel: dataRec.speedData,
                    poppedup: false,
                    colorFondo: color
                });

                puntoMap.id = "travel" + i; //El id necesita tener una letra        

                features.push(puntoMap);
            }
        }
    }

    lienzoPoinTravel.addFeatures(features);
}

function drawPointsRouteManual(muniReg, json) {

    var features = new Array();

    for (var i = 0; i < json.length - 3; i++) {
        var dataRecRuta = json[i];

        var pt = new OpenLayers.Geometry.Point(dataRecRuta.longitud, dataRecRuta.latitud);
        pt.transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913"));

        var puntoMap = new OpenLayers.Feature.Vector(pt, {
            idOrderPointManual: dataRecRuta.orderPointView,
            muniRegManual: muniReg,
            pointManual: dataRecRuta.pointView,
            dateManual: dataRecRuta.fecha,
            timeDebManual: dataRecRuta.timeDebView,
            timeLlManual: dataRecRuta.timeLlView,
            differenceManual: dataRecRuta.timeDifView,
            speedManual: dataRecRuta.velocidad,
            poppedup: false
        });

        puntoMap.id = "route_manual" + i; //El id necesita tener una letra        

        features.push(puntoMap);
    }

    lienzoPointRouteManual.addFeatures(features);
}

function markerStartFinish(json) {
    var size = new OpenLayers.Size(32, 32);
    var iconIni = new OpenLayers.Icon(
            'img/inicio_ruta.png',
            size, null, 0);

    var iconFin = new OpenLayers.Icon(
            'img/fin_ruta.png',
            size, null, 0);

    markerInicioFin.clearMarkers();

    var filIni = json[0];

    var pInicio = new OpenLayers.LonLat(filIni.longitudLine, filIni.latitudLine);
    pInicio.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    markerInicioFin.addMarker(new OpenLayers.Marker(pInicio, iconIni));

    var filFin = json[json.length - 1];

    var pFin = new OpenLayers.LonLat(filFin.longitudLine, filFin.latitudLine);
    pFin.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    markerInicioFin.addMarker(new OpenLayers.Marker(pFin, iconFin));
}

/**
 * Activa el control para arrastrar los puntos de una ruta para editarlos de 
 * forma manual
 */
function permitirArrastrarPuntosRutas() {
    //--Add a drag feature control to move features around.
    dragFeature = new OpenLayers.Control.DragFeature(lienzoPointRoute, {
        // onStart: iniciarArrastre,
        onDrag: arrastrar,
        onComplete: finalizarArrastre
    });
    map.addControl(dragFeature);
}

/**
 * Bloquea el arrastre de los puntos
 * @param {boolean} activar description
 */
function activarArrastrePuntos(activar) {
    if (dragFeature !== undefined) {
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
 * @param {feature} feature description
 * @param {type} pixel description
 */
function arrastrar(feature, pixel) {
    var aux = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform(new OpenLayers.Projection("EPSG:900913"),
            new OpenLayers.Projection("EPSG:4326"));
    storePuntos.getAt(storePuntos.find('numero', feature.id)).set('latitud', aux.y);
    storePuntos.getAt(storePuntos.find('numero', feature.id)).set('longitud', aux.x);
}

//Metodos de Limpieza de Puntos o Lineas en el Mapa

function clearLienzoReport() {
    clearLienzoTravel();
    clearLienzoRouteManual();
    clearLienzoPointsRoute();
    lienzoLocalizar.destroyFeatures();
}

function clearLienzoTravel() {
    clearLienzoLineTravel();
    clearLienzoPointTravel();
}

function clearLienzoRouteManual() {
    clearLienzoLineRouteManual();
    clearLienzoPointRouteManual();
}

function clearLienzoRoute() {
    clearLienzoLineRoute();
    clearLienzoPointsRoute();
}

function clearLienzoRouteByItems(item) {
    for (var i = 0; i < showRouteMap.length; i++) {
        if (showRouteMap[i][0] === item.getItemId()) {
            clearMarks();
            lienzoLineRoute.destroyFeatures(showRouteMap[i][1]);
            lienzoPointRoute.destroyFeatures(showRouteMap[i][2]);
        }
    }
}

function clearLienzoPointRouteManual() {
    lienzoPointRouteManual.destroyFeatures();
    clearPopups();
}

function clearLienzoLineRouteManual() {
    lienzoLineRouteManual.destroyFeatures();
}

function clearLienzoPointsRoute() {
    lienzoPointRoute.destroyFeatures();
    clearPopups();
}

function clearLienzoLineRoute() {
    lienzoLineRoute.destroyFeatures();
}

function clearLienzoPointTravel() {

    lienzoPoinTravel.destroyFeatures();
    lienzoLocalizar.destroyFeatures();
    clearPopups();
    clearLienzoLineTravel();
    clearLienzoLineRoute();
    clearLienzoPointRouteManual();
    clearLienzoLineRouteManual();
    clearLienzoPointsRoute();
    clearVehiclesByRoute();
    clearMarks();
}

function clearLienzoLineTravel() {
    lienzoLineTravel.destroyFeatures();
}

function clearVehiclesByRoute() {
    lienzoVehicle.destroyFeatures();
}

function clearVehicles(records) {
    for (var i = 0; i < records.length; i++) {
        var vehicleFeature = lienzoVehicle.getFeatureById('last' + records[i].idVehiculo);
        if (vehicleFeature !== null) {
            lienzoVehicle.removeFeatures(vehicleFeature);
        }
    }
}

function clearPopups() {
    //Comprobar si existe algun popUp abierto
    if (map.popups.length === 1) {
        map.removePopup(map.popups[0]);
    }
}

function clearMarks() {
    markerInicioFin.clearMarkers();
}

/**
 * Grafica de Perimetro
 * @param {double} m description
 * @param {double} ypos description
 * @param {double} xpos description
 */
function dibujarPerimetro(m, ypos, xpos) {

    var puntosRuta = new Array();

    var factorLAT = m / (1852 * 60);
    var factorLON = ((m * 0.00001) / 0.000111) / 10000;

    var lat1 = ypos - factorLAT;
    var lat2 = ypos + factorLAT;
    var lon1 = xpos - factorLON;
    var lon2 = xpos + factorLON;


    var pt = new OpenLayers.Geometry.Point(lon1, lat2);
    pt.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon2, lat2);
    pt.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon2, lat1);
    pt.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon1, lat1);
    pt.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon1, lat2);
    pt.transform(new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    puntosRuta.push(pt);

    var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
    //Estilo de Linea de Recorrido
    var style = {
        strokeColor: '#003DF5',
        strokeOpacity: 0.7,
        strokeWidth: 5
    };
    var lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
    lienzoPointRoute.addFeatures(lineFeature);
}

function estadoControlD(flag) {
    for (var key in drawControls) {
        var control = drawControls[key];
        if (flag == key) {
            if (control.active == null || !control.active) {
                control.activate();
                lienzoGeoCercas.destroyFeatures(); // borrar capa
            } else {
                console.log('activando');
                control.deactivate();
            }
        }
    }
}


function getDateGeo(fig) {

    trazando = 0;

    estadoControlD('polygon');

    var geom = fig.geometry; //figura
    var area = geom.getArea() / 1000     //area km
    var vert = geom.getVertices();  //vertices

    area = Math.round(area * 100) / 100;

    contenedorWinAddGeo.down('[name=area]').setValue(area + ' km2');
    console.log(area + ' km2');
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

var vertPolygon;

function getDataRoute(fig) {
    if (vehiLugares) {
        var vert = fig.geometry.getVertices();
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
        drawLine.deactivate();
        winVehiculosLugares.show();
        vehiLugares = false;
        clearLienzoTravel();
        clearLienzoPointTravel();
    } else {

        var vert = fig.geometry.getVertices();
        var areaGeocerca = fig.geometry.getArea() / 1000;


        coordenadasGeos = '';
        for (var i = 0; i < vert.length; i++) {
            vert[i] = vert[i].transform(new OpenLayers.Projection('EPSG:900913'),
                    new OpenLayers.Projection('EPSG:4326'));
            coordenadasGeos += vert[i].x + ',' + vert[i].y;
            if (i != vert.length - 1) {
                coordenadasGeos += ';';
            }
        }
        console.log(coordenadasGeos);
        ///////////////////////////////////////77
        areaGeocerca = Math.round(areaGeocerca * 100) / 100;
        Ext.getCmp('numberfield-point-route').setValue(areaGeocerca + ' km2');
        drawRoute = false;
        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-update");
        Ext.getCmp('btn-delete-route').enable();
        drawLine.deactivate();
        winAddGeocerca.show();
        console.log("Area" + areaGeocerca);
    }

}
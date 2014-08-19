/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function cargarCapas() {
    //Estilo para la Central
    var centralStyle = new OpenLayers.StyleMap({
        externalGraphic: "${icon}",
        graphicWidth: 20,
        graphicHeight: 20,
        fillOpacity: 0.85,
        idCentral: "${idCentral}",
        nameCentral: "${nameCentral}",
        email: "${email}",
        listPhone: "${listPhone}",
        label: " ${idCentral}",
        fontColor: "${favColor}",
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold",
        labelAlign: "${align}",
        labelOffset: new OpenLayers.Pixel(0, -20)
    });

    var styleSolicitud = new OpenLayers.StyleMap({
        externalGraphic: "img/localizame.png",
        graphicWidth: 20,
        graphicHeight: 20,
        nombres: "${nombres}",
        apellidos: "${apellidos}",
        celular: "${celular}",
        fecha: "${fecha}",
        hora: "${hora}",
        labelOffset: new OpenLayers.Pixel(0, -20)
    });

    var styleVeh = new OpenLayers.StyleMap({
        externalGraphic: "${icon}",
        graphicWidth: 25,
        graphicHeight: 16,
        fillOpacity: 0.85,
        idCoop: "${idCoop}",
        company: "${company}",
        vehiculo: "${vehiculo}",
        nombre: "${nombre}",
        fecha: "${fecha}",
        hora: "${hora}",
        vel: "${vel}",
        rumbo: "${rumbo}",
        dir: "${dir}",
        evt: "${evt}",
        label: "..${vehiculo}",
        fontColor: "${favColor}",
        fontSize: "13px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold",
        labelAlign: "${align}",
        labelOffset: new OpenLayers.Pixel(0, -20)
    });

    var stylePuntosRecorrido = new OpenLayers.StyleMap({
        fillOpacity: 0.7,
        pointRadius: 8,
        idBD: "${idBD}",
        company: "${company}",
        label: "${idBD}",
        fec: "${fec}",
        hor: "${hor}",
        nomb: "${nomb}",
        vel: "${vel}",
        bateria: "${bateria}",
        gsm: "${gsm}",
        gps2: "${gps2}",
        ign: "${ign}",
        evt: "${evt}",
        fontColor: "white",
        fillColor: "${colorFondo}",
        strokeColor: "blue",
        strokeOpacity: 0.7,
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold"
    });

    // prepare to style the data
    styleMap = new OpenLayers.StyleMap({
        strokeColor: "black",
        strokeWidth: 2,
        strokeOpacity: 0.5,
        fillOpacity: 0.2
    });

    lienzoCentral = new OpenLayers.Layer.Vector("Centrales", {
        eventListeners: {
            featureselected: function(evt) {
                var feature = evt.feature;

                var nameCentral = feature.attributes.nameCentral;
                var email = feature.attributes.email;
                var phones = feature.attributes.listPhones;
                var phonesString = "";

                if (phones.indexOf(";") !== -1) {
                    var listPhone = phones.split(";");
                    for (var i = 0; i < listPhone.length; i++) {
                        var dataPhone = listPhone[i].split(",");
                        switch (parseInt(dataPhone[0])) {
                            case 1:
                                phonesString += "   <img src='img/icon_claro.png'> " + dataPhone[1];
                                break;
                            case 2:
                                phonesString += "   <img src='img/icon_movistar.png'> " + dataPhone[1];
                                break;
                            case 3:
                                phonesString += "   <img src='img/icon_fijo.png'> " + dataPhone[1];
                                break;
                        }

                        if (i < listPhone.length - 1) {
                            phonesString += "<br>";
                        }
                    }
                } else {
                    var dataPhone = phones.split(",");
                    switch (parseInt(dataPhone[0])) {
                        case 1:
                            phonesString += "   <img src='img/icon_claro.png'> " + dataPhone[1];
                            break;
                        case 2:
                            phonesString += "   <img src='img/icon_movistar.png'> " + dataPhone[1];
                            break;
                        case 3:
                            phonesString += "   <img src='img/icon_fijo.png'> " + dataPhone[1];
                            break;
                    }
                }

                var contenidoAlternativo =
                        "<section>" +
                        "<b>Central:</b> " + nameCentral + "<br>" +
                        "<b>Correo:</b> " + email + "<br>" +
                        "<b>Telefonos:</b><br><pre>" + phonesString + "</pre>" +
                        "</section>";

                var popup = new OpenLayers.Popup.FramedCloud("popup",
                        OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                        null,
                        contenidoAlternativo,
                        null,
                        true, 
                        function(evt) {
                            feature.popup.destroy();
                        }
                        );

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
        styleMap: centralStyle
    });

    lienzoCentral.id = 'coopLayer';

    lienzoSolicitudes = new OpenLayers.Layer.Vector("Solicitudes", {
        eventListeners: {
            featureselected: function(evt) {
                onSolicitudSelect(evt);
            },
            featureunselected: function(evt) {
                onSolicitudUnSelect(evt);
            }
        },
        styleMap: styleSolicitud
    });

    lienzoSolicitudes.id = 'solLayer';

    vectorKRC = new OpenLayers.Layer.Vector("Vehiculos", {
        eventListeners: {
            featureselected: function(evt) {
                onVehiculoSelect(evt);
            },
            featureunselected: function(evt) {
                onVehiculoUnselect(evt);
            }
        },
        styleMap: styleVeh
    });
    vectorKRC.id = 'KRCLayer';

    lienzoPuntosRec = new OpenLayers.Layer.Vector('Puntos Recorridos', {
        eventListeners: {
            featureselected: function(evt) {
                var feature = evt.feature;

                var idRec = feature.attributes.idBD;
                var company = feature.attributes.company;
                var fecha = feature.attributes.fec;
                var hora = feature.attributes.hor;
                var vel = feature.attributes.vel;
                var bateria = feature.attributes.bateria;
                var gsm = feature.attributes.gsm;
                var gps2 = feature.attributes.gps2;
                var ign = feature.attributes.ign;
                var nomb = feature.attributes.nomb;
                var evt = feature.attributes.evt;

                var contenidoAlternativo = "";

                if (bateria === -1) {
                    contenidoAlternativo =
                            "<section>" +
                            "<b>Id: </b>" + idRec.toString() + " | <b>Empresa: </b>"+ company +"<br>" +
                            "<b>Nombre: </b><br>" + nomb.toString() + "</br>" +
                            "<b>Evento: </b><br>" + evt.toString() + "</br>" +
                            "<b>Fecha y Hora: </b>" + fecha.toString() + " " + hora.toString() + "</br>" +
                            "<b>Velocidad: </b>" + vel.toString() + " Km/h</br>" +
                            "<b>Estado Mecanico: </b>" + gps2.toString() + "</br>" +
                            "<b>Estado Unidad: </b>" + ign.toString() +
                            "</section>";
                } else {
                    var stringBateria = "NO";
                    var stringGsm = "NO";
                    if (bateria.toString() === '1') {
                        stringBateria = "SI";
                    }
                    
                    if (gsm.toString() === '1') {
                        stringGsm = "SI";
                    }
                    
                    contenidoAlternativo =
                            "<section>" +
                            "<b>Id: </b>" + idRec.toString() + " | <b>Empresa: </b>"+ company +"<br>" +
                            "<b>Nombre: </b><br>" + nomb.toString() + "</br>" +
                            "<b>Evento: </b><br>" + evt.toString() + "</br>" +
                            "<b>Fecha y Hora: </b>" + fecha.toString() + " " + hora.toString() + "</br>" +
                            "<b>Velocidad: </b>" + vel.toString() + " Km/h</br>" +
                            "<b>Bateria: </b>" + stringBateria +"<b> | GSM: </b>" + stringGsm +
                            "</section>";
                }

                var popup = new OpenLayers.Popup.Anchored("popup",
                        OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                        new OpenLayers.Size(275, 160),
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
        styleMap: stylePuntosRecorrido
    });

    lienzoGeoCercas = new OpenLayers.Layer.Vector('GeoCercas');
    markerEdificios = new OpenLayers.Layer.Markers("KRADAC");

    if (idRolKarview === 2 || idRolKarview === 3 || idRolKarview === 4) {
        lienzoCentral.name = 'Central';
    }

    //Comportamiento de los Elementos de la Capa
    var selectFeatures = new OpenLayers.Control.SelectFeature(
            [lienzoPuntosRec, lienzoCentral, lienzoSolicitudes, vectorKRC], {
        hover: false,
        autoActivate: true
    });

    selectCtrl = new OpenLayers.Control.SelectFeature(lienzoGeoCercas,
            {clickout: true}
    );

    var report = function(e) {
        OpenLayers.Console.log(e.type, e.feature.id);
    };

    var highlightCtrl = new OpenLayers.Control.SelectFeature(lienzoGeoCercas, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary",
        eventListeners: {
            beforefeaturehighlighted: report,
            featurehighlighted: report,
            featureunhighlighted: report
        }
    });

    var polyOptions = {sides: 4};

    polygonControl = new OpenLayers.Control.DrawFeature(lienzoGeoCercas,
            OpenLayers.Handler.RegularPolygon,
            {handlerOptions: polyOptions,
                featureAdded: getDateGeo}
    );

    capaRecorridos();

    map.addLayers([
        lienzoCentral,
        lienzoSolicitudes,
        vectorKRC,
        lienzoPuntosRec,
        lienzoGeoCercas/*,
         markerEdificios*/
    ]);
    map.addControl(selectFeatures);
    map.addControl(highlightCtrl);
    map.addControl(selectCtrl);
    map.addControl(polygonControl);

    selectFeatures.activate();
    highlightCtrl.activate();

    drawControls = {
        polygon: new OpenLayers.Control.DrawFeature(
                lienzoGeoCercas,
                OpenLayers.Handler.Polygon,
                {'featureAdded': getDateGeo})
    };

    for (var key in drawControls) {
        var auxControl = drawControls[key];

        map.addControl(auxControl);
    }

    /**
     * Inicializa el mapa para que permita graficar los recorridos de los buses
     */
    edificios();
    getPosSolicitudes();
    graficarCoop();
    //recargarTree();
}

//Acciones Vehiculos
function onVehiculoSelect(evt) {
    var feature;
    if (evt.feature === undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    var veh = feature.attributes.vehiculo;
    var company = feature.attributes.company;
    var nombre = feature.attributes.nombre;
    var dateTime = feature.attributes.fecha +" "+ feature.attributes.hora;
    var vel = feature.attributes.vel;
    var rumbo = feature.attributes.rumbo;
    var dir = feature.attributes.dir;
    var evento = feature.attributes.evt;

    var contenidoAlternativo =
            "<section>" +
            "<b>Empresa: </b>" + company + "</br>" +
            "<b>Vehiculo: </b>" + nombre + "</br>" +
            "<b>Fecha y Hora: </b>" + dateTime + "</br>" +
            "<b>Velocidad: </b>" + vel + " Km/h | <b>Rumbo: </b>" + rumbo +"º<br>"+
            "<b>Dirección:</b></br>" + dir + "<br>" +
            "<b>Evento:</b></br>" + evento + "<br>" +
            "<img src='img/icon_kradac.png'>" +
            "</section>";

    var popup = new OpenLayers.Popup.Anchored("popup",
            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
            new OpenLayers.Size(255, 183),
            contenidoAlternativo,
            null,
            true, function() {
                map.removePopup(feature.popup);
                feature.attributes.poppedup = false;
            }
    );

    popup.setBackgroundColor('#F5DA81');
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

function onSolicitudSelect(evt) {
    var feature;
    if (evt.feature === undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    var idSol = feature.attributes.idSol;
    var nombres = feature.attributes.nombres;
    var apellidos = feature.attributes.apellidos;
    var fecha = feature.attributes.fecha;
    var hora = feature.attributes.hora;

    var contenidoAlternativo =
            "<section>" +
            "<b>Nombres: </b>" + nombres + "<br>" +
            "<b>Apellidos: </b>" + apellidos + "<br>" +
            "<b>Fecha: </b>" + fecha + "<br>" +
            "<b>Hora: </b>" + hora + "<br>" +
            "<center><a onClick='despachar(" + idSol + ")'><img src='img/despachar.png'> Despachar</a></center>" +
            "</section>";

    var popup = new OpenLayers.Popup.FramedCloud("popup",
            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
            null,
            contenidoAlternativo,
            null,
            true, function() {
                map.removePopup(feature.popup);
                feature.attributes.poppedup = false;
            }
    );

    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup(popup);
}

function onSolicitudUnSelect(evt) {

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
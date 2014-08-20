/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function lienzosRecorridoHistorico(idEquipo, coordPuntos) {

    var features = new Array();

    for (var i = 0; i < coordPuntos.length; i++) {

        var dataRec = coordPuntos[i];

        var pt = new OpenLayers.Geometry.Point(dataRec.longitud, dataRec.latitud);
        pt.transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913"));

        var puntoMap = new OpenLayers.Feature.Vector(pt, {
            idBD: dataRec.idRec,
            company: dataRec.company,
            fec: formatoFecha(new Date(dataRec.fecha_hora)),
            hor: formatoHora(new Date(dataRec.fecha_hora)),
            vel: dataRec.velocidad,
            bateria: dataRec.bateria,
            gsm: dataRec.gsm,
            gps2: dataRec.gps2,
            ign: dataRec.ign,
            evt: dataRec.evento,
            nomb: dataRec.vehiculo,
            poppedup: false,
            colorFondo: dataRec.color
        });

        puntoMap.id = "B" + dataRec.idRec; //El id necesita tener una letra         

        features.push(puntoMap);
    }

    lienzoPuntosRec.addFeatures(features);
}

//Grafica los vehiculos luego de consultar a la BD
function addVehiculoToCanvas(cordGrap) {
    storeEventos.removeAll;
    for (var i = 0; i < cordGrap.length; i++) {
        // Extraigo columnas
        var datosVeh = cordGrap[i].data;
        var idEquipo = datosVeh.idEqp;
        //Extracción dependiendo del Layer
        var taxiFeature = vectorKRC.getFeatureById(idEquipo);

        //Crear un nuevo elemento para el taxi que no existe
        if (taxiFeature === null) {
            // Coordenadas
            var x = datosVeh.lon;
            var y = datosVeh.lat;
            // Posicion lon : lat
            var point = new OpenLayers.Geometry.Point(x, y);

            // Transformacion de coordendas
            point.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

            taxiFeature = new OpenLayers.Feature.Vector(point, {
                icon: datosVeh.icon,
                idCoop: datosVeh.idCoop,
                company: datosVeh.company,
                equipo: idEquipo,
                vehiculo: datosVeh.vehiculo,
                nombre: datosVeh.nombre,
                fecha: datosVeh.fec,
                hora: datosVeh.hor,
                vel: datosVeh.vel,
                rumbo: datosVeh.rumbo,
                dir: datosVeh.dir,
                evt: datosVeh.evt,
                favColor: 'blue',
                align: "lt",
                poppedup: false
            });

            if (datosVeh.idEvt > 0 && datosVeh.idEvt === 3 || datosVeh.idEvt === 7 || datosVeh.idEvt === 8 ||
                    datosVeh.idEvt === 11 || datosVeh.idEvt === 13 || datosVeh.idEvt === 20) {
                var evt = Ext.create('eventos', {
                    fecha_hora: datosVeh.fec + ' ' + datosVeh.hor,
                    vehiculo: datosVeh.nombre,
                    evento: datosVeh.evt,
                    velocidad: datosVeh.vel,
                    direccion: datosVeh.dir,
                    coordenadas: datosVeh.lon + ',' + datosVeh.lat
                });
                storeEventos.insert(0, evt);
            }

            // Se coloca el ID de veh�culo a la imagen            
            taxiFeature.id = idEquipo;
            //Se añade a la capa que corresponda
            vectorKRC.addFeatures([taxiFeature]);
        } else {
            // Comprobar si los datos graficados estan desactualizados
            if (taxiFeature.attributes.hora !== datosVeh.hor) {
                var poppedup = false;
                poppedup = taxiFeature.attributes.poppedup;

                // Nuevo punto
                var newPoint = new OpenLayers.LonLat(datosVeh.lon, datosVeh.lat);
                newPoint.transform(new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:900913"));
                // Asignamos icono y Movemos el vehiculo 
               // taxiFeature.attributes.icon = getIconByRumbo(datosVeh.rumbo, datosVeh.vel, datosVeh.idEvt);
                taxiFeature.move(newPoint);

                if (datosVeh.idEvt === 1 || datosVeh.idEvt === 3 || datosVeh.idEvt === 7 || datosVeh.idEvt === 8 ||
                        datosVeh.idEvt === 11 || datosVeh.idEvt === 13 || datosVeh.idEvt === 20) {
                    var evt = Ext.create('eventos', {
                        fecha_hora: datosVeh.fec + ' ' + datosVeh.hor,
                        vehiculo: datosVeh.nombre,
                        evento: datosVeh.evt,
                        velocidad: datosVeh.vel,
                        direccion: datosVeh.dir,
                        coordenadas: datosVeh.lon + ',' + datosVeh.lat
                    });
                    storeEventos.insert(0, evt);
                }

                if (poppedup) {
                    onVehiculoUnselect(taxiFeature);

                    // Actualizamos Datos
                    taxiFeature.attributes.fecha = datosVeh.fec;
                    taxiFeature.attributes.hora = datosVeh.hor;
                    taxiFeature.attributes.vel = datosVeh.vel;
                    taxiFeature.attributes.rumbo = datosVeh.rumbo;
                    taxiFeature.attributes.dir = datosVeh.dir;
                    taxiFeature.attributes.evt = datosVeh.evt;

                    onVehiculoSelect(taxiFeature);
                } else {
                    // Actualizamos Datos
                    taxiFeature.attributes.fecha = datosVeh.fec;
                    taxiFeature.attributes.hora = datosVeh.hor;
                    taxiFeature.attributes.vel = datosVeh.vel;
                    taxiFeature.attributes.rumbo = datosVeh.rumbo;
                    taxiFeature.attributes.dir = datosVeh.dir;
                    taxiFeature.attributes.evt = datosVeh.evt;
                }
            }
        } //FIN DE ELSE DEL OBJETO NULO
    }
}

function addCompanyToCanvas(cordGrap) {
    for (var i = 0; i < cordGrap.length; i++) {
        var dataCoop = cordGrap[i].data;

        //lon - lat
        var punto = new OpenLayers.Geometry.Point(dataCoop.longitud, dataCoop.latitud);

        // Creacion del punto
        // Transformacion de coordendas
        punto.transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913"));

        var pointFeature = new OpenLayers.Feature.Vector(punto, {
            icon: dataCoop.icon,
            idCentral: dataCoop.id,
            nameCentral: dataCoop.text,
            email: dataCoop.email,
            listPhones: dataCoop.telefono,
            poppedup: false,
            favColor: 'blue',
            align: "lt"
        });

        // Se coloca el ID de la central
        if (idRolKarview === 2 || idRolKarview === 4) {
            showCoopMap[i] = [dataCoop.id, dataCoop.text, true, dataCoop.idTipoEmpresa];
            // Centrar el Mapa
            var lonLat = new OpenLayers.LonLat(dataCoop.longitud, dataCoop.latitud).transform(new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject());
            map.setCenter(lonLat, 13);
        } else {
            showCoopMap[i] = [dataCoop.id, dataCoop.text, false, dataCoop.idTipoEmpresa];
        }

        pointFeature.id = dataCoop.id;

//        // Anadir  central al mapa
        lienzoCentral.addFeatures([pointFeature]);
    }

    getCoopMenu();
}

function addSolicitudesToCanvas(coordPuntos) {
    var features = new Array();

    for (i = 0; i < coordPuntos.length; i++) {
        var dataSol = coordPuntos[i];
        var idSol = dataSol.idSol;

        var taxiFeature = null;
        taxiFeature = lienzoSolicitudes.getFeatureById(idSol);


        if (taxiFeature == null) {

            var pt = new OpenLayers.Geometry.Point(dataSol.longitud, dataSol.latitud);
            pt.transform(new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));

            var puntoMap = new OpenLayers.Feature.Vector(pt, {
                idSol: idSol,
                nombres: dataSol.nombres,
                apellidos: dataSol.apellidos,
                celular: dataSol.celular,
                fecha: dataSol.fecha,
                hora: dataSol.hora,
                poppedup: false
            });

            puntoMap.id = idSol; //puede ser numero pero si es string

            features.push(puntoMap);
            lienzoSolicitudes.addFeatures(features);

        } else {
            var poppedup = false;
            poppedup = taxiFeature.attributes.poppedup;

            if (poppedup) {
                onSolicitudUnSelect(taxiFeature);
                onSolicitudSelect(taxiFeature);
            }
        }
    }
}

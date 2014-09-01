/*Funciones para guardar Geolocalizacion de Usuario*/
var cadena;
var data = [];
function getLocationUser() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(showPositionUser, showError);
    } else {
        //x.innerHTML="Geolocation is not supported by this browser.";
        Ext.example.msg('Error', 'Geolocalizacion no es soportada por este navegador.');
    }
}

function showPositionUser(position) {
    lonPos = position.coords.longitude;
    latPos = position.coords.latitude;

    document.getElementById("longitud").value = lonPos;
    document.getElementById("latitud").value = latPos;
}
/*
 Funciones para realizar Geolocalización
 */
function getLocation() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        //x.innerHTML="Geolocation is not supported by this browser.";
        Ext.example.msg('Error', 'Geolocalizacion no es soportada por este navegador.');
    }
}

function connectionMap() {
    if (typeof OpenLayers !== 'undefined') {
        return true;
    } else {
        Ext.example.msg('Mensaje', 'El mapa se encuentra deshabilitado.');
        return false;
    }
}

function showPosition(position) {
    //x.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude; 
    localizarDireccion(position.coords.longitude, position.coords.latitude, 17);
}

function showError(error) {
    console.log(error);
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML="User denied the request for Geolocation."
            Ext.example.msg('Error', 'User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            //x.innerHTML="Location information is unavailable."
            Ext.example.msg('Error', 'Location information is unavailable.');
            break;
        case error.TIMEOUT:
            //x.innerHTML="The request to get user location timed out."
            Ext.example.msg('Error', 'The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            //x.innerHTML="An unknown error occurred."
            Ext.example.msg('Error', 'An unknown error occurred.');
            break;
    }
}
function kilometrajeRecorrido(json) {
    var lat1;
    var lon1;
    var lat2;
    var lon2;
    var k = 0;
    var kilometraje = 0;
    for (var i = 0; i < json.length - 1; i++) {
        var punto1 = json[i];
        lat1 = punto1.latitud;
        lon1 = punto1.longitud;
        var punto2 = json[i + 1];
        lat2 = punto2.latitud;
        lon2 = punto2.longitud;

        k = parseFloat(Dist(lat1, lon1, lat2, lon2));
        kilometraje = kilometraje + k;
    }
    return kilometraje.toFixed(2);
}
function obtenerLitros(json) {
    var kilometraje = parseFloat(kilometrajeRecorrido(json));
    var kilEstimado=100;
    var litrosEstimadoo=7.5;
    var litros= kilometraje*litrosEstimadoo/kilEstimado;
    return litros.toFixed(2);
}

function obtenerGalones(json) {
    var litros = parseFloat(obtenerLitros(json));
    var litrosEstimado=3.78541178;
    var galonEstimado=1;
    var galones= litros*galonEstimado/litrosEstimado;
    return galones.toFixed(2);
}

function Dist(lat1, lon1, lat2, lon2) {
    rad = function(x) {
        return x * Math.PI / 180;
    };
    var R = 6378.137;                          //Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(2);                      //Retorna tres decimales
}

function velocidadmaxima(json) {
    var maximo = json[0].velocidad;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        lat1 = objeto.velocidad;
        if(objeto.velocidad>maximo){
            maximo=objeto.velocidad;
        }
    }
    return maximo;
}

function velocidadMinimo(json) {
    var minimo = json[0].velocidad;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        lat1 = objeto.velocidad;
        if(objeto.velocidad<minimo){
            minimo=objeto.velocidad;
        }
    }
    return minimo;
}

function velociadadMedia(json) {
    var promedio = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        promedio = promedio+objeto.velocidad;
    }
    return (promedio/json.length).toFixed(2);
}

function velociadadMayor60(json) {
    var contmayor = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        console.log('velocidad de 60');
        if(objeto.velocidad>60){
           contmayor=contmayor+1;
        }
    }
    return contmayor;
}

function velociadadMayor90(json) {
    var contmayor = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        if(objeto.velocidad>90){
           contmayor=contmayor+1;
        }
    }
    return contmayor;
}






//function getCoopMenu() {
//    for (var i = 0; i < showCoopMap.length; i++) {
//        if (showCoopMap[i][0] > 1) {
//            menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
//        }
//    }
//}

/*
 Funciones para recargar la region Este del sistema de forma Automatica
 */

function recargarTree() {

    setTimeout(function() {
        recargarTree();

        var treePart = Ext.getCmp('veh-part-tree');
        var treeTaxis = Ext.getCmp('veh-taxis-tree');
        reloadTree(treePart, 'Vehiculos Particulares', storeTreeVehPart);
        reloadTree(treeTaxis, 'Taxis', storeTreeVehTaxis);
    }
    , 20 * 1000);
}

function reloadTree(tree, titleMessenge, storeTree) {
    //tree.body.mask('Loading', 'x-mask-loading');

    /*storeTree.reload(function(){
     tree.body.unmask();
     Ext.example.msg('Vehiculos', 'Recargado');
     });*/

    storeTree.reload();
    //Ext.example.msg(titleMessenge, 'Recargado');
    //tree.body.unmask(); 
}

function formatoFecha(date) {

    var año = date.getFullYear();
    var mes = date.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }
    var dia = date.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }
    return año + '-' + mes + '-' + dia;
}

function formatoHora(time) {
    var hora = time.getHours();
    if (hora < 10) {
        hora = "0" + hora;
    }
    var minuto = time.getMinutes();
    if (minuto < 10) {
        minuto = "0" + minuto;
    }
    var segundo = time.getSeconds();
    if (segundo < 10) {
        segundo = "0" + segundo;
    }
    return hora + ':' + minuto + ':' + segundo;
}

function formatBatIgnGsmGps2(val) {
    if (val === 1) {
        return '<span style="color:green;">SI</span>';
    } else {
        return '<span style="color:red;">NO</span>';
    }
}

function formatTmpDes(val) {
    if (val < 11) {
        return '<span style="color:green;">' + val + '</span>';
    } else if (val < 60) {
        return '<span style="color:orange;">' + val + '</span>';
    } else {
        return '<span style="color:red;">' + val + '</span>';
    }
}

function formatLock(val) {
    if (val === 1) {
        return '<span style="color:green;">NO</span>';
    } else {
        return '<span style="color:red;">SI</span>';
    }
}

function formatStateTaxy(val) {
    if (val === 1) {
        return '<span style="color:red;">Ocupado</span>';
    } else {
        return '<span style="color:green;">Libre</span>';
    }
}
///
function formatTipoEstado(val) {
    switch (val) {
        case 0:
            return '<span style="color:blue;"><b>Entrada</b></span>';
            break;
        case 1:
            return '<span style="color:orange;"><b>Salida</b></span>';
            break;
    }
}
//
//function formatTipoSeguro(val) {
//     var nowDate = new Date();
//   console.logg(Ext.Date.format(val, 'Y-m-d'));
//   console.logg(Ext.Date.format(nowDate, 'Y-m-d'));
////    if(Ext.Date.format(val, 'Y-m-d')===(Ext.Date.format(nowDate, 'Y-m-d'))){
////         return '<span style="color:blue;">CADUCADO</span>';
////    }else if(val==='0000-00-00'){
////         return '<span style="color:blue;">NO REGISTRADO</span>';
////    }else{
////        return '<span style="color:green;">VIGENTE</span>';
////    }
//    
   
//}



function formatTipoSeguro(val) {
     var nowDate = new Date();
    if(Ext.Date.format(val, 'Y-m-d')===(Ext.Date.format(nowDate, 'Y-m-d'))){
         return '<span style="color:blue;">CADUCADO</span>';
    }else if(val==='0000-00-00'){
         return '<span style="color:blue;">NO REGISTRADO</span>';
    }else{
        return '<span style="color:green;">VIGENTE</span>';
    }
    
   
}






function formatTipoServicio(val) {
    switch (val) {
        case 1:
            return '<span style="color:blue;">Mantenimiento</span>';
            break;
        case 2:
            return '<span style="color:orange;">Reparacion</span>';
            break;
        case 3:
            return '<span style="color:green;">Repuesto</span>';
            break;
    }
}





function formatPanic(val) {
    if (val === 1) {
        return '<span style="color:blue;">NORMAL</span>';
    } else {
        return '<span style="color:red;"> PANICO RECEPTADO</span>';
    }
}

function parametroServicio(val) {
    if (val === "1") {
        return '<span style="color:blue;"><b>KILOMETRO</b></span>';
    } else if (val === "2") {
        return '<span style="color:green;"><b>DIA</b></span>';
    } else {
        return '<span style="color:orange;"><b>VACIO</b> </span>';
    }
}

function formatSpeed(val) {
    if (val > 60) {
        return '<span style="color:orange;">' + val + '</span>';
    } else if (val > 90) {
        return '<span style="color:red;">' + val + '</span>';
    } else {
        return '<span style="color:blue;">' + val + '</span>';
    }
}

function formatState(val) {
    if (val > 6) {
        return '<span style="color:red;">Desconectado</span>';
    } else {
        return '<span style="color:green;">Conectado</span>';
    }
}

function formatStateMec(val) {
    if (val === 'OK') {
        return '<span style="color:green;">' + val + '</span>';
    } else {
        return val;
    }
}

function formatCompany(val) {
    if (val === 'COOPMEGO') {
        return '<span style="color:blue;">' + val + '</span>';
    }
    if (val === 'KRADAC') {
        return '<span style="color:green;">' + val + '</span>';
    }
    return val;
}

function formatStateConect(val) {
    if (val === "1")
        return '<center><img src="img/icon_conect.png" alt="conectado"></center>';
    else if (val === "0")
        return '<center><img src="img/icon_desconect.png" alt="conectado"></center>';
    else
        return '';
}

function check_cedula(b) {
    var h = b.split("");
    var c = h.length;
    if (c == 10) {
        var f = 0;
        var a = (h[9] * 1);
        for (i = 0; i < (c - 1); i++) {
            var g = 0;
            if ((i % 2) != 0) {
                f = f + (h[i] * 1)
            } else {
                g = h[i] * 2;
                if (g > 9) {
                    f = f + (g - 9)
                } else {
                    f = f + g
                }
            }
        }
        var e = f / 10;
        e = Math.floor(e);
        e = (e + 1) * 10;
        var d = (e - f);
        if ((d == 10 && a == 0) || (d == a)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function despachar(idSol) {
    Ext.Ajax.request({
        url: 'php/roles/cooperativas/setDespacho.php',
        params: {
            idSolicitud: idSol
        },
        success: function(response, opts) {
            Ext.example.msg("Mensaje", "Despacho Realizado Correctamente");
        }
    });

}

//function getCoopMenu() {
//    for (var i = 0; i < showCoopMap.length; i++) {
//        if (showCoopMap[i][3] === 2) {
//            menuCoop.add({id: showCoopMap[i][0], itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
//        }
//    }
//}

function getIconByRumbo(rumbo, velocidad, idEvento) {
    var icon = '';

    if (idEvento > 0 && idEvento <= 2) {
        icon = 'img/taxy_panic.png';
    } else {
        if (velocidad > 0) {
            if (rumbo > 0) {
                if (rumbo >= 1 && rumbo < 22.5) {
                    icon = 'img/taxy_north.png';
                } else if (rumbo >= 22.5 && rumbo < 67.5) {
                    icon = 'img/taxy_north_east.png';
                } else if (rumbo >= 67.5 && rumbo < 112.5) {
                    icon = 'img/taxy_east.png';
                } else if (rumbo >= 112.5 && rumbo < 157.5) {
                    icon = 'img/taxy_south_east.png';
                } else if (rumbo >= 157.5 && rumbo < 202.5) {
                    icon = 'img/taxy_south.png';
                } else if (rumbo >= 202.5 && rumbo < 247.5) {
                    icon = 'img/taxy_south_west.png';
                } else if (rumbo >= 247.5 && rumbo < 292.5) {
                    icon = 'img/taxy_west.png';
                } else if (rumbo >= 292.5 && rumbo < 337.5) {
                    icon = 'img/taxy_north_west.png';
                } else if (rumbo >= 337.5 && rumbo < 360) {
                    icon = 'img/taxy_north.png';
                }
            } else {
                icon = 'img/taxy_sin_rumbo.png';
            }
        } else {
            icon = 'img/taxy_stop.png';
        }
    }

    return icon;
}


function getNavigator() {
    if (navigator.appName === "Microsoft Internet Explorer") {
        return 'img/explorer.png';
        //return '<img src="img/explorer.png" width="16" height="16">';
    } else {
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
            return 'img/chrome.png';
            //return '<img src="img/chrome.png" width="16" height="16">';
        } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            return 'img/firefox.png';
            //return '<img src="img/firefox.png" width="16" height="16">';
        } else if (navigator.userAgent.indexOf('Apple') !== -1) {
            return 'img/safari.png';
            //return '<img src="img/safari.png" width="16" height="16">';
        } else {
            return 'Desconocido';
        }
    }
}

//function getCoopMenu() {
//    for (var i = 0; i < showCoopMap.length; i++) {
//        if (showCoopMap[i][0] > 0) {
//            menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
//        }
//    }
//}

function checkRolSesion(idRolKarview) {
    Ext.Ajax.request({
        url: 'php/login/checkLogin.php',
        params: {
            idRolKarview: idRolKarview
        },
        success: function(response) {
            if (parseInt(response.responseText) === 1) {
                window.location = 'index.php';
            }
        }
    });

    setTimeout(function() {
        checkRolSesion(idRolKarview);
    }
    , 3 * 1000);
}

function reloadStore(store, cant) {
    setTimeout(function() {
        // reloadStateEqp(store, cant);
        store.reload();
    }
    , cant * 1000);
}
function fijarcadenaPrueba(cadenas) {
    cadena = cadenas;
//console.log(cadena);
    cadena = cadena.replace(/;/g, ',');
    if (cadena.charAt(cadena.length - 1) == ',') {
        cadena = cadena.substring(0, cadena.length - 1)
//        console.log(cadena);
    }
    ;
//console.log(cadena.charAt(cadena.length-1));
}


function dataPrueba() {
//
    var data = [];
    var lasts = [];
//    var cadena ='';
//    console.log(cadena);
//    cadena.replace(';',',')
    lasts = cadena.split(',');
    var count = 0;
    var oper = ' ';
    var hasta = lasts.length / 2;
    for (var i = 0; i < hasta; i++) {
        if (lasts[count] || null) {
            if (lasts[count] == 1) {
                oper = 'Claro';
            } else {
                if (lasts[count] == 2) {
                    oper = 'Movistar';
                } else {
                    if (lasts[count] == 3) {
                        oper = 'Convencional'
                    } else {
                    }
                }
                ;
            }
        } else {
            oper = '';
        }
        ;
        data.push({
            name: lasts[count],
            numero: lasts[count + 1],
            tipo: oper
        });
        count = count + 2;
    }

    return data;

}
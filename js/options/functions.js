//VARIABLES GLOBALES
var INFOMESSAGEREQUERID = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>';
var INFOMESSAGEREQUERIDUNIQUE = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio y Único">*</span>';
var INFOMESSAGEKRADAC = 'Información del Sistema';
var INFOMESSAGEBLANKTEXT = 'Este campo es Obligatorio';
var INFOMESSAGEREQUERIDALL = 'Llenar los campos obligatorios';
var INFOMESSAGEBLANKUNIQUETEXT = 'Este campo es Obligatorio y Único';
var INFOMESSAGEMAXLENGTH = 'La longitud máxima para este campo es {0}';
var INFOMESSAGEMINLENGTH = 'La longitud mínima para este campo es {0}';
var INFOMESSAGEMAXVALUE = 'El valor máximo para este campo es {0}';
var INFOMESSAGEMINVALUE = 'El valor mínimo para este campo es {0}';
var currentDate = new Date();



/*Funciones para guardar Geolocalizacion de Usuario*/
var cadena;
var data = [];

function applicateVTypes() {
    // /g -> Busqueda case sensitive
    // /i -> Busqueda no case sensitive
    // \s -> Busqueda de espacios
    // \d -> Busqueda de digitos
    // \D -> Busqueda de no digitos

    Ext.apply(Ext.form.field.VTypes, {
        emailText: 'Este campo debe ser una dirección de correo electrónico en el formato "user@example.com"',
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },
        daterangeText: 'La fecha de inicio debe ser menor que la fecha de fin',
        password: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Las Contraseñas no coinciden',
        cedulaValida: function (val, field) {
            if (val.length === 10) {
                return check_cedula(val);
            } else {
                return false;
            }
        },
        cedulaValidaText: 'Número de Cedula Invalida',
        cedulaValidaMask: /[0-9]/,
        placaValida: function (val, field) {
            if (val.length === 7) {
                return /^[A-Z]{3}[0-9]{4}$/.test(val);
            } else {
                return /^[A-Z]{3}[0-9]{3}$/.test(val);
            }
        },
        placaValidaText: 'Ingrese un número de placa válido. Ejemplo: LAB3532. "3 letras y 3 o 4 números")',
        placaValidaMask: /[A-Z0-9]/,
        registroMunicipal: function (val, field) {
            return /^[RT-]{3}[0-9]{4}$/.test(val);
        },
        registroMunicipalText: 'Ingrese un número de Registro Municipal válido. Ejemplo: RT-1501. "2 letras, - y 4 números")',
        registroMunicipalMask: /[-RT0-9]/,
        numeroTelefono: function (val, field) {
            if (val.length === 10) {
                return /^09[0-9]{8}$/.test(val);
            } else {
                return /^07[0-9]{7}$/.test(val);
            }
        },
        numeroTelefonoText: 'Ingresar solo caracteres numéricos válidos <br>que empiezen con [09] movil tamaño de (10)dígitos<br> 0 [072] convencional tamaño de (9)dígitos ',
        telefonocelular: function (val, field) {
            return /^09[0-9]{8}$/.test(val);
        },
        telefonocelularText: 'Ingresar un número de teléfono celular válido<br>que empieze con [09] de (10)dígitos',
        telefonocelularMask: /[0-9]/,
        num: function (val, field) {
            return /^[0-9]*$/.test(val);
        },
        numText: 'El campo solo debe contener numeros',
        numMask: /[0-9]/,
        numdash: function (val, field) {
            return /^[0-9-]*$/.test(val);
        },
        numdashText: 'El campo solo debe contener numeros y -',
        numdashMask: /[0-9-]/,
        alphaupper: function (val, field) {
            return /^[A-Z]*$/.test(val);
        },
        alphaupperText: 'El campo solo debe contener letras mayusculas sin Ñ y sin espacios',
        alphaupperMask: /[A-Z]/,
        alphauppernum: function (val, field) {
            return /^[A-Z0-9]*$/.test(val);
        },
        alphauppernumText: 'El campo solo debe contener letras mayusculas sin Ñ, numeros y sin espacios',
        alphauppernumMask: /[A-Z0-9]/,
        alphaupperene: function (val, field) {
            return /^[A-ZÑ]*$/.test(val);
        },
        alphauppereneText: 'El campo solo debe contener letras mayusculas con Ñ, sin espacios',
        alphauppereneMask: /[A-ZÑ]/,
        alphaupperaccent: function (val, field) {
            return /^[A-ZÁÉÍÓÚ]*$/.test(val);
        },
        alphaupperaccentText: 'El campo solo debe contener letras mayusculas y vocales con acento',
        alphaupperaccentMask: /[A-ZÁÉÍÓÚ]/,
        alphaupperspaces: function (val, field) {
            return /^[A-Z\s]*$/.test(val);
        },
        alphaupperspacesText: 'El campo solo debe contener letras mayusculas sin Ñ y con espacios',
        alphaupperspacesMask: /[A-Z\s]/,
        alphaupperspacesene: function (val, field) {
            return /^[A-ZÑ\s]*$/.test(val);
        },
        alphaupperspaceseneText: 'El campo solo debe contener letras mayusculas con Ñ y con espacios',
        alphaupperspaceseneMask: /[A-ZÑ\s]/,
        alphaaccentenespaces: function (val, field) {
            return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(val);
        },
        alphaaccentenespacesText: 'El campo solo debe contener letras, espacios, acentos y ñ|Ñ',
        alphaaccentenespacesMask: /[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/,
        alphanumaccentenespaces: function (val, field) {
            return /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]*$/.test(val);
        },
        alphanumaccentenespacesText: 'El campo solo debe contener letras, espacios, numeros, acentos y ñ|Ñ',
        alphanumaccentenespacesMask: /[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]/,
        alphanumnospecialenepointdash: function (val, field) {
            return /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ.-\s]*$/.test(val);
        },
        alphanumnospecialenepointdashText: 'El campo solo debe contener letras, espacios, numeros, acentos, ñ|Ñ, . y -',
        alphanumnospecialenepointdashMask: /[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ.-\s]/,
        //Otros
        emailNuevo: function (val, field) {
            if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return  false;
            }
            return true;
        },
        emailNuevoText: 'Dede ingresar segun elz formato user@gmail.com <br>sin caracteres especiales',
        campos: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñÑ\s*]{2,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 45 carateres',
        //para direccion
        direccion: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,150}$/.test(val)) {
                return  false;
            }
            return true;
        },
        direccionText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 150 carateres',
        //Metodo utilizado para controlar caracteres alfanuericos y el tamano del campo "Reg. Municipal"
        //del archivo administracion de buses (vehicle.js)
        camposVehicleMax10: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,10}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposVehicleMax10Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 10 carateres',
        //Metodo utilizado para controlar caracteres alfanuericos y el tamano de los campos
        //del archivo administracion de buses (vehicle.js) que requieren un tamano de entre 2 y 45 caracteres
        camposVehicleMax45: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposVehicleMax45Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 45 carateres',
        campos1: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,80}$/.test(val)) {
                return  false;
            }
            return true;
        },
        campos1Text: 'Solo carateres alfa numéricos<br> Tamaño min de 1 y un máx de 80 carateres',
        camposMin: function (val, field) {
            if (!/^[0-9A-Za-zñ\s*]{2,10}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposMinText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 10 carateres',
        //solo mayus
        mayus: function (val, field) {
            if (!/^[0-9A-Z]{1,5}$/.test(val)) {
                return  false;
            }
            return true;
        },
        mayusText: 'Solo carateres Mayusculas',
        //Para datos combos vehiculos y personas 

        alphanum0: function (val, field) {
            if (!/^[0-9A-Za-záéíóúñ\s*]{3,80}$/.test(val)) {
                return  false;
            }
            return true;
        },
        alphanum0Text: 'Solo carateres alfa numéricos',
        alphanum1: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ\s*]{2,30}$/.test(val)) {
                return  false;
            }
            return true;
        },
        alphanum1Text: 'Solo carateres alfa numéricos',
        //para puntos
        puntos: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ/\s*]{2,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        puntosText: 'Solo datos numéricos,mínimo 2 y máximo de 4 numeros',
        ///para rutas
        alphanum2: function (val, field) {
            if (!/^[0-9\s.A-Z.\sa-zÁÉÓÍÚáéíóúñ.()-:\s*]{3,100}$/.test(val)) {
                return  false;
            }
            return true;
        },
        alphanum2Text: 'Solo carateres alfa numéricos',
        //para geocercas
        geo: function (val, field) {
            if (!/^[0-9]{2,4}$/.test(val)) {
                return  false;
            }
            return true;
        },
        geoText: 'Solo carateres numéricos mínimo 2 y máximo 4 numeros',
        num1: function (val, field) {
            if (!/^[0-9]{3,4}$/.test(val)) {
                return  false;
            }
            return true;
        },
        num1Text: 'Solo carateres numéricos',
        //para numeros 3-45
        num2: function (val, field) {
            if (!/^[0-9]{3,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        num2Text: 'Solo carateres numéricos mínimo 3 y un máximo de 45',
        camposRegMun: function (val, field) {
            if (!/^[-0-9A-Za-z]{3,10}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposRegMunText: 'Solo carateres alfa numéricos,y guiones <br> Tamaño min de 5 y un máx de 10 carateres',
        distancia: function (value, field) {
            return value.replace(/[ \.]/g, '');
        },
        distanciaText: 'Formato distanc 00.00',
        distanciaMask: /[ \d\.]/
    });
}



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

function messageInformation(message) {
    Ext.MessageBox.show({
        title: 'Información',
        msg: message,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INTO
    });
}

function showError(error) {
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
    var kilEstimado = 100;
    var litrosEstimadoo = 7.5;
    var litros = kilometraje * litrosEstimadoo / kilEstimado;
    return litros.toFixed(2);
}

function obtenerGalones(json) {
    var litros = parseFloat(obtenerLitros(json));
    var litrosEstimado = 3.78541178;
    var galonEstimado = 1;
    var galones = litros * galonEstimado / litrosEstimado;
    return galones.toFixed(2);
}

function Dist(lat1, lon1, lat2, lon2) {
    rad = function (x) {
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
        if (objeto.velocidad > maximo) {
            maximo = objeto.velocidad;
        }
    }
    return maximo;
}

function velocidadMinimo(json) {
    var minimo = json[0].velocidad;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        lat1 = objeto.velocidad;
        if (objeto.velocidad < minimo) {
            minimo = objeto.velocidad;
        }
    }
    return minimo;
}

function velociadadMedia(json) {
    var promedio = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        promedio = promedio + objeto.velocidad;
    }
    return (promedio / json.length).toFixed(2);
}

function velociadadMayor60(json) {
    var contmayor = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        if (objeto.velocidad > 60) {
            contmayor = contmayor + 1;
        }
    }
    return contmayor;
}

function velociadadMayor90(json) {
    var contmayor = 0;
    for (var i = 0; i < json.length; i++) {
        var objeto = json[i];
        if (objeto.velocidad > 90) {
            contmayor = contmayor + 1;
        }
    }
    return contmayor;
}






function getCoopMenu() {
    for (var i = 0; i < showCoopMap.length; i++) {
        if (showCoopMap[i][0] > 1) {
            menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
        }
    }
}

/*
 Funciones para recargar la region Este del sistema de forma Automatica
 */

function recargarTree() {

    setTimeout(function () {
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

function formatBat(val) {
    if (val === 1) {
        return '<span style="color:green;">Bat del Vehiculo</span>';
    } else {
        return '<span style="color:red;">Bat del Equipo</span>';
    }
}

function estadoVehiculo(val) {
    if (val === 1) {
        return '<span style="color:green;">Encendido</span>';
    } else {
        return '<span style="color:red;">Apagado</span>';
    }
}


function formatBatIgnGsmGps2(val) {
    if (val === 1) {
        return '<span style="color:green;">Con Cobertura</span>';
    } else {
        return '<span style="color:red;">Sin Cobertura</span>';
    }
}
function formatIgn(val) {
    if (val === 1) {
        return '<span style="color:green;">Con Cobertura</span>';
    } else {
        return '<span style="color:red;">Sin Cobertura</span>';
    }
}

function estadoGsm(val) {
    if (val === 1) {
        return '<span style="color:green;">Con Cobertura</span>';
    } else {
        return '<span style="color:red;">Sin Cobertura</span>';
    }
}

function estadoGps(val) {
    if (val === 1) {
        return '<span style="color:green;">Con Gps</span>';
    } else {
        return '<span style="color:red;">Sin Gps</span>';
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
        return '<span style="color:green;">SI</span>';
    } else {
        return '<span style="color:red;">NO</span>';
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

function formatTipoRegistro(val) {
    var nowDate = new Date();
    if (Ext.Date.format(val, 'Y-m-d') === (Ext.Date.format(nowDate, 'Y-m-d'))) {
        return '<span style="color:BLACK;">CADUCADO</span>';
    } else if (val === 'NO') {
        return '<span style="color:RED;">NO REGISTRADO</span>';
    } else {
        return '<span style="color:GREEN;">VIGENTE</span>';
    }
}

function formatVistaRegistro(val) {
    if (val === 'NO') {
        return '<span style="color:RED;">NO REGISTRADO</span>';
    } else {
        return '<span style="color:GREEN;">' + val + '</span>';
    }
}


function formatTipoServicio(val) {
    switch (val) {
        case 1:
            return '<span style="color:blue;">Mantenimiento</span>';
            break;
        case 2:
            return '<span style="color:orange;">Reparación</span>';
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
///
function formatEstadoGeocerca(val) {
    if (val === 0) {
        return '<span style="color:black;">' + "FUERA" + '</span>';
    } else if (val === 1) {
        return '<span style="color:green;">' + "DENTRO" + '</span>';
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

function formatComp(val) {
    if (val==='<b>Total</b>') {
        return val;
    } else {
        var record = storeEmpresas.getById(val);
        return '<span style="color: ' + record.get('color') + ';">' + record.get('text') + '</span>';
    }
     return val;
}



function formatCompany(val) {
    if (val === '1') {
        return '<span style="color:blue;">' + 'KRADAC' + '</span>';
    }
    if (val === '2') {
        return '<span style="color:green;">' + 'COOPMEGO' + '</span>';
    }
    if (val === '5') {
        return '<span style="color:green;">' + 'PRUEBAS' + '</span>';
    }
    return val;
}

function formatCompanyCant(val) {
    if (val === 2) {
        return '<span style="color:blue;">' + 'COOPMEGO' + '</span>';
    }
    if (val === 1) {
        return '<span style="color:green;">' + 'KRADAC' + '</span>';
    }
    return val;
}


function formatEstadoEquipo(val) {
    var estad = 1;
    for (var i = 0; i < store_equipo.data.length; i++) {
        if (store_equipo.getAt(i).data.id === val) {
            estad = 0
        }
    }
    if (estad === 0) {
        return '<span style="color:green;">' + 'Disponible' + '</span>';
    }
    if (estad === 1) {
        return 'Ocupado';
    }

}

function obtenerVehiculo(val) {
    for (var i = 0; i < storeVeh.data.length; i++) {
        if (storeVeh.getAt(i).data.id === val) {
            return;
        }
    }
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
        success: function (response, opts) {
            Ext.example.msg("Mensaje", "Despacho Realizado Correctamente");
        }
    });

}

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



function checkRolSesion(idRolKarview) {
    Ext.Ajax.request({
        url: 'php/login/checkLogin.php',
        params: {
            idRolKarview: idRolKarview
        },
        success: function (response) {
            if (parseInt(response.responseText) === 1) {
                window.location = 'index.php';
            }
        }
    });

    setTimeout(function () {
        checkRolSesion(idRolKarview);
    }
    , 3 * 1000);
}

function reloadStore(store, cant) {
    setTimeout(function () {
        // reloadStateEqp(store, cant);
        store.reload();
    }
    , cant * 1000);
}
function fijarcadenaPrueba(cadenas) {
    cadena = cadenas;
    cadena = cadena.replace(/;/g, ',');
    if (cadena.charAt(cadena.length - 1) == ',') {
        cadena = cadena.substring(0, cadena.length - 1)
    }
    ;
}


function dataPrueba() {
    var data = [];
    var lasts = [];
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


function formatBateria(val) {
    if (val === 1) {
        return '<span style="color:green;">Bat. del Vehiculo</span>';
    } else if (val === 0) {
        return '<span style="color:red;">Bat. del Equipo</span>';
    } else {
        return '';
    }
}


function formatBatGSM(val) {
    if (val === 0) {
        return '<span style="color:red;">Sin covertura</span>';
    } else {
        return '<span style="color:green;">Con covertura</span>';
    }
}



function formatBatGPS(val) {
    if (val === 0) {
        return '<span style="color:red;">Sin GPS</span>';
    } else {
        return '<span style="color:green;">Con GPS</span>';
    }
}


function formatBatIgn(val) {
    if (val === 0) {
        return '<span style="color:red;">Apagado</span>';
    } else {
        return '<span style="color:green;">Encendido</span>';
    }
}

function messageInformationEffect(message) {
    Ext.example.msg("Información", message);
}

function messageInformation(message) {
    Ext.example.msg("Información", message);
}

function messageInformation(message) {
    Ext.MessageBox.show({
        title: 'Información',
        msg: message,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INTO
    });
}

function exportExcel(grid, nameFile, nameSheet, titleSheet) {
    if (grid.getStore().getCount() > 0) {
        if (getNavigator() === 'img/chrome.png') {
            var columnsArray = grid.getView().grid.columns;
            var storeData = grid.getStore();

            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            var numFil = storeData.data.length;
            var numCol = columnsArray.length;
            var tiLetra = 'Calibri';
            var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
            table_div += "</DocumentProperties> " +
                    "<Styles> " +
                    "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                    "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='Blue' ss:Bold='1'/>  </Style>  " +
                    "<Style ss:ID='fString'><NumberFormat ss:Format='@'/></Style>" +
                    "<Style ss:ID='fInteger'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/><NumberFormat ss:Format='0'/></Style>" +
                    "<Style ss:ID='fDouble'><NumberFormat ss:Format='Fixed'/></Style>" +
                    "<Style ss:ID='fDateTime'><NumberFormat ss:Format='yyyy\-mm\-dd\ hh:mm:ss'/></Style>" +
                    "<Style ss:ID='fDate'><NumberFormat ss:Format='yyyy\-mm\-dd;@'/></Style>" +
                    "<Style ss:ID='fTime'><NumberFormat ss:Format='hh:mm:ss'/></Style>" +
                    "</Styles>";
            //Definir el número de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
            table_div += "<Worksheet ss:Name='" + nameSheet + "'>"; //Nombre de la hoja
            table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='100' ss:DefaultRowHeight='15'>";
            for (var i = 0; i < columnsArray.length; i++) {
                var lengthText = columnsArray[i].text.replace("<br>", " ").length;
                var ancho;
                if (lengthText > 15) {
                    ancho = (lengthText * 10) / 2;
                } else {
                    ancho = lengthText * 10;
                }
                table_div += "<Column ss:AutoFitWidth='0' ss:Width='" + ancho + "'/>";
            }
            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titleSheet + "</Data></Cell></Row>";
            table_div += "<Row ss:AutoFitHeight='0'>";
            for (var i = 0; i < columnsArray.length; i++) {
                table_div += "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>" + columnsArray[i].text.replace("<br>", " ") + "</Data></Cell>";
            }
            table_div += "</Row>";
            for (var i = 0; i < storeData.getCount(); i++) {
                table_div += "<Row ss:AutoFitHeight='0'>";
                for (var j = 0; j < columnsArray.length; j++) {
                    if (!columnsArray[j].renderer) {
                        table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + storeData.data.items[i].get(columnsArray[j].dataIndex) + "</Data></Cell>";
                    } else {
                        var cadena = String(columnsArray[j].renderer).split(' ');

                        if (cadena[1] === '(k,b,g,c,e,a,j){var') {
                            table_div += "<Cell ss:StyleID='fInteger'><Data ss:Type='Number'>" + (i + 1) + "</Data></Cell>";
                        }
                        if (cadena[1] === '(c){return') {
                            table_div += "<Cell ss:StyleID='fDate'><Data ss:Type='DateTime'>" + Ext.Date.format(storeData.data.items[i].get(columnsArray[j].dataIndex), 'Y-m-d') + "</Data></Cell>";
                        }
                        if (cadena[1] === '(a){return') {
                            table_div += "<Cell ss:StyleID='fDateTime'><Data ss:Type='DateTime'>" + Ext.Date.format(storeData.data.items[i].get(columnsArray[j].dataIndex), 'Y-m-d\\TH:i:s') + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatoAtrasoTotal(val)') {
                            table_div += "<Cell ss:StyleID='fTime'><Data ss:Type='DateTime'>" + formatoAtrasoTotal(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatValidDispatch(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatValidDispatch(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatPerson(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatPerson(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatCompany(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatCompany(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatRolUser(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatRolUser(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatActiveUser(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatActiveUser(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatAuxRoute(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatAuxRoute(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatDecision(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatDecision(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatTypeDevice(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatTypeDevice(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                        if (cadena[1] === 'formatRouteService(val)') {
                            table_div += "<Cell ss:StyleID='fString'><Data ss:Type='String'>" + formatRouteService(storeData.data.items[i].get(columnsArray[j].dataIndex)) + "</Data></Cell>";
                        }
                    }
                }
                table_div += "</Row>";
            }

            table_div += "</Table> </Worksheet></Workbook>";
            var table_xml = table_div.replace(/ /g, '%20');
            a.href = data_type + ', ' + table_xml;
            a.download = nameFile + '.xml';
            a.click();
        } else {
            Ext.MessageBox.show({
                title: 'Información',
                msg: '<center>El Servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome</center>',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    } else {
        Ext.MessageBox.show({
            title: 'Información',
            msg: 'No hay datos en la Lista a Exportar',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    }
}
<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    //echo "Error: No se ha podido conectar a la Base de Datos.";
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 4) {
        $consultaSql = "SELECT emp.id_empresa, vh.id_vehiculo,emp.empresa, eq.id_equipo,emp.empresa, eq.equipo, vh.placa, vh.vehiculo, vh.icono,
                        sky.sky_evento, sky.id_sky_evento, udskps.velocidad, udskps.fecha_hora_ult_dato, udskps.latitud, udskps.longitud,udskps.rumbo, udskps.direccion
                        FROM karviewdb.empresas emp, karviewdb.equipos eq, karviewdb.vehiculos vh, 
                        karviewdb.sky_eventos sky, karviewdb.ultimo_dato_skps udskps
                        where udskps.id_sky_evento=sky.id_sky_evento 
                        and udskps.id_equipo= eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_persona='$idPersona';"
        ;
    } else {
        
        $consultaSql = "SELECT emp.id_empresa, vh.id_vehiculo ,emp.empresa, eq.id_equipo,eq.equipo, vh.placa, vh.vehiculo, vh.icono, 
                        sky.sky_evento,sky.id_sky_evento, udskps.velocidad, udskps.fecha_hora_ult_dato,udskps.latitud, udskps.longitud,udskps.rumbo, udskps.direccion
                        FROM karviewdb.empresas emp, karviewdb.equipos eq, karviewdb.vehiculos vh, 
                        karviewdb.sky_eventos sky, karviewdb.ultimo_dato_skps udskps
                        where udskps.id_sky_evento=sky.id_sky_evento 
                        and udskps.id_equipo= eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_empresa in ($listCoop);";
    }
    $result = $mysqli->query($consultaSql);

    if ($result->num_rows > 0) {
        $objJson = "dataGps: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "idVehiculo:'".$myrow["id_vehiculo"] . "',"
                    . "idCoop: '" . $myrow["id_empresa"] . "',"
                    . "company: '" . utf8_encode($myrow["empresa"]) . "',"
                    . "idEqp: '" . $myrow["id_equipo"] . "',"
                    . "equipo: '" . $myrow["equipo"] . "',"
                    . "vehiculo: '" . $myrow["vehiculo"] . "',"
                    . "placa: '" . $myrow["placa"] . "',"
                    . "nombre_vehiculo: '" . utf8_encode('VH: ' . $myrow["placa"] . ' - ' . $myrow["vehiculo"]) . "',"
                    . "lat: " . $myrow["latitud"] . ","
                    . "lon: " . $myrow["longitud"] . ","
                    . "fec: '" . $myrow["fecha_hora_ult_dato"] . "',"
                    . "vel: " . $myrow["velocidad"] . ","
                    . "rumbo: " . $myrow["rumbo"] . ","
                    . "dir: '" . utf8_encode($myrow["direccion"]) . "',"
                    . "evt: '" . utf8_encode($myrow["sky_evento"]) . "',"
                    . "icono: '".$myrow["icono"]. "'},";
        }
        $objJson.= "]";

        echo "{success: true, $objJson }";
    } else {
        //echo "No hay datos que Obtener";
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

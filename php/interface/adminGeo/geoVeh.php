<?php

extract($_GET);
include('../../login/isLogin.php');
require_once('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT v.vehiculo, v.placa, V.id_vehiculo
    FROM  karviewdb.geocerca_vehiculos vg, karviewdb.vehiculos v, karviewdb.geocercas g
    WHERE vg.id_geocerca ='$idGeo' AND g.id_empresa = '$empresa'
    AND vg.id_vehiculo = v.id_vehiculo AND vg.id_geocerca = g.id_geocerca";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "{veh_geo: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson.= "{"
                    . "id:" . $myrow["id_vehiculo"] . ","
                    . "nombre:'" . $myrow["placa"] . ' - ' .$myrow["vehiculo"]. "'"
                    . "},";
        }
        $objJson .="]}";
        if ($haveData) {
            echo $objJson;
        } else {
            echo "{failure: true, msg: 'No hay datos que mostrar en estas Fechas'}";
        }
    }
}


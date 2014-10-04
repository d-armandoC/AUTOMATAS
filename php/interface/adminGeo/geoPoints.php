<?php
include('../../login/isLogin.php');
require_once('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $consultaSql = "SELECT latitud, longitud FROM karviewdb.geocerca_puntos where id_geocerca='$idGeo' ORDER BY orden;";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "geo_points : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "longitud:'" . $myrow["longitud"] . "',"
                    . "latitud:'" . $myrow["latitud"] . "',"
                    . "},";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
    
}


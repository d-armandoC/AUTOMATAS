<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_GET);
    $consultaSql = "SELECT id_clase_Vehiculo, clase_vehiculo FROM karviewdb.clase_vehiculos";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{class_veh: [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{            
            id:" . $myrow["id_clase_Vehiculo"] . ",
            text:'" . utf8_encode($myrow["clase_vehiculo"]) . "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}




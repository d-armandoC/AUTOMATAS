<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_GET);
    $consultaSql = "SELECT id_tipo_equipo, tipo_equipo FROM karviewdb.tipo_equipos";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{tipo_veh: [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{            
               id:" . $myrow["id_tipo_equipo"] . ",
            text:'" . utf8_encode($myrow["tipo_equipo"]) . "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

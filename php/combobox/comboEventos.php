<?php
include('../login/isLogin.php');
include ('../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $consultaSql = "SELECT id_sky_evento, sky_evento
    FROM karviewdb.sky_eventos";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{eventos : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id:'" . $myrow["id_sky_evento"] . "',
                nombre:'" . utf8_encode($myrow["sky_evento"]). "'
            },";
        }
        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}





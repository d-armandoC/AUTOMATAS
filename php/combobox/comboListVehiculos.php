<?php
include('../login/isLogin.php');
include ('../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $consultaSql = "SELECT ID_SKY_EVT, DESC_EVENTO
    FROM vehiculos";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{vehiculo : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id:'" . $myrow["ID_SKY_EVT"] . "',
                nombre:'" . utf8_encode($myrow["DESC_EVENTO"]). "'
            },";
        }
        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
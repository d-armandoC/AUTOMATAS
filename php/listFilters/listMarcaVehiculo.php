<?php
require_once('../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $consultaSql = "SELECT marca
    FROM vehiculos";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "[";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "["
                    . "'" . utf8_encode($myrow["marca"]) . "',"
                    . "'" . utf8_encode($myrow["marca"]) . "'],";
        }

        $objJson .="]";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

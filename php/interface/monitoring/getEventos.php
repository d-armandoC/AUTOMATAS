<?php

extract($_GET);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT desc_evento, parametro FROM sky_eventos;";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
      $objJson = "{getEvento : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "evento:'" . $myrow["desc_evento"] . "',"
                    . "parametro:" . $myrow["parametro"] . "},";
        }
        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
<?php

extract($_GET);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT r.id_equipo, r.parametro, se.desc_evento, count(*) as totalPanico FROM  recorridos r, sky_eventos se 
WHERE r.parametro=se.parametro and fecha = '$date' and r.parametro = $parametro group by id_equipo ;";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{countByPanic: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "idEquipo:'" . $myrow["id_equipo"] . "',"
                    . "parametro:" . $myrow["parametro"] . ","
                    . "evento:'" . $myrow["desc_evento"] . "',"
                    . "total:" . $myrow["totalPanico"] . "},";
        }
        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}









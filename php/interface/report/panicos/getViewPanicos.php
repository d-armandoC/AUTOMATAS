<?php

include ('../../../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT sk.fecha, sk.hora,ev.sky_evento, sk.latitud,sk.longitud, sk.velocidad  FROM karviewhistoricodb.dato_spks sk, karviewdb.sky_eventos ev where sk.id_sky_evento=ev.id_sky_evento and sk.id_sky_evento=2 and  fecha between '$fechaIni' and '$fechaFin'and sk.hora between '$horaIniP' and '$horaFinP' and sk.id_equipo='$idEquipo'order by sk.fecha_hora_registro desc";
    $result = $mysqli->query($consultaSql);


    $mysqli->close();

    if (($result->num_rows > 0) || ($result1->num_rows > 0)) {

        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {

            $json .= "{"
                    . "fecha: '" . $myrow["fecha"] . "',"
                    . "hora: '" . $myrow["hora"] . "',"
                    . "evento:' " . utf8_encode($myrow["sky_evento"]) . "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "velocidad: " . $myrow["velocidad"] . ","
                    . "},";
        }


        $json .="]";
        echo "{success: true, $json}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
}
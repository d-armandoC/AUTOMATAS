<?php

extract($_GET);
include ('../../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT sk.fecha, sk.hora ,ev.sky_evento, sk.velocidad, sk.latitud, sk.longitud, sk.bateria,sk.gsm, sk.gps, sk.direccion
                            FROM karviewhistoricodb.dato_spks sk ,karviewdb.sky_eventos ev
                            where  sk.id_equipo='$idEquipoEnDe' and sk.id_sky_evento=ev.id_sky_evento and ev.id_sky_evento in(6,7) and
                            sk.fecha between ? and ? and sk.hora between ? and ?";
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("ssss", $fechaIniEnDe, $fechaFinEnDe, $horaIniEnDe, $horaFinEnDe);
        /* ejecutar la consulta */
        $stmt->execute();
        $result = $stmt->get_result();

        $mysqli->close();
        if ($result->num_rows > 0) {

            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $json .= "{"
                        . "fechaED: '" . $myrow["fecha"] . "',"
                        . "horaED: '" . $myrow["hora"] . "',"
                        . "eventoED: " . $myrow["sky_evento"] . ","
                        . "velocidadED: " . $myrow["velocidad"] . ","
                        . "latitudED: '" . $myrow["latitud"] . "',"
                        . "longitudED: '" . $myrow["longitud"] . "',"
                        . "bateriaED: " . $myrow["bateria"] . ","
                        . "gsmED: " . $myrow["gsm"] . ","
                        . "gpsED: " . $myrow["gps"] . ","
                        . "direccionED: " . $myrow["direccion"] . ""
                        . "},";
            }
            $json .="]";
            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    } else {
        echo "{failure: true, message: 'Problemas en la Construcción de la Consulta.'}";
    }
    $stmt->close();
}

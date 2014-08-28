<?php

extract($_GET);
include ('../../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    switch ($estadoR) {
        case 1:
            $consultaSql = "SELECT fecha, hora , velocidad, latitud, longitud 
        FROM karviewhistoricodb.dato_spks sk where  id_equipo='$idEquipo' and 
        sk.velocidad between ? and ? and sk.fecha between ? and ? and sk.hora between ? and ? ";
            $stmt = $mysqli->prepare($consultaSql);
            if ($stmt) {
                /* ligar parámetros para marcadores */
                $stmt->bind_param("iissss", $limiST, $limiFI, $fechaIni, $fechaFin, $horaST, $horaFI);
                /* ejecutar la consulta */
                $stmt->execute();
                $result = $stmt->get_result();

                $mysqli->close();
                if ($result->num_rows > 0) {

                    $json = "data: [";
                    while ($myrow = $result->fetch_assoc()) {
                        $json .= "{"
                                . "fecha: '" . $myrow["fecha"] . "',"
                                . "hora: '" . $myrow["hora"] . "',"
                                . "velocidad: " . $myrow["velocidad"] . ","
                                . "latitud: " . $myrow["latitud"] . ","
                                . "longitud: " . $myrow["longitud"] . ""
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
            break;
        case 2:
            $consultaSql = "SELECT fecha, hora , velocidad, latitud, longitud 
        FROM karviewhistoricodb.dato_spks sk where  id_equipo='$idEquipo' and sk.id_sky_evento=12 and 
         sk.fecha between ? and ? and sk.hora between ? and ?  ";
            $stmt = $mysqli->prepare($consultaSql);
            if ($stmt) {
                /* ligar parámetros para marcadores */
                $stmt->bind_param("ssss", $fechaIni, $fechaFin, $horaST, $horaFI);
                /* ejecutar la consulta */
                $stmt->execute();
                $result = $stmt->get_result();

                $mysqli->close();
                if ($result->num_rows > 0) {

                    $json = "data: [";
                    while ($myrow = $result->fetch_assoc()) {
                        $json .= "{"
                                . "fecha: '" . $myrow["fecha"] . "',"
                                . "hora: '" . $myrow["hora"] . "',"
                                . "velocidad: " . $myrow["velocidad"] . ","
                                . "latitud: " . $myrow["latitud"] . ","
                                . "longitud: " . $myrow["longitud"] . ""
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
            break;
        case 3:
            $consultaSql = "SELECT fecha, hora , velocidad, latitud, longitud 
        FROM karviewhistoricodb.dato_spks sk where  id_equipo='$idEquipo' and sk.id_sky_evento=21 and 
        sk.fecha between ? and ? and sk.hora between ? and ? ";
            $stmt = $mysqli->prepare($consultaSql);
            if ($stmt) {
                /* ligar parámetros para marcadores */
                $stmt->bind_param("ssss", $fechaIni, $fechaFin, $horaST, $horaFI);
                /* ejecutar la consulta */
                $stmt->execute();
                $result = $stmt->get_result();

                $mysqli->close();
                if ($result->num_rows > 0) {

                    $json = "data: [";
                    while ($myrow = $result->fetch_assoc()) {
                        $json .= "{"
                                . "fecha: '" . $myrow["fecha"] . "',"
                                . "hora: '" . $myrow["hora"] . "',"
                                . "velocidad: " . $myrow["velocidad"] . ","
                                . "latitud: " . $myrow["latitud"] . ","
                                . "longitud: " . $myrow["longitud"] . ""
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
            break;
    }
}

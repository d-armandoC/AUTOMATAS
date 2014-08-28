<?php

extract($_GET);
include ('../../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {

    $consultaSql = "SELECT fecha, hora , velocidad, latitud, longitud 
        FROM karviewhistoricodb.dato_spks sk where  id_equipo='$idEquipo' and 
        sk.velocidad between ? and ? and sk.fecha between ? and ? and sk.hora between ? and ? ";
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
         $stmt->bind_param("iissss", $limiST,$limiFI,$fechaIni, $fechaFin, $horaST, $horaFI);
        /* ejecutar la consulta */
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
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
}

//    $consultaSql = "SELECT sk.fecha, sk.hora,ev.sky_evento, sk.latitud,sk.longitud, sk.velocidad 
//            FROM karviewhistoricodb.dato_spks sk, karviewdb.sky_eventos ev 
//            where sk.id_sky_evento=ev.id_sky_evento and sk.id_sky_evento in (12,21) 
////            and  fecha between '$fechaIni' and '$fechaFin'  and sk.id_equipo='$idEquipo'order by sk.fecha_hora_registro desc";
//
//   $result = $mysqli->query($consultaSql);
//    $mysqli->close();
//    if (($result->num_rows > 0) || ($result1->num_rows > 0)) {
//
//        $json = "data: [";
//        while ($myrow = $result->fetch_assoc()) {
//
//            $json .= "{"
//                    . "fecha: '" . $myrow["fecha"] . "',"
//                    . "hora: '" . $myrow["hora"] . "',"
//                    . "velocidad: " . $myrow["velocidad"] . ","
//                    . "latitud: " . $myrow["latitud"] . ","
//                    . "longitud: " . $myrow["longitud"] . ""
//                    . "},";
//        }
//

//        $json .="]";
//
//        echo "{success: true, $json}";
//    } else {
//        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
//    }
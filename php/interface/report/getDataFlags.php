<?php
include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select COUNT(*) AS c from vehiculos where id_equipo = '$cbxVeh' and id_tipo_equipo = 3";
    $result1 = $mysqli->query($consultaSql);
    $myrow1 = $result1->fetch_assoc();

    if ($myrow1["c"] > 0) {
        $consultaSql = "select r.latitud, r.longitud,r.fecha, r.hora, r.fecha_hora_reg, r.velocidad, 
            r.id_encabezado, et.encabezado, et.color, r.id_estado_mecanico, r.id_estado_unidad, 
            em.estado_mecanico, eu.estado_unidad, r.direccion, e.empresa
            from recorridos_udp r, encabezado_trama et, estado_mecanico em, estado_unidad eu, empresas e
            where r.id_encabezado = et.id_encabezado
            and r.id_empresa = e.id_empresa
            and r.id_estado_mecanico = em.id_estado_mecanico
            and r.id_estado_unidad = eu.id_estado_unidad
            and r.id_equipo = ?
            and r.fecha between ? and ?
            and r.id_encabezado <> 'X' and r.id_encabezado <> 'J'
            order by r.fecha, r.hora
            "
        ;
    } else {
        $consultaSql = "select r.latitud, r.longitud,r.fecha, r.hora, r.fecha_hora_reg, r.velocidad, 
            r.bat, r.gsm, r.gps2, r.ign, r.direccion, se.color, se.desc_evento, r.id_evento, r.parametro, 
            r.g1, r.g2, r.sal, e.empresa
            from recorridos r, sky_eventos se, empresas e
            where r.parametro = se.parametro
            and r.id_empresa = e.id_empresa
            and r.id_equipo = ?
            and r.fecha between ? and ?
            order by r.fecha, r.hora"
        ;
    }

    $stmt = $mysqli->prepare($consultaSql);

    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("sss", $cbxVeh, $fechaIni, $fechaFin);
        /* ejecutar la consulta */
        $stmt->execute();

        $result = $stmt->get_result();

        $stmt->close();
        $mysqli->close();

        if ($result->num_rows > 0) {
            $fechaHoraIni = $fechaIni . " " . $horaIni;
            $fechaHoraFin = $fechaFin . " " . $horaFin;

            $json = "puntos: [";
            $c = 0;
            $haveData = false;
            while ($myrow = $result->fetch_assoc()) {
                $c++;
                $fechaHoraRec = $myrow["fecha"] . " " . $myrow["hora"];
                if (strcmp($fechaHoraRec, $fechaHoraIni) >= 0 && strcmp($fechaHoraRec, $fechaHoraFin) <= 0) {
                    $haveData = true;
                    if ($myrow1["c"] > 0) {
                        $json .= "{"
                                . "idRec: " . $c . ","
                                . "company:'" . utf8_encode($myrow["empresa"]) . "',"
                                . "vehiculo:'" . $nameVeh . "',"
                                . "latitud: " . $myrow["latitud"] . ","
                                . "longitud: " . $myrow["longitud"] . ","
                                . "fecha_hora_reg:'" . $myrow["fecha_hora_reg"]. "',"
                                . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                                . "velocidad:" . $myrow["velocidad"] . ","
                                . "bateria: -1,"
                                . "gsm:" . $myrow["id_estado_unidad"] . ","
                                . "gps2:'" . $myrow["estado_mecanico"] . "',"
                                . "ign:'" . $myrow["estado_unidad"] . "',"
                                . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                                . "color:'" . $myrow["color"] . "',"
                                . "evento:'" . utf8_encode($myrow["encabezado"]) . "',"
                                . "idEvento: -1,"
                                . "parametro: -1,"
                                . "g1: -1,"
                                . "g2: -1,"
                                . "salida: -1"
                                . "},";
                    } else {
                        $json .= "{"
                                . "idRec: " . $c . ","
                                . "company:'" . utf8_encode($myrow["empresa"]) . "',"
                                . "vehiculo:'" . $nameVeh . "',"
                                . "latitud: " . $myrow["latitud"] . ","
                                . "longitud: " . $myrow["longitud"] . ","
                                . "fecha_hora_reg:'" . $myrow["fecha_hora_reg"]. "',"
                                . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                                . "velocidad:" . $myrow["velocidad"] . ","
                                . "bateria:" . $myrow["bat"] . ","
                                . "gsm:" . $myrow["gsm"] . ","
                                . "gps2:" . $myrow["gps2"] . ","
                                . "ign:" . $myrow["ign"] . ","
                                . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                                . "color:'" . $myrow["color"] . "',"
                                . "evento:'" . utf8_encode($myrow["desc_evento"]) . "',"
                                . "idEvento:" . $myrow["id_evento"] . ","
                                . "parametro:" . $myrow["parametro"] .","
                                . "g1:" . $myrow["g1"] . ","
                                . "g2:" . $myrow["g2"] . ","
                                . "salida:" . $myrow["sal"]
                                . "},";
                    }
                }
            }

            $json .="]";

            //$json = preg_replace("[\n|\r|\n\r]", "", $json);        
            
            if ($haveData) {
                echo "{success: true, $json }";
            } else {
                echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
            }
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    } else {
        echo "{failure: true, message: 'Problemas en la Construcción de la Consulta.'}";
    }
}
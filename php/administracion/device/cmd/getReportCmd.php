<?php

include ('../../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "select u.usuario, c.comando, c.respuesta, "
            . "c.fecha_hora_reg, c.fecha_hora_envio, c.fecha_hora_respuesta,tec.tipo_estado_cmd "
            . "from kbushistoricodb.comandos c, usuarios u, tipo_estado_cmds tec "
            . "where c.id_usuario = u.id_usuario "
            . "and c.id_tipo_estado_cmd = tec.id_tipo_estado_cmd "
            . "and c.id_equipo = ? "
            . "and c.fecha_hora_reg between concat(?,' ', ?) and concat(?,' ', ?) "
            . "order by c.fecha_hora_reg desc";

    $stmt = $mysqli->prepare($consultaSql);

    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("issss", $idDevice, $fechaIni, $horaIni, $fechaFin, $horaFin);
        /* ejecutar la consulta */
        $stmt->execute();

        $result = $stmt->get_result();

        $stmt->close();
        $mysqli->close();

        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $json .= "{"
                        . "usuario:'" . utf8_encode($myrow["usuario"]) . "',"
                        . "comando:'" . utf8_decode($myrow["comando"]) . "',"
                        . "respuesta:'" . utf8_encode($myrow["respuesta"]) . "',"
                        . "fecha_creacion:'" . $myrow["fecha_hora_reg"] . "',"
                        . "fecha_envio:'" . $myrow["fecha_hora_envio"] . "',"
                        . "fecha_respuesta:'" . $myrow["fecha_hora_respuesta"] . "',"
                        . "estado:'" . $myrow["tipo_estado_cmd"] . "'},";
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
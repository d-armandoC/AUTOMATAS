<?php

include('../../../login/isLogin.php');
include ('../../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idUser = $_SESSION["USERKARVIEW"];
    $consultaSql = "select id_tipo_estado_cmd, respuesta from karviewhistoricodb.comandos 
            where fecha_hora_registro =  
            (select max(fecha_hora_registro) 
            from karviewhistoricodb.comandos 
            where date(fecha_hora_registro) = date(now()) 
            and id_usuario = ?) 
            and id_tipo_estado_cmd in (3, 4)";

    $stmt = $mysqli->prepare($consultaSql);

    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("i", $idUser);
        /* ejecutar la consulta */
        $stmt->execute();

        $result = $stmt->get_result();

        $stmt->close();
        $mysqli->close();

        if ($result->num_rows > 0) {
            $myrow = $result->fetch_assoc();
            $response = "Sin Respuesta de Comando.";
            if ($myrow["id_tipo_estado_cmd"] == 3) {
                $response = utf8_encode($myrow["respuesta"]);
            }

            echo "{success: true, message: '$response'}";
        } else {
            echo "{failure: true, message:'Esperando Respuesta...'}";
        }
    } else {
        echo "{failure: true, message: 'Problemas en la Construcción de la Consulta.'}";
    }
}
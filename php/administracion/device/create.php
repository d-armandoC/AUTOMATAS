<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $existeSql = "select equipo from equipos where equipo='" . $json["deviceDevice"] . "'";

    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'El Equipo ya se encuentra registrado en el Sistema.',state: false}";
        } else {

            $insertSql = "insert into equipos (id_tipo_equipo, equipo, serie, numero_chip, imei_chip)"
                    . "values(?, ?, ?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("issss", $json["idTypeDevice"], utf8_decode($json["deviceDevice"]), utf8_decode($json["serieDevice"]), utf8_decode($json["numberChipDevice"]), utf8_decode($json["imeiChipDevice"]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Datos Insertados Correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al Insertar en la Tabla.',state: false}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
        $mysqli->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
}
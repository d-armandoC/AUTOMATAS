<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $setIdTypeDevice = $setDevice = $setSerial = $setNumberChip = $setImeiChip = "";

    if (isset($json["idTypeDevice"])) {
        $setIdTypeDevice = "id_tipo_equipo=" . $json["idTypeDevice"] . ",";
    }
    if (isset($json["deviceDevice"])) {
        $setDevice = "equipo='" . utf8_decode($json["deviceDevice"]) . "',";
    }
    if (isset($json["serieDevice"])) {
        $setSerial = "serie='" . utf8_decode($json["serieDevice"]) . "',";
    }
    if (isset($json["numberChipDevice"])) {
        $setNumberChip = "numero_chip='" . utf8_decode($json["numberChipDevice"]) . "',";
    }
    if (isset($json["imeiChipDevice"])) {
        $setImeiChip = "imei_chip='" . utf8_decode($json["imeiChipDevice"]) . "',";
    }

    $setId = "id_equipo = " . $json["id"];

    if ($setDevice != "") {
        $existeSql = "select id_equipo from equipos where equipo='" . utf8_decode($json["deviceDevice"] . "'");

        $result = $mysqli->query($existeSql);

        if ($result->num_rows > 0) {
            echo "{success:true, message:'El Equipo ya esta registrado.',state: false}";
        } else {
            $updateSql = "update equipos "
                    . "set $setIdTypeDevice$setDevice$setSerial$setNumberChip$setImeiChip$setId "
                    . "where id_equipo = ?";

            $stmt = $mysqli->prepare($updateSql);
            if ($stmt) {
                $stmt->bind_param("i", $json["id"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
    } else {
        $updateSql = "update equipos "
                . "set $setIdTypeDevice$setDevice$setSerial$setNumberChip$setImeiChip$setId "
                . "where id_equipo = ?";

        $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
            } else {
                echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
        }
    }
    $mysqli->close();
}
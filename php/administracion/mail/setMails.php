<?php

include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $json = json_decode($puntos, true);
    $problem = false;

    for ($i = 0; $i < count($json); $i++) {
        if ($json[$i]["state"]) {
            $insertSql = "insert into send_mail (id_persona, parametro, id_empresa) values(?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("iis", $idPersona, $json[$i]["parametro"], $cbxEmpresas);
                $stmt->execute();

                if ($stmt->affected_rows == 0) {
                    $problem = true;
                    break;
                }
            } else {
                $problem = true;
                break;
            }
        } else {
            $destroySql = "delete from send_mail where id_persona = ? and parametro = ? and id_empresa = ?";
            $stmt = $mysqli->prepare($destroySql);
            if ($stmt) {
                $stmt->bind_param("iis", $idPersona, $json[$i]["parametro"], $cbxEmpresas);
                $stmt->execute();

                if ($stmt->affected_rows == 0) {
                    $problem = true;
                }
            } else {
                $problem = true;
                break;
            }
        }
    }
    if ($problem) {
        echo "{failure:true, message: 'Problemas al Guardar la Información.'}";
    } else {
        echo "{success:true, message:'Datos Guardados Correctamente.'}";
    }
    
    $stmt->close();
    $mysqli->close();
}
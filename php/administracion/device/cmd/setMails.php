<?php

include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $json = json_decode($puntos, true);
    $problem = false;

    for ($i = 0; $i < count($json); $i++) {
        if ($json[$i]["state"]) {
            $insertSql = "insert into envio_correos (id_persona, id_sky_evento, id_empresa) values(?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("iii", $idPerson, $json[$i]["idSkyEvt"], $idCompany);
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
            $destroySql = "delete from envio_mails where id_persona = ? and id_sky_evento = ? and id_empresa = ?";
            $stmt = $mysqli->prepare($destroySql);
            if ($stmt) {
                $stmt->bind_param("iii", $idPerson, $json[$i]["idSkyEvt"], $idCompany);
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
        echo "{failure:true, message: 'Problemas al Guardar la Información.',state: false}";
    } else {
        echo "{success:true, message:'Datos Guardados Correctamente.',state: false}";
    }
    
    $stmt->close();
    $mysqli->close();
}
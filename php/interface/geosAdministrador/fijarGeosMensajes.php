<?php
include('../../login/isLogin.php');
require_once('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $json = json_decode($puntos, true);
    $problem = false;

    for ($i = 0; $i < count($json); $i++) {
        if ($json[$i]["state"]) {
            $insertSql = "insert into karviewdb.envio_geo_correos (id_persona, id_geocerca, estado) "
                    . "values(?, ?, ?)";
            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $limite = 0;
                if ($json[$i]["estado"] == 'Salida') {
                    $limite = 1;
                }
                $stmt->bind_param("iii", $idPerson, $idGeos, $limite);
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
            $destroySql = "delete from karviewdb.envio_geo_correos where id_persona = ? and id_geocerca = ? and estado = ?";
            $stmt = $mysqli->prepare($destroySql);
            if ($stmt) {
                $limite = 0;
                if ($json[$i]["estado"] == 'Salida') {
                    $limite = 1;
                }
                $stmt->bind_param("iii", $idPerson, $idGeos, $limite);
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
<?php

include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
      $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    
    $setPersona = $setRol = $setEmpresa = $setUsuario = $setClave = "";
    $passEqual = false;
    if (isset($json["idPerson"]))
        $setPersona = "id_persona=" . $json["idPerson"] . ",";
    if (isset($json["rol"]))
        $setRol = "id_rol_usuario=" . $json["rol"] . ",";
    if (isset($json["idEmp"]))
        $setEmpresa = "id_empresa=" . $json["idEmp"].",";
    if (isset($json["usuario"]))
        $setUsuario = "usuario='" . utf8_decode($json["usuario"]) . "',";
    if (isset($json["clave"])) {
        $partes = $json["clave"];
        $clave = $partes[0];
        $salt = "KR@D@C";
        $encriptClave = md5(md5(md5($clave) . md5($salt)));
        $setClave = "clave='$encriptClave',";
        $consultaPassSql = "select id_usuario from usuarios where clave = '" .  $encriptClave . "' and id_usuario = ". $json["id"];
        $resultPass = $mysqli->query($consultaPassSql);
        if ($resultPass->num_rows > 0) {
            $setPass = "";
        } else {
            $setPass = "clave='" . $encriptClave . "',";
        }
    }

    $setId = "id_usuario = " . $json["id"];

    if ($setUsuario != "") {
        $existeSql = "select usuario from usuarios where usuario='" . $json["usuario"] . "'";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            echo "{success:false, message:'El Usuario ya se encuentra en uso por otra persona.',state: true}";
        } else {
         $updateSql = "UPDATE karviewdb.usuarios 
            SET $setPersona$setRol$setEmpresa$setUsuario$setClave$setId
            WHERE id_usuario = ?";
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
        $updateSql = "UPDATE karviewdb.usuarios 
            SET $setPersona$setRol$setEmpresa$setUsuario$setClave$setId
            WHERE id_usuario = ?";
        $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos actualizados correctamente.',state: false}";
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
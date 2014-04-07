<?php
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $setPersona = $setRol = $setEmpresa = $setUsuario = $setClave= "";
    $passEqual = false;

    $json = json_decode($usuarios, true);

    if (isset($json["idPerson"])) $setPersona = "id_persona=".$json["idPerson"].",";
    if (isset($json["rol"])) $setRol = "id_rol_usuario=".$json["rol"].",";
    if (isset($json["idEmp"])) $setEmpresa = "id_empresa='".$json["idEmp"]."',";
    if (isset($json["usuario"])) $setUsuario = "usuario='".utf8_decode($json["usuario"])."',";
    if (isset($json["clave"])) {
        $partes = $json["clave"];
        $clave = $partes[0];
        $salt = "KR@D@C";
        $encriptClave = md5(md5(md5($clave) . md5($salt)));

        $setClave = "clave='$encriptClave',";
        
        $existeSql = "select clave from usuarios where clave='" . $encriptClave . "'";

        $result = $mysqli->query($existeSql);

        if ($result->num_rows > 0) {
            $passEqual = true;
        }
    }
    
    if (!$passEqual) {
        $setId = "id_usuario = ".$json["id"];

        $updateSql = 
            "UPDATE usuarios 
            SET $setPersona$setRol$setEmpresa$setUsuario$setClave$setId
            WHERE id_usuario = ?"
        ;

        if ($stmt = $mysqli->prepare($updateSql)) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos Actualizados Correctamente.'}";
            } else {
                echo "{success:false, message: 'Problemas al Actualizar en la Tabla.'}";
            }
            $stmt->close();
        } else {
            echo "{success:false, message: 'Problemas en la Construcción de la Consulta.'}";
        }
    } else {
        echo "{success:false, message: 'La Contraseña ya esta Ingresada en el Sistema'}";
    }
    $mysqli->close();
}
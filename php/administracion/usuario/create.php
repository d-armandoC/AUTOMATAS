<?php

include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    
    $clave = $json["clave"];
    $clave = $clave[0];
    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($clave) . md5($salt)));

    $insertSql = "INSERT INTO usuarios (id_rol_usuario, id_empresa, id_persona, usuario, clave)
	    VALUES(?, ?, ?, ?, ?)"
    ;

    if ($stmt = $mysqli->prepare($insertSql)) {
        $stmt->bind_param("iiiss", $json["rol"], $json["idEmp"], $json["idPerson"], utf8_decode($json["usuario"]), $encriptClave);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos Insertados Correctamente.'}";
        } else {
            echo "{success:false, message: 'Problemas al Insertar en la Tabla,<br> No puede existir usuarios repetidos'}";
        }
        $stmt->close();
    } else {
        echo "{success:false, message: 'Problemas en la Construcción de la Consulta.'}";
    }
    $mysqli->close();
}
?>
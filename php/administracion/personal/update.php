<?php
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    
    $setCedula = $setNombres = $setApellidos = $setEmpleo = $setFechaNac = $setDireccion = $setEmail = $setCelular = "";
    if (isset($json["cedula"])) $setCedula = "cedula='".$json["cedula"]."',";
    if (isset($json["nombres"])) $setNombres = "nombres='".utf8_decode(strtoupper($json["nombres"]))."',";
    if (isset($json["apellidos"])) $setApellidos = "apellidos='".utf8_decode(strtoupper($json["apellidos"]))."',";
    if (isset($json["cbxEmpleo"])) $setEmpleo = "id_empleo=".$json["cbxEmpleo"].",";
    if (isset($json["fechaNacimiento"])) $setFechaNac = "fecha_nacimiento='".$json["fechaNacimiento"]."',";
    if (isset($json["email"])) $setEmail = "correo='".$json["email"]."',";
    if (isset($json["direccion"])) $setDireccion = "direccion='".utf8_decode($json["direccion"])."',";
    if (isset($json["celular"])) $setCelular = "celular='".$json["celular"]."',";

    $setId = "id_persona = ".$json["id"];

    $updateSql = 
        "UPDATE personas 
        SET $setCedula$setNombres$setApellidos$setEmpleo$setFechaNac$setDireccion$setEmail$setCelular$setId
        WHERE id_persona = ?"
    ;

    if ($stmt = $mysqli->prepare($updateSql)) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos Actualizados Correctamente.',state: true}";
        } else {
           echo "{success:true, message:'Problemas al Actualizar la Tabla Correctamente.',state: true}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message:'Problemas en la Construcción de la Consulta.',state: false}";
    }
    $mysqli->close();
}
?>
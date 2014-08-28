<?php
include ('../../../dll/config.php');
include('../../login/isLogin.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $setAcronimo = $setEmpresa = $setDireccion=$setTelefono=$setEmail= $setId="";
    if (isset($json["acronimo"])) $setAcronimo = "acronimo='".$json["acronimo"]."',";
    if (isset($json["empresa"])) $setEmpresa = "empresa='".utf8_decode(strtoupper($json["empresa"]))."',"; 
    if (isset($json["direccion"])) $setDireccion = "direccion='".utf8_decode(strtoupper($json["direccion"]))."',";
    if (isset($json["telefono"])) $setTelefono = "telefono='".$json["telefono"]."',";
    if (isset($json["correo"])) $setEmail = "correo='".$json["correo"]."',";
    $setId = "id_empresa= ".$json["id"];
    $updateSql = 
        "UPDATE empresas 
        SET $setAcronimo$setEmpresa$setDireccion$setTelefono$setEmail$setId WHERE id_empresa = ?";
        if ($stmt = $mysqli->prepare($updateSql)) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                 echo "{success:true, message:'Datos Actualizados Correctamente.',state: true}";
            } else {
                echo "{success:false, message: 'Problemas al actualizar en la tabla.'}";
            }
            $stmt->close();
        } else {
            echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
        }
    
    $mysqli->close();
}
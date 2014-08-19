<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
  
  $requestBody = file_get_contents('php://input');
  $json = json_decode($requestBody, true);
  
  $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
  $existeSql = "SELECT cedula FROM karviewdb.personas WHERE cedula='" . $json["cedula"] . "' AND id_empresa = '$idEmpresa'";
  $result = $mysqli->query($existeSql);
    if ($result->num_rows > 0) {
        echo "{success:false, message: 'La Persona Ya existe.'}";
    } 
    else {
        $insertSql = "INSERT INTO karviewdb.personas (id_empresa, cedula,  nombres, apellidos, fecha_nacimiento, direccion, correo, celular)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("isssssss", $idEmpresa, $json["cedula"], utf8_decode(strtoupper($json["nombres"])), utf8_decode(strtoupper($json["apellidos"])), $json["fechaNacimiento"],utf8_decode($json["direccion"]), $json["email"],$json["celular"]);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
               echo "{success:true, message:'Datos Insertados Correctamente.',state: true}";
            } else {
                 echo "{success:true, message:'Problemas al Insertar en la tabla.',state: true}";
            }
            $stmt->close();
        } else {
           echo "{success:true, message:'Problemas en la Construcción de las Consultas.',state: false}";
        }
    }
    $mysqli->close();
}
?>
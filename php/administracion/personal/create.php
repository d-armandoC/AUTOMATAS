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
$setCedula = $setNombres = $setApellidos = $setEmpleo = $setFechaNac = $setDireccion = $setEmail = $setCelular = "";
    if (isset($json["cedula"])) $setCedula =$json["cedula"];
    if (isset($json["nombres"])) $setNombres = utf8_decode(strtoupper($json["nombres"]));
    if (isset($json["apellidos"])) $setApellidos = utf8_decode(strtoupper($json["apellidos"]));
    if (isset($json["cbxEmpleo"])) $setEmpleo = $json["cbxEmpleo"];
    if (isset($json["fechaNacimiento"])) $setFechaNac = $json["fechaNacimiento"];
    if (isset($json["email"])) $setEmail = $json["email"];
    if (isset($json["direccion"])) $setDireccion = utf8_decode($json["direccion"]);
    if (isset($json["celular"])) $setCelular =$json["celular"];
        
        $insertSql = "INSERT INTO karviewdb.personas (id_empresa, cedula,  nombres, apellidos, fecha_nacimiento, direccion, correo, celular)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("isssssss", $idEmpresa, $setCedula, $setNombres, $setApellidos, $setFechaNac,$setDireccion, $setEmail,$setCelular);
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
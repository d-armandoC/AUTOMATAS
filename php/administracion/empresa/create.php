<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
     $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];
   $requestBody = file_get_contents('php://input');
   $json = json_decode($requestBody, true);
   
   
   
   
   
    
    $existeSql = "SELECT empresa FROM empresas WHERE empresa='".$json["empresa"]."'";
    $result = $mysqli->query($existeSql);
    if ($result->num_rows > 0) {
         echo "{success:true, message:'La empresa Ya Existe.',state: true}";
    } else {
        $insertSql = "INSERT INTO empresas (id_empresa,acronimo,empresa,direccion,telefono,correo, id_usuarioAsignado)
            VALUES(?, ?, ?, ?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("isssssi", utf8_decode(strtoupper($json["id"])),
                    $json["acronimo"], utf8_decode(strtoupper($json["empresa"])),
                    utf8_decode(strtoupper($json["direccion"])), $json["telefono"], $json["correo"],$idPersona);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                 echo "{success:true, message:'Datos Insertados Correctamente.',state: true}";
            } else {
                 echo "{success:true, message:'Problemas al Insertar en la tabla.',state: true}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message:'Problemas en la Construcción de las Consultas.',state: true}";
        }
    }
    $mysqli->close();
}

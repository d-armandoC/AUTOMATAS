<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
   $requestBody = file_get_contents('php://input');
   $json = json_decode($requestBody, true);
   
   $existe = substr_count($listVeh, ',');
   if ($existe > 0) {
    $VEHC = str_replace(",", "','", $listVeh);
} else {
    $VEHC = $listVeh;
}
    
    $existeSql = "SELECT * FROM karviewdb.geocercas where id_empresa=".$id_empresa." and  geocerca='".$json["geocerca"]."'";
    $result = $mysqli->query($existeSql);
    if ($result->num_rows > 0) {
         echo "{success:true, message:'La Geocerca ya existe.',state: true}";
    } else {
        $insertSql = "INSERT INTO karviewdb.geocercas (id_empresa,geocerca,descripcion,area)
            VALUES(?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("issd",$id_empresa, utf8_decode($json["geocerca"]), utf8_decode($json["desc_geo"]),$json["areaGeocerca"]);
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

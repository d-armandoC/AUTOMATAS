<?php

include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $setPlaca = $setEquipo = $setEmpresa = $setVeh = "";
    $setConductor = $setMarca = $setModelo = "";
    $setYear = $setNumMotor = $setNumChasis = $setTipo = "";
    $setObvs = $setcbxClaseVehiculo = $setcbxEstadoVehiculo = $setidClaseVehiculo="";
    $bandera = false;
    
    if (isset($json["placa"]))
        $setPlaca = "placa='" . $json["placa"] . "',";
    if (isset($json["idEquipo"]))
        $setEquipo = "id_equipo='" . $json["idEquipo"] . "',";
    if (isset($json["idEmpresa"]))
        $setEmpresa = "id_empresa='" . $json["idEmpresa"] . "',";
    if (isset($json["vehiculo"]))
        $setVeh = "vehiculo='" . $json["vehiculo"] . "',";
    if (isset($json["cbxPropietario"]))
        $setConductor = "id_persona=" . $json["cbxPropietario"] . ",";
    if (isset($json["year"]))
        $setYear = "year=" . $json["year"] . ",";
    if (isset($json["marca"]))
        $setMarca = "marca='" . $json["marca"] . "',";
    if (isset($json["modelo"]))
        $setModelo = "modelo='" . utf8_decode($json["modelo"]) . "',";
    if (isset($json["numMotor"]))
        $setNumMotor = "num_motor='" . utf8_decode($json["numMotor"]) . "',";
    if (isset($json["numChasis"]))$setNumChasis = "num_chasis='" . utf8_decode($json["numChasis"]) . "',";
    if (isset($json["cbxClaseVehiculo"]))$setidClaseVehiculo = "id_clase_vehiculo='".$json["cbxClaseVehiculo"] . "',";
    if (isset($json["obser"]))
        $setObvs = "observacion='" . utf8_decode(preg_replace("[\n|\r|\n\r]", "", $json["obser"])) . "',";

    $setId = "id_vehiculo = ".$json["id"];
    $updateSql = "UPDATE vehiculos 
        SET $setPlaca$setEquipo$setVeh$setEmpresa$setConductor$setidClaseVehiculo$setMarca$setModelo$setYear$setNumMotor$setNumChasis$setObvs$setId
        WHERE id_vehiculo = ?";

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
        echo "{success:true, message: 'Problemas en la Construcción de la Consulta.'}";
    }
    $mysqli->close();
}

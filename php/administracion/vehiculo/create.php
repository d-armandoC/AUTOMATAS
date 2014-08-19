<?php
include('../../login/isLogin.php');
include ('../../../dll/config.php');
 extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
//    $existeSql ="SELECT id_equipo FROM vehiculos WHERE id_equipo='".$json["idEquipo"]."'";
//    $result = $mysqli->query($existeSql);
//    if ($result->num_rows > 0) {
//        echo "{success:false, message:'El Equipo Seleccionado pertenece a otro Vehiculo'}";
//    }
//else {
//cbxClaseVehiculo: 6
//cbxPropietario: 9
//id: "DataObjectVeh-2"
//idEmpresa: 2
//idEquipo: 10
//marca: ""
//modelo: ""
//numChasis: ""
//numMotor: ""
//obser: ""
//vehiculo: "asdasd"
//year: 0
    
    
        $insertSql ="INSERT INTO vehiculos (id_equipo, id_empresa, marca, modelo, id_persona, vehiculo,
            placa,year, num_motor, num_chasis,observacion,id_clase_vehiculo)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("iissississsi",               
                $json["idEquipo"], $json["idEmpresa"], utf8_decode($json["marca"]), utf8_decode($json["modelo"]), $json["cbxPropietario"],
               $json["vehiculo"], $json["placa"], $json["year"], utf8_decode($json["numMotor"]), 
                utf8_decode($json["numChasis"]),utf8_decode(preg_replace("[\n|\r|\n\r]", "", $json["obser"])),$json["cbxClaseVehiculo"]);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos Insertados Correctamente.'}";
            } else {
                echo "{success:false, message: 'Problemas al Insertar en la Tabla.'}";
            }
            $stmt->close();
        } else {
            echo "{success:false, message: 'Problemas en la Construcción de la Consulta.'}";
        }
    
    $mysqli->close();
}

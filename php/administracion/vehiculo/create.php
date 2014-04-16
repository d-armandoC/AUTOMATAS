<?php
include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idTecnico = $_SESSION["IDUSERKARVIEW"];
    $estado = 0;

    $json = json_decode($veh, true);

    $existeSql ="SELECT id_equipo FROM vehiculos WHERE id_equipo='".$json["idEquipo"]."'";
   

    $result = $mysqli->query($existeSql);
 
    if ($result->num_rows > 0) {
        $salida = "{success:false, message:'ID del Equipo Repetido'}";
    } else {
        $insertSql ="INSERT INTO vehiculos (id_equipo, id_empresa, marca, modelo, id_persona, vehiculo, reg_municipal,
            placa, year, num_motor, num_chasis, id_tecnico, num_chip, id_operadora, imei,
            lugar_instalacion,num_cel,observacion, id_taximetro, fecha_instalacion, id_interfaz, id_tipo_equipo)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("ssssisssissisissssssii", //   ssssisssissisissssssii              
                $json["idEquipo"], $json["idEmpresa"], utf8_decode($json["marca"]), utf8_decode($json["modelo"]), $json["cbxPropietario"],
                $json["vehiculo"],$json["regMunicipal"], $json["placa"], $json["year"], utf8_decode($json["numMotor"]), 
                utf8_decode($json["numChasis"]), $idTecnico, $json["chip"], $json["cbxOperadora"], 
                $json["imei"], utf8_decode($json["siteInst"]), $json["celular"], utf8_decode(preg_replace("[\n|\r|\n\r]", "", $json["obser"])),
                $json["cbxTaximetro"], $json["dateInst"], $json["cbxInterfaz"], $json["cbxTipoEquipo"]);
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
    }
    $mysqli->close();
}

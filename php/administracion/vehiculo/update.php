<?php
include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idTecnico = $_SESSION["IDUSERKARVIEW"];

    $setPlaca = $setEquipo = $setEmpresa = $setVeh = "";
    $setConductor = $setRegMun = $setMarca = $setModelo = "";
    $setYear = $setNumMotor = $setNumChasis = $setTipo  = "";
    $setImage = $setChip = $setCel = $setImei = $setOperadora = "";
    $setTecnico = $setLugar = $setHaveTaximetro = $setTaximetro = "";
    $setFechaInst = $setInterfaz = $setTipoEquipo = $setObvs = "";

    $json = json_decode($veh, true);

    if (isset($json["placa"])) $setPlaca = "placa='".$json["placa"]."',";
    if (isset($json["idEquipo"])) $setEquipo = "id_equipo='".$json["idEquipo"]."',";
    if (isset($json["idEmpresa"])) $setEmpresa = "id_empresa='".$json["idEmpresa"]."',";
    if (isset($json["vehiculo"])) $setVeh = "vehiculo='".$json["vehiculo"]."',";
    if (isset($json["cbxPropietario"])) $setConductor = "id_propietario=".$json["cbxPropietario"].",";    
    if (isset($json["regMunicipal"])) $setRegMun = "reg_municipal='".$json["regMunicipal"]."',";
    if (isset($json["year"])) $setYear = "year=".$json["year"].",";
    if (isset($json["marca"])) $setMarca = "marca='".$json["marca"]."',";
    if (isset($json["modelo"])) $setModelo = "modelo='".utf8_decode($json["modelo"])."',";
    if (isset($json["numMotor"])) $setNumMotor = "num_motor='".utf8_decode($json["numMotor"])."',";
    if (isset($json["numChasis"])) $setNumChasis = "num_chasis='".utf8_decode($json["numChasis"])."',";
    if (isset($json["labelImage"])) $setImage = "image='".utf8_decode($json["labelImage"])."',";
    if (isset($json["chip"])) $setChip = "num_chip='".$json["chip"]."',";
    if (isset($json["celular"])) $setCel = "num_cel='".$json["celular"]."',";
    if (isset($json["imei"])) $setImei = "imei='".$json["imei"]."',";
    if (isset($json["cbxOperadora"])) $setOperadora = "id_operadora=".$json["cbxOperadora"].",";
    //if (isset($json["cbxTecnico"])) $setTecnico = "id_tecnico=".$json["cbxTecnico"].",";
    $setTecnico = "id_tecnico=".$idTecnico.",";
    if (isset($json["siteInst"])) $setLugar = "lugar_instalacion='".utf8_decode($json["siteInst"])."',";
    if (isset($json["cbxTaximetro"])) {
        $setHaveTaximetro = "have_taximetro='".$json["cbxTaximetro"]."',";
        if ($json["cbxTaximetro"] == 'N') {
            $setTaximetro = "id_taximetro='',";
        }
    }
    if (isset($json["idTaximetro"])) $setTaximetro = "id_taximetro='".$json["idTaximetro"]."',";
    if (isset($json["dateInst"])) $setFechaInst = "fecha_instalacion='".$json["dateInst"]."',";
    if (isset($json["cbxInterfaz"])) $setInterfaz = "if_interfaz=".$json["cbxInterfaz"].",";
    if (isset($json["cbxTipoEquipo"])) $setTipoEquipo = "id_tipo_equipo=".$json["cbxTipoEquipo"].",";
    if (isset($json["obser"])) $setObvs = "observacion='". utf8_decode(preg_replace("[\n|\r|\n\r]", "", $json["obser"]))."',";

    $setId = "id_vehiculo = ".$json["id"];

    $updateSql = 
        "UPDATE vehiculos 
        SET $setPlaca$setEquipo$setVeh$setEmpresa$setConductor$setRegMun$setMarca$setModelo$setYear$setNumMotor$setNumChasis$setImage$setChip$setCel$setImei$setOperadora$setTecnico$setLugar$setHaveTaximetro$setTaximetro$setFechaInst$setInterfaz$setTipoEquipo$setObvs$setId 
        WHERE id_vehiculo = ?"
    ;

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
        echo "{success:false, message: 'Problemas en la Construcción de la Consulta.'}";
    }
    $mysqli->close();
}
?>
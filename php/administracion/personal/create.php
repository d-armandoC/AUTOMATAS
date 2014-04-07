<?php
include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
    
    $json = json_decode($personas, true);

    $existeSql = 
        "SELECT cedula FROM personas WHERE cedula='".$json["cedula"]."' AND id_empresa = '$idEmpresa'"
    ;

    $result = $mysqli->query($existeSql);

    if ($result->num_rows > 0) {
        $salida = "{success:false, message:'La Persona ya Existe'}";
    } else {

        $insertSql = 
            "INSERT INTO personas (id_empresa, cedula, id_empleo, nombres, apellidos, email, fecha_nacimiento, direccion, celular)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ;

        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("ssissssss", 
                $idEmpresa, $json["cedula"], $json["cbxEmpleo"],
                utf8_decode(strtoupper($json["nombres"])), utf8_decode(strtoupper($json["apellidos"])), $json["email"],
                    $json["fecha_nacimiento"], utf8_decode($json["direccion"]), $json["celular"]);
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
?>
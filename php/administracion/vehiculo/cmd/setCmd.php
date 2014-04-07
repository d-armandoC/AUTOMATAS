<?php

include('../../../login/isLogin.php');
include ('../../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if (isset($cmdManual)) {
        $valCmd = $cmdManual;
    } else {
        //Extraer el comando relacionado
        $consultaSql = "select cmd from cmd_pred 
                where id_cmd_pred = $cbxCmdPred";

        $result = $mysqli->query($consultaSql);
    }

    $insertSql = "insert into cmd_at_historial (id_usuario, id_equipo, cmd) "
            . "values(?, ?, ?)";

    $stmt = $mysqli->prepare($insertSql);
    if ($stmt) {
        $stmt->bind_param("iss", $_SESSION["IDUSERKTAXY"], $cbxVeh, utf8_decode($valCmd));
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
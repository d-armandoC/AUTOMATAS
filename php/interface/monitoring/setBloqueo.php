<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idUser = $_SESSION["IDUSERKARVIEW"];
    $updateSql = "UPDATE ultimo_dato_skps
            SET id_usuario = ?,
            estado = ?
            WHERE id_equipo = ?
            "
    ;
    $stmt = $mysqli->prepare($updateSql);

    if ($stmt) {
        $stmt->bind_param("iii", $idUser, $bloqueo, $idEquipo);
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
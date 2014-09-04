<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idUsuario = $_SESSION["IDUSERKARVIEW"];
    $updateSql = "UPDATE karviewdb.equipos
            SET id_usuario = ?,
            estado = ?
            WHERE id_equipo = ?
            "
    ;
    $stmt = $mysqli->prepare($updateSql);

    if ($stmt) {
        $stmt->bind_param("iii", $idUsuario, $estado, $idEquipo);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos actualizados correctamente.'}";
        } else {
            echo "{failure:true, message: 'Problemas al actualizar en la tabla.'}";
        }
        $stmt->close();
    } else {
        echo "{failure:true, message: 'Problemas en la construcción de la consulta.'}";
    }
    $mysqli->close();
}
?>
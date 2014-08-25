<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idUsuario = $_SESSION["IDUSERKARVIEW"];
    if ($rb == 1) {
        $updateSql = "insert into karviewhistoricodb.comentario_vehiculos (id_usuario,id_vehiculo,comentario) values(?,?,?)";
        $stmt = $mysqli->prepare($updateSql);

        if ($stmt) {
            $stmt->bind_param("iis", $idUsuario, $idEquipo, utf8_decode(preg_replace("[\n|\r|\n\r]", "", $stadoEqp)));
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
    } else {
        $updateSql = "insert into karviewhistoricodb.comentario_equipos (id_usuario,id_equipo,comentario) values(?,?,?)";
        $stmt = $mysqli->prepare($updateSql);

        if ($stmt) {
            $stmt->bind_param("iis", $idUsuario, $idEquipo, utf8_decode(preg_replace("[\n|\r|\n\r]", "", $stadoEqp)));
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
}
?>
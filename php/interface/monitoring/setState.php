<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $setidEquipo=$setComentario=$idComentario= "";
    
    $idUser = "id_usuario=". $_SESSION["IDUSERKARVIEW"]. ",";
    $consultaSql = "select count(*) as idUltimoComentario from karviewhistoricodb.comentario_equipos ceq, karviewdb.equipos eq
                where ceq.id_equipo = eq.id_equipo and eq.equipo='$equipo'";
    $result = $mysqli->query($consultaSql);
    if ($result->num_rows > 0) {
        $myrow = $result->fetch_assoc();
        $idComentario = $myrow["idUltimoComentario"];
    }
    $consultaSql1 = "SELECT id_equipo FROM karviewdb.equipos where equipo='$equipo'";
    $result1 = $mysqli->query($consultaSql1);
    if ($result1->num_rows > 0) {
        $myrow1 = $result1->fetch_assoc();
        $setidEquipo ="id_equipo=". $myrow1["id_equipo"]. ",";
    }
     if (isset($comentario)) {
        $setComentario = "comentario='".utf8_decode($comentario)."',";
    }
    $setId = "id_comentario_equipo=".$idComentario."";
     $updateSql = "update comentario_equipos "
                    . "set $idUser$setidEquipo$setComentario$setId"
                    . "where id_comentario_equipo = ?";
         $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i",$idComentario);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
            } else {
                echo "{failure:true, message: 'Problemas al actualizar en la tabla.',state: false}";
            }
            $stmt->close();
        } else {
            echo "{failure:true, message: 'Problemas en la construcción de la consulta.',state: false}";
        }
        $mysqli->close();
    }

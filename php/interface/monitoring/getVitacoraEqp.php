<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT eqp.equipo, cq.id_equipo, cq.comentario, cq.fecha_hora_registro, p.nombres, p.apellidos "
            . "FROM karviewhistoricodb.comentario_equipos cq, karviewdb.equipos eqp, karviewdb.usuarios u, karviewdb.personas p "
            . "where cq.id_equipo=eqp.id_equipo and cq.id_usuario=u.id_usuario and u.id_persona=p.id_persona and eqp.equipo='$equipo'";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{success: true, vitaStateEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idEquipo:'" . $myrow["equipo"] . "',
                estado:'" . utf8_encode($myrow["comentario"]) . "',
                fechaEstado:'" . $myrow["fecha_hora_registro"] . "',
                fechaHoraReg:'" . $myrow["fecha_hora_registro"] . "',
                tecnico: '".  utf8_encode($myrow["apellidos"].' '.$myrow["nombres"])."'
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, msg:'No hay datos que obtener'}";
    }
}
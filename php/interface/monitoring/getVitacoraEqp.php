<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "select vs.id_equipo, vs.estado, vs.fecha_estado, vs.fecha_hora_reg, p.apellidos, p.nombres
        from vitacora_state_eqp vs, usuarios u, personas p
        where vs.id_usuario = u.id_usuario
        and u.id_persona = p.id_persona
        and vs.id_equipo = '$equipo'"
    ;


    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{success: true, vitaStateEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idEquipo:'" . $myrow["id_equipo"] . "',
                estado:'" . utf8_encode($myrow["estado"]) . "',
                fechaEstado:'" . $myrow["fecha_estado"] . "',
                fechaHoraReg:'" . $myrow["fecha_hora_reg"] . "',
                tecnico: '".  utf8_encode($myrow["apellidos"].' '.$myrow["nombres"])."'
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, msg:'No hay datos que obtener'}";
    }
}
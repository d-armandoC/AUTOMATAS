<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    if ($rb == 1) {
        $consultaSql = "select e.vehiculo,vs.comentario, vs.fecha_hora_registro, p.apellidos, p.nombres 
        from   karviewhistoricodb.comentario_vehiculos vs,  karviewdb.usuarios u, karviewdb.vehiculos e, karviewdb.personas p 
        where vs.id_usuario = u.id_usuario and u.id_persona = p.id_persona and vs.id_vehiculo=e.id_vehiculo and vs.id_vehiculo = '$idEquipo' order by vs.fecha_hora_registro desc ";

        $result = $mysqli->query($consultaSql);
        $mysqli->close();

        if ($result->num_rows > 0) {
            $objJson = "{success: true, vitaStateEqp : [";
            while ($myrow = $result->fetch_assoc()) {
                $objJson .= "{
                equipoVtc:'" . $myrow["vehiculo"] . "',
                estadoVtc:'" . utf8_encode($myrow["comentario"]) . "',
                fechaHoraReg:'" . $myrow["fecha_hora_registro"] . "',
                tecnicoVtc: '" . utf8_encode($myrow["apellidos"] . ' ' . $myrow["nombres"]) . "'
            },";
            }

            $objJson .="]}";

            echo $objJson;
        } else {
            echo "{failure:true, msg:'No hay datos que obtener'}";
        }
    } else {
        $consultaSql = "select e.equipo, vs.comentario, vs.fecha_hora_registro, p.apellidos, p.nombres 
from  karviewhistoricodb.comentario_equipos vs, karviewdb.usuarios u,karviewdb.equipos e, karviewdb.personas p 
where vs.id_usuario = u.id_usuario and u.id_persona = p.id_persona and vs.id_equipo=e.id_equipo and vs.id_equipo = '$idEquipo' order by vs.fecha_hora_registro desc";

        $result = $mysqli->query($consultaSql);
        $mysqli->close();

        if ($result->num_rows > 0) {
            $objJson = "{success: true, vitaStateEqp : [";
            while ($myrow = $result->fetch_assoc()) {
                $objJson .= "{
                equipoVtc:'" . $myrow["equipo"] . "',
                estadoVtc:'" . utf8_encode($myrow["comentario"]) . "',
                fechaHoraReg:'" . $myrow["fecha_hora_registro"] . "',
                tecnicoVtc: '" . utf8_encode($myrow["apellidos"] . ' ' . $myrow["nombres"]) . "'
            },";
            }

            $objJson .="]}";

            echo $objJson;
        } else {
            echo "{failure:true, msg:'No hay datos que obtener'}";
        }
    }
}
<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 1) {
        $consultaSql = "Select e.id_equipo, e.comentario,v.id_vehiculo,
            e.fecha_hora_comentario,v.vehiculo,v.comentario as cv ,v.fecha_hora_comentario as fechV,e.id_usuario as usuarioEquipo, v.id_usuario as usuarioVehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.g1,b.g2,b.sal,b.bateria,b.v1,b.v2,b.gsm,b.gps,b.ign,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo   and e.id_equipo=v.id_equipo  and e.estado=1
            and v.id_empresa=em.id_empresa and b.estado=1 and b.id_sky_evento=se.id_sky_evento 
            ORDER BY em.empresa, v.vehiculo";
    }
    if ($idRol == 2) {
        $consultaSql = "Select e.id_equipo, e.comentario,v.id_vehiculo,
            e.fecha_hora_comentario,v.vehiculo,v.comentario as cv ,v.fecha_hora_comentario as fechV,e.id_usuario as usuarioEquipo, v.id_usuario as usuarioVehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.g1,b.g2,b.sal,b.bateria,b.v1,b.v2,b.gsm,b.gps,b.ign,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo and b.estado=1 and e.id_equipo=v.id_equipo and e.estado=1
            and v.id_empresa=em.id_empresa and b.id_sky_evento=se.id_sky_evento  and v.id_empresa='$idEmpresa'
            ORDER BY em.empresa, v.vehiculo"
        ;
    }

    $result = $mysqli->query($consultaSql);
    if ($result->num_rows > 0) {

        $objJson = "{stateEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $usuarioE = $myrow["usuarioEquipo"];
            $usuarioV = $myrow["usuarioVehiculo"];
            $consultaSql1 = "select concat(p.nombres, ' ', p.apellidos)as persona from usuarios u, karviewdb.personas p where u.id_persona=p.id_persona and u.id_usuario='$usuarioE'";
            $result1 = $mysqli->query($consultaSql1);
            $myrow1 = $result1->fetch_assoc();
            $usuarioE = $myrow1['persona'];
            $consultaSql1 = "select concat(p.nombres, ' ', p.apellidos)as persona from usuarios u, karviewdb.personas p where u.id_persona=p.id_persona and u.id_usuario='$usuarioV'";
            $result1 = $mysqli->query($consultaSql1);
            $myrow1 = $result1->fetch_assoc();
            $usuarioV = $myrow1['persona'];
            $objJson .= "{
                 estadoE:'" . utf8_encode($myrow["comentario"]) . "', 
                estadoV:'" . utf8_encode($myrow["cv"]) . "',
                usuarioE:'" . utf8_encode($usuarioE) . "',
                usuarioV:'" . utf8_encode($usuarioV) . "',
                fecha_hora_estadoE:'" . utf8_encode($myrow["fecha_hora_comentario"]) . "', 
                fecha_hora_estadoV:'" . utf8_encode($myrow["fechV"]) . "', 
                id_vehiculo:" . $myrow["id_vehiculo"] . ",
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                idEquipo:'" . $myrow["id_equipo"] . "',
                equipo:'" . $myrow["equipo"] . "',
                vehiculo:'" . utf8_encode($myrow["vehiculo"]) . "',
                fhCon:'" . $myrow["fecha_hora_conex"] . "',
                fhDes:'" . $myrow["fecha_hora_ult_dato"] . "',
                tmpcon:'" . $myrow["conex"] . "',
                tmpdes:'" . $myrow["deconexion"] . "',
                bateria:" . $myrow["bateria"] . ",
                comentario:'" . utf8_encode($myrow["comentario"]) . "',
                fechaEstado:'" . $myrow["fecha_hora_comentario"] . "',
                gsm:" . $myrow["gsm"] . ",
                gps2:" . $myrow["gps"] . ",
                vel:" . $myrow["velocidad"] . ",
                ign:" . $myrow["ign"] . ",
                activo:" . 1 . ",
                taximetro:" . $myrow["g1"] . ",
                panico:" . $myrow["g2"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
        $mysqli->close();
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
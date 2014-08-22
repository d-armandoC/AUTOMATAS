<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 1) {
        $consultaSql = "Select b.id_equipo, e.comentario,
            e.fecha_hora_comentario,v.vehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.g1,b.g2,b.sal,b.bateria,b.v1,b.v2,b.gsm,b.gps,b.ign,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo   and e.id_equipo=v.id_equipo 
            and v.id_empresa=em.id_empresa and b.id_sky_evento=se.id_sky_evento 
            ORDER BY em.empresa, v.vehiculo";
    } 
    if ($idRol == 2) {
        $consultaSql = "Select b.id_equipo, e.comentario,
            e.fecha_hora_comentario,v.vehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.g1,b.g2,b.sal,b.bateria,b.v1,b.v2,b.gsm,b.gps,b.ign,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo   and e.id_equipo=v.id_equipo 
            and v.id_empresa=em.id_empresa and b.id_sky_evento=se.id_sky_evento  and v.id_empresa='$idEmpresa'
            ORDER BY em.empresa, v.vehiculo"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{stateEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                idEquipo:'" . $myrow["id_equipo"] . "',
                equipo:'" . $myrow["equipo"] . "',
                vehiculo:'" . utf8_encode($myrow["vehiculo"]) . "',
                fhCon:'" . $myrow["fecha_hora_conex"] . "',
                fhDes:'" . $myrow["fecha_hora_ult_dato"] . "',
                tmpcon:" . $myrow["conex"] . ",
                tmpdes:" . $myrow["deconexion"] . ",
                bateria:" . $myrow["bateria"] . ",
                estado:'" . utf8_encode($myrow["comentario"]) . "',
                fechaEstado:'" . $myrow["fecha_hora_comentario"] . "',
                gsm:" . $myrow["gsm"] . ",
                gps2:" . $myrow["gps"] . ",
                vel:" . $myrow["velocidad"] . ",
                ign:" . $myrow["ign"] . ",
                taximetro:" . $myrow["g1"] . ",
                panico:" . $myrow["g2"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
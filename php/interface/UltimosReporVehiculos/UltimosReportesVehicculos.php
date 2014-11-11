<?php
include('../../login/isLogin.php');
require_once('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];
    if ($idRol == 1) {
        $consultaSql = "Select e.id_equipo,v.id_vehiculo,
           v.vehiculo,e.id_usuario as usuarioEquipo, v.id_usuario as usuarioVehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.bateria,b.gsm,b.gps,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo   and e.id_equipo=v.id_equipo  and e.estado=1
            and v.id_empresa=em.id_empresa and b.estado=1 and b.id_sky_evento=se.id_sky_evento
            ORDER BY em.empresa, v.vehiculo";
    }
    if ($idRol == 2) {
        $consultaSql = "Select e.id_equipo,v.id_vehiculo,
           v.vehiculo,e.id_usuario as usuarioEquipo, v.id_usuario as usuarioVehiculo,
            timestampdiff(minute,  b.fecha_hora_conex,now())as conex,
            timestampdiff(minute, b.fecha_hora_ult_dato,now()) AS deconexion,em.empresa,e.equipo,
            b.fecha_hora_conex,b.fecha_hora_ult_dato,se.sky_evento,b.latitud,
            b.longitud,b.velocidad,b.rumbo,b.bateria,b.gsm,b.gps,b.direccion 
            from ultimo_dato_skps b,equipos e,vehiculos v, empresas em, sky_eventos se 
            where b.id_equipo=e.id_equipo   and e.id_equipo=v.id_equipo  and e.estado=1
            and v.id_empresa=em.id_empresa and b.estado=1 and b.id_sky_evento=se.id_sky_evento and v.id_empresa='$idEmpresa'
            ORDER BY em.empresa, v.vehiculo";
    }

    $result = $mysqli->query($consultaSql);
    if ($result->num_rows > 0) {
        $objJson = "{eventos : [";
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
                usuarioE:'" . utf8_encode($usuarioE) . "',
                usuarioV:'" . utf8_encode($usuarioV) . "',
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
                gsm:" . $myrow["gsm"] . ",
                gps2:" . $myrow["gps"] . ",
                vel:" . $myrow["velocidad"] . ",
                dir:'".$myrow["direccion"]."',
                sky_evento:'".$myrow["sky_evento"]."',
                latitud:'" . $myrow["latitud"] . "',
                longitud:'" . $myrow["longitud"] . "'
            },";
        }

        $objJson .="]}";

        echo $objJson;
        $mysqli->close();
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

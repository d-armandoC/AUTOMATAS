<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT e.empresa, u.id_equipo, v.vehiculo, concat(u.fecha, ' ',u.hora) AS fh_con, timestampdiff(MINUTE, concat(u.fecha, ' ', u.hora), now()) AS tmpdes, 
    et.encabezado, u.id_pt, em.estado_mecanico, eu.estado_unidad, u.velocidad
        FROM ultimos_gps u, vehiculos v, encabezado_trama et, estado_mecanico em, estado_unidad eu, empresas e
        WHERE u.id_equipo = v.id_equipo
        AND u.id_encabezado = et.id_encabezado
        AND u.id_estado_mecanico = em.id_estado_mecanico
        AND u.id_estado_unidad = eu.id_estado_unidad
        AND v.id_empresa = e.id_empresa"
    ;

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{stateEqpUdp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                empresa:'" . $myrow["empresa"] . "',
                idEquipo:'" . $myrow["id_equipo"] . "',
                vehiculo:" . $myrow["vehiculo"] . ",
                velocidad:" . $myrow["velocidad"] . ",
                fechaConect:'" . $myrow["fh_con"] . "',
                timeDesconect:" . $myrow["tmpdes"] . ",
                encabezado:'" . utf8_encode($myrow["encabezado"]) . "',
                estadoUnidad:'" . utf8_encode($myrow["estado_unidad"]) . "',
                estadoMecanico:'" . utf8_encode($myrow["estado_mecanico"]) . "'
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
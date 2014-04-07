<?php

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select u.usuario, count(*) as total, concat(p.nombres, ' ', p.apellidos) as persona "
            . "from accesos_historico ah, usuarios u, personas p "
            . "where ah.id_usuario = u.id_usuario "
            . "and u.id_persona = p.id_persona "
            . "and ah.fecha = date(now()) "
            . "group by ah.id_usuario"
    ;

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{countAccessByUser : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                usuario:'" . utf8_encode($myrow["usuario"]) . "',
                persona:'" . utf8_encode($myrow["persona"]) . "',
                total:" . $myrow["total"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
<?php

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
        $consultaSql = "select id_equipo, count(*) as total "
                . "from recorridos "
                . "where fecha = date(now()) "
                . "group by id_equipo"
        ;

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{countByDevice : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idEquipo:'" . $myrow["id_equipo"] . "',
                total:" . $myrow["total"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
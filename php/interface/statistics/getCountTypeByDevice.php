<?php

include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select se.desc_evento, se.abv, count(*) as total "
            . "from recorridos r, sky_eventos se "
            . "where r.parametro = se.parametro "
            . "and r.fecha  = date(now()) "
            . "and r.id_equipo = '$idEqp' "
            . "group by r.parametro"
    ;

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{countTypeByDevice : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "evento:'" . $myrow["desc_evento"] . "',"
                    . "abv:'" . $myrow["abv"] . "',"
                    . "total:" . $myrow["total"] . "},";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

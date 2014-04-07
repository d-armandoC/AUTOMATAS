<?php

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT recorridos.fecha,  count(*) as total FROM recorridos WHERE YEAR(fecha) = YEAR(date(now())) AND  MONTH(fecha) = MONTH(date(now())) group by recorridos.fecha";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    $haveData = false;
    if ($result->num_rows > 0) {

        $objJson = "{countByDay : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                fecha:'" . $myrow["fecha"] . "',
                total:" . $myrow["total"] . "
            },";
        }
        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
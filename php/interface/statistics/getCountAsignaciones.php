<?php

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select e.empresa, count(*) as total 
    from assigs a, empresas e
    where a.id_empresa = e.id_empresa
    group by a.id_empresa"
    ;

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                total:" . $myrow["total"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
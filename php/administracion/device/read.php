<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "select e.id_equipo, e.id_tipo_equipo, e.equipo, e.serie, e.numero_chip, e.imei_chip, te.tipo_equipo "
            . "from equipos e, tipo_equipos te "
            . "where e.id_tipo_equipo = te.id_tipo_equipo "
            . "order by e.equipo";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idDevice:" . $myrow["id_equipo"] . ","
                . "idTypeDevice:" . $myrow["id_tipo_equipo"] . ","
                . "deviceDevice:'" . utf8_encode($myrow["equipo"]) . "',"
                . "serieDevice:'" . utf8_encode($myrow["serie"]) . "',"
                . "numberChipDevice:'" . utf8_encode($myrow["numero_chip"]) . "',"
                . "imeiChipDevice:'" . utf8_encode($myrow["imei_chip"]) . "',"
                . "typeDevice:'" . utf8_encode($myrow["tipo_equipo"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}
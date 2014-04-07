<?php
require_once('../../../dll/conect.php');

extract($_GET);

$consultaSql = 
    "SELECT GH.ID_GEOCERCA, G.NOMBRE_GEOC, GH.ID_EQUIPO, GH.ACCION, GH.FEC_HOR, GH.NOTIFICADA, V.PLACA, V.VEHICULO
    FROM GEOCERCAS_HISTORIAL GH, GEOCERCAS G, VEHICULOS V
    WHERE GH.ID_EQUIPO = '$cbxVeh'
    AND GH.ID_GEOCERCA = $cbxGeo
    AND GH.ID_GEOCERCA = G.ID_GEOCERCA
    AND GH.ID_EQUIPO = V.ID_EQUIPO
    ORDER BY GH.FEC_HOR"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{datos: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            id_geocerca:'" . $fila["ID_GEOCERCA"] . "',
            geocerca:'" . $fila["NOMBRE_GEOC"] . "',
            id_equipo:'" . $fila["ID_EQUIPO"] . "',
            placa:'" . $fila["PLACA"] . "',
            vehiculo:'" . $fila["VEHICULO"] . "',
            accion:'" . $fila["ACCION"] . "',
            fecha_hora:'" . $fila["FEC_HOR"] . "',
            notificada:'" . $fila["NOTIFICADA"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
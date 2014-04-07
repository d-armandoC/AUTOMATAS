<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_TIPO_VEHICULO, TIPO_VEHICULO
    FROM TIPO_VEHICULO"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'tipo_veh': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["ID_TIPO_VEHICULO"] . ",
            'nombre':'" . utf8_encode($fila["TIPO_VEHICULO"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

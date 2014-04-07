<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_MARCA_VEHICULO, MARCA
    FROM MARCA_VEHICULO"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "[";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "[
            '" . utf8_encode($fila["MARCA"]) . "',
            '" . utf8_encode($fila["MARCA"]) . "'
        ]";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]";

echo $salida;
?>

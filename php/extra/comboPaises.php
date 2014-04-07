<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_PAIS, PAIS
    FROM PAIS"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'pais': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . utf8_encode($fila["ID_PAIS"]) . "',
            'nombre':'" . utf8_encode($fila["PAIS"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

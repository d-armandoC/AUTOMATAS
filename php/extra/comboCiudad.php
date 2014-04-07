<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_CIUDAD, CIUDAD
    FROM CIUDAD WHERE ID_PAIS = '$cbxPais'"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'ciudad': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . utf8_encode($fila["ID_CIUDAD"]) . "',
            'nombre':'" . utf8_encode($fila["CIUDAD"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

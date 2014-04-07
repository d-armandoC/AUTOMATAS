<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_BARRIO, BARRIO
    FROM BARRIO WHERE ID_CIUDAD = '$cbxCiudad'"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'barrio': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . utf8_encode($fila["ID_BARRIO"]) . "',
            'nombre':'" . utf8_encode($fila["BARRIO"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

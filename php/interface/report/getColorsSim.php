<?php
require_once('../../../dll/conect.php');

extract($_POST);

$consultaSql = 
    "SELECT DESC_EVENTO, COLOR FROM SKY_EVENTOS"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{simbologia: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            evento:'" . $fila["DESC_EVENTO"] . "',
            color:'" . $fila["COLOR"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
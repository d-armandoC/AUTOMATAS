<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_TIPO_EMPRESA, NOMBRE
    FROM TIPO_EMPRESA"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'tipo_empresa': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["ID_TIPO_EMPRESA"] . ",
            'nombre':'" . utf8_encode($fila["NOMBRE"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
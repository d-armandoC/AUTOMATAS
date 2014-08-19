<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_tipo, tipo_operadora FROM karviewdb.tipo_operadora_vehiculo";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'operadora_veh': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_tipo"] . ",
            'text':'" . utf8_encode($fila["tipo_operadora"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;


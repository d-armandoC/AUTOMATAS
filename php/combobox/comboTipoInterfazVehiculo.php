<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_tipo, tipo_interfaz FROM karviewdb.tipo_interfaz_vehiculo";
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'interfaz_veh': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_tipo"] . ",
            'text':'" . utf8_encode($fila["tipo_interfaz"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_estado_vehiculo, nameEstado FROM karviewdb.tipo_estado";
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'estado_veh': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_estado_vehiculo"] . ",
            'text':'" . utf8_encode($fila["nameEstado"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

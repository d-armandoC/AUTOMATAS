<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_clase_Vehiculo, clase_vehiculo FROM karviewdb.clase_vehiculos";
consulta($consultaSql);
$resulset = variasFilas();
$salida = "{'class_veh': [";
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_clase_Vehiculo"] . ",
            'text':'" . utf8_encode($fila["clase_vehiculo"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}
$salida .="]}";

echo $salida;


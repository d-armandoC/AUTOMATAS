<?php

require_once('../../../dll/conect.php');

extract($_GET);

$consultaSql = "SELECT v.vehiculo, v.placa, V.id_vehiculo
    FROM  karviewdb.geocerca_vehiculos vg, karviewdb.vehiculos v, karviewdb.geocercas g
    WHERE vg.id_geocerca ='$idGeo' AND g.id_empresa = '$empresa'
    AND vg.id_vehiculo = v.id_vehiculo AND vg.id_geocerca = g.id_geocerca
";
consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'veh_geo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $idEqp = $fila["id_vehiculo"];
    $veh = $fila["vehiculo"];
    $placa = $fila["placa"];

    $salida .= "{
            'id':'" . utf8_encode($fila["id_vehiculo"]) . "',
            'nombre':'" .utf8_encode($idEqp.' - VH: ' .$placa. ' - '.$veh). "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
<?php

require_once('../../../dll/conect.php');

extract($_GET);

$consultaSql = "SELECT V.ID_EQUIPO, V.VEHICULO, V.PLACA
    FROM VEHICULOS V, VEHICULOS_GEOCERCAS VG, GEOCERCAS G
    WHERE V.ACT = 1 AND VG.ID_GEOCERCA = $idGeo
    AND VG.ID_EQUIPO = V.ID_EQUIPO
    AND G.ID_EMPRESA = '$empresa'
";
    
consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'veh_geo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $idEqp = $fila["ID_EQUIPO"];
    $veh = $fila["VEHICULO"];
    $placa = $fila["PLACA"];

    $salida .= "{
            'id':'" . utf8_encode($fila["ID_EQUIPO"]) . "',
            'nombre':'" .utf8_encode($idEqp.' - VH: ' .$placa. ' - '.$veh). "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
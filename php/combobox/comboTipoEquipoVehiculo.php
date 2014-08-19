<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_tipo_equipo, tipo_equipo FROM karviewdb.tipo_equipos";
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'tipo_veh': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_tipo_equipo"] . ",
            'text':'" . utf8_encode($fila["tipo_equipo"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>


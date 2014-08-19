<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_equipo, equipo FROM karviewdb.equipos WHERE id_equipo NOT IN(SELECT id_equipo FROM karviewdb.vehiculos)";
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'equipo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_equipo"] . ",
            'text':'" . utf8_encode($fila["equipo"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}
$salida .="]}";

echo $salida;
?>
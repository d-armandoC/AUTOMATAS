<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_ciudad, ciudad
    FROM ciudad"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'ciudades': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id_ciudad':" . $fila["id_ciudad"] . ",
            'ciudad':'" . utf8_encode($fila["ciudad"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
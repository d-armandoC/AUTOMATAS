<?php

require_once('../../../dll/conect.php');


extract($_POST);

$consultaSql = 
	"SELECT LAT_GEOC_POINT, LONG_GEOC_POINT 
	FROM GEOCERCA_POINTS
	WHERE ID_GEOCERCA = $idGeo
	ORDER BY ORDEN";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'geo_points': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'longitud':" . $fila["LONG_GEOC_POINT"] . ",
            'latitud':" . $fila["LAT_GEOC_POINT"] . "            
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

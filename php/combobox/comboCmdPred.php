<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_CMD_PRED, DESCRIPCION
    FROM CMD_PRED
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'comandos': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . $fila["ID_CMD_PRED"]. "',
            'nombre':'" . utf8_encode($fila["DESCRIPCION"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

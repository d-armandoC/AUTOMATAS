<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_ROL_USUARIO, NOMBRE
    FROM ROL_USUARIO
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "[";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "[
            '" . utf8_encode($fila["NOMBRE"]) . "',
            '" . utf8_encode($fila["NOMBRE"]) . "'
        ]";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]";

echo $salida;
?>

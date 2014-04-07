<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_PERSONA, ID_EMPLEO, NOMBRES, APELLIDOS
    FROM PERSONAS;
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{conductores: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            id:" . $fila["ID_PERSONA"] . ",
            text:'" . $fila["APELLIDOS"]." ".$fila["NOMBRES"] . "',
            idEmpleo:" . $fila["ID_EMPLEO"] . ",
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>

<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT  cmd.id_cmd_predefinido , cmd.descripcion FROM karviewdb.cmd_predefinidos cmd";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'comandos': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . $fila["id_cmd_predefinido"]. "',
            'nombre':'" . utf8_encode($fila["descripcion"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

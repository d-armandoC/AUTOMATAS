<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT id_rol_usuario, nombre
    FROM rol_usuarios
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'rol_usuario': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':" . $fila["id_rol_usuario"] . ",
            'nombre':'" . utf8_encode($fila["nombre"]). "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

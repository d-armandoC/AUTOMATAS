<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$id_empresa = $_SESSION["IDCOMPANYKTAXY"];
$id_rol = $_SESSION["IDROLKTAXY"];

$salida = "{failure:true}";


$consultaSql = 
    "SELECT M.ID_MANTEN, M.MANTENIMIENTO, M.TIEMPO, M.ODOMETRO, E.EMPRESA
    FROM MANTENIMIENTO M, EMPRESAS E
    WHERE M.ID_EMPRESA = E.ID_EMPRESA
    AND M.ID_EMPRESA = '$id_empresa'
";


consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'maintenance': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{            
            'id_manten':".$fila["ID_MANTEN"].",
            'manten':'".utf8_encode($fila["MANTENIMIENTO"])."',
            'tiempo':" . $fila["TIEMPO"] . ",
            'odom':" . $fila["ODOMETRO"] . ",
            'empresa':'" . utf8_encode($fila["EMPRESA"]) . "'            
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

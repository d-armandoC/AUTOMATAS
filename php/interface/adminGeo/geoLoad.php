<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$id_empresa = $_SESSION["IDCOMPANYKARVIEW"];
$id_rol = $_SESSION["IDROLKARVIEW"];

$salida = "{failure:true}";

if ($id_rol == 1) {
    $consultaSql = "SELECT g.id_geocerca, g.geocerca, g.descripcion, e.empresa, e.id_empresa
        FROM karviewdb.geocercas g,  karviewdb.empresas e  
        WHERE g.id_empresa=e.id_empresa"
    ;
} else {
    $consultaSql = "SELECT g.id_geocerca, g.geocerca, g.descripcion, e.empresa, e.id_empresa
        FROM karviewdb.geocercas g,  karviewdb.empresas e  
        WHERE g.id_empresa=e.id_empresa and e.id_empresa='$id_empresa'"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'adminGeo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id_geocerca':" . $fila["id_geocerca"] . ",
            'geocerca':'" . utf8_encode($fila["geocerca"]) . "',
            'desc_geo':'" .$fila["descripcion"] . "',
            'empresa':'" . utf8_encode($fila["empresa"]) . "',
            'id_empresa':'" . utf8_encode($fila["id_empresa"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

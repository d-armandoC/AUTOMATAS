<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$id_empresa = $_SESSION["IDCOMPANYKTAXY"];
$id_rol = $_SESSION["IDROLKTAXY"];

$salida = "{failure:true}";

if ($id_rol == 1) {
    $consultaSql = "SELECT G.ID_GEOCERCA, G.NOMBRE_GEOC, G.DESC_GEOC, E.EMPRESA, E.ID_EMPRESA
        FROM GEOCERCAS G, EMPRESAS E    
        WHERE G.ID_EMPRESA = E.ID_EMPRESA"
    ;
} else {
    $consultaSql = "SELECT G.ID_GEOCERCA, G.NOMBRE_GEOC, G.DESC_GEOC, E.EMPRESA, E.ID_EMPRESA
        FROM GEOCERCAS G, EMPRESAS E    
        WHERE G.ID_EMPRESA = E.ID_EMPRESA
        AND E.ID_EMPRESA = '$id_empresa'"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'adminGeo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id_geocerca':" . $fila["ID_GEOCERCA"] . ",
            'geocerca':'" . utf8_encode($fila["NOMBRE_GEOC"]) . "',
            'desc_geo':'" . utf8_encode($fila["DESC_GEOC"]) . "',
            'empresa':'" . utf8_encode($fila["EMPRESA"]) . "',
            'id_empresa':'" . utf8_encode($fila["ID_EMPRESA"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>

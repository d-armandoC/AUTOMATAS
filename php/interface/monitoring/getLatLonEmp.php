<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);
Header("content-type: application/x-javascript");

$id_empresa = $_SESSION["IDCOMPANYKARVIEW"];
$id_rol = $_SESSION["IDROLKARVIEW"];

$salida = "{failure:true}";
if ($id_rol == 1) {
    $consultaSql = 
    "SELECT ID_EMPRESA,EMPRESA,LATITUD,LONGITUD 
    FROM EMPRESAS"
    ;
} else {
    $consultaSql = 
    "SELECT ID_EMPRESA,EMPRESA,LATITUD,LONGITUD 
    FROM EMPRESAS WHERE ID_EMPRESA = '$id_empresa'"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'pos_emp': [";
//$salida = "stcCallback1001([";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id_empresa':'" . $fila["ID_EMPRESA"] . "',
            'empresa':'" . utf8_encode($fila["EMPRESA"]) . "',
            'latitud':'" . $fila["LATITUD"] . "',
            'longitud':'" . $fila["LONGITUD"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
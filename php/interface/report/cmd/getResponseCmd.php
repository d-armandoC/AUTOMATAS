<?php
include('../../../login/isLogin.php');
require_once('../../../../dll/conect.php');

extract($_GET);

$idUsuario = $_SESSION["IDUSERKARVIEW"];

$consultaSql = 
    "SELECT RTA 
    FROM CMD_AT_HISTORIAL 
    WHERE RTA <> ''
    AND ID_CMD = (SELECT MAX(ID_CMD) FROM CMD_AT_HISTORIAL WHERE ID_USUARIO = $idUsuario)"
;

consulta($consultaSql);
$resulset = unicaFila();

if (count($resulset) > 0) {
    $respuesta = utf8_encode($resulset["RTA"]);
    $salida = "{success:true, msg: '$respuesta'}";
} else {
    $salida = "{failure:true}";    
}

echo $salida;
?>
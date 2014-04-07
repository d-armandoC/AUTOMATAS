<?php
require_once('../../../dll/conect.php');

extract($_POST);

$json = json_decode($maintenance, true);

$destroySql = 
    "DELETE FROM MANTENIMIENTO WHERE ID_MANTEN = ".$json["id"]
;

if (consulta($destroySql) == 1) {
    $salida = "{success:true, message:'Datos Eliminados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$destroySql'}";
}


echo $salida;
?>
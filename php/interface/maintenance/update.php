<?php
require_once('../../../dll/conect.php');

extract($_POST);

$salida = "{success:false, message:'No se pudo actualizar los Datos'}";
$setManten = $setTiempo = $setOdom = "";

$json = json_decode($maintenance, true);

if (isset($json["manten"])) {
    $setManten = "MANTENIMIENTO='".$json["manten"]."',";
}

if (isset($json["tiempo"])) {
    $setTiempo = "TIEMPO=".strtoupper($json["tiempo"]).",";
}

if (isset($json["odom"])) {
    $setOdom = "ODOMETRO=".strtoupper($json["odom"]).",";
}

$setId = "ID_MANTEN = ".$json["id"];

$updateSql = 
    "UPDATE MANTENIMIENTO 
    SET $setManten$setTiempo$setOdom$setId
    WHERE ID_MANTEN = ".$json["id"]
;

$updateSql = utf8_decode($updateSql);

if (consulta($updateSql) == 1) {
    $salida = "{success:true, message:'Datos Actualizados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$updateSql'}";
}

echo $salida;
?>
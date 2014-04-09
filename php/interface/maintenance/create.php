<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_POST);

$id_empresa = $_SESSION["IDCOMPANYKARVIEW"];

$salida = "{success:false, message:'No se pudo insertar los Datos'}";

$json = json_decode($maintenance, true);

$insertSql = 
"INSERT INTO MANTENIMIENTO (MANTENIMIENTO,TIEMPO,ODOMETRO,ID_EMPRESA)
VALUES('".$json["manten"]."',".$json["tiempo"].",".$json["odom"].",'".$id_empresa."')"
;

$insertSql = utf8_decode($insertSql);

if (consulta($insertSql) == 1) {
    $salida = "{success:true, message:'Datos Insertados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$insertSql'}";
}

echo $salida;
?>
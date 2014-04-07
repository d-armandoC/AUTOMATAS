<?php

include('../../../login/isLogin.php');
require_once('../../../../dll/conect.php');

extract($_POST);

$consultaSql = 
    "INSERT INTO INSTALACIONES (ID_EQUIPO,TECNICO,ID_USUARIO,NUM_CHIP,NUM_CEL,OPERADORA_CHIP,IMEI,LUGAR_INSTALACION,OBSERVACIONES)
    VALUES('$cbxVeh', '$tecnico', " . $_SESSION["IDUSERKTAXY"] . ", '$numberChip',
        '$numberCel', '$cbxOperadora', '$imei', '$siteInst','$obser')";


if (consulta($consultaSql) == 1) {
    $salida = "{success:true}";
} else {
    $salida = "{failure:true}";    
}

echo $salida;

?>

<?php

require_once('../../../dll/conect.php');


extract($_POST);

$salida = false;

$consultaSql = 
	"DELETE FROM VEHICULOS_GEOCERCAS WHERE ID_EQUIPO = '$idEqp'";

if (consulta($consultaSql) == 1) {
    $salida = true;
}

echo $salida;
?>

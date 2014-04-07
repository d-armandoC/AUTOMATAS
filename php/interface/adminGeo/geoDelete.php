<?php

require_once('../../../dll/conect.php');


extract($_POST);

$salida = false;

$consultaSql =
	"DELETE FROM GEOCERCA_POINTS WHERE ID_GEOCERCA = $idGeo";

if (consulta($consultaSql) == 1) {
	$consultaSql = 
	"DELETE FROM VEHICULOS_GEOCERCAS WHERE ID_GEOCERCA = $idGeo";

	if (consulta($consultaSql) == 1) {
		$consultaSql = 
		"DELETE FROM GEOCERCAS WHERE ID_GEOCERCA = $idGeo";

		if (consulta($consultaSql) == 1) {
			$consultaSql = 
			"DELETE FROM ENVIO_MAILS_GEO WHERE ID_GEOCERCA = $idGeo";
			
			if (consulta($consultaSql) == 1) {
				$salida = true;
			}			
		}
	}
}

echo $salida;
?>

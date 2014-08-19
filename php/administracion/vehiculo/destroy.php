<?php
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
	$json = json_decode($veh, true);

	$destroySql = 
		"DELETE FROM vehiculos WHERE id_vehiculo = ?"
		;

	if ($stmt = $mysqli->prepare($destroySql)) {
		$stmt->bind_param("i", $json["id"]);
		$stmt->execute();

		if ($stmt->affected_rows > 0) {
			echo "{success:true, message:'Datos Eliminados Correctamente.'}";
		} else {
			echo "{success:false, message: 'Problemas al Eliminar en la Tabla.'}";
		}
		$stmt->close();
	} else {
		echo "{success:false, message: 'Problemas en la Construcción de la Consulta.'}";
	}
	$mysqli->close();
}
?>
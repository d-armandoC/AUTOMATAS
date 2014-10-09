<?php
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
	//$json = json_decode($veh, true);

	$destroySql = 
		"DELETE FROM mantenimiento WHERE id_vehiculo=? and id_estandar_vehiculo=?";

	if ($stmt = $mysqli->prepare($destroySql)) {
            $id = explode("_", $json["id"]);
		$stmt->bind_param("ii", $id[0],$id[1]);
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
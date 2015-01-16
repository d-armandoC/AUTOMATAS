<?php

extract($_GET);
include ('../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT vh.vehiculo, m.id_vehiculo, vh.placa, vh.marca, sv.estandar_vehiculo, m.valorTipoServicio,m.fecha_registro, m.responsable, concat (p.nombres,' ',p.apellidos) nombres "
            . "FROM karviewdb.personas p, karviewhistoricodb.historicomantenimientovehiculo m, karviewdb.vehiculos vh, karviewdb.empresas emp, karviewdb.estandar_vehiculos sv, karviewdb.usuarios us "
            . "where vh.id_empresa= emp.id_empresa and m.id_vehiculo=vh.id_vehiculo  and m.id_estandar_vehiculo=sv.id_estandar_vehiculo and m.responsable=us.id_persona and us.id_persona=p.id_persona and m.id_vehiculo='$idVehiculo' and (m.fecha_registro between concat('$fechaInicio',' ','$horaInicio') and concat('$fechaFin',' ','$horaFinal'));";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {

        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {

            $json .= "{"
                    . "placa: '" . $myrow["placa"] . "',"
                    . "vehiculo: '" . $myrow["vehiculo"] . "',"
                    . "marca: '" . $myrow["marca"] . "',"
                    . "estandar:' " . utf8_encode($myrow["estandar_vehiculo"]) . "',"
                    . "idTipoServicio: " . $myrow["valorTipoServicio"] . ","
                    . "responsable:'" . $myrow["nombres"] . "',"
                    . "},";
        }
        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
}
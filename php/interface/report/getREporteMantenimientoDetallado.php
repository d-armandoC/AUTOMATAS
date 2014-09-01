<?php

extract($_GET);
include ('../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT vh.vehiculo, m.id_vehiculo, vh.placa, vh.marca, sv.estandar_vehiculo, m.valorTipoServicio FROM karviewdb.mantenimiento m, karviewdb.vehiculos vh, karviewdb.empresas emp, karviewdb.estandar_vehiculos sv where vh.id_empresa= emp.id_empresa and m.id_vehiculo=vh.id_vehiculo  and m.id_estandar_vehiculo=sv.id_estandar_vehiculo and m.id_vehiculo='$idVehiculo';";
    $result = $mysqli->query($consultaSql);


    $mysqli->close();

    if (($result->num_rows > 0) || ($result1->num_rows > 0)) {

        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {

            $json .= "{"
                    . "placa: '" . $myrow["placa"] . "',"
                    . "vehiculo: '" . $myrow["vehiculo"] . "',"
                    . "marca: '" . $myrow["marca"] . "',"
                    . "estandar:' " . utf8_encode($myrow["estandar_vehiculo"]) . "',"
                    . "idTipoServicio: " .$myrow["valorTipoServicio"]. ","
                    . "},";
        }


        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }

}
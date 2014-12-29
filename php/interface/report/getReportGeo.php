<?php

include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
$consultaSql = "SELECT gh.id_geocerca, g.geocerca, gh.id_vehiculo, gh.estado, gh.fecha_hora_registro, v.placa, v.vehiculo 
FROM karviewhistoricodb.historial_geocercas gh, karviewdb.geocercas g, karviewdb.vehiculos v 
where gh.id_geocerca=g.id_geocerca and gh.id_vehiculo=v.id_vehiculo and gh.id_vehiculo='$cbxVeh' and gh.id_geocerca='$cbxGeo' and (gh.fecha_hora_registro between concat('$fechaIni',' ','$horaIniParada') and concat('$fechaFin',' ','$horaFinParada'))";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_geocerca:" . $myrow["id_geocerca"] . ","
                    . "geocerca:'" . $myrow["geocerca"] . "',"
                    . "placa:'" . $myrow["placa"] . "',"
                    . "vehiculo:'" . $myrow["vehiculo"] . "',"
                    . "estado:" . $myrow["estado"] . ","
                    . "fecha_hora:'" . $myrow["fecha_hora_registro"] . "'"
                    . "},";
        }
        $objJson .="],comp:'" . $idCompanyParadas . "',fi:'" . $fechaIni . "',ff:'" . $fechaFin . "'";
    }
    if ($haveData) {
        echo "{success: true, $objJson}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    $mysqli->close();
}
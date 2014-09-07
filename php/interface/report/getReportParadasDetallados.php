<?php

extract($_GET);
include ('../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT emp.id_empresa,v.id_vehiculo,emp.empresa ,eq.equipo,V.placa, V.vehiculo, skp.latitud,skp.longitud,skp.fecha,skp.hora,skp.velocidad,skp.bateria,skp.gsm,skp.gps,skp.ign,SE.sky_evento
    FROM karviewhistoricodb.dato_spks skp, karviewdb.sky_eventos SE, karviewdb.vehiculos v, karviewdb.equipos eq, karviewdb.empresas emp
    WHERE  skp.ID_EQUIPO  =V.ID_EQUIPO and eq.id_equipo=v.id_equipo and skp.id_sky_evento=SE.id_sky_evento and v.id_empresa=emp.id_empresa 
    and (skp.fecha between '$fechainiParadas' and '$fechafinParadas') and SE.id_sky_evento= 13 and v.id_vehiculo='$idVehiculo'";
    $result = $mysqli->query($consultaSql);
    if (($result->num_rows > 0)) {

        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $json .= "{"
                    . "empresa: '" . $myrow["empresa"] . "',"
                    . "vehiculo: '".$myrow["vehiculo"]."',"
                    . "placa:'".$myrow["placa"]. "',"
                    . "latitud:'".$myrow["latitud"]. "',"
                    . "longitud:'".$myrow["longitud"]. "',"
                    . "fecha:'".$myrow["fecha"]. "',"
                    . "hora:'".$myrow["hora"]. "',"
                    . "velocidad: " .$myrow["velocidad"]. ","
                    . "bateria: " .$myrow["bateria"]. ","
                    . "gsm: " .$myrow["gsm"]. ","
                    . "gps: " .$myrow["gps"]. ","
                    . "ign: " .$myrow["ign"]. ","
                    . "sky_evento:'".$myrow["sky_evento"]."',"
                    . "},";
        }

        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
    $mysqli->close();
}
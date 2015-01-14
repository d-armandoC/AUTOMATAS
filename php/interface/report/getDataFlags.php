<?php

include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $haveData = false;
     $consultaSqlvehiculo="SELECT id_equipo FROM karviewdb.vehiculos where id_Vehiculo='$cbxVeh'";
     $resultVehiculo = $mysqli->query($consultaSqlvehiculo);
    $myrowvehiculo = $resultVehiculo->fetch_assoc();
    $idequipo=$myrowvehiculo["id_equipo"];

    $consultaSql1 = "select  count(r.id_sky_evento) as cantidad,r.id_sky_evento, se.sky_evento
            from karviewhistoricodb.dato_spks r, karviewdb.vehiculos v,  karviewdb.sky_eventos se,  karviewdb.empresas e
            where r.id_sky_evento = se.id_sky_evento
            and r.id_equipo = v.id_equipo
            and v.id_empresa = e.id_empresa
            and r.id_equipo = '$idequipo'
            and r.fecha between '$fechaIni' and '$fechaFin'
            group by id_sky_evento ";
    $result1 = $mysqli->query($consultaSql1);
    $eventos = '';
    while ($myrow = $result1->fetch_assoc()) {
        $eventos = $eventos . utf8_encode($myrow["sky_evento"]) . ',' . $myrow["cantidad"] . ',' . $myrow["id_sky_evento"] . ';';
    }
    $consultaSql = "select v.placa, v.vehiculo,r.latitud, r.longitud,r.fecha, r.hora, r.fecha_hora_registro, r.velocidad, 
            r.bateria, r.gsm, r.gps, r.ign, r.direccion, se.color, se.sky_evento, r.id_sky_evento, 
            r.g1, r.g2, r.sal, e.empresa,eq.equipo
            from karviewhistoricodb.dato_spks r, karviewdb.vehiculos v,  karviewdb.sky_eventos se,  karviewdb.empresas e, karviewdb.equipos eq
            where r.id_sky_evento = se.id_sky_evento
            and r.id_equipo = v.id_equipo
            and r.id_equipo=eq.id_equipo
            and v.id_empresa = e.id_empresa
            and r.id_equipo = ?
            and r.fecha between ? and ?
            order by r.fecha, r.hora";
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("iss", $idequipo, $fechaIni, $fechaFin);
        /* ejecutar la consulta */
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $mysqli->close();
        if ($result->num_rows > 0) {
            $fechaHoraIni = $fechaIni . " " . $horaIni;
            $fechaHoraFin = $fechaFin . " " . $horaFin;
            $json = "puntos: [";
            $c = 0;
            $haveData = false;
            while ($myrow = $result->fetch_assoc()) {
                $haveData = true;
                $c++;
                $json .= "{"
                        . "idData: " . $c . ","
                        . "company:'" . utf8_encode($myrow["empresa"]) . "',"
                        . "latitud: " . $myrow["latitud"] . ","
                        . "longitud: " . $myrow["longitud"] . ","
                        . "placa: '" . $myrow["placa"] . "',"
                        . "equipo: '" . $myrow["equipo"] . "',"
                        . "fecha_hora_reg:'" . $myrow["fecha_hora_registro"] . "',"
                        . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                        . "velocidad:" . $myrow["velocidad"] . ","
                        . "bateria:" . $myrow["bateria"] . ","
                        . "gsm:" . $myrow["gsm"] . ","
                        . "gps2:" . $myrow["gps"] . ","
                        . "ign:" . $myrow["ign"] . ","
                        . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                        . "color:'" . $myrow["color"] . "',"
                        . "evento:'" . utf8_encode($myrow["sky_evento"]) . "',"
                        . "idEvento:" . $myrow["id_sky_evento"] . ","
                        . "g1:" . $myrow["g1"] . ","
                        . "g2:" . $myrow["g2"] . ","
                        . "eventos:'" . $eventos . "',"
                        . "salida:" . $myrow["sal"]
                        . "},";
            }
            $json .="]";
        }
    }


    if ($haveData) {
        echo "{success: true, $json }";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
}
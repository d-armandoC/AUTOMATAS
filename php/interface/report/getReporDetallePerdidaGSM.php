<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($rb4 == 1) {
        $consultaSql = "SELECT emp.empresa, eq.equipo, vh.placa, skp.velocidad, concat(skp.fecha,' ',skp.hora) as fecha , skp.gsm, skp.gps ,skp.latitud, skp.longitud "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_empresa='$idempresagsm' and skp.fecha between '$fechaIni' and '$fechaFin'and skp.hora between '$horaIni' and '$horaFin' and( skp.gsm=0 );";
        $consultaSqlRec = "SELECT emp.empresa, eq.equipo, vh.placa, skp.velocidad, concat(skp.fecha,' ',skp.hora) as fecha , skp.gsm ,skp.gps, skp.latitud, skp.longitud "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_empresa='$idempresagsm' and skp.fecha between '$fechaIni' and '$fechaFin'and skp.hora between '$horaIni' and '$horaFin' and( skp.gps=0 );";
    }else if ($rb4 == 2) {
         $consultaSql = "SELECT emp.empresa, eq.equipo, vh.placa, skp.velocidad, concat(skp.fecha,' ',skp.hora) as fecha , skp.gsm, skp.gps ,skp.latitud, skp.longitud "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_Vehiculo='$cbxVeh' and skp.fecha between '$fechaIni' and '$fechaFin' and skp.hora between '$horaIni' and '$horaFin' and( skp.gsm=0 );";
        $consultaSqlRec = "SELECT emp.empresa, eq.equipo, vh.placa, skp.velocidad, concat(skp.fecha,' ',skp.hora) as fecha , skp.gsm ,skp.gps, skp.latitud, skp.longitud "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_Vehiculo='$cbxVeh' and skp.fecha between '$fechaIni' and '$fechaFin' and skp.hora between '$horaIni' and '$horaFin' and( skp.gps=0 );";
        
    }
        $result = $mysqli->query($consultaSql);
        if ($result->num_rows > 0) {
            $objJson = "{data : [";
            while ($myrow1 = $result->fetch_assoc()) {
                $objJson .= "{"
                        . "empresa:'" . $myrow1["empresa"] . "',"
                        . "equipo:'" . $myrow1["equipo"] . "',"
                        . "placa:'" . $myrow1["placa"] . "',"
                        . "latitud: " . $myrow1["latitud"] . ","
                        . "longitud: " . $myrow1["longitud"] . ","
                        . "fecha:'" . $myrow1["fecha"] . "', "
                        . "velocidad:" . $myrow1["velocidad"] . ","
                        . "gps:" . $myrow1["gps"] . ","
                        . "gsm:" . $myrow1["gsm"] . ","
                        . "tipo_respuesta:'" . 'GSM' . "'"
                        . "},";
            }
        }

        $resultRec = $mysqli->query($consultaSqlRec);
        if ($resultRec->num_rows > 0) {
            while ($myrow2 = $resultRec->fetch_assoc()) {
                $objJson .= "{"
                        . "empresa:'" . $myrow2["empresa"] . "',"
                        . "equipo:'" . $myrow2["equipo"] . "',"
                        . "placa:'" . $myrow2["placa"] . "',"
                        . "latitud: " . $myrow2["latitud"] . ","
                        . "longitud: " . $myrow2["longitud"] . ","
                        . "fecha:'" . $myrow2["fecha"] . "', "
                        . "velocidad:" . $myrow2["velocidad"] . ","
                        . "gps:" . $myrow2["gps"] . ","
                        . "gsm:" . $myrow2["gsm"] . ","
                        . "tipo_respuesta:'" . 'GPS' . "'"
                        . "},";
            }
        }
        $objJson .="]}";
        echo "{success:true, string: " . json_encode($objJson) . "}";
    $mysqli->close();
}


<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($rb1== 1) {
        $consultaSql = "SELECT eq.equipo, emp.empresa, vh.placa, skp.velocidad,concat(skp.fecha,'  ',skp.hora) as fecha, skev.acronimo, skev.sky_evento  "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh, karviewdb.sky_eventos skev   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and vh.id_empresa='$idempresasExcesos' and skp.id_sky_evento= skev.id_sky_evento and "
                . "skp.fecha between '$fechaIniEx' and '$fechaFinEx' and skp.hora between '$horaIniExcesos' and '$horaFinExcesos'  and( skp.id_sky_evento=11 || skp.id_sky_evento=20);";
    } else if ($rb1 == 2) { 
        $consultaSql = "SELECT eq.equipo, emp.empresa, vh.placa, skp.velocidad,concat(skp.fecha,'  ',skp.hora) as fecha, skev.acronimo, skev.sky_evento  "
                . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh, karviewdb.sky_eventos skev   "
                . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and skp.id_sky_evento= skev.id_sky_evento and "
                . "vh.id_Vehiculo='$cbxVeh' and skp.fecha between '$fechaIniEx' and '$fechaFinEx' and skp.hora between '$horaIniExcesos' and '$horaFinExcesos' and( skp.id_sky_evento=11 || skp.id_sky_evento=20);";
    }
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "acronimo:'" . utf8_encode($myrow["acronimo"]) . "',"
                    . "equipo:'" . $myrow["equipo"] . "',"
                    . "empresa:'" . $myrow["empresa"] . "',"
                    . "placa:'" . $myrow["placa"] . "',"
                    . "velocidad:'" . $myrow["velocidad"] . "',"
                    . "fecha:'" . $myrow["fecha"] . "',"
                    . "evento:'" . $myrow["sky_evento"] . "'"
                    . "},";
        }
        $objJson .="]}";
    }
    if ($haveData) {
        echo "{success:true, string: " . json_encode($objJson) . "}";
    } else {
        echo "{failure: true, msg: 'No hay Datos quee mostrar'}";
    }


    $mysqli->close();
}


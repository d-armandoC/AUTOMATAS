<?php
extract($_GET);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
//cbxEmpresasPan:2
//fechaIni:2013-10-27
//fechaFin:2014-08-31
//horaIni:00:01
//horaFin:23:59
            $consultaSql = "select ds.id_equipo, eq.equipo, ds.latitud, ds.longitud, ds.fecha, ds.hora, ds.fecha_hora_registro, ds.velocidad, 
            ds.bateria, ds.gsm, ds.gps, ds.ign, ds.direccion, se.sky_evento, ds.id_sky_evento, se.parametro, 
            ds.g1, ds.g2, ds.sal
            from karviewhistoricodb.dato_spks ds, sky_eventos se, equipos eq, vehiculos v
            where ds.id_sky_evento = se.id_sky_evento and ds.id_equipo = eq.id_equipo
            and eq.id_equipo = v.id_equipo
            and (((ds.gsm = 0)and (ds.gps = 0)and ((ds.fecha between '$fechaIni' AND '$fechaFin')
            and (ds.hora between '$horaIni' AND '$horaFin')))and v.id_empresa='$cbxEmpresasPan')AND eq.equipo='$id_equipo' order by ds.id_equipo";

    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByGSM : [";
        while ($myrow = $result->fetch_assoc()) {
                    $objJson .= "{"
                            . "id_equipo:'" . $myrow["equipo"] . "',"
                            . "latitud: " . $myrow["latitud"] . ","
                            . "longitud: " . $myrow["longitud"] . ","
                            . "fecha_hora_reg:'" . $myrow["fecha_hora_registro"] . "',"
                            . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                            . "velocidad:" . $myrow["velocidad"] . ","
                            . "bat:" . $myrow["bateria"] . ","
                            . "gsm:" . $myrow["gsm"] . ","
                            . "gps:" . $myrow["gps"] . ","
                            . "ign:" . $myrow["ign"] . ","
                            . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                            . "evento:'" . utf8_encode($myrow["sky_evento"]) . "',"
                            . "id_evento:" . $myrow["id_sky_evento"] . ","
                            . "parametro:" . $myrow["parametro"] . ","
                            . "g1:" . $myrow["g1"] . ","
                            . "g2:" . $myrow["g2"] . ","
                            . "sal:" . $myrow["sal"]
                            . "},";
                } 
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
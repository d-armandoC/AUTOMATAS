<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT s.id_equipo,s.latitud,s.longitud,s.fecha_hora_reg,s.fecha,s.hora,s.velocidad,s.bateria,s.gsm,s.gps,s.ign,s.direccion,s.id_sky_evento,s.g1,s.g2,s.sal FROM karviewhistoricodb.dato_spks s,karviewdb.vehiculos v,karviewdb.sky_eventos ev where s.id_equipo=v.id_equipo  and s.id_sky_evento=ev.id_sky_evento and s.id_sky_evento=2 and v.id_empresa='$empresa' and ((s.fecha between '$fecha_Ini' AND '$fecha_Fin')and (s.hora between '$hora_Ini' AND '$hora_Fin'))  group by s.id_equipo;";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$empresa';";
        $result1 = $mysqli->query($consultaSql1);
        $myrow1 = $result1->fetch_assoc();
        $empresa = $myrow1['empresa'];
        $objJson = "infByPanico : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "fecha_hora_reg:'" . $myrow["fecha_hora_reg"] . "',"
                    . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                    . "velocidad:" . $myrow["velocidad"] . ","
                    . "bat:" . $myrow["bateria"] . ","
                    . "gsm:" . $myrow["gsm"] . ","
                    . "gps2:" . $myrow["gps"] . ","
                    . "ign:" . $myrow["ign"] . ","
                    . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                    . "id_evento:" . $myrow["id_sky_evento"] . ","
                    . "g1:" . $myrow["g1"] . ","
                    . "g2:" . $myrow["g2"] . ","
                    . "sal:" . $myrow["sal"]
                    . "},";
        }
        $objJson .="],comp:'" . $empresa . "',fi:'" . $fecha_Ini . "',ff:'" . $fecha_Fin. "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    }
    else {
        echo "{failure: true, msg: 'No hay Datos que mostrar'}";
    }
    $mysqli->close();
}
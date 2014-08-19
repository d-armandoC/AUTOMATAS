<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT ds.id_equipo,ds.latitud,ds.longitud,ds.fecha_hora_reg,ds.fecha,ds.hora,ds.velocidad,ds.bateria,ds.gsm,ds.gps,ds.ign,ds.direccion,ds.g1,ds.g2,ds.sal FROM karviewhistoricodb.dato_spks ds, karviewdb.sky_eventos sky , karviewdb.vehiculos v where ds.id_equipo=v.id_equipo and ds.id_sky_evento=sky.id_sky_evento and v.id_empresa='1' and (ds.id_sky_evento='12' || ds.id_sky_evento='21') and ((ds.fecha between '2014-07-30' AND '2014-07-30')and (ds.hora between '00:00:00' AND '10:47:27'))group by id_equipo;";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='1';";
        $result1 = $mysqli->query($consultaSql1);
        $myrow1 = $result1->fetch_assoc();
        $cbxEmpresasPan = $myrow1['empresa'];
        $objJson = "countByVelocidad1 : [";
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
                    . "g1:" . $myrow["g1"] . ","
                    . "g2:" . $myrow["g2"] . ","
                    . "sal:" . $myrow["sal"]
                    . "},";
        }
        $objJson .="],comp:'" . $cbxEmpresasPan . "',fi:'" . $fechaIni . "',ff:'" . $fechaFin . "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
// echo "{success: true, $json }";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
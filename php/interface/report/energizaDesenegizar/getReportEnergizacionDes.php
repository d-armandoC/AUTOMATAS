<?php

extract($_GET);
include ('../../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    
    $consultaSql = "SELECT sk.fecha, sk.hora ,ev.sky_evento, sk.velocidad, sk.latitud, sk.longitud, sk.bateria,sk.gsm, sk.gps, sk.direccion
                            FROM karviewhistoricodb.dato_spks sk ,karviewdb.sky_eventos ev
                            where  sk.id_equipo='$idEquipoED' and sk.id_sky_evento=ev.id_sky_evento and ev.id_sky_evento in(6,7) and
                            sk.fecha between '$fechaIniED' and '$fechaFinED'and sk.hora between '$horaIniED' and '$horaFinED'";
    
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                       . "fechaED: '" . $myrow["fecha"] . "',"
                        . "horaED: '" . $myrow["hora"] . "',"
                        . "eventoED: '" . utf8_encode($myrow["sky_evento"]) . "',"
                        . "velocidadED: " . $myrow["velocidad"] . ","
                        . "latitudED: '" . $myrow["latitud"] . "',"
                        . "longitudED: '" . $myrow["longitud"] . "',"
                        . "bateriaED: " . $myrow["bateria"] . ","
                        . "gsmED: " . $myrow["gsm"] . ","
                        . "gpsED: " . $myrow["gps"] . ","
                        . "direccionED: '".$myrow["direccion"]."'"
                    . "},";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos quee mostrar $consultaSql'}";
    }
    $mysqli->close();
}

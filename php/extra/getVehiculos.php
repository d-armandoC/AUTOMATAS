<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $coord = explode(";", $coord);
    $numVer = count($coord);

    for ($i = 0; $i < count($coord); $i++) {
        $data = explode(",", $coord[$i]);
        $vertx[$i] = $data[0];
        $verty[$i] = $data[1];
    }

    $consultaSql = "SELECT dskp.ID_EQUIPO, dskp.FECHA, dskp.HORA, dskp.VELOCIDAD, dskp.LATITUD, dskp.LONGITUD, dskp.bateria, dskp.IGN, dskp.GSM, dskp.GPS, dskp.G2
	FROM karviewhistoricodb.dato_spks dskp WHERE FECHA = '2014-09-08'
	AND HORA BETWEEN '00:00' AND '11:15'";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "{puntos: [";
        while ($myrow = $result->fetch_assoc()) {
            if (pointOnVertice($numVer, $verty, $vertx, $myrow["LATITUD"], $myrow["LONGITUD"])) {
                  $objJson .= "{"
                    . "idEquipo:" . $myrow["ID_EQUIPO"] . ","
                    . "fecha_hora:'" .$myrow["FECHA"] . ' ' . $myrow["HORA"]. "',"
                    . "velocidad:'" . $myrow["VELOCIDAD"] . "',"
                    . "latitud:'" . $myrow["LATITUD"] . "',"
                    . "longitud:'" . $myrow["LONGITUD"] . "',"
                    . "bateria:'" . $myrow["bateria"] . "',"
                    . "ign:'" . $myrow["IGN"] . "',"
                    . "gsm:'" .  $myrow["GSM"] . "',"
                    . "gps2:'" . $myrow["GPS"] . "',"
                    . "G2:'" . $myrow["G2"] . "'"
                    . "},";
            }
        }
        $objJson .="]}";
    }
    if ($haveData) {
        echo "{success:true, string: " . json_encode($objJson) . "}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }
}


function pointOnVertice($numVer, $verty, $vertx, $testy, $testx) {
    $c = false;
    for ($i = 0, $j = $numVer - 1; $i < $numVer; $j = $i++) {
        if ((($vertx[$i] > $testx) != ($vertx[$j] > $testx)) && ($testy < ($verty[$j] - $verty[$i]) * ($testx - $vertx[$i]) / ($vertx[$j] - $vertx[$i]) + $verty[$i])) {
            $c = !$c;
        }
    }
    return $c;
}

?>

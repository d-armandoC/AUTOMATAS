<?php
require_once('../../dll/conect.php');

extract($_POST);

$coord = explode(";", $coord);
$numVer = count($coord);

for ($i=0; $i < count($coord); $i++) { 
	$data = explode(",", $coord[$i]);
	$vertx[$i] = $data[0];
	$verty[$i] = $data[1];
}

$consultaSql = 
	"SELECT ID_EQUIPO, FECHA, HORA, VELOCIDAD, LATITUD, LONGITUD, BAT, IGN, GSM, GPS2, G2
	FROM RECORRIDOS WHERE FECHA = '$fecha'
	AND HORA BETWEEN '$horaIni' AND '$horaFin'"
;

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) > 0) {
	$existVehiculos = false;

	$json = "{puntos: [";

	for ($i = 0; $i < count($resulset); $i++) {
	    $fila = $resulset[$i];

	    if (pointOnVertice($numVer, $verty, $vertx, $fila["LATITUD"], $fila["LONGITUD"])) {
	    	$json .= "{
	            idEquipo:'" . utf8_encode($fila["ID_EQUIPO"]) . "',
	            fecha_hora:'" . $fila["FECHA"]. ' '. $fila["HORA"] . "',
	            velocidad:" . $fila["VELOCIDAD"]. ",
	            latitud:" . $fila["LATITUD"]. ",
	            longitud:" . $fila["LONGITUD"]. ",
                    bateria:" . $fila["BAT"]. ",
                    ign:" . $fila["IGN"]. ",
                    gsm:" . $fila["GSM"]. ",
                    gps2:" . $fila["GPS2"]. ",
                    taximetro:" . $fila["G2"]. "
	        }";
		    if ($i != count($resulset) - 1) {
		        $json .= ",";
		    }
		    $existVehiculos = true;
	    }
	}

	$json .="]}";

	$json = preg_replace("[\n|\r|\n\r]", "", $json);        

    $salida = "{success:true, string: ".json_encode($json)."}";

	if (!$existVehiculos) {
		$salida = "{failure:true}";
	}	
} else {
	$salida = "{failure:true}";
}

echo $salida;

function pointOnVertice($numVer, $verty, $vertx, $testy, $testx) {
    $c = false;
    for ($i=0, $j = $numVer-1; $i < $numVer; $j = $i++) { 
        if ((($vertx[$i] > $testx) != ($vertx[$j] > $testx)) 
            && ($testy < ($verty[$j] - $verty[$i])
            * ($testx - $vertx[$i])
            / ($vertx[$j] - $vertx[$i]) + $verty[$i])) {
            $c = !$c;
        }
    }
    return $c;
}
?>

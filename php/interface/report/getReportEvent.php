<?php

include ('../../../dll/config.php');
extract($_GET);

$existe = substr_count($listVeh, ',');
if ($existe > 0) {
    $VEHC = str_replace(",", "','", $listVeh);
} else {
    $VEHC = $listVeh;    
}



if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT V.PLACA, V.VEHICULO, R.LATITUD,R.LONGITUD,R.FECHA,R.HORA,R.VELOCIDAD,R.bateria,R.GSM,R.GPS,R.IGN,SE.sky_evento,R.DIRECCION
    FROM karviewhistoricodb.dato_spks R, karviewdb.sky_eventos SE, karviewdb.vehiculos V
    WHERE  V.ID_EQUIPO =R.ID_EQUIPO  
    AND  SE.id_sky_evento=R.id_sky_evento 
	AND R.ID_EQUIPO IN ('$VEHC')
	AND R.id_sky_evento IN ($listEvt)
    AND R.FECHA BETWEEN '$fechaIni' AND '$fechaFin'
	AND R.HORA >= '$horaIni'&& R.HORA <='$horaFin'
    ORDER BY V.VEHICULO;";
    
    $haveData= false;
    $result = $mysqli->query($consultaSql);
    if ($result->num_rows > 0) {
        $haveData=true;
        $objJson = "datos: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
            vehiculor:'". utf8_encode('VH:' . $myrow["PLACA"] . ' - ' .$myrow["VEHICULO"]) . "',
            latitudr:'" . $myrow["LATITUD"] . "',
            longitudr:'" . $myrow["LONGITUD"] . "',
            fecha_horar:'" . $myrow["FECHA"] . " ". $myrow["HORA"]."',            
            velocidadr:'" . $myrow["VELOCIDAD"] . "',
            bateriar:'". $myrow["bateria"] . "',
            gsmr:'". $myrow["GSM"] . "',
            gps2r:'". $myrow["GPS"] . "',                
            ignr:'". $myrow["IGN"] . "',
            evtr:'". utf8_encode($myrow["sky_evento"]) . "',
            direccionr:'". utf8_encode($myrow["DIRECCION"]) . "'
        },";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos'}";
    }
   $mysqli->close();
}
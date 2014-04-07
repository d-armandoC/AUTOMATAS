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
    $consultaSql = "SELECT V.PLACA, V.VEHICULO, R.LATITUD,R.LONGITUD,R.FECHA,R.HORA,R.VELOCIDAD,R.BAT,R.GSM,R.GPS2,R.IGN,SE.DESC_EVENTO,R.DIRECCION
    FROM RECORRIDOS R, SKY_EVENTOS SE, VEHICULOS V
    WHERE  V.ID_EQUIPO =R.ID_EQUIPO  
	AND SE.PARAMETRO =R.PARAMETRO 
	AND R.ID_EQUIPO IN ('$VEHC')
	AND R.PARAMETRO IN ($listEvt)
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
            bateriar:'". $myrow["BAT"] . "',
            gsmr:'". $myrow["GSM"] . "',
            gps2r:'". $myrow["GPS2"] . "',                
            ignr:'". $myrow["IGN"] . "',
            evtr:'". $myrow["DESC_EVENTO"] . "',
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
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
    WHERE R.ID_EQUIPO IN ('$VEHC')
    AND R.ID_EVENTO = SE.ID_EVENTO
    AND R.PARAMETRO = SE.PARAMETRO
    AND R.ID_EQUIPO = V.ID_EQUIPO
    AND R.ID_EVENTO IN (SELECT ID_EVENTO FROM SKY_EVENTOS WHERE ID_SKY_EVT IN ($listEvt))
    AND R.PARAMETRO IN (SELECT PARAMETRO FROM SKY_EVENTOS WHERE ID_SKY_EVT IN ($listEvt))
    AND CONCAT(R.FECHA,' ',R.HORA) BETWEEN CONCAT('$fechaIni',' ', '$horaIni') AND CONCAT('$fechaFin',' ', '$horaFin')
    ORDER BY R.FECHA, R.HORA";
    $haveData= false;
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $haveData=true;
        $objJson = "datos: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
            vehiculo:'". utf8_encode('VH:' . $fila["PLACA"] . ' - ' .$fila["VEHICULO"]) . "',
            latitud:'" . $fila["LATITUD"] . "',
            longitud:'" . $fila["LONGITUD"] . "',
            fecha_hora:'" . $fila["FECHA"] . " ". $fila["HORA"]."',            
            velocidad:'" . $fila["VELOCIDAD"] . "',
            bateria:'". $fila["BAT"] . "',
            gsm:'". $fila["GSM"] . "',
            gps2:'". $fila["GPS2"] . "',                
            ign:'". $fila["IGN"] . "',
            evt:'". $fila["DESC_EVENTO"] . "',
            direccion:'". utf8_encode($fila["DIRECCION"]) . "'
        },";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    
}
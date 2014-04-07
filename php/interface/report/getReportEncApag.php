<?php
require_once('../../../dll/conect.php');

extract($_GET);

$consultaSql = 
    "SELECT R.LATITUD,R.LONGITUD,R.FECHA,R.HORA,R.VELOCIDAD,R.BAT,R.GSM,R.GPS2,R.IGN,SE.DESC_EVENTO,R.DIRECCION
    FROM RECORRIDOS R, SKY_EVENTOS SE
    WHERE R.ID_EQUIPO = '$cbxVeh'
    AND R.ID_EVENTO = SE.ID_EVENTO
    AND R.PARAMETRO = SE.PARAMETRO
    AND R.ID_EVENTO = 7
    AND R.PARAMETRO IN (0, 1)
    AND CONCAT(R.FECHA,' ',R.HORA) BETWEEN CONCAT('$fechaIni',' ', '$horaIni') AND CONCAT('$fechaFin',' ', '$horaFin')
    ORDER BY R.FECHA, R.HORA"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{datos: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
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
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
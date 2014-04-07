<?php

include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$INI = $fechaIni . " " . $horaIni;
$FIN = $fechaFin . " " . $horaFin;

$existe = substr_count($listVeh, ',');

if ($existe > 0) {
    $VEHC = str_replace(",", "','", $listVeh);
} else {
    $VEHC = $listVeh;    
}

//CONSTANTES
$LIMITE_ODOM = "4000000000";
$KM_EQV = 1.852;
$TMP_REPORTE_PARADA = 10 * 60; //segundos
$EVT_PARADA = 12;

//Tiempo total
$tIni = strtotime($INI);
$tFin = strtotime($FIN);
$segTotal = $tFin - $tIni;

$sql = 
    "SELECT DISTINCT A.ID_EQUIPO, V.PLACA, V.VEHICULO, D.MINODOM, E.MAXODOM, MAXVELOCIDAD, NUMPARADAS, VELAVG
    FROM
        #consulta 1
        (SELECT ID_EQUIPO, MAX(VELOCIDAD) MAXVELOCIDAD
        FROM RECORRIDOS
        WHERE CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND  '$FIN'
        GROUP BY ID_EQUIPO
        HAVING ID_EQUIPO IN ('$VEHC')) AS A,

        #consulta 2
        (SELECT ID_EQUIPO, AVG(VELOCIDAD) VELAVG
        FROM RECORRIDOS
        WHERE CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND  '$FIN'
        AND VELOCIDAD > 0
        GROUP BY ID_EQUIPO
        HAVING ID_EQUIPO IN ('$VEHC')) AS B,

        #consulta 3
        (SELECT ID_EQUIPO, COUNT(DISTINCT ODOMETRO) NUMPARADAS
        FROM RECORRIDOS R, SKY_EVENTOS S
        WHERE CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND  '$FIN'
        AND S.ID_SKY_EVT = $EVT_PARADA
        AND R.ID_EVENTO = S.ID_EVENTO
        AND R.PARAMETRO = S.PARAMETRO
        GROUP BY ID_EQUIPO
        HAVING R.ID_EQUIPO IN ('$VEHC')) AS C,

        #consulta 4
        (SELECT RC4.ID_EQUIPO, RC4.ODOMETRO AS MINODOM
        FROM RECORRIDOS RC4,
            (SELECT R2.ID_EQUIPO, MIN(CONCAT(R2.FECHA, ' ',HORA)) AS FH
             FROM RECORRIDOS R2
             WHERE CONCAT(FECHA,' ',HORA) BETWEEN '$INI' AND  '$FIN'
             AND R2.ID_EQUIPO IN ('$VEHC')
             GROUP BY R2.ID_EQUIPO) AS R3        
        WHERE RC4.ID_EQUIPO = R3.ID_EQUIPO
        AND CONCAT(RC4.FECHA,' ',RC4.HORA) = R3.FH
        ORDER BY RC4.ID_EQUIPO) AS D,

        #consulta 5
        (SELECT RC5.ID_EQUIPO, RC5.ODOMETRO AS MAXODOM
        FROM RECORRIDOS RC5,
            (SELECT R2.ID_EQUIPO, MAX(CONCAT(R2.FECHA, ' ',HORA)) AS FH
            FROM RECORRIDOS R2
            WHERE CONCAT(R2.FECHA,' ',R2.HORA) BETWEEN '$INI' AND  '$FIN'
            AND R2.ID_EQUIPO IN ('$VEHC')
            GROUP BY R2.ID_EQUIPO) AS R3        
        WHERE RC5.ID_EQUIPO = R3.ID_EQUIPO
        AND CONCAT(RC5.FECHA,' ',RC5.HORA) = R3.FH
        ORDER BY RC5.ID_EQUIPO) AS E,
        VEHICULOS V 
    WHERE A.ID_EQUIPO = B.ID_EQUIPO
    AND B.ID_EQUIPO = C.ID_EQUIPO
    AND C.ID_EQUIPO = D.ID_EQUIPO
    AND D.ID_EQUIPO = E.ID_EQUIPO
    AND A.ID_EQUIPO = V.ID_EQUIPO";

consulta($sql);
$resulset = variasFilas();

$salida = "{failure:true, $sql}";
$datos = "";



$salida = '{datos: [';

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    $idEqp = $fila["ID_EQUIPO"];
    $placa = $fila["PLACA"];
    $veh = $fila["VEHICULO"];
    $odoMin = $fila["MINODOM"];
    $odoMax = $fila["MAXODOM"];
    $velAvg = $fila["VELAVG"];
    $velMax = $fila["MAXVELOCIDAD"];
    $numParadas = $fila["NUMPARADAS"];

    //## Calculo de Distancia
    $DIST = 0;
    if ($odoMin > $odoMax) {
        $DIST = ($LIMITE_ODOM - $odoMin) + $odoMax;
    } else {
        $DIST = $odoMax - $odoMin;
    }
    //Transformar a Km.
    $DIST = $DIST / 1000;
    $DIST = round($DIST * 100) / 100; //redondeo

    //Transformar Velocidades nudos a km
    $velAvg = $velAvg * $KM_EQV;
    $velMax = $velMax * $KM_EQV;

    $tiempoDetenido = $numParadas * $TMP_REPORTE_PARADA;
    $tiempoRodando = $segTotal - $tiempoDetenido;


    $porcRodando = ($tiempoRodando * 100)/$segTotal;
    $porcDetenido = 100 - $porcRodando;    

    $salida .="{
        vehiculo:'". utf8_encode($idEqp . ' - VH:' . $placa . ' - ' .$veh) . "',
        distancia:" .  $DIST . ",
        vel_max:" . round($velMax * 100) / 100 . ",
        vel_prom:" . round($velAvg * 100) / 100 . ",
        time_rodando: '" . segundosFormat($tiempoRodando) . "',
        time_detenido: '" . segundosFormat($tiempoDetenido) . "',
        paradas:" . $numParadas . ",
        percent_rodando:" . round($porcRodando * 100) / 100 . ",
        percent_detenido:" . round($porcDetenido * 100) / 100 . "
    }";

    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .= "]}";


echo $salida;

function segundosFormat($inSeg) {
    $h = (int) ($inSeg / 3600);
    $m = (int) ((($inSeg / 3600) - $h) * 60);
    $s = (int) ((((($inSeg / 3600) - $h) * 60) - $m) * 60);

    $time = "";
    $time = completarDosDigitos($h) . ":" .
            completarDosDigitos($m) . ":" .
            completarDosDigitos($s);
    return $time;
}

function completarDosDigitos($val){
    if ($val < 10) {
        return "0".$val;
    }
    return $val;
}
?>

<?php

extract($_POST);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

//    $consultaSql = "SELECT id_equipo,count(*) as totalVelocidad FROM recorridos where (((velocidad >='60'and velocidad<='90')and ((fecha between '$fechaIni' AND '$fechaFin')and (hora between '$horaIni' AND '$horaFin')))and id_empresa='$cbxEmpresasPan')group by id_equipo";
 $consultaSql = "SELECT id_equipo,count(*) as totalPanico FROM recorridos where (((parametro =1 or parametro=0)and ((fecha between '$fecha_Ini' AND '$fecha_Fin')and (hora between '$hora_Ini' AND '$hora_Fin')))and id_empresa='$empresa')group by id_equipo";


    $result = $mysqli->query($consultaSql);
    $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$empresa';";
//        $consultaSql1 = "SELECT id_equipo,count(*) as totalVelocidad FROM recorridos where (((velocidad >='60'and velocidad<='90')and ((fecha between '$fechaIni' AND '$fechaFin')and (hora between '$horaIni' AND '$horaFin')))and id_empresa='$cbxEmpresasPan')group by id_equipo";
    $result1 = $mysqli->query($consultaSql1);
    $myrow1 = $result1->fetch_assoc();
    $empresa = $myrow1['empresa'];
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByPanic : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
                    . "total:" . $myrow["totalPanico"]
//                    . "totalVelocidad:" . $myrow["totalVelocidad"] . "',"
//                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
//                    . "latitud: " . $myrow["latitud"] . ","
//                    . "longitud: " . $myrow["longitud"] . ","
//                    . "fecha_hora_reg:'" . $myrow["fecha_hora_reg"] . "',"
//                    . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
//                    . "velocidad:" . $myrow["velocidad"] . ","
//                    . "bat:" . $myrow["bat"] . ","
//                    . "gsm:" . $myrow["gsm"] . ","
//                    . "gps2:" . $myrow["gps2"] . ","
//                    . "ign:" . $myrow["ign"] . ","
//                    . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
//                    . "id_evento:" . $myrow["id_evento"] . ","
//                    . "parametro:" . $myrow["parametro"] . ","
//                    . "g1:" . $myrow["g1"] . ","
//                    . "g2:" . $myrow["g2"] . ","
//                    . "sal:" . $myrow["sal"]
                    . "},";
        }


        $objJson .="],comp:'" . $empresa . "',fi:'" . $fecha_Ini . "',ff:'" . $fecha_Fin . "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
        // echo "{success: true, $json }";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}

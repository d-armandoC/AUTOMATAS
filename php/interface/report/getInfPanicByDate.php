<?php

extract($_POST);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_equipo,latitud,longitud,fecha_hora_reg,fecha,hora,velocidad,bat,gsm,gps2,ign,direccion,id_evento,parametro,g1,g2,sal FROM recorridos where (((parametro =1)and ((fecha between '$fecha_Ini' AND '$fecha_Fin')and (hora between '$hora_Ini' AND '$hora_Fin')))and id_empresa='$empresa')order by id_equipo";


    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$empresa';";
        $result1 = $mysqli->query($consultaSql1);
        $myrow1 = $result1->fetch_assoc();
        $empresa = $myrow1['empresa'];
        
        $objJson = "infByPanico : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "fecha_hora_reg:'" . $myrow["fecha_hora_reg"] . "',"
                    . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                    . "velocidad:" . $myrow["velocidad"] . ","
                    . "bat:" . $myrow["bat"] . ","
                    . "gsm:" . $myrow["gsm"] . ","
                    . "gps2:" . $myrow["gps2"] . ","
                    . "ign:" . $myrow["ign"] . ","
                    . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                    . "id_evento:" . $myrow["id_evento"] . ","
                    . "parametro:" . $myrow["parametro"] . ","
                    . "g1:" . $myrow["g1"] . ","
                    . "g2:" . $myrow["g2"] . ","
                    . "sal:" . $myrow["sal"]
                    . "},";
        }
        $objJson .="],comp:'" . $empresa . "',fi:'" . $fecha_Ini . "',ff:'" . $fecha_Fin . "'";
//                $objJson .="],comp:'". $data . "',fi:'" . $fechaIni . "',ff:'" . $fechaFin . "'";

    }
    if ($haveData) {
        echo "{success: true,$objJson}";
// echo "{success: true, $json }";
    } else {
        echo "{failure: true, msg: 'NO hay Datos que mostrar'}";
    }

    $mysqli->close();
}
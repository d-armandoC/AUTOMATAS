<?php

extract($_POST);
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    
    if ($idCompanyExcesosDT == 1) {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total,sum(sk.velocidad) as tVel,(sum(sk.velocidad)/count(*))as proVel ,v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento in (12,21) and sk.fecha between '$fechaIniExcesos' and '$fechaFinExcesos' group by sk.id_equipo ";
        $result = $mysqli->query($consultaSql);
        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $json .= "{"
                        . "vehiculo: " . $myrow["id_equipo"] . ","
                        . "persona: '" . utf8_encode($myrow["persona"]) . "',"
                        . "empresa: '" . utf8_encode($myrow["empresa"]) . "',"
                        . "placa:' " . $myrow["placa"] . "',"
                        . "totalCant: " . $myrow["total"] . ","
                        . "totalVel: " . $myrow["tVel"] . ","
                        . "promedio: " . $myrow["proVel"] . ","
                        . "},";
            }
            $json .="]";
            $mysqli->close();

            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    } else {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total,sum(sk.velocidad) as tVel,(sum(sk.velocidad)/count(*))as proVel ,v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento in (12,21) and sk.fecha between '$fechaIniExcesos' and '$fechaFinExcesos' and v.id_empresa='$idCompanyExcesosDT' group by sk.id_equipo ";
        $result = $mysqli->query($consultaSql);
        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $json .= "{"
                        . "vehiculo: " . $myrow["id_equipo"] . ","
                        . "persona: '" . utf8_encode($myrow["persona"]) . "',"
                        . "empresa: '" . utf8_encode($myrow["empresa"]) . "',"
                        . "placa:' " . $myrow["placa"] . "',"
                        . "totalCant: " . $myrow["total"] . ","
                        . "totalVel: " . $myrow["tVel"] . ","
                        . "promedio: " . $myrow["proVel"] . ","
                        . "},";
            }
            $json .="]";
            $mysqli->close();

            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    }
}
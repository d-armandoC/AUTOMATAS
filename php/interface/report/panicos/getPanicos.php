<?php

include ('../../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($rb == 1) {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo  and v.id_empresa='$idCompanyPanico'and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and  sk.fecha between '$fechaIni' and '$fechaFin'  and sk.hora between '$horaIniPanico' and '$horaFinPanico' group by sk.id_equipo";
        $result = $mysqli->query($consultaSql);
        $mysqli->close();
        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $json .= "{"
                        . "empresaPanicos:'" . utf8_encode($myrow["empresa"]) . "',"
                        . "personaPanicos:'" . utf8_encode($myrow["persona"]) . "',"
                        . "idEquipoPanicos:" . $myrow["id_equipo"] . ","
                        . "placaPanicos:'" . $myrow["placa"] . "',"
                        . "cantidadPanicos:" . $myrow["total"] . ""
                        . "},";
            }
                $json .="]";
            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    } else if ($rb == 2) {
        $consultaSql1 = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where v.idid_vehiculo='$cbxVeh' and sk.id_equipo=v.id_equipo  and v.id_empresa='$idCompanyPanico'and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and  sk.fecha between '$fechaIni' and '$fechaFin'  and sk.hora between '$horaIniPanico' and '$horaFinPanico' group by sk.id_equipo";
        $result1 = $mysqli1->query($consultaSql1);
        $mysqli1->close();
        if ($result1->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result1->fetch_assoc()) {
                $json .= "{"
                        . "empresaPanicos:'" . utf8_encode($myrow["empresa"]) . "',"
                        . "personaPanicos:'" . utf8_encode($myrow["persona"]) . "',"
                        . "idEquipoPanicos:" . $myrow["id_equipo"] . ","
                        . "placaPanicos:'" . $myrow["placa"] . "',"
                        . "cantidadPanicos:" . $myrow["total"] . ""
                        . "},";
            }
            $json .="]";
            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    }
}
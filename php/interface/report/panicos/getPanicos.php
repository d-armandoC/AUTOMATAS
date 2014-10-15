<?php

include ('../../../../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($idCompany == 1) {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento='2' and sk.fecha between ? and ? and sk.hora between '$horaIniPanico' and '$horaFinPanico' group by sk.id_equipo ";
        $stmt = $mysqli->prepare($consultaSql);
        if ($stmt) {
            /* ligar parámetros para marcadores */
            $stmt->bind_param("ss", $fechaIni, $fechaFin);
            /* ejecutar la consulta */
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            $mysqli->close();
            if ($result->num_rows > 0) {
                $isFirst = false;
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
                echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.....................'}";
            }
        } else {
            echo "{failure: true, message: 'Problemas en la Construcción de la Consulta.'}";
        }
    } else {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento ='2' and v.id_empresa=? and sk.fecha between ? and ? and sk.hora between '$horaIniPanico' and '$horaFinPanico' group by sk.id_equipo ";
        $stmt = $mysqli->prepare($consultaSql);

        if ($stmt) {
            /* ligar parámetros para marcadores */
            $stmt->bind_param("iss", $idCompany, $fechaIni, $fechaFin);
            /* ejecutar la consulta */
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            $mysqli->close();
            if ($result->num_rows > 0) {
                $isFirst = false;
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
        } else {
            echo "{failure: true, message: 'Problemas en la Construcción de la Consulta.'}";
        }
    }
}
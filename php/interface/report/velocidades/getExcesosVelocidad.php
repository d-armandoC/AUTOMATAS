<?php

include ('../../../../dll/config.php');

extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($idCompanyExcesos == 1) {
        $consultaSql = "SELECT e.empresa,concat(p.apellidos,' ',p.nombres)as persona, v.reg_municipal,v.placa,ev.fecha,ev.cantidad,ev.velocidad_maxima FROM kbushistoricodb.exceso_velocidades ev, kbusdb.vehiculos v,kbusdb.personas p,kbusdb.empresas e where ev.id_vehiculo=v.id_vehiculo and v.id_persona=p.id_persona and  v.id_empresa=e.id_empresa and ev.fecha between ? and ?";
        $stmt = $mysqli->prepare($consultaSql);
        if ($stmt) {
            /* ligar parámetros para marcadores */
            $stmt->bind_param("ss", $fechaIniExcesos, $fechaFinExcesos);
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
                            . "empresaExceso:'" . utf8_encode($myrow["empresa"]) . "',"
                            . "personaExceso:'" . utf8_encode($myrow["persona"]) . "',"
                            . "regMunicipalExceso:'" . $myrow["reg_municipal"] . "',"
                            . "placaExceso:'" . $myrow["placa"] . "',"
                            . "fechaExceso:'" . $myrow["fecha"] . "',"
                            . "cantidadExceso:" . $myrow["cantidad"] . ","
                            . "velocidadMaximaExceso:" . $myrow["velocidad_maxima"] . ""
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
    } else {
        $consultaSql = "SELECT e.empresa,concat(p.apellidos,' ',p.nombres)as persona, v.reg_municipal,v.placa,ev.fecha,ev.cantidad,ev.velocidad_maxima FROM kbushistoricodb.exceso_velocidades ev, kbusdb.vehiculos v,kbusdb.personas p ,kbusdb.empresas e where ev.id_vehiculo=v.id_vehiculo and v.id_persona=p.id_persona and v.id_empresa=e.id_empresa and v.id_empresa = ? and ev.fecha between ? and ?";
        $stmt = $mysqli->prepare($consultaSql);

        if ($stmt) {
            /* ligar parámetros para marcadores */
            $stmt->bind_param("iss", $idCompanyExcesos, $fechaIniExcesos, $fechaFinExcesos);
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
                            . "empresaExceso:'" . utf8_encode($myrow["empresa"]) . "',"
                            . "personaExceso:'" . utf8_encode($myrow["persona"]) . "',"
                            . "regMunicipalExceso:'" . $myrow["reg_municipal"] . "',"
                            . "placaExceso:'" . $myrow["placa"] . "',"
                            . "fechaExceso:'" . $myrow["fecha"] . "',"
                            . "cantidadExceso:" . $myrow["cantidad"] . ","
                            . "velocidadMaximaExceso:" . $myrow["velocidad_maxima"] . ""
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
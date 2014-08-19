<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($idCompanyExcesos == 1) {
        $consultaSql = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento in (12,21) and sk.fecha between ? and ? group by sk.id_equipo ";
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
                            . "idEquipoExceso:" . $myrow["id_equipo"] . ","
                            . "placaExceso:'" . $myrow["placa"] . "',"
                            . "cantidadExceso:" . $myrow["total"] . ""
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
        $consultaSql = "SELECT sk.id_equipo,count(*) as total, v.placa,e.empresa,  concat(p.nombres,' ', p.apellidos)as persona FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.empresas e,karviewdb.personas p where sk.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and v.id_persona=p.id_persona and sk.id_sky_evento in (12,21) and v.id_empresa=? and sk.fecha between ? and ? group by sk.id_equipo ";
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
                            . "idEquipoExceso:" . $myrow["id_equipo"] . ","
                            . "placaExceso:'" . $myrow["placa"] . "',"
                            . "cantidadExceso:" . $myrow["total"] . ""
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
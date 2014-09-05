<?php

extract($_POST);
extract($_GET);
include ('../../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT eq.equipo, emp.empresa, vh.placa, skp.velocidad, skp.fecha,skp.hora , skev.sky_evento  "
            . "FROM karviewhistoricodb.dato_spks skp, karviewdb.equipos eq, karviewdb.empresas emp, karviewdb.vehiculos vh, karviewdb.sky_eventos skev   "
            . "where skp.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa and skp.id_sky_evento= skev.id_sky_evento and skp.fecha between '2014-01-03' and '2014-07-30'and skp.id_sky_evento=21 ;";
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("issss", $idCompanyExcesos, $fechaIni, $fechaFin, $horaST, $horaFI);
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
                        . "personaExc:'" . utf8_encode($myrow["persona"]) . "',"
                        . "placaExc:'" . $myrow["placa"] . "',"
                        . "idEquipoExc:'" . $myrow["id_equipo"] . "',"
                        . "equipoExc:'" . $myrow["equipo"] . "',"
                        . "totalExc:'" . $myrow["total"] . "'"
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
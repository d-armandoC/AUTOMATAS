<?php

extract($_GET);
include ('../../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT concat(p.nombres,' ', p.apellidos)as persona, v.placa, sk.id_equipo, e.equipo, count(*) as total
FROM karviewdb.vehiculos v , karviewdb.personas p,karviewdb.equipos e, karviewhistoricodb.dato_spks  sk 
where v.id_empresa=? and v.id_persona=p.id_persona and v.id_equipo=e.id_equipo and  sk.id_sky_evento in(8,9)
 and v.id_equipo=sk.id_equipo and sk.fecha between ? and ? and sk.hora between ? and ? group by v.id_vehiculo";
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("issss", $idCompanyExcesos, $fechaIni, $fechaFin, $horaIni, $horaFin);
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
                        . "personaEA:'" . utf8_encode($myrow["persona"]) . "',"
                        . "placaEA:'" . $myrow["placa"] . "',"
                        . "idEquipoEA:'" . $myrow["id_equipo"] . "',"
                        . "equipoEA:'" . $myrow["equipo"] . "',"
                        . "totalEA:'" . $myrow["total"] . "'"
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
<?php

extract($_POST);
extract($_GET);
include ('../../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT  concat(p.nombres,' ', p.apellidos)as persona, v.placa, sk.id_equipo, e.equipo, count(*) as total 
        FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.personas p, karviewdb.equipos e
        where sk.id_equipo=v.id_equipo=e.id_equipo and sk.id_sky_evento=21 and v.id_persona=p.id_persona and v.id_empresa=? 
        and sk.fecha between ? and ? and sk.hora between ? and ? ";
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
                        . "personaE:'" . utf8_encode($myrow["persona"]) . "',"
                        . "placaE:'" . $myrow["placa"] . "',"
                        . "idEquipoE:'" . $myrow["id_equipo"] . "',"
                        . "equipoE:'" . $myrow["equipo"] . "',"
                        . "totalE:'" . $myrow["total"] . "'"
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
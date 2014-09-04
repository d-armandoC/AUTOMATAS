<?php

include ('../../../../dll/config.php');


extract($_GET);


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $consultaSql = "SELECT e.empresa,v.reg_municipal,s.velocidad,s.fecha_hora_reg, k.sky_evento as evento, s.latitud,s.longitud,p.punto FROM kbushistoricodb.dato_skps s ,kbusdb.vehiculos v ,kbusdb.empresas e ,kbusdb.sky_eventos k,kbusdb.puntos p where s.id_equipo=v.id_Equipo and v.id_empresa=e.id_empresa and s.id_sky_evento in (12,21) and s.id_punto=p.id_punto and s.id_sky_evento=k.id_sky_evento and s.fecha between '$fechaIni' and '$fechaFin' and v.reg_municipal=' $regMunicipal' order by s.fecha_hora_reg DESC";
    $consultaSql1 = "SELECT e.empresa,v.reg_municipal,s.velocidad,s.fecha_hora_reg, k.descripcion_encabezado as evento, s.latitud,s.longitud,p.punto  FROM kbushistoricodb.dato_fastracks s ,kbusdb.vehiculos v ,kbusdb.empresas e ,kbusdb.encabezados k,kbusdb.puntos p where s.id_equipo=v.id_Equipo and v.id_empresa=e.id_empresa   and s.id_encabezado ='5'  and s.id_encabezado=k.id_encabezado and s.id_punto=p.id_punto and s.fecha between '$fechaIni' and '$fechaFin' and v.reg_municipal='$regMunicipal' order by s.fecha_hora_reg DESC";
    $result = $mysqli->query($consultaSql);
    $result1 = $mysqli->query($consultaSql1);

    $mysqli->close();

    if (($result->num_rows > 0) || ($result1->num_rows > 0)) {

        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {

            $json .= "{"
                    . "reg_municipal: '" . $myrow["reg_municipal"] . "',"
                    . "fecha: '" . $myrow["fecha_hora_reg"] . "',"
                    . "empresa: '" . utf8_encode($myrow["empresa"] ). "',"
                    . "evento:' " .utf8_encode( $myrow["evento"] ). "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "punto: '" . utf8_encode($myrow["punto"]) . "',"
                    . "velocidad: " . $myrow["velocidad"] . ","
                    . "},";
        }
        while ($myrow = $result1->fetch_assoc()) {

            $json .= "{"
                    . "reg_municipal: '" . $myrow["reg_municipal"] . "',"
                    . "fecha: '" . $myrow["fecha_hora_reg"] . "',"
                    . "empresa: '" . $myrow["empresa"] . "',"
                    . "evento:' " . $myrow["evento"] . "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "punto: '" . $myrow["punto"] . "',"
                    . "velocidad: " . $myrow["velocidad"] . ","
                    . "},";
        }

        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
}
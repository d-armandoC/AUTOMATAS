<?php
extract($_POST);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select COUNT(*) AS c from vehiculos v, equipos e, tipo_equipos te 
                   where v.id_equipo = e.id_equipo and te.id_tipo_equipo = e.id_tipo_equipo 
                   and v.id_empresa = '$cbxEmpresasPan' and e.id_tipo_equipo = 3";
    $result1 = $mysqli->query($consultaSql);
    $myrow1 = $result1->fetch_assoc();

    if ($myrow1["c"] > 0) {
        $consultaSql = "select df.id_equipo, eq.equipo, df.latitud, df.longitud,df.fecha, df.hora, df.fecha_hora_registro, df.velocidad, 
            df.id_encabezado, df.id_estado_mecanico, d.display,  d.descripcion, df.direccion
            from ktaxyhistoricodb.dato_fastracks df, encabezado_fastracks ef, displays d, equipos eq, vehiculos v
            where df.id_encabezado = ef.id_encabezado_fastrack and  df.id_display = d.id_display
            and df.id_equipo = eq.id_equipo and eq.id_equipo = v.id_equipo
            and (((df.id_encabezado = 7)and ((df.fecha between '$fechaIni' AND '$fechaFin')
            and (df.hora between '$horaIni' AND '$horaFin')))and v.id_empresa='$cbxEmpresasPan') order by df.id_equipo";
    } else {
        //$consultaSql = "select COUNT(*) AS c from vehiculos where id_equipo = '$cbxVeh' and id_tipo_equipo = 4";
        $consultaSql = "select COUNT(*) AS c from vehiculos v, equipos e, tipo_equipos te 
                   where v.id_equipo = e.id_equipo and te.id_tipo_equipo = e.id_tipo_equipo 
                   and v.id_empresa = '$cbxEmpresasPan' and e.id_tipo_equipo = 1";
        $result1 = $mysqli->query($consultaSql);
        $myrow2 = $result1->fetch_assoc();
        if ($myrow2["c"] > 0) {
            $consultaSql = "select ds.id_equipo, eq.equipo, ds.latitud, ds.longitud, ds.fecha, ds.hora, ds.fecha_hora_registro, ds.velocidad, 
            ds.bateria, ds.gsm, ds.gps, ds.ign, ds.direccion, se.sky_evento, ds.id_sky_evento, se.parametro, 
            ds.g1, ds.g2, ds.sal
            from ktaxyhistoricodb.dato_skps ds, sky_eventos se, equipos eq, vehiculos v
            where ds.id_sky_evento = se.id_sky_evento and ds.id_equipo = eq.id_equipo
            and eq.id_equipo = v.id_equipo
            and (((ds.gsm = 0)and ((ds.fecha between '$fechaIni' AND '$fechaFin')
            and (ds.hora between '$horaIni' AND '$horaFin')))and v.id_empresa='$cbxEmpresasPan') order by ds.id_equipo";
        } 
    }

    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$cbxEmpresasPan'";
        $result1 = $mysqli->query($consultaSql1);
        $myrow3 = $result1->fetch_assoc();
        $cbxEmpresasPan = $myrow3['empresa'];


        $objJson = "countByVelocidad1 : [";

        while ($myrow = $result->fetch_assoc()) {
            if ($myrow1["c"] > 0) {
                $objJson .= "{"
                        . "id_equipo:'" . $myrow["equipo"] . "',"
                        . "latitud: " . $myrow["latitud"] . ","
                        . "longitud: " . $myrow["longitud"] . ","
                        . "fecha_hora_reg:'" . $myrow["fecha_hora_registro"] . "',"
                        . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                        . "velocidad:" . $myrow["velocidad"] . ","
                        . "bat: -1,"
                        . "gsm: -1,"
                        . "gps2:-1,"
                        . "ign: -1,"
                        . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                        . "evento:'" . utf8_encode($myrow["descripcion"]) . "',"
                        . "id_evento: -1,"
                        . "parametro: -1,"
                        . "g1: -1,"
                        . "g2: -1,"
                        . "sal: -1"
                        . "},";
            } else {
                if ($myrow2["c"] > 0) {
                    $objJson .= "{"
                            . "id_equipo:'" . $myrow["equipo"] . "',"
                            . "latitud: " . $myrow["latitud"] . ","
                            . "longitud: " . $myrow["longitud"] . ","
                            . "fecha_hora_reg:'" . $myrow["fecha_hora_registro"] . "',"
                            . "fecha_hora:'" . $myrow["fecha"] . " " . $myrow["hora"] . "',"
                            . "velocidad:" . $myrow["velocidad"] . ","
                            . "bat:" . $myrow["bateria"] . ","
                            . "gsm:" . $myrow["gsm"] . ","
                            . "gps2:" . $myrow["gps"] . ","
                            . "ign:" . $myrow["ign"] . ","
                            . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                            . "evento:'" . utf8_encode($myrow["sky_evento"]) . "',"
                            . "id_evento:" . $myrow["id_sky_evento"] . ","
                            . "parametro:" . $myrow["parametro"] . ","
                            . "g1:" . $myrow["g1"] . ","
                            . "g2:" . $myrow["g2"] . ","
                            . "sal:" . $myrow["sal"]
                            . "},";
                } 
            }
        }
        $objJson .="],comp:'" . $cbxEmpresasPan . "',fi:'" . $fechaIni . "',ff:'" . $fechaFin . "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
// echo "{success: true, $json }";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
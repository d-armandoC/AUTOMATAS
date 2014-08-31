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
        $consultaSql = "select distinct df.id_equipo, eq.equipo, (select count(df2.id_equipo) from ktaxyhistoricodb.dato_fastracks df2 where df2.id_equipo = df.id_equipo and df2.id_encabezado =7) as totalPerdidasGSM
            from ktaxyhistoricodb.dato_fastracks df, encabezado_fastracks ef, displays d, equipos eq, vehiculos v
            where df.id_encabezado = ef.id_encabezado_fastrack and  df.id_display = d.id_display
            and df.id_equipo = eq.id_equipo and eq.id_equipo = v.id_equipo
            and (((df.id_encabezado = 7)and ((df.fecha between '$fechaIni' AND '$fechaFin')
            and (df.hora between '$horaIni' AND '$horaFin')))and v.id_empresa=$cbxEmpresasPan) order by df.id_equipo";
    } else {
        $consultaSql = "select COUNT(*) AS c from vehiculos v, equipos e, tipo_equipos te 
                   where v.id_equipo = e.id_equipo and te.id_tipo_equipo = e.id_tipo_equipo 
                   and v.id_empresa = '$cbxEmpresasPan' and e.id_tipo_equipo = 1";
        $result1 = $mysqli->query($consultaSql);
        $myrow1 = $result1->fetch_assoc();
        if ($myrow1["c"] > 0) {
            $consultaSql = "select distinct ds.id_equipo, eq.equipo, (select count(ds2.id_equipo) from ktaxyhistoricodb.dato_skps ds2 where ds2.id_equipo = ds.id_equipo and ds2.gsm=0 ) as totalPerdidasGSM
            from ktaxyhistoricodb.dato_skps ds, sky_eventos se, equipos eq, vehiculos v
            where ds.id_sky_evento = se.id_sky_evento and ds.id_equipo = eq.id_equipo
            and eq.id_equipo = v.id_equipo
            and (((ds.gsm = 0)and ((ds.fecha between '$fechaIni' AND '$fechaFin')
            and (ds.hora between '$horaIni' AND '$horaFin')))and v.id_empresa='$cbxEmpresasPan') order by ds.id_equipo";
        } 
    }
    $result = $mysqli->query($consultaSql);
    $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$cbxEmpresasPan'";
//        $consultaSql1 = "SELECT id_equipo,count(*) as totalVelocidad FROM recorridos where (((velocidad >='60'and velocidad<='90')and ((fecha between '$fechaIni' AND '$fechaFin')and (hora between '$horaIni' AND '$horaFin')))and id_empresa='$cbxEmpresasPan')group by id_equipo";
    $result2 = $mysqli->query($consultaSql1);
    $myrow2 = $result2->fetch_assoc();
    $cbxEmpresasPan = $myrow2['empresa'];
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByVelocidad : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["equipo"] . "',"
                    . "total:" . $myrow["totalPerdidasGSM"]
                    . "},";
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


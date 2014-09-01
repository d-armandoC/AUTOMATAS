<?php
extract($_POST);
//cbxEmpresasPan:2
//fechaIni:2013-10-27
//fechaFin:2014-08-31
//horaIni:00:01
//horaFin:23:59
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $consultaSql = "select COUNT(*) AS c from vehiculos v, equipos e, tipo_equipos te 
                   where v.id_equipo = e.id_equipo and te.id_tipo_equipo = e.id_tipo_equipo 
                   and v.id_empresa = '$cbxEmpresasPan'";
    $result1 = $mysqli->query($consultaSql);
    $myrow1 = $result1->fetch_assoc();
 
        if ($myrow1["c"] > 0) {
            $consultaSql = "select distinct ds.id_equipo, eq.equipo, (select count(ds2.id_equipo) from karviewhistoricodb.dato_spks ds2 where ds2.id_equipo = ds.id_equipo and ds2.gsm=0 ) as totalPerdidasGSM
            from karviewhistoricodb.dato_spks ds, sky_eventos se, equipos eq, vehiculos v
            where ds.id_sky_evento = se.id_sky_evento and ds.id_equipo = eq.id_equipo
            and eq.id_equipo = v.id_equipo
            and (((ds.gsm = 0)and ((ds.fecha between '$fechaIni' AND '$fechaFin')
            and (ds.hora between '$horaIni' AND '$horaFin')))and v.id_empresa='$cbxEmpresasPan') order by ds.id_equipo";
        } 
    
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countBygsm : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["equipo"] . "',"
                    . "total:" . $myrow["totalPerdidasGSM"]
                    . "},";
        }


        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos en estas Fechas'}";
    }

    $mysqli->close();
}


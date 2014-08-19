<?php

extract($_POST);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "select ds.id_equipo, count(*) as cantidadExcesos  from karviewhistoricodb.dato_spks ds, karviewdb.sky_eventos sky , karviewdb.vehiculos v where ds.id_equipo=v.id_equipo and ds.id_sky_evento=sky.id_sky_evento and v.id_empresa='1' and (ds.id_sky_evento='12' || ds.id_sky_evento='21') and ((ds.fecha between '2014-07-30' AND '2014-07-30')and (ds.hora between '00:00:00' AND '10:47:27'))group by id_equipo;";
    //select ds.id_equipo, sky.sky_evento, count(*) as cantidadExcesos  from karviewhistoricodb.dato_spks ds, karviewdb.sky_eventos sky , karviewdb.vehiculos v where ds.id_equipo=v.id_equipo and ds.id_sky_evento=sky.id_sky_evento and v.id_empresa='$cbxEmpresasPan' and (ds.id_sky_evento='12' || ds.id_sky_evento='21') and ((ds.fecha between '2014-07-30' AND '2014-07-30')and (ds.hora between '00:00:00' AND '10:47:27'))group by id_equipo;
    $result = $mysqli->query($consultaSql);
    $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='1';";
    $result1 = $mysqli->query($consultaSql1);
    $myrow1 = $result1->fetch_assoc();
    $cbxEmpresasPan = $myrow1['empresa'];
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByVelocidad : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:" . $myrow["id_equipo"] . ","
                    . "total:'" . $myrow["cantidadExcesos"]
                    . "'},";
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

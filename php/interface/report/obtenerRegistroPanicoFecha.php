<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_POST);
    $consultaSql = "SELECT s.id_equipo,count(*) as total FROM karviewhistoricodb.dato_spks s,karviewdb.vehiculos v,karviewdb.sky_eventos ev where s.id_equipo=v.id_equipo  and s.id_sky_evento=ev.id_sky_evento and s.id_sky_evento=2 and v.id_empresa='$empresa' and ((s.fecha between '$fecha_Ini' AND '$fecha_Fin')and (s.hora between '$hora_Ini' AND '$hora_Fin'))  group by s.id_equipo;";
    $result = $mysqli->query($consultaSql);
    $consultaSql1 = "SELECT empresa FROM empresas where id_empresa=1;";
    $result1 = $mysqli->query($consultaSql1);
    $myrow1 = $result1->fetch_assoc();
    $empresa = $myrow1['empresa'];
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByPanic : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
                    . "total:" . $myrow["total"]
                    . "},";
        }
        $objJson .="],comp:'" . $empresa . "',fi:'".$fecha_Ini. "',ff:'" .$fecha_Fin . "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos que Mostrar'}";
    }

    $mysqli->close();
}

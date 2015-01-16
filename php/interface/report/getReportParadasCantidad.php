<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    if($rb5==1){
    $consultaSql="SELECT emp.id_empresa,v.id_vehiculo,emp.empresa ,eq.equipo, V.placa, V.vehiculo, skp.IGN,SE.sky_evento, count(*) totalEventos
    FROM karviewhistoricodb.dato_spks skp, karviewdb.sky_eventos SE, karviewdb.vehiculos v, karviewdb.equipos eq, karviewdb.empresas emp
    WHERE  skp.ID_EQUIPO  =V.ID_EQUIPO and eq.id_equipo=v.id_equipo and v.id_empresa=emp.id_empresa and skp.id_sky_evento=SE.id_sky_evento and v.id_empresa='$idempresaparada'
    and (skp.fecha between '$fechaIniParadas' and '$fechaFinParadas') and (skp.hora between '$horaIniParadas' and '$horaFinParadas') and SE.id_sky_evento= 12  group by skp.id_equipo";   
    }else if($rb5==2){
    $consultaSql ="SELECT emp.id_empresa,v.id_vehiculo,emp.empresa ,eq.equipo, V.placa, V.vehiculo, skp.IGN,SE.sky_evento, count(*) totalEventos
    FROM karviewhistoricodb.dato_spks skp, karviewdb.sky_eventos SE, karviewdb.vehiculos v, karviewdb.equipos eq, karviewdb.empresas emp
    WHERE  skp.ID_EQUIPO  =V.ID_EQUIPO and eq.id_equipo=v.id_equipo and v.id_empresa=emp.id_empresa and skp.id_sky_evento=SE.id_sky_evento and v.id_Vehiculo='$cbxVeh'
   and (skp.fecha between '$fechaIniParadas' and '$fechaFinParadas') and (skp.hora between '$horaIniParadas' and '$horaFinParadas') and SE.id_sky_evento= 12  group by skp.id_equipo";
    }
    
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    $empresa=" ";
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByParadas : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_vehiculo:".$myrow["id_vehiculo"].","
                    . "id_empresa:".$myrow["id_empresa"].","
                    . "empresa:'" . $myrow["empresa"] . "',"
                    . "vehiculo:'" . $myrow["vehiculo"] . "',"
                    . "equipo:'".$myrow["equipo"]."',"
                    . "placa:'" . $myrow["placa"] . "',"
                    . "totalEventos:".$myrow["totalEventos"]
                    . "},";
        }
        $objJson .="],";
    }

    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
}
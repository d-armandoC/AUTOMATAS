<?php

extract($_POST);
include ('../../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT  emp.empresa,concat(p.nombres,' ', p.apellidos)as persona, v.placa, sk.id_equipo, e.equipo ,count(*) as total
        FROM karviewdb.vehiculos v ,karviewdb.empresas emp , karviewdb.personas p,karviewdb.equipos e, 
	karviewhistoricodb.dato_spks  sk 
        where    v.id_empresa=emp.id_empresa and v.id_persona=p.id_persona and v.id_equipo=e.id_equipo and  
        sk.id_sky_evento in(6,7) and v.id_equipo=sk.id_equipo and sk.fecha between '$fechaIniEnerg' and '$fechaFinEnerg'
        group by v.id_vehiculo";
    
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                        . "empresaEneDes:'" . utf8_encode($myrow["empresa"]) . "',"
                        . "personaEneDes:'" . utf8_encode($myrow["persona"]) . "',"
                        . "placaEneDes:'" . $myrow["placa"] . "',"
                        . "idEquipoEneDes:'" . $myrow["id_equipo"] . "',"
                        . "equipoEneDes:'" . $myrow["equipo"] . "',"
                        . "totalEneDes:'" . $myrow["total"] . "'"
                    . "},";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos quee mostrar'}";
    }
    $mysqli->close();
}
<?php

extract($_POST);
include ('../../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure: true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT  concat(p.nombres,' ', p.apellidos)as persona, v.placa, sk.id_equipo, e.equipo, count(*) as total 
        FROM karviewhistoricodb.dato_spks  sk,karviewdb.vehiculos v ,karviewdb.personas p, karviewdb.equipos e
        where sk.id_equipo=v.id_equipo=e.id_equipo and v.id_persona=p.id_persona and v.id_empresa='$idCompanyExcesos' 
        and sk.velocidad between '" . $limiST . "' and '" . $limiFI . "' and sk.fecha between '$fechaIni' and '$fechaFin' group by sk.id_equipo";

    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "personaExceso:'" . utf8_encode($myrow["persona"]) . "',"
                    . "placaExceso:'" . $myrow["placa"] . "',"
                    . "idEquipoExceso:'" . $myrow["id_equipo"] . "',"
                    . "equipoExceso:'" . $myrow["equipo"] . "',"
                    . "total:'" . $myrow["total"] . "'"
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

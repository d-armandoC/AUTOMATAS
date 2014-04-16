<?php

/* DATOS DE MI APLICACION */
$site_title = "Kradac: Karview";
$site_icon = "img/icon_karview.png";

function getConectionDb() {
    /* DATOS DE MI SERVIDOR */
    $db_name = "karviewdb";
    $db_host = "172.16.17.214";
    $db_user = "kradacLoja";
    $db_password = "kradac";

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli->connect_errno) {
        echo "{failure: true, msg: 'Falló la conexión con MySQL: (" . $mysqli->connect_errno . ")ç " . $mysqli->connect_error . "'}";
    } else {
        return ($mysqli->connect_errno) ? false : $mysqli;
    }
}


function allRows($result) {
    $vector = null;
    $pos = 0;

    while ($myrow = $result->fetch_row()) {
        $fila = "";
        for ($i = 0; $i < count($myrow); $i++) {
            $infoCampo = $result->fetch_field_direct($i);
            $fila[$infoCampo->name] = $myrow[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

/*
 * Example of use for allRows

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "select * from report where state = 0";

    $result = allRows($mysqli->query($consultaSql));
    $mysqli->close();
    
    for ($i = 0; $i < count($result); $i++) {
        $fila = $result[$i];
        echo $fila["id_report"]. "\n";
    }
    
}*/
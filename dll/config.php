<?php

/* DATOS DE MI APLICACION */
$site_title = "Kradac: Karview";
$site_icon = "img/icon_karview.png";

function getConectionDb() {
    /* DATOS DE MI SERVIDOR */
    $db_name = "karviewdb";
    $db_host = "localhost";
    $db_user = "diego";
    $db_password = "diego";

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    if ($mysqli->connect_errno) {
        echo "{failure: true, msg: 'Falló la conexión con MySQL: (" . $mysqli->connect_errno . ")ç " . $mysqli->connect_error . "'}";
    } else {
        return ($mysqli->connect_errno) ? false : $mysqli;
    }
}

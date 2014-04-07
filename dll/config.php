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

    @$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    return ($mysqli->connect_errno) ? false : $mysqli;
}

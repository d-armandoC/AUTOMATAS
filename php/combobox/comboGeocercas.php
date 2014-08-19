<?php

include('../login/isLogin.php');
include ('../../dll/config.php');
extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $userKarview = $_SESSION["USERKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 1) {
        $consultaSql = "select id_geocerca, geocerca FROM GEOCERCAS";
    } else {
        $consultaSql = "SELECT ID_GEOCERCA, geocerca
    FROM GEOCERCAS WHERE ID_EMPRESA = '$idEmpresa'";
    }
    $haveData = false;
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "adminGeo: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
             'id':" . $myrow["id_geocerca"] . ",
            'text':'" . utf8_encode($myrow["geocerca"]) . "'
        },";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }
}
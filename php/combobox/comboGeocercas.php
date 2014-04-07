<?php

include('../login/isLogin.php');
include ('../../dll/config.php');
extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT ID_GEOCERCA, NOMBRE_GEOC
    FROM GEOCERCAS WHERE ID_EMPRESA = '$cbxEmpresas'";
   $haveData= false;
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $haveData=true;
        $objJson = "adminGeo: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
             'id':'" . $myrow["ID_GEOCERCA"] . "',
            'nombre':'" . utf8_encode($myrow["NOMBRE_GEOC"]) . "'
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
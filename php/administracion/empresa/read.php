<?php

extract($_POST);

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT e.id_empresa,e.acronimo,e.empresa,e.direccion,e.telefono,e.correo
    FROM empresas e ";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "empresas : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_empresa:" . $myrow["id_empresa"] . ","
                    . "acronimo:'" . $myrow["acronimo"] . "',"
                    . "empresa:'" . utf8_encode($myrow["empresa"]) . "',"
                    . "direccion:'" . $myrow["direccion"] . "',"
                    . "telefono:'" . $myrow["telefono"] . "',"
                    . "correo:'" . $myrow["correo"] . "',"
                    . "},";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
// echo "{success: true, $json }";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
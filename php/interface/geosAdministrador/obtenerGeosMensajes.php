<?php
include('../../login/isLogin.php');
require_once('../../../dll/config.php');
extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $queryMail = "select estado from karviewdb.envio_geo_correos where id_persona = $idPerson and id_geocerca = $idGeos";
    $resultMail = $mysqli->query($queryMail);
    $mysqli->close();

    if ($resultMail->num_rows > 0) {
        $objJson = "{data: [";
        if ($resultMail->num_rows == 1) {
            while ($myrow = $resultMail->fetch_assoc()) {
                if ($myrow["estado"] == 1) {
                    $objJson .= "{estado: 'Entrada', state: false}, {estado: 'Salida', state: true},";
                } else {
                    $objJson .= "{estado: 'Entrada', state: true}, {estado: 'Salida', state: false},";
                }
            }
        } else {
            $objJson .= "{estado: 'Entrada', state: true}, {estado: 'Salida', state: true},";
        }

        $objJson .="]}";
    } else {
        $objJson = "{data: [{estado: 'Entrada', state: false}, "
                . "{estado: 'Salida', state: false}";
        $objJson .="]}";
    }
    echo $objJson;
}
<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $queryEvents = "select parametro, desc_evento from sky_eventos";

    $queryMail = "select id_persona, parametro, id_empresa "
            . "from send_mail where id_persona = $idPerson "
            . "and id_equipo = -1 and id_empresa = '$cbxEmpresas'"
    ;

    $resultEvents = $mysqli->query($queryEvents);
    $resultMail = $mysqli->query($queryMail);

    if ($resultMail->num_rows > 0) {
        $objJson = "{mails: [";
        $exist = false;
        while ($myrow = $resultEvents->fetch_assoc()) {
            $resultMail = $mysqli->query($queryMail);
            while ($myrow2 = $resultMail->fetch_assoc()) {
                if ($myrow["parametro"] == $myrow2["parametro"]) {
                    $objJson .= "{idEmpresa: '".$myrow2["id_empresa"]."', parametro: ".$myrow["parametro"].", event: '" . utf8_encode($myrow["desc_evento"]) . "',"
                            . "state: true},";
                    $exist = true;
                    break;
                } else {
                    $exist = false;
                }
            }
            if (!$exist) {
                $objJson .= "{idEmpresa: '".$myrow2["id_empresa"]."', parametro: ".$myrow["parametro"].", event: '" . utf8_encode($myrow["desc_evento"]) . "',"
                            . "state: false},";
            }
        }

        $objJson .="]}";
    } else {
        $objJson = "{mails: [";
        while ($myrow = $resultEvents->fetch_assoc()) {
            $objJson .= "{idEmpresa: null, parametro: ".$myrow["parametro"].", event: '" . utf8_encode($myrow["desc_evento"]) . "',"
                    . "state: false},";
        }
        $objJson .="]}";
    }
    echo $objJson;
    $mysqli->close();
}
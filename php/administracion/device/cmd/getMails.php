<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $queryEvents = "select id_sky_evento, sky_evento from sky_eventos";

    $queryMail = "select id_persona, id_sky_evento, id_empresa "
            . "from envio_correos where id_persona = $idPerson "
            . "and id_empresa = $idCompany"
    ;

    $resultEvents = $mysqli->query($queryEvents);
    $resultMail = $mysqli->query($queryMail);

    if ($resultMail->num_rows > 0) {
        $objJson = "{mails: [";
        $exist = false;
        $resultMail = allRows($mysqli->query($queryMail));
        while ($myrow = $resultEvents->fetch_assoc()) {
            for ($i = 0; $i < count($resultMail); $i++) {
                $myrow2 = $resultMail[$i];
                if ($myrow["id_sky_evento"] == $myrow2["id_sky_evento"]) {
                    $objJson .= "{idEmpresa: '" . $myrow2["id_empresa"] . "', idSkyEvt: " . $myrow["id_sky_evento"] . ", event: '" . utf8_encode($myrow["sky_evento"]) . "',"
                            . "state: true},";
                    $exist = true;
                    break;
                } else {
                    $exist = false;
                }
            }

            if (!$exist) {
                $objJson .= "{idEmpresa: '" . $myrow2["id_empresa"] . "', idSkyEvt: " . $myrow["id_sky_evento"] . ", event: '" . utf8_encode($myrow["sky_evento"]) . "',"
                        . "state: false},";
            }
        }

        $objJson .="]}";
    } else {
        $objJson = "{mails: [";
        while ($myrow = $resultEvents->fetch_assoc()) {
            $objJson .= "{idEmpresa: null, idSkyEvt: " . $myrow["id_sky_evento"] . ", event: '" . utf8_encode($myrow["sky_evento"]) . "',"
                    . "state: false},";
        }
        $objJson .="]}";
    }
    echo $objJson;
    $mysqli->close();
}
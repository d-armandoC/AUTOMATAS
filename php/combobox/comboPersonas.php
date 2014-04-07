<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
    $idRol = $_SESSION["IDROLKTAXY"];

    if ($idRol == 1) {
        $consultaSql = "select p.id_persona, p.id_empleo, concat(p.nombres, ' ', p.apellidos) as person, e.empresa, p.email "
                . "from personas p, empresas e "
                . "where p.id_empresa = e.id_empresa "
                . "order by p.apellidos";
    } else {
        $consultaSql = "select p.id_persona, p.id_empleo, concat(p.nombres, ' ', p.apellidos) as person, e.empresa, p.email "
                . "from personas p, empresas e "
                . "where p.id_empresa = e.id_empresa "
                . "and p.id_empresa = '$idEmpresa' "
                . "order by p.apellidos";
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{personas: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_persona"] . ", "
                    . "text:'" . utf8_encode($myrow["person"]) . "', "
                    . "idEmpleo:" . $myrow["id_empleo"] . ", "
                    . "empresa:'" . utf8_encode($myrow["empresa"]) . "', "
                    . "mail:'" . utf8_encode($myrow["email"]) . "', "
                    . "}, ";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

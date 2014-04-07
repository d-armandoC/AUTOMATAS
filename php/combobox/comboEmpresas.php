<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

$idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
$menuClick = 0;

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idRol = $_SESSION["IDROLKTAXY"];
    if ($idRol == 1 && $menuClick != 1) {
        $consultaSql = "select id_empresa, empresa, latitud, longitud,"
                . "direccion, telefono, email, icon, id_tipo_empresa "
                . "from empresas "
                . "order by empresa"
        ;
    } else {
        $consultaSql = "select id_empresa, empresa, latitud, longitud, "
                . "direccion, telefono, email, icon, id_tipo_empresa "
                . "from empresas "
                . "where id_empresa = '$idEmpresa'"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{empresas: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:'" . $myrow["id_empresa"] . "',"
                    . "idTipoEmpresa:" . $myrow["id_tipo_empresa"] . ","
                    . "text:'" . utf8_encode($myrow["empresa"]) . "',"
                    . "latitud: " . $myrow["latitud"] . ","
                    . "longitud: " . $myrow["longitud"] . ","
                    . "direccion: '" . utf8_encode($myrow["direccion"]) . "',"
                    . "telefono: '" . $myrow["telefono"] . "',"
                    . "email: '" . $myrow["email"] . "',"
                    . "icon: '" . $myrow["icon"] . "'"
                    . "},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}
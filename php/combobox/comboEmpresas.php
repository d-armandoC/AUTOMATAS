<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

$idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
$menuClick = 0;

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idRol = $_SESSION["IDROLKARVIEW"];
    if ($idRol == 1 && $menuClick != 1) {
        $consultaSql = "select id_empresa, empresa,
                direccion, telefono, correo from empresas 
                order by id_empresa";
        ;
    } else {
        $consultaSql = "select id_empresa, empresa,
                direccion, telefono, correo 
                from empresas 
                where id_empresa = '$idEmpresa'"
        ;
    }
      $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "empresas: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_empresa"] . ","
                    . "text:'" . utf8_encode($myrow["empresa"]) . "'},";
        }

        $objJson .="]";
        echo "{success: true, $objJson }";
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
    

//    $result = $mysqli->query($consultaSql);
//    $mysqli->close();
//
//    if ($result->num_rows > 0) {
//        $objJson = "{empresas: [";
//        while ($myrow = $result->fetch_assoc()) {
//            $objJson .= "{"
//                    . "id:" . $myrow["id_empresa"] . ","
//                    . "text:'" . utf8_encode($myrow["empresa"]) . "',"
//                    . "direccion: '" . utf8_encode($myrow["direccion"]) . "',"
//                    . "telefono: '" . $myrow["telefono"] . "',"
//                    . "email: '" . $myrow["correo"] . "',"
//                    . "},";
//        }
//
//        $objJson .="]}";
//        echo $objJson;
//    } else {
//        echo "{success:false, msg: 'No hay datos que obtener'}";
//    }
}
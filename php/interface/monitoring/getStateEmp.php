<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 3) {
        $consultaSql = "select e.empresa, ee.ip, timestampdiff(minute,ee.tiempo,now()) as min_atras, ee.ini_conex "
                . "from coop_consultando ee, empresas e "
                . "where ee.id_empresa = e.id_empresa "
                . "and e.id_ciudad = 1 "
                . "order by e.empresa"
        ;
    } else {
        $consultaSql = "select e.empresa, ee.ip, timestampdiff(minute,ee.tiempo,now()) as min_atras, ee.ini_conex "
            . "from coop_consultando ee, empresas e "
            . "where ee.id_empresa = e.id_empresa "
            . "order by e.empresa"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{stateEmp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                empresa:'" . utf8_encode($myrow["empresa"]) . "',            
                ip:'" . $myrow["ip"] . "',
                min_atras:" . $myrow["min_atras"] . ",
                ini_conex:'" . $myrow["ini_conex"] . "'
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
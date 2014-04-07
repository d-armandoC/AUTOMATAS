<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idRol = $_SESSION["IDROLKTAXY"];
    if ($idRol == 3) {
        $consultaSql = "select d.desco, t.total, e.empresa. "
            . "from (select count(*) as desco, v.id_empresa "
                . "from estado_eqp ee, vehiculos v "
                . "where ee.id_equipo = v.id_equipo "
                . "and timestampdiff(minute, concat(ee.fecha_ult_dato, ' ', ee.hora_ult_dato), now()) > 3 "
                . "group by v.id_empresa) as d, "
                . "(select count(*) as total, v.id_empresa "
                . "from estado_eqp ee, vehiculos v "
                . "where ee.id_equipo = v.id_equipo "
                . "group by v.id_empresa) as t, empresas e "
            . "where d.id_empresa = t.id_empresa "
            . "and t.id_empresa = e.id_empresa "
            . "and e.id_ciudad <> 2 "
            . "order by e.empresa"
        ;
    } else {
        $consultaSql = "select d.desco, t.total, e.empresa "
            . "from (select count(*) as desco, v.id_empresa "
                . "from estado_eqp ee, vehiculos v "
                . "where ee.id_equipo = v.id_equipo "
                . "and timestampdiff(minute, concat(ee.fecha_ult_dato, ' ', ee.hora_ult_dato), now()) > 3 "
                . "group by v.id_empresa) as d, "
                . "(select count(*) as total, v.id_empresa "
                . "from estado_eqp ee, vehiculos v "
                . "where ee.id_equipo = v.id_equipo "
                . "group by v.id_empresa) as t, empresas e "
            . "where d.id_empresa = t.id_empresa "
            . "and t.id_empresa = e.id_empresa "
            . "order by e.empresa"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $cantDesc = 0;
        $cantTotal = 0;
        $cantConect = 0;

        $objJson = "{cantEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $con = $myrow["total"] - $myrow["desco"];

            $cantDesc += $myrow["desco"];
            $cantTotal += $myrow["total"];
            $cantConect += $con;

            $objJson .= "{
                conect:" . $con . ",
                desco:" . $myrow["desco"] . ",
                total:" . $myrow["total"] . ",
                empresa:'" . utf8_encode($myrow["empresa"]) . "'
            },";
        }

        $objJson .= "{
        conect:'<b>" . $cantConect . "</b>',
        desco:'<b>" . $cantDesc . "</b>',
        total:'<b>" . $cantTotal . "</b>',
        empresa: '<b>total</b>'
    }";

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
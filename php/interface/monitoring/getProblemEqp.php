<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 3) {
        $consultaSql = "SELECT e.empresa, ee.id_equipo, v.vehiculo, ee.fh_con, ee.fh_des, ee.tmpcon, ee.tmpdes, ee.bateria,ee.estado, ee.fecha_estado, ee.gsm, ee.gps2, ee.vel, ee.activo, ee.ign, ee.taximetro, ee.panico
            FROM problem_equipo ee, vehiculos v, empresas e
            WHERE ee.id_equipo = v.id_equipo
            AND v.id_empresa = e.id_empresa
            AND e.id_ciudad = 1
            ORDER BY e.empresa, v.vehiculo"
        ;
    } else {
        $consultaSql = "SELECT e.empresa, ee.id_equipo, v.vehiculo, ee.fh_con, ee.fh_des, ee.tmpcon, ee.tmpdes, ee.bateria,ee.estado, ee.fecha_estado, ee.gsm, ee.gps2, ee.vel, ee.activo, ee.ign, ee.taximetro, ee.panico
            FROM problem_equipo ee, vehiculos v, empresas e
            WHERE ee.id_equipo = v.id_equipo
            AND v.id_empresa = e.id_empresa
            ORDER BY e.empresa, v.vehiculo"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{problemEqp : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                idEquipo:'" . $myrow["id_equipo"] . "',
                vehiculo:" . $myrow["vehiculo"] . ",
                fhCon:'" . $myrow["fh_con"] . "',
                fhDes:'" . $myrow["fh_des"] . "',
                tmpcon:" . $myrow["tmpcon"] . ",
                tmpdes:" . $myrow["tmpdes"] . ",
                bateria:" . $myrow["bateria"] . ",
                estado:'" . utf8_encode($myrow["estado"]) . "',
                fechaEstado:'" . $myrow["fecha_estado"] . "',
                gsm:" . $myrow["gsm"] . ",
                gps2:" . $myrow["gps2"] . ",
                vel:" . $myrow["vel"] . ",
                activo:" . $myrow["activo"] . ",
                ign:" . $myrow["ign"] . ",
                taximetro:" . $myrow["taximetro"] . ",
                panico:" . $myrow["panico"] . "
            },";
        }

        $objJson .="]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
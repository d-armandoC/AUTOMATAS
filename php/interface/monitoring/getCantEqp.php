<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql1 = "SELECT v.id_empresa,e.empresa,count(*) as total FROM karviewdb.ultimo_dato_skps  f, empresas e,vehiculos v where f.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa group by e.empresa order by e.empresa";
    $result1 = $mysqli->query($consultaSql1);
    $cantConect = 0;
    $cantTotal = 0;
    $cantDesconect = 0;
    if ($result1->num_rows > 0) {

        $objJson = "{cantEqp : [";
        while ($myrow1 = $result1->fetch_assoc()) {
            $empresa = $myrow1["empresa"];
            $conectado = 0;
            $desconectado = 0;
            $cantTotal1 = $myrow1["total"];

            $consultaSql = "SELECT count(*) as total FROM karviewdb.ultimo_dato_skps  f, empresas e,vehiculos v
    where f.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and 
    timestampdiff(minute, f.fecha_hora_ult_dato,now()) <=3 and e.empresa='$empresa'";
            $result = $mysqli->query($consultaSql);
            if ($result->num_rows > 0) {
                $myrow = $result->fetch_assoc();
                $conectado = $myrow["total"];
            } else {
                $consultaSql = "SELECT count(*) as total FROM karviewdb.ultimo_dato_skps  f, empresas e,vehiculos v
    where f.id_equipo=v.id_equipo and v.id_empresa=e.id_empresa and 
    timestampdiff(minute, f.fecha_hora_ult_dato,now()) > 3 and e.empresa='$empresa'";
                $result = $mysqli->query($consultaSql);
                $myrow = $result->fetch_assoc();
                $desconectado = $myrow["total"];
            }

        
            $cantTotal += $cantTotal1;
            $desconect = $cantTotal1 - $conectado;
            $cantConect +=$conectado;
            $cantDesconect += $desconect;
            $objJson .= "{
                desco:" . $desconect . ",
                conect:" . $conectado . ",
                total:" . $cantTotal1 . ",
                empresa:" . $myrow1["id_empresa"] . "
            },";
        }
        $objJson .= "{
        desco:'<b>" . $cantDesconect . "</b>',
        conect:'<b>" . $cantConect . "</b>',
        total:'<b>" . $cantTotal . "</b>',
        empresa: '<b>Total</b>'
    }";
        $objJson .="]}";
        $mysqli->close();
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
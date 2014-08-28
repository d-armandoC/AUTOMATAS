<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_GET);

$id_empresa = $_SESSION["IDCOMPANYKARVIEW"];
$id_rol = $_SESSION["IDROLKARVIEW"];

$salida = "{failure:true}";
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    if ($id_rol == 1 || $id_rol == 2) {
        $consultaSql = "SELECT g.id_geocerca, g.geocerca, g.descripcion, e.empresa, e.id_empresa, g.area
        FROM karviewdb.geocercas g,  karviewdb.empresas e  
        WHERE g.id_empresa=e.id_empresa";
    }  else {
        $consultaSql = "SELECT g.id_geocerca, g.geocerca, g.descripcion, e.empresa, e.id_empresa, g.area
        FROM karviewdb.geocercas g,  karviewdb.empresas e  
        WHERE g.id_empresa=e.id_empresa and e.id_empresa='$id_empresa'"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{adminGeo: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
            id:'" . $myrow["id_geocerca"] . "',
            id_empresa:'" . utf8_encode($myrow["id_empresa"]) . "',
            geocerca:'" . utf8_encode($myrow["geocerca"]) . "',
            desc_geo:'" . utf8_encode($myrow["descripcion"]) . "',
            empresa:'" . utf8_encode($myrow["empresa"]) . "',
            areaGeocerca:'" . utf8_encode($myrow["area"]) . "',                

            },";
        }
        $objJson .= "]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

//consulta($consultaSql);
//$resulset = variasFilas();

//$salida = "{'adminGeo': [";
//
//for ($i = 0; $i < count($resulset); $i++) {
//    $fila = $resulset[$i];
//    $salida .= "{
//            'id':".$fila["id_geocerca"].",
//            'id_empresa':" . utf8_encode($fila["id_empresa"]) . ",
//            'geocerca':'" . utf8_encode($fila["geocerca"]) . "',
//            'desc_geo':'" . utf8_encode($fila["descripcion"]) . "',
//            'empresa':'" . utf8_encode($fila["empresa"]) . "',
//            'areaGeocerca':" . utf8_encode($fila["area"]) . ",
//        }";
//    if ($i != count($resulset) - 1) {
//        $salida .= ",";
//    }
//}
//
//$salida .="]}";
//
//echo $salida;
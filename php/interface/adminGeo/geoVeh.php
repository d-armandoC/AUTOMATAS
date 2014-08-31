<?php

include('../../login/isLogin.php');
require_once('../../../dll/config.php');

extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
 $consultaSql = "SELECT v.vehiculo, v.placa, V.id_vehiculo
    FROM  karviewdb.geocerca_vehiculos vg, karviewdb.vehiculos v, karviewdb.geocercas g
    WHERE vg.id_geocerca ='$idGeo' AND g.id_empresa = '$empresa'
    AND vg.id_vehiculo = v.id_vehiculo AND vg.id_geocerca = g.id_geocerca";
    $result= $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{veh_geo: [";
        while ($myrow = $result->fetch_assoc()) {
            $idEqp = $myrow["id_vehiculo"];
            $veh = $myrow["vehiculo"];
            $placa = $myrow["placa"];
            $objJson .= "{"
                    . "id:" . $myrow["id_vehiculo"] . ","
                    . "nombre:'" .$placa . ' - ' . $veh . "'"
                    . "},";
        }
        $objJson .="]}";
        echo utf8_encode($objJson);
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}


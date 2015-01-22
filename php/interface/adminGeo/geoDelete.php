<?php

include('../../login/isLogin.php');
require_once('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql1 = "delete FROM karviewdb.geocerca_puntos where id_geocerca= $idGeo";
    $result1=$mysqli->query($consultaSql1);
    
    $consultaSql2 = "delete FROM karviewdb.geocerca_vehiculos where id_geocerca = $idGeo";
    $result2=$mysqli->query($consultaSql2);
     
    $consultaSql3 = "delete FROM karviewdb.geocercas where id_geocerca = $idGeo";
    $result3=$mysqli->query($consultaSql3);
     
    $consultaSql4 = "delete FROM karviewdb.envio_geo_correos where id_geocerca = $idGeo";
    $result4=$mysqli->query($consultaSql4);
      
   echo "{success: true}";
   
}
?>

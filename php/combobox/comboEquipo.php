<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_GET);
    $consultaSql = "SELECT id_equipo, equipo FROM karviewdb.equipos WHERE id_equipo NOT IN(SELECT id_equipo FROM karviewdb.vehiculos)";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{equipo: [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{            
            id:" . $myrow["id_equipo"] . ",
            text:'" . utf8_encode($myrow["equipo"]) . "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}














<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_GET);
    $consultaSql = "SELECT id_rol_usuario, nombre FROM rol_usuarios";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{rol_usuario: [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{            
               id:'" . $myrow["id_rol_usuario"]."',
               nombre:'" . utf8_encode($myrow["nombre"]). "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}







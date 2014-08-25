<?php

include('../../login/isLogin.php');
include('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "select u.usuario,r.nombre as rol_usuario,e.empresa, u.fecha_hora_conexion as fecha_hora_con, u.conectado, u.ip, u.longitud, u.latitud 
            from usuarios u, rol_usuarios r,empresas e 
            where u.id_rol_usuario = r.id_rol_usuario and u.conectado=1 and u.id_empresa=e.id_empresa order by u.fecha_hora_conexion desc";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{userConect: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "usuarioConect:'" . utf8_encode($myrow["usuario"]) . "',"
                . "rolConect:'" . $myrow["rol_usuario"] . "',"
                . "empresaConect:'" . $myrow["empresa"] . "',"
                . "fechaHoraConect:'" . $myrow["fecha_hora_con"] . "',"
                . "conectadoConect:" . $myrow["conectado"] . ","
                . "ipConect:'" . $myrow["ip"] . "',"
                . "longitudConect:" . $myrow["longitud"] . ","
                . "latitudConect:" . $myrow["latitud"] . "},";
    }
    $objJson .= "]}";
    echo $objJson;
}


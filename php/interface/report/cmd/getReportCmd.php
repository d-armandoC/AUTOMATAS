<?php

include('../../../login/isLogin.php');
include ('../../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    if ($rb6 == 1) {
$consultaSql = "SELECT eq.equipo, us.usuario, cm.comando, cm.respuesta,cm.fecha_hora_registro,cm.fecha_hora_envio,
 CASE cm.id_tipo_estado_cmd
        WHEN 1 THEN 'NO ENVIADO'
        WHEN 2 THEN 'SIN RESPUESTA'
        WHEN 3 THEN 'COMPLETADO'
END AS estado
FROM karviewhistoricodb.comandos cm, karviewdb.usuarios us, karviewdb.equipos eq,  karviewdb.vehiculos v where cm.id_usuario = us.id_usuario and cm.id_equipo= eq.id_equipo and cm.id_equipo=v.id_equipo and v.id_empresa='$idCompanyComando'
and cm.fecha_hora_registro BETWEEN CONCAT('$fechaIni',' ', '$horaIniComando') AND CONCAT('$fechaFin',' ', '$horaFinComando')";
    } else if ($rb6 == 2) {
        $consultaSql = "SELECT eq.equipo, us.usuario, cm.comando, cm.respuesta,cm.fecha_hora_registro,cm.fecha_hora_envio,
 CASE cm.id_tipo_estado_cmd
        WHEN 1 THEN 'NO ENVIADO'
        WHEN 2 THEN 'SIN RESPUESTA'
        WHEN 3 THEN 'COMPLETADO'
END AS estado
FROM karviewhistoricodb.comandos cm, karviewdb.usuarios us, karviewdb.equipos eq,  karviewdb.vehiculos v where cm.id_usuario = us.id_usuario and cm.id_equipo= eq.id_equipo and cm.id_equipo=v.id_equipo and v.id_empresa='$idCompanyComando'
and cm.fecha_hora_registro BETWEEN CONCAT('$fechaIni',' ', '$horaIniComando') AND CONCAT('$fechaFin',' ', '$horaFinComando')";
    }
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "usuario:'".utf8_encode($myrow["usuario"])."',"
                    . "comando:'".utf8_encode($myrow["comando"])."',"
                    . "respuesta:'".utf8_encode($myrow["respuesta"])."',"
                    . "fecha_creacion:'".$myrow["fecha_hora_registro"]."',"
                    . "fecha_envio:'".$myrow["fecha_hora_envio"]."',"
                    . "estado:'".$myrow["estado"]."'"
                    . "},";
        }
        $objJson .="],";
    }
   if ($haveData) {
        echo "{success: true, $objJson }";
    } else {
        echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
    }
    $mysqli->close();
}

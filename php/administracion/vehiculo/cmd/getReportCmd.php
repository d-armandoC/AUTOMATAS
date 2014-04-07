<?php
require_once('../../../../dll/conect.php');

extract($_GET);

$consultaSql = 
    "SELECT U.USUARIO, CH.CMD, CH.RTA, CH.FECHA_CREACION, CH.FECHA_ENVIO, 
    CASE CH.STD
        WHEN 1 THEN 'NO ENVIADO'
        WHEN 2 THEN 'SIN RESPUESTA'
        WHEN 3 THEN 'COMPLETADO'
    END AS STD
    FROM CMD_AT_HISTORIAL CH, USUARIOS U
    WHERE CH.ID_USUARIO = U.ID_USUARIO
    AND CH.ID_EQUIPO = '$cbxVeh'
    AND CH.FECHA_CREACION BETWEEN CONCAT('$fechaIni',' ', '$horaIni') AND CONCAT('$fechaFin',' ', '$horaFin')"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{cmd_hist: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            usuario:'" . utf8_encode($fila["USUARIO"]) . "',
            comando:'" . utf8_encode($fila["CMD"]) . "',
            respuesta:'" . utf8_encode($fila["RTA"]) . "',
            fecha_creacion:'" . $fila["FECHA_CREACION"] . "',
            fecha_envio:'". $fila["FECHA_ENVIO"] . "',            
            estado:'". $fila["STD"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
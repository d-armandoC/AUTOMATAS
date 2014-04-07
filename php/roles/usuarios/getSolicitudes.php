<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$consultaSql = 
    "SELECT S.ID_SOLICITUD, P.NOMBRES, P.APELLIDOS, P.CELULAR, S.FECHA, S.HORA, S.LATITUD, S.LONGITUD
    FROM USUARIOS U, PERSONAS P, SOLICITUDES S
    WHERE S.ID_USUARIO = U.ID_USUARIO
    AND U.ID_PERSONA = P.ID_PERSONA
    AND S.ESTADO = 0"
;

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{d: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];

    if ($i > 0) {
        $salida .= ",";
    }

    $salida .= "{
        idSol: '" . $fila["ID_SOLICITUD"] . "',
        nombres: '" . $fila["NOMBRES"] . "',
        apellidos: '" . $fila["APELLIDOS"] . "',
        celular: '" . $fila["CELULAR"] . "',
        latitud: " . $fila["LATITUD"] . ",
        longitud: " . $fila["LONGITUD"] . ",
        fecha: '" . $fila["FECHA"] . "',
        hora: '" . $fila["HORA"] . "'

    }";
}

$salida.= "]}";
echo $salida;
?>

<?php
require_once('../../dll/conect.php');

extract($_POST);

$avenidaP = utf8_decode($avenidaP);
$avenidaS = utf8_decode($avenidaS);

$consultaSql = 
    "CALL SP_INGRESAR_DIRECCION('cbxPais', $cbxCiudad, '$cbxBarrio', '$avenidaP', '$avenidaS', $latitud, $longitud)"
;

$ingreso = consulta($consultaSql);

$salida = "{failure:true}";
if ($ingreso == 1) {
	$salida = '{success:true}';
}

echo $salida;
?>
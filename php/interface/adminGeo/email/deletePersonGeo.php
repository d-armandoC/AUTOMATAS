<?php
require_once('../../../../dll/conect.php');

extract($_POST);

$sql = "DELETE FROM ENVIO_MAILS_GEO WHERE ID_PERSONA = $id_person AND ID_GEOCERCA = $id_geocerca";

if (consulta($sql) == 1) {
    $salida = "{success:true}";
} else {
    $salida = "{failure:true, msg: 'No se pudo Eliminar de la Lista de Mails'}";
}

echo $salida;
?>

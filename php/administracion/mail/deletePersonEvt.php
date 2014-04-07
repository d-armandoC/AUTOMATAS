<?php
require_once('../../../dll/conect.php');

extract($_POST);

$sql = "DELETE FROM ENVIO_MAILS WHERE ID_PERSONA = $id_person";

if (consulta($sql) == 1) {
    $salida = "{success:true}";
} else {
    $salida = "{failure:true, msg: 'No se pudo Eliminar de la Lista de Mails'}";
}

echo $salida;
?>

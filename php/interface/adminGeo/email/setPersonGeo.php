<?php
require_once('../../../../dll/conect.php');

extract($_POST);

$parte = "";
$existe = substr_count($listPerson, ',');

if ($existe > 0) {
    $person = explode(',', $listPerson);

    for ($i=0; $i < count($person) ; $i++) { 
        $parte .= "($person[$i], $cbxGeo),";
    }

    $sql = "INSERT INTO ENVIO_MAILS_GEO (ID_PERSONA, ID_GEOCERCA)
        VALUES $parte";
    $sql = substr($sql, 0, -1);
    
} else {
    $sql = "INSERT INTO ENVIO_MAILS_GEO (ID_PERSONA, ID_GEOCERCA)
        VALUES ($listPerson, $cbxGeo)";
}


if (consulta($sql) == 1) {
    $salida = "{success:true}";
} else {
    $salida = "{failure:true, msg: 'No se pudo Agregar la Persona a la Lista de Mails'}";
}

echo $salida;
?>

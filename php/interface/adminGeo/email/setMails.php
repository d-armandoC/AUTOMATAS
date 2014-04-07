<?php
require_once('../../../../dll/conect.php');

extract($_POST);

$salida = false;
$json = json_decode($puntos, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = 
        	"UPDATE ENVIO_MAILS_GEO
        	SET IN_GEO='" . $json[$i]["in_geo"] . "', 
	            OUT_GEO='" . $json[$i]["out_geo"] . "'
            WHERE ID_PERSONA =" . $json[$i]["id_persona"] ."
            AND ID_GEOCERCA =" . $json[$i]["id_geocerca"]
        ;

        if (consulta($sql) == 1) {
            $salida = true;
        }
    }    
} 

echo $salida;
?>

<?php

include('../../login/isLogin.php');
include('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

   $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    $consultaSql = "SELECT ((length(trama))/1048576) as megas,(((length(trama)/1048576)*11.19)/300) as precio,di.tipo_dato_invalido as descripcion,i.fecha_hora_registro as fecha_hora_reg,i.equipo,i.trama,i.excepcion as excepcion
            FROM karviewhistoricodb.dato_invalidos i,  karviewdb.tipo_dato_invalidos di 
            where i.id_tipo_dato_invalido=di.id_tipo_dato_invalido and  date(i.fecha_hora_registro)=date(now()) order by i.fecha_hora_registro desc";


    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{dataInvalid: [";

    while ($myrow = $result->fetch_assoc()) {

        $objJson .= "{"
                . "descripcionDI:'" . utf8_encode($myrow["descripcion"]) . "',"
                . "fecha_hora_regDI:'" . $myrow["fecha_hora_reg"] . "',"
                . "equipoDI:'" . $myrow["equipo"] . "',"
                . "megasDI:" . $myrow["megas"] . ","
                . "precioDI:" . $myrow["precio"] . ","
                . "tramaDI:'" . utf8_encode((preg_replace("[\n|\r|\n\r]", "", $myrow["trama"]))) . "',"
                . "excepcionDI:'" . utf8_encode($myrow["excepcion"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

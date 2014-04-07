<?php
include('../../../login/isLogin.php');
require_once('../../../../dll/conect.php');

extract($_GET);

$id_empresa = $_SESSION["IDCOMPANYKTAXY"];
$id_rol = $_SESSION["IDROLKTAXY"];

$salida = "{failure:true}";

if ($id_rol == 1) {
    $consultaSql = 
        "SELECT EM.ID_PERSONA, CONCAT(P.APELLIDOS,' ',P.NOMBRES) AS 'NOM_APE', P.EMAIL, 
        EM.IN_GEO, EM.OUT_GEO, G.ID_GEOCERCA
        FROM ENVIO_MAILS_GEO EM, PERSONAS P, GEOCERCAS G, EMPRESAS E
        WHERE EM.ID_PERSONA = P.ID_PERSONA
        AND EM.ID_GEOCERCA = G.ID_GEOCERCA
        AND P.ID_EMPRESA = E.ID_EMPRESA
        AND EM.ID_GEOCERCA = $id_geo        
        ORDER BY P.APELLIDOS
        "
    ;
} else {
    $consultaSql = 
        "SELECT EM.ID_PERSONA, CONCAT(P.APELLIDOS,' ',P.NOMBRES) AS 'NOM_APE', P.EMAIL,
        EM.IN_GEO, EM.OUT_GEO, G.ID_GEOCERCA
        FROM ENVIO_MAILS_GEO EM, PERSONAS P, GEOCERCAS G, EMPRESAS E
        WHERE EM.ID_PERSONA = P.ID_PERSONA
        AND EM.ID_GEOCERCA = G.ID_GEOCERCA
        AND P.ID_EMPRESA = E.ID_EMPRESA
        AND EM.ID_GEOCERCA = $id_geo
        AND P.ID_EMPRESA = '$id_empresa'
        ORDER BY P.APELLIDOS
        "
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'envio_mails_geo': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];    

    $salida .= "{
            'id_persona':" . $fila["ID_PERSONA"] . ",
            'id_geocerca':" . $fila["ID_GEOCERCA"] . ",
            'persona':'" . utf8_encode($fila["NOM_APE"]) . "',
            'email':'" . utf8_encode($fila["EMAIL"]) . "',
            'in_geo':" . $fila["IN_GEO"] . ",
            'out_geo':" . $fila["OUT_GEO"] . "            
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
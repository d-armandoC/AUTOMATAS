<?php
require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$query = utf8_decode($query);
$apariciones = substr_count($query, ',');

if ($apariciones == 1) {
    $partes = explode(",", $query);
    $ciudad = $partes[0];
    $barrio = $partes[1];

    $consultaSql = 
        "SELECT CONCAT(P.PAIS,',',C.CIUDAD,',',B.BARRIO,',',I.AVENIDAP,',',I.AVENIDAS) AS 'TODO', 
        P.PAIS,C.CIUDAD,B.BARRIO,I.AVENIDAP,I.AVENIDAS,I.LATITUD,I.LONGITUD
        FROM PAIS P JOIN CIUDAD C ON P.ID_PAIS = C.ID_PAIS
        JOIN BARRIO B ON C.ID_CIUDAD = B.ID_CIUDAD  
        JOIN INTERSECCION I ON B.ID_BARRIO = I.ID_BARRIO
        WHERE C.CIUDAD LIKE '%$ciudad%' AND B.BARRIO LIKE '%$barrio%'"
    ;
} else if ($apariciones == 2) {
    $partes = explode(",", $query);
    $ciudad = $partes[0];
    $barrio = $partes[1];
    $avenidaP = $partes[2];

    $consultaSql = 
        "SELECT CONCAT(P.PAIS,',',C.CIUDAD,',',B.BARRIO,',',I.AVENIDAP,',',I.AVENIDAS) AS 'TODO', 
        P.PAIS,C.CIUDAD,B.BARRIO,I.AVENIDAP,I.AVENIDAS,I.LATITUD,I.LONGITUD
        FROM PAIS P JOIN CIUDAD C ON P.ID_PAIS = C.ID_PAIS
        JOIN BARRIO B ON C.ID_CIUDAD = B.ID_CIUDAD  
        JOIN INTERSECCION I ON B.ID_BARRIO = I.ID_BARRIO
        WHERE C.CIUDAD LIKE '%$ciudad%' AND B.BARRIO LIKE '%$barrio%'
        AND I.AVENIDAP LIKE '%$avenidaP%'"
    ;
} else if ($apariciones == 3){
    $partes = explode(",", $query);
    $ciudad = $partes[0];
    $barrio = $partes[1];
    $avenidaP = $partes[2];
    $avenidaS = $partes[3];

    $consultaSql = 
        "SELECT CONCAT(P.PAIS,',',C.CIUDAD,',',B.BARRIO,',',I.AVENIDAP,',',I.AVENIDAS) AS 'TODO', 
        P.PAIS,C.CIUDAD,B.BARRIO,I.AVENIDAP,I.AVENIDAS,I.LATITUD,I.LONGITUD
        FROM PAIS P JOIN CIUDAD C ON P.ID_PAIS = C.ID_PAIS
        JOIN BARRIO B ON C.ID_CIUDAD = B.ID_CIUDAD  
        JOIN INTERSECCION I ON B.ID_BARRIO = I.ID_BARRIO
        WHERE C.CIUDAD LIKE '%$ciudad%' AND B.BARRIO LIKE '%$barrio%' 
        AND I.AVENIDAP LIKE '%$avenidaP%' AND I.AVENIDAS LIKE '%$avenidaS%'"
    ;
} else {
    $consultaSql = 
        "SELECT CONCAT(P.PAIS,',',C.CIUDAD,',',B.BARRIO,',',I.AVENIDAP,',',I.AVENIDAS) AS 'TODO', 
        P.PAIS,C.CIUDAD,B.BARRIO,I.AVENIDAP,I.AVENIDAS,I.LATITUD,I.LONGITUD
        FROM PAIS P JOIN CIUDAD C ON P.ID_PAIS = C.ID_PAIS
        JOIN BARRIO B ON C.ID_CIUDAD = B.ID_CIUDAD  
        JOIN INTERSECCION I ON B.ID_BARRIO = I.ID_BARRIO
        WHERE C.CIUDAD LIKE '%$query%'"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'direccion': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
    		'todo':'" . utf8_encode($fila["TODO"]) . "',
            'pais':'" . utf8_encode($fila["PAIS"]) . "',
            'ciudad':'" . utf8_encode($fila["CIUDAD"]) . "',
            'barrio':'" . utf8_encode($fila["BARRIO"]) . "',
            'avenidaP':'" . utf8_encode($fila["AVENIDAP"]) . "',
            'avenidaS':'" . utf8_encode($fila["AVENIDAS"]) . "',
            'latitud':'" . utf8_encode($fila["LATITUD"]) . "',
            'longitud':'" . utf8_encode($fila["LONGITUD"]) . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
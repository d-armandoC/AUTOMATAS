<?php

require_once('../../../dll/conect.php');

extract($_POST);

$coord = explode(";", $coord);

$area = substr($area, 0, strlen($area) - 4);

$est = pasosInsersion($nameGeo, $cbxEmpresas ,$desGeo, $area, $listVeh, $coord);

if ($est == 0) {
    echo "{success:false}";
} else {
    echo "{success:true}";
}

function pasosInsersion($nameGeo, $cbxEmpresas ,$desGeo, $area, $listVeh, $coord) {
    //Extracción de ID      
    $sql = "SELECT MAX(ID_GEOCERCA) AS M FROM GEOCERCAS";
    consulta($sql);
    $id = unicaFila();
    $idGeo = $id["M"];
    $idGeo++;

    //Inserción de GeoCerca. Datos iniciales
    $sql = " INSERT INTO GEOCERCAS(ID_GEOCERCA, ID_EMPRESA, NOMBRE_GEOC, DESC_GEOC, AREA)
    VALUES($idGeo, '$cbxEmpresas', '$nameGeo', '$desGeo', $area) ";
    $val = consulta($sql);
    if ($val == 0) {
        return 0;
    } 

    //Vinculación de Vehículos
    $vehVector = explode(",", $listVeh);
    for ($i = 0; $i < count($vehVector); $i++) {

        //Extracción ID de vehículo según ID de equipo
        $sql = "SELECT DISTINCT ID_EQUIPO FROM VEHICULOS
                WHERE ACT = 1 AND ID_EQUIPO = '$vehVector[$i]'
                LIMIT 1";
        consulta($sql);
        $idEqp = unicaFila();
        $idEqp = $idEqp["ID_EQUIPO"];


        $sql = "INSERT INTO VEHICULOS_GEOCERCAS (ID_GEOCERCA, ID_EQUIPO, ESTADO, ULTIMO_ESTADO)
                VALUES($idGeo, '$idEqp', 'C', 0)";
        $val = consulta($sql);

        if ($val == 0) {
            return 0;
        }
    }

    //Vinculación de Puntos a la GeoCerca
    for ($i = 0; $i < count($coord); $i++) {
        $xy = explode(",", $coord[$i]);
        $sql = "INSERT GEOCERCA_POINTS(ID_GEOCERCA, LAT_GEOC_POINT, LONG_GEOC_POINT, ORDEN)
                VALUES($idGeo, $xy[1], $xy[0], " . ($i + 1) . ")";
        $val = consulta($sql);           
        if ($val == 0) {
            return 0;
        }            
    }
    return 1;
}
?>
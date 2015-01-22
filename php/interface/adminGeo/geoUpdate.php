<?php

include('../../login/isLogin.php');
require_once('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $coord = explode(";", $coord);
    $area = substr($area, 0, strlen($area) - 4);

    function coneccion() {
        if (!$mysqli = getConectionDb()) {
            
        } else {
            return $mysqli;
        }
    }
    
//    idGeo:1
//coord:
//area:
//vehiculolist:31
//vehiculolist:47
//vehiculolist:38
//vehiculolist:48
//vehiculolist:37
//idempresa:
//geocerca:Geocerca 1
//areaGeocerca:15000480.99
//cbxEmpresasV:KRADAC
//desc_geo:datos de geocerca
//listVehiGeos:31,47,38,48,37
    
    function pasosInsersion($idGeo,$geocerca, $cbxEmpresasV, $desc_geo, $area, $listVehiGeos, $coord) {
        
        //Modificacion de GeoCerca. Datos iniciales
        $consultaSql2 = "UPDATE GEOCERCAS SET geocerca='$geocerca', descripcion='$desc_geo', area='$area'
         WHERE id_geocerca='$idGeo' and id_empresa='$cbxEmpresasV'";
        coneccion()->query($consultaSql2);
        
////     Eliminar vehiculos existentes
        $consultaSql = "DELETE FROM geocerca_vehiculos WHERE id_geocerca='$idGeo'";
        coneccion()->query($consultaSql);
//        //Vinculación de nuevos Vehículos
        $vehVector = explode(",", $listVehiGeos);
        for ($i = 0; $i < count($vehVector); $i++) {
            //Extracción ID de vehículo según ID de equipo
            $consultaSql3 = "INSERT INTO geocerca_vehiculos (id_geocerca,id_vehiculo)
                VALUES($idGeo, $vehVector[$i])";
            coneccion()->query($consultaSql3);
        }
        
        ////     Eliminar de Puntos a la GeoCerca
        $consultaSql = "DELETE FROM geocerca_puntos WHERE id_geocerca='$idGeo'";
        coneccion()->query($consultaSql);
        //Vinculación de Puntos a la GeoCerca
        for ($i = 0; $i < count($coord); $i++) {
            $xy = explode(",", $coord[$i]);
            $consultaSql4 = "INSERT geocerca_puntos(id_geocerca,orden ,latitud, longitud)
                VALUES($idGeo," . ($i + 1) . " ,$xy[1], $xy[0])";
            coneccion()->query($consultaSql4);
        }
        return 1;
    }

    $est = pasosInsersion($idGeo,$geocerca, $idempresa, $desc_geo, $area, $listVehiGeos, $coord);
    if ($est == 0) {
        echo "{success:false}";
    } else {
        echo "{success:true}";
    }
}
  


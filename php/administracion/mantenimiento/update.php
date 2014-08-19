<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
        $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
   $idvehiculo=$idestandar=$valorTipoServicio=$valorTipoMantenimiento=$mkilometraje=$mdias=$mfecha=$mobservacion= $repaFecha=$repaDescripcion=$repaObservacion=$repuMarca=$repuModelo=$repuCodigo=$repuSerie=$repuEstado="";
 
    if (isset($json["idvehiculo"])) $idvehiculo = "id_vehiculo=" . $json["idvehiculo"] . ",";
    if (isset($json["idestandar"])) $idestandar = "id_estandar_vehiculo=" . $json["idestandar"] . ",";
    if (isset($json["valorTipoServicio"]))$valorTipoServicio = "valorTipoServicio=" .$json["valorTipoServicio"].",";
    if (isset($json["valorTipoMantenimiento"]))$valorTipoMantenimiento = "valorTipoMantenimiento=".$json["valorTipoMantenimiento"].",";
    if (isset($json["mkilometraje"]))$mkilometraje = "mkilometraje=".$json["mkilometraje"].",";
    if (isset($json["mdias"]))$mdias = "mdias=".$json["mdias"]."";
    if (isset($json["mfecha"]))$mfecha = "mfecha='".$json["mfecha"]."'";
    if (isset($json["mobservacion"]))$mobservacion = "mobservacion='".utf8_decode($json["mobservacion"])."'";
    if (isset($json["repaFecha"]))$repaFecha = "repaFecha='".$json["repaFecha"]."'";
    if (isset($json["repaDescripcion"]))$repaDescripcion = "repaDescripcion='".utf8_decode($json["repaDescripcion"])."'";
    if (isset($json["repaObservacion"]))$repaObservacion = "repaObservacion='".utf8_decode($json["repaObservacion"])."'";
    if (isset($json["repuMarca"]))$repuMarca = "repuMarca='".$json["repuMarca"]."'";
    if (isset($json["repuModelo"]))$repuModelo = "repuModelo='".$json["repuModelo"]."'";
    if (isset($json["repuCodigo"]))$repuCodigo = "repuCodigo='".$json["repuCodigo"]."'";
    if (isset($json["repuSerie"]))$repuSerie = "repuSerie='".$json["repuSerie"]."'";
    if (isset($json["repuEstado"]))$repuEstado = "repuEstado=".$json["repuEstado"]."";
    
    $id = explode("_", $json["id"]);
    $existe = false;
    if ($idestandar != "") {
        $existeSql = "select id_vehiculo from mantenimiento where id_vehiculo=" . $id[0] . " and  id_estandar_vehiculo=" . $json["idestandar"] . " ";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            $exist = true;
        }  else {
           $existe = false; 
        }
    } else {
        if ($idvehiculo != "") {
            $existeSql = "select id_vehiculo from mantenimiento where id_vehiculo=" . $json["idvehiculo"] . " and  id_estandar_vehiculo=" . $id[1] . " ";
            $result = $mysqli->query($existeSql);
            if ($result->num_rows > 0) {
                $exist = true;
            }else {
           $existe = false; 
        }
        }
    }

    if ($existe) {
         echo "{success:true, message:'Ya existe este Servicio',state: false}";
    } else {
        $updateSql = "UPDATE mantenimiento 
        SET $idvehiculo$idestandar$valorTipoServicio$valorTipoMantenimiento$mkilometraje$mdias$mfecha$mobservacion$repaFecha$repaDescripcion$repaObservacion$repuMarca$repuModelo$repuCodigo$repuSerie$repuEstado
        WHERE  id_vehiculo=? and id_estandar_vehiculo=?";
        if ($stmt = $mysqli->prepare($updateSql)) {
            $stmt->bind_param("ii", $id[0], $id[1]);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
               echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
            } else {
               echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
            }
            $stmt->close();
        } else {
              echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
        }
        $mysqli->close();
    }
}
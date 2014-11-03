<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $bandera = false;
    $idvehiculo = $idestandar = $valorTipoServicio = $valorTipoMantenimiento = $mkilometraje = $mdias = $mfecha = $mobservacion = $repaFecha = $repaDescripcion = $repaObservacion = $repuMarca = $repuModelo = $repuCodigo = $repuSerie = $repuEstado = "";
    $descripSoat = $fechaSoatReg = $fechaSoatVenc = $descripMatricula = $fechaMatriculaReg = $fechaMatriculaVenc = $descripSeguro = $fechaSeguroReg = $fechaSeguroVenc = "";
    if (isset($json["idvehiculo"]))
        $idvehiculo = "id_vehiculo=" . $json["idvehiculo"] . ",";
    if (isset($json["idestandar"]))
        $idestandar = "id_estandar_vehiculo=" . $json["idestandar"] . ",";
    if (isset($json["valorTipoServicio"]))
        $valorTipoServicio = "valorTipoServicio=" . $json["valorTipoServicio"] . ",";
    if (isset($json["valorTipoMantenimiento"]))
        $valorTipoMantenimiento = "valorTipoMantenimiento=" . $json["valorTipoMantenimiento"] . ",";
    if (isset($json["mkilometraje"]))
        $mkilometraje = "mkilometraje=" . $json["mkilometraje"] . ",";
    if (isset($json["mdias"]))
        $mdias = "mdias=" . $json["mdias"] . ",";
    if (isset($json["mfecha"]))
        $mfecha = "mfecha='" . $json["mfecha"] . "',";
    if (isset($json["mobservacion"]))
        $mobservacion = "mobservacion='" . utf8_decode($json["mobservacion"]) . "',";
    if (isset($json["repaFecha"]))
        $repaFecha = "repaFecha='" . $json["repaFecha"] . "',";
    if (isset($json["repaDescripcion"]))
        $repaDescripcion = "repaDescripcion='" . utf8_decode($json["repaDescripcion"]) . "',";
    if (isset($json["repaObservacion"]))
        $repaObservacion = "repaObservacion='" . utf8_decode($json["repaObservacion"]) . "',";
    if (isset($json["repuMarca"]))
        $repuMarca = "repuMarca='" . $json["repuMarca"] . "',";
    if (isset($json["repuModelo"]))
        $repuModelo = "repuModelo='" . $json["repuModelo"] . "',";
    if (isset($json["repuCodigo"]))
        $repuCodigo = "repuCodigo='" . $json["repuCodigo"] . "',";
    if (isset($json["repuSerie"]))
        $repuSerie = "repuSerie='" . $json["repuSerie"] . "',";
    if (isset($json["repuEstado"]))
        $repuEstado = "repuEstado=" . $json["repuEstado"] . ",";
    ///Pra registros
    //SOAT
    if (isset($json["descripSoat"]))
        $descripSoat = "descripSoat='" . $json["descripSoat"] . "',";

    if (isset($json["fechaSoatReg"]))
        $fechaSoatReg = "fechaSoatReg='" . $json["fechaSoatReg"] . "',";

    if (isset($json["fechaSoatVenc"]))
        $fechaSoatVenc = "fechaSoatVenc='" . $json["fechaSoatVenc"] . "',";
//MATRICULA
    if (isset($json["descripMatricula"]))
        $descripMatricula = "descripMatricula='" . $json["descripMatricula"] . "',";

    if (isset($json["fechaMatriculaReg"]))
        $fechaMatriculaReg = "fechaMatriculaReg='" . $json["fechaMatriculaReg"] . "',";

    if (isset($json["fechaMatriculaVenc"]))
        $fechaMatriculaVenc = "fechaMatriculaVenc='" . $json["fechaMatriculaVenc"] . "',";
//SEGURO
    if (isset($json["descripSeguro"]))
        $descripSeguro = "descripSeguro ='" . $json["descripSeguro"] . "',";

    if (isset($json["fechaSeguroReg"]))
        $fechaSeguroReg = "fechaSeguroReg='" . $json["fechaSeguroReg"] . "',";

    if (isset($json["fechaSeguroVenc"]))
        $fechaSeguroVenc = "fechaSeguroVenc='" . $json["fechaSeguroVenc"] . "',";

    $id = explode("_", $json["id"]);
    $setId = "id_vehiculo= " . $id[0];


    $existe = false;
    if (isset($json["idestandar"])) {
        $existeSql = "select id_vehiculo from mantenimiento where id_vehiculo=" . $id[0] . " and  id_estandar_vehiculo=" . $json["idestandar"] . " ";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            $exist = true;
        } else {
            $existe = false;
        }
    }
    if (isset($json["idvehiculo"])) {
        $existeSql = "select id_vehiculo from mantenimiento where id_vehiculo=" . $json["idvehiculo"] . " and  id_estandar_vehiculo=" . $id[1] . " ";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            $exist = true;
        } else {
            $existe = false;
        }
    }
    if ($existe) {
        echo "{success:true, message:'Ya existe este Servicio',state: false}";
    } else {

        ///controlar el registro
        ///controlar el registro
        if (isset($json["descripSoat"])) {

//MATRICULA
            if (isset($json["descripMatricula"]))
                $descripMatricula = "descripMatricula='" . "" . "',";

            $fechaMatriculaReg = "fechaMatriculaReg='" . "" . "',";

            $fechaMatriculaVenc = "fechaMatriculaVenc='" . "" . "',";
//SEGURO
            $descripSeguro = "descripSeguro ='" . "" . "',";

            $fechaSeguroReg = "fechaSeguroReg='" . "" . "',";

            $fechaSeguroVenc = "fechaSeguroVenc='" . "" . "',";
        }
        if (isset($json["descripMatricula"])) {
            //SOAT
            $descripSoat = "descripSoat='" . "" . "',";

            $fechaSoatReg = "fechaSoatReg='" . "" . "',";

            $fechaSoatVenc = "fechaSoatVenc='" . "" . "',";

//SEGURO
            $descripSeguro = "descripSeguro ='" . "" . "',";

            $fechaSeguroReg = "fechaSeguroReg='" . "" . "',";

            $fechaSeguroVenc = "fechaSeguroVenc='" . "" . "',";
        }
        if (isset($json["descripSeguro"])) {
            //SOAT
            $descripSoat = "descripSoat='" . "" . "',";

            $fechaSoatReg = "fechaSoatReg='" . "" . "',";

            $fechaSoatVenc = "fechaSoatVenc='" . "" . "',";
//MATRICULA
            $descripMatricula = "descripMatricula='" . "" . "',";

            $fechaMatriculaReg = "fechaMatriculaReg='" . "" . "',";

            $fechaMatriculaVenc = "fechaMatriculaVenc='" . "" . "',";
        }


        if (isset($json["valorTipoServicio"])) {
            $updateSql = "UPDATE mantenimiento 
                    SET $valorTipoServicio$idestandar$valorTipoMantenimiento$mkilometraje$mdias$mfecha$mobservacion$repaFecha$repaDescripcion$repaObservacion$repuMarca$repuModelo$repuCodigo$repuSerie$repuEstado$descripSoat$fechaSoatReg$fechaSoatVenc$descripMatricula$fechaMatriculaReg$fechaMatriculaVenc$descripSeguro$fechaSeguroReg$fechaSeguroVenc$setId
                    WHERE  id_vehiculo=? and id_estandar_vehiculo=? and valorTipoServicio=? ";
            if ($stmt = $mysqli->prepare($updateSql)) {
                $stmt->bind_param("iii", $id[0], $id[1], $id[2]);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    $bandera = true;
                } else {
                    $bandera = false;
                }
                $stmt->close();
            } else {
                $bandera = false;
            }
        } else {

            switch ($id[2]) {
                case 1:
                    $updateSql = "UPDATE mantenimiento 
                    SET $idestandar$valorTipoMantenimiento$mkilometraje$mdias$mfecha$mobservacion$descripSoat$fechaSoatReg$fechaSoatVenc$descripMatricula$fechaMatriculaReg$fechaMatriculaVenc$descripSeguro$fechaSeguroReg$fechaSeguroVenc$setId
                    WHERE  id_vehiculo=? and id_estandar_vehiculo=? and valorTipoServicio=? ";
                    if ($stmt = $mysqli->prepare($updateSql)) {
                        $stmt->bind_param("iii", $id[0], $id[1], $id[2]);
                        $stmt->execute();
                        if ($stmt->affected_rows > 0) {
                            $bandera = true;
                        } else {
                            $bandera = false;
                        }
                        $stmt->close();
                    } else {
                        $bandera = false;
                    }
                    break;
                case 2:
                    $updateSql = "UPDATE mantenimiento 
                    SET $idestandar$repaFecha$repaDescripcion$repaObservacion$descripSoat$fechaSoatReg$fechaSoatVenc$descripMatricula$fechaMatriculaReg$fechaMatriculaVenc$descripSeguro$fechaSeguroReg$fechaSeguroVenc$setId
                    WHERE  id_vehiculo=? and id_estandar_vehiculo=? and valorTipoServicio=? ";
                    if ($stmt = $mysqli->prepare($updateSql)) {
                        $stmt->bind_param("iii", $id[0], $id[1], $id[2]);
                        $stmt->execute();
                        if ($stmt->affected_rows > 0) {
                            $bandera = true;
                        } else {
                            $bandera = false;
                        }
                        $stmt->close();
                    } else {
                        $bandera = false;
                    }
                    break;
                case 3:
                    $updateSql = "UPDATE mantenimiento 
                    SET $idestandar$repuMarca$repuModelo$repuCodigo$repuSerie$repuEstado$descripSoat$fechaSoatReg$fechaSoatVenc$descripMatricula$fechaMatriculaReg$fechaMatriculaVenc$descripSeguro$fechaSeguroReg$fechaSeguroVenc$setId
                    WHERE  id_vehiculo=? and id_estandar_vehiculo=? and valorTipoServicio=? ";
                    if ($stmt = $mysqli->prepare($updateSql)) {
                        $stmt->bind_param("iii", $id[0], $id[1], $id[2]);
                        $stmt->execute();
                        if ($stmt->affected_rows > 0) {
                            $bandera = true;
                        } else {
                            $bandera = false;
                        }
                        $stmt->close();
                    } else {
                        $bandera = false;
                    }
                    break;
            }
        }

        $mysqli->close();

        if ($bandera) {
            echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
        } else {
            echo "{success:false, message: 'No se pudo actualizar mantenimiento'}";
        }
    }
}
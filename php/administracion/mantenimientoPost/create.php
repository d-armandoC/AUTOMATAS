<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $userKarview = $_SESSION["USERKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];
    $bandera = false;

    if ($descripSoat != '') {
        $id_registro = 1;
        $sqlrepetidos = "SELECT * FROM karviewdb.registros_mantenimiento where id_vehiculo='$idvehiculo' and id_registro='$id_registro';";
        $resultrepetidos = $mysqli->query($sqlrepetidos);
        if ($resultrepetidos->num_rows > 0) {
            $updateSql = "UPDATE karviewdb.registros_mantenimiento set id_vehiculo='$idvehiculo', id_registro='$id_registro', descripcion='$descripSoat',fechaRegistro='$fechaSoatReg',fechaVencimiento='$fechaSoatVenc' where id_vehiculo=? and id_registro=?;";
            if ($stmt = $mysqli->prepare($updateSql)) {
                $stmt->bind_param("ii", $idvehiculo, $id_registro);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    $bandera = true;
                } else {
                    $bandera = true;
//                    echo "{success:false, message: 'problemas en la consulta1'}";
                }
                $stmt->close();
            } 
        } else {
            $insertSql = "INSERT INTO karviewdb.registros_mantenimiento(id_vehiculo, id_registro, descripcion,fechaRegistro,fechaVencimiento)VALUES (?, ?, ?, ?, ?);";
            if ($stmt = $mysqli->prepare($insertSql)) {
                $stmt->bind_param("iisss", $idvehiculo, $id_registro, utf8_decode($descripSoat), $fechaSoatReg, $fechaSoatVenc);
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
        }
    }

    if ($descripMatricula != '') {
        $id_registro = 2;
        $sqlrepetidos = "SELECT * FROM karviewdb.registros_mantenimiento where id_vehiculo='$idvehiculo'and id_registro='$id_registro';";
        $resultrepetidos = $mysqli->query($sqlrepetidos);
        if ($resultrepetidos->num_rows > 0) {
            $updateSql = "UPDATE  karviewdb.registros_mantenimiento set id_vehiculo='$idvehiculo', id_registro='$id_registro', descripcion='$descripMatricula',fechaRegistro='$fechaMatriculaReg',fechaVencimiento='$fechaMatriculaVenc' where id_vehiculo=? and id_registro=?;";
            if ($stmt = $mysqli->prepare($updateSql)) {
                $stmt->bind_param("ii", $idvehiculo, $id_registro);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    $bandera = true;
                } else {
                    $bandera = true;
//                    echo "{success:false, message: 'problemas en la consulta2'}";
                }
                $stmt->close();
            } 
        } else {
            $insertSql = "INSERT INTO karviewdb.registros_mantenimiento(id_vehiculo, id_registro, descripcion,fechaRegistro,fechaVencimiento)VALUES (?, ?, ?, ?, ?);";
            if ($stmt = $mysqli->prepare($insertSql)) {
                $stmt->bind_param("iisss", $idvehiculo, $id_registro, utf8_decode($descripMatricula), $fechaMatriculaReg, $fechaMatriculaVenc);
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
        }
    }
    if ($descripSeguro != '') {
        $id_registro = 3;
        $sqlrepetidos = "SELECT * FROM karviewdb.registros_mantenimiento where id_vehiculo='$idvehiculo' and id_registro='$id_registro';";
        $resultrepetidos = $mysqli->query($sqlrepetidos);
        if ($resultrepetidos->num_rows > 0) {
            $updateSql = "UPDATE karviewdb.registros_mantenimiento set id_vehiculo='$idvehiculo', id_registro='$id_registro',descripcion='$descripSeguro',fechaRegistro='$fechaSeguroReg',fechaVencimiento='$fechaSeguroVenc' where id_vehiculo=? and id_registro=?;";
            if ($stmt = $mysqli->prepare($updateSql)) {
                $stmt->bind_param("ii", $idvehiculo, $id_registro);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    $bandera = true;
                } else {
                    $bandera = true;
//                    echo "{success:false, message: 'problemas en la consulta3'}";
                }
                $stmt->close();
            } 
        } else {
            $insertSql = "INSERT INTO karviewdb.registros_mantenimiento(id_vehiculo, id_registro, descripcion,fechaRegistro,fechaVencimiento)VALUES (?, ?, ?, ?, ?);";
            if ($stmt = $mysqli->prepare($insertSql)) {
                $stmt->bind_param("iisss", $idvehiculo, $id_registro, utf8_decode($descripSeguro), $fechaSeguroReg, $fechaSeguroVenc);
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
        }
    }

    $insertSql = "INSERT INTO karviewdb.mantenimientovehiculo(id_vehiculo,id_estandar_vehiculo,valorTipoServicio,valorTipoMantenimiento,mkilometraje,mdias,mfecha,mobservacion,repaFecha,repaDescripcion,repaObservacion,repuMarca,repuModelo,repuCodigo,repuSerie,repuEstado,fecha_config,responsable)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?);";
    if ($stmt = $mysqli->prepare($insertSql)) {
        $stmt->bind_param("iiiiiisssssssssisi", $idvehiculo, $idestandar, $valorTipoServicio, $valorTipoMantenimiento, $mkilometraje, $mdias, $mfecha, utf8_decode($mobservacion), $repaFecha, utf8_decode($repaDescripcion), utf8_decode($repaObservacion), $repuMarca, $repuModelo, $repuCodigo, $repuSerie, $repuEstado,$fechaConfig, $idPersona);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $bandera = true;
        } else {
            $bandera = false;
        }
        $stmt->close();
    } 
    $mysqli->close();
    if ($bandera) {
        echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
    } else {
        echo "{success:false, message: 'No se pudo actualizar mantenimiento'}";
    }
}

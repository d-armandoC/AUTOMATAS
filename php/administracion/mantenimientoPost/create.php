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


    $insertSql = "INSERT INTO historicomantenimientovehiculo (id_vehiculo,id_estandar_vehiculo,valorTipoServicio,valorTipoMantenimiento,mkilometraje,mdias,mfecha,mobservacion,repaFecha,repaDescripcion,repaObservacion,repuMarca,repuModelo,repuCodigo,repuSerie,repuEstado,descripSoat,fechaSoatReg,fechaSoatVenc,descripMatricula,fechaMatriculaReg,fechaMatriculaVenc,descripSeguro,fechaSeguroReg,fechaSeguroVenc,responsable)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)";
    if ($stmt = $mysqli->prepare($insertSql)) {
        $stmt->bind_param("iiiiiisssssssssisssssssssi", $idvehiculo, $idestandar, $valorTipoServicio, $valorTipoMantenimiento, $mkilometraje, $mdias, $mfecha, utf8_decode($mobservacion), $repaFecha, utf8_decode($repaDescripcion), utf8_decode($repaObservacion), $repuMarca, $repuModelo, $repuCodigo, $repuSerie, $repuEstado, utf8_decode($descripSoat), $fechaSoatReg, $fechaSoatVenc, utf8_decode($descripMatricula), $fechaMatriculaReg, $fechaMatriculaVenc, utf8_decode($descripSeguro), $fechaSeguroReg, $fechaSeguroVenc, $idPersona);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Servicio Generado Correctamente.',state: true}";
        } else {
            echo "{success:true, message:'Problemas al Insertar  en la Tabla',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message:'Problemas en la Construcción de la Consulta.',state: false}";
    }
    $mysqli->close();
}

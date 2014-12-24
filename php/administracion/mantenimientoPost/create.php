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
    
    
    
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $sqlrepetidos="SELECT id_vehiculo, id_estandar_vehiculo from historicomantenimientovehiculo where id_vehiculo='".$json["idvehiculo"]."' and id_estandar_vehiculo='".$json["idestandar"]."';";
    $resultrepetidos = $mysqli->query($sqlrepetidos);
     if ($resultrepetidos->num_rows > 0) {
         echo "{success:true, message:'Su Vehiculo ya cuenta con este servicio Puede elegir otro.',state: false}";
     }else{
        //descripMatricula: ""//descripSeguro: ""//descripSoat: ""//equipo: ""//estandar_vehiculo: ""//fechaMatriculaReg: ""
        //fechaMatriculaVenc: ""//fechaSeguroReg: ""//fechaSeguroVenc: ""//fechaSoatReg: ""//fechaSoatVenc: ""
        //fecha_registro: null//id: "DataObjectVehiculo-2"//idempresa: 1//idestandar: 1//idvehiculo: 3//mdias: ""
        //mfecha: ""//mkilometraje: ""//mobservacion: ""//nombreMantenimiento: ""//repaDescripcion: ""//repaFecha: ""
        //repaObservacion: ""//repuCodigo: ""//repuEstado: ""//repuMarca: ""//repuModelo: ""//repuSerie: ""//valorTipoServicio: 1

$insertSql = "INSERT INTO historicomantenimientovehiculo (id_vehiculo,id_estandar_vehiculo,valorTipoServicio,valorTipoMantenimiento,mkilometraje,mdias,mfecha,mobservacion,repaFecha,repaDescripcion,repaObservacion,repuMarca,repuModelo,repuCodigo,repuSerie,repuEstado,descripSoat,fechaSoatReg,fechaSoatVenc,descripMatricula,fechaMatriculaReg,fechaMatriculaVenc,descripSeguro,fechaSeguroReg,fechaSeguroVenc,responsable)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)";
        if ($stmt = $mysqli->prepare($insertSql)) {
            $stmt->bind_param("iiiiiisssssssssisssssssssi",$json["idvehiculo"],$json["idestandar"],$json["valorTipoServicio"],$json["valorTipoMantenimiento"],$json["mkilometraje"],$json["mdias"],$json["mfecha"], utf8_decode($json["mobservacion"]),$json["repaFecha"],utf8_decode($json["repaDescripcion"]),utf8_decode($json["repaObservacion"]),$json["repuMarca"],$json["repuModelo"],$json["repuCodigo"],$json["repuSerie"],$json["repuEstado"],utf8_decode($json["descripSoat"]),$json["fechaSoatReg"],$json["fechaSoatVenc"],utf8_decode($json["descripMatricula"]),$json["fechaMatriculaReg"],$json["fechaMatriculaVenc"],utf8_decode($json["descripSeguro"]),$json["fechaSeguroReg"],$json["fechaSeguroVenc"],$idPersona);
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
     }
    $mysqli->close();
}

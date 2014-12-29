

<?php

extract($_POST);

include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT mv.id_vehiculo, p.nombres , v.marca, v.vehiculo, sm.estandar_vehiculo, em.id_empresa, mv.id_estandar_vehiculo, mv.valorTipoServicio,em.empresa, mv.valorTipoMantenimiento, mv.mkilometraje, mv.mdias, mv.mfecha, mv.mobservacion, sm.estandar_vehiculo, mv.repaFecha, mv.repaDescripcion, mv.repaObservacion, mv.repuMarca, mv.repuModelo, mv.repuCodigo, mv.repuSerie, mv.repuEstado, 
        mv.descripSoat, mv.fechaSoatReg, mv.fechaSoatVenc, mv.descripMatricula, mv.fechaMatriculaReg, mv.fechaMatriculaVenc, mv.descripSeguro, mv.fechaSeguroReg, mv.fechaSeguroVenc             
        FROM karviewdb.mantenimientovehiculo mv, karviewdb.estandar_vehiculos sm,  karviewdb.empresas em, karviewdb.vehiculos v, karviewdb.personas p where mv.id_vehiculo= v.id_vehiculo and mv.id_estandar_vehiculo=sm.id_estandar_vehiculo and v.id_persona=p.id_persona and v.id_empresa=em.id_empresa and mv.id_vehiculo='$idVehiculoStandar' and mv.id_estandar_vehiculo='$idEstandar'";

    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "datos : [";

        while ($myrow = $result->fetch_assoc()) {

            $descripSoat = '';
            $fechaSoatReg = '';
            $fechaSoatVenc = '';
            $descripMatricula = '';
            $fechaMatriculaReg = '';
            $fechaMatriculaVenc = '';
            $descripSeguro = '';
            $fechaSeguroReg = '';
            $fechaSeguroVenc = '';
            $idVehiculo = $myrow["id_vehiculo"];
            $consultaSql1 = "SELECT id_estandar_vehiculo FROM karviewdb.mantenimientovehiculo where id_Vehiculo='$idVehiculo'";
            $result1 = $mysqli->query($consultaSql1);
            $estandar = '';
            while ($myrow1 = $result1->fetch_assoc()) {
                $estandar = $estandar . $myrow1["id_estandar_vehiculo"] . ',';
            }


            $consultaSql1 = "SELECT id_registro,descripcion,fechaRegistro,fechaVencimiento FROM karviewdb.registros_mantenimiento where id_vehiculo='$idVehiculo'";
            $result1 = $mysqli->query($consultaSql1);
            while ($myrow1 = $result1->fetch_assoc()) {
                $id_registro = $myrow1["id_registro"];
                if ($id_registro == 1) {
                    $descripSoat = utf8_encode($myrow1["descripcion"]);
                    $fechaSoatReg = $myrow1["fechaRegistro"];
                    $fechaSoatVenc = $myrow1["fechaVencimiento"];
                }
                if ($id_registro == 2) {
                    $descripMatricula = utf8_encode($myrow1["descripcion"]);
                    $fechaMatriculaReg = $myrow1["fechaRegistro"];
                    $fechaMatriculaVenc = $myrow1["fechaVencimiento"];
                }
                if ($id_registro == 3) {
                    $descripSeguro = utf8_encode($myrow1["descripcion"]);
                    $fechaSeguroReg = $myrow1["fechaRegistro"];
                    $fechaSeguroVenc = $myrow1["fechaVencimiento"];
                }
            }
            $objJson .= "{
                idmantenimiento:'" . $myrow["id_vehiculo"] . "_" . $myrow["id_estandar_vehiculo"] . "_" . $myrow["valorTipoServicio"] . "',
                idempresa:" . $myrow["id_empresa"] . ",
                idestandar:" . $myrow["id_estandar_vehiculo"] . ",
                valorTipoServicio:" . $myrow["valorTipoServicio"] . ",
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                propietario:'" . $myrow["nombres"] . "',
                servicio:'" . utf8_encode($myrow["estandar_vehiculo"]) . "',
                vehiculo:'" . $myrow["marca"] . " " . $myrow["vehiculo"] . "',
                idvehiculo:" . $myrow["id_vehiculo"] . ",
                valorTipoMantenimiento:" . $myrow["valorTipoMantenimiento"] . ",
                mkilometraje:" . $myrow["mkilometraje"] . ",
                mdias:" . $myrow["mdias"] . ",
                mfecha:'" . $myrow["mfecha"] . "',
                mobservacion:'" . utf8_encode($myrow["mobservacion"]) . "',
                repaFecha:'" . $myrow["repaFecha"] . "',
                repaDescripcion:'" . $myrow["repaDescripcion"] . "',
                repaObservacion:'" . $myrow["repaObservacion"] . "',
                repuMarca:'" . $myrow["repuMarca"] . "',
                repuModelo:'" . $myrow["repuModelo"] . "',
                repuCodigo:'" . $myrow["repuCodigo"] . "',
                repuSerie:'" . $myrow["repuSerie"] . "',
                repuEstado:'" . $myrow["repuEstado"] . "',
                descripSoat:'" . $descripSoat . "',
                fechaSoatReg:'" . $fechaSoatReg . "',
                fechaSoatVenc:'" . $fechaSoatVenc . "',
                descripMatricula:'" . $descripMatricula . "',
                fechaMatriculaReg:'" . $fechaMatriculaReg . "',
                fechaMatriculaVenc:'" . $fechaMatriculaVenc . "',
                descripSeguro:'" . $descripSeguro . "',
                fechaSeguroReg:'" . $fechaSeguroReg . "',
                fechaSeguroVenc:'" . $fechaSeguroVenc . "'  
            },";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
<?php

include ('../../../dll/config.php');
include('../../login/isLogin.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    extract($_GET);
    $userKarview = $_SESSION["USERKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];
    if ($idRol == 1) {
        $consultaSql = "SELECT vh.id_vehiculo, concat(vh.placa,'-',vh.marca) as vehiculo,eq.equipo, mv.fecha_registro, mv.valorTipoServicio,mv.id_estandar_vehiculo ,emp.empresa, esvm.estandar_vehiculo
FROM karviewdb.estandar_vehiculos esvm ,karviewdb.mantenimientovehiculo mv, karviewdb.equipos eq, karviewdb.vehiculos vh , karviewdb.empresas emp
Where esvm.id_estandar_vehiculo=mv.id_estandar_vehiculo and mv.id_vehiculo=vh.id_vehiculo and vh.id_equipo=eq.id_equipo and vh.id_empresa= emp.id_empresa";
    }

    if ($idRol == 2) {
        $consultaSql = "SELECT  mv.id_vehiculo, p.nombres , v.marca, v.vehiculo, sm.estandar_vehiculo, em.id_empresa, mv.id_estandar_vehiculo, mv.valorTipoServicio,em.empresa, mv.valorTipoMantenimiento, mv.mkilometraje, mv.mdias, mv.mfecha, mv.mobservacion, sm.estandar_vehiculo, mv.repaFecha, mv.repaDescripcion, mv.repaObservacion, mv.repuMarca, mv.repuModelo, mv.repuCodigo, mv.repuSerie, mv.repuEstado, 
        mv.descripSoat, mv.fechaSoatReg, mv.fechaSoatVenc, mv.descripMatricula, mv.fechaMatriculaReg, mv.fechaMatriculaVenc, mv.descripSeguro, mv.fechaSeguroReg, mv.fechaSeguroVenc             
        FROM karviewdb.mantenimiento mv, karviewdb.estandar_vehiculos sm,  empresas em, karviewdb.vehiculos v, karviewdb.personas p where mv.id_vehiculo= v.id_vehiculo and mv.id_estandar_vehiculo=sm.id_estandar_vehiculo and v.id_persona=p.id_persona and v.id_empresa=em.id_empresa and em.id_empresa='$idEmpresa';";
    }

    if ($idRol == 3) {
        $consultaSql = "SELECT mv.id_vehiculo, p.nombres , v.marca, v.vehiculo, sm.estandar_vehiculo, em.id_empresa, mv.id_estandar_vehiculo, mv.valorTipoServicio,em.empresa, mv.valorTipoMantenimiento, mv.mkilometraje, mv.mdias, mv.mfecha, mv.mobservacion, sm.estandar_vehiculo, mv.repaFecha, mv.repaDescripcion, mv.repaObservacion, mv.repuMarca, mv.repuModelo, mv.repuCodigo, mv.repuSerie, mv.repuEstado, 
        mv.descripSoat, mv.fechaSoatReg, mv.fechaSoatVenc, mv.descripMatricula, mv.fechaMatriculaReg, mv.fechaMatriculaVenc, mv.descripSeguro, mv.fechaSeguroReg, mv.fechaSeguroVenc             
        FROM karviewdb.mantenimiento mv, karviewdb.estandar_vehiculos sm,  empresas em, karviewdb.vehiculos v, karviewdb.personas p where mv.id_vehiculo= v.id_vehiculo and mv.id_estandar_vehiculo=sm.id_estandar_vehiculo and v.id_persona=p.id_persona and v.id_empresa=em.id_empresa and v.id_persona='$idPersona'";
    }
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id_vehiculo:" . $myrow["id_vehiculo"] . ",
                equipo:'" . $myrow["equipo"] . "',
                vehicuo:'" . $myrow["vehiculo"] . "',
                empresa:'" . $myrow["empresa"] . "',
                estandar_vehiculo:'" . utf8_encode($myrow["estandar_vehiculo"]) . "',
                id_estandar_vehiculo:" . $myrow["id_estandar_vehiculo"] . ",
                valorTipoServicio:" . $myrow["valorTipoServicio"] . ",
                fecha_registro:'" . $myrow["fecha_registro"] . "',    
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}


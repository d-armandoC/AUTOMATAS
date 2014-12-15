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
        $consultaSql = "SELECT eq.id_equipo, concat(vh.placa,'-',vh.marca) as vehicuo,eq.equipo,emp.empresa, mv.fecha_registro, mv.nombreMantenimiento,mv.tipoServicio FROM karviewdb.mantenimientovehiculo mv, karviewdb.equipos eq, karviewdb.vehiculos vh, karviewdb.empresas emp "
                . "where mv.id_equipo=eq.id_equipo and eq.id_equipo=vh.id_equipo and vh.id_empresa=emp.id_empresa;";
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
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $dato = 'Sin Servicio';
            if ($myrow["tipoServicio"]!=0) {
                $dato= $myrow["nombreMantenimiento"];
            }
            $objJson .= "{
                id_equipo:" . $myrow["id_equipo"] . ",
                equipo:'" . $myrow["equipo"] . "',
                vehicuo:'" . $myrow["vehicuo"] . "',
                empresa:'" . $myrow["empresa"] . "',
                fecha_registro:'" . $myrow["fecha_registro"] . "',    
                nombreMantenimiento:'" . $dato . "',    
            },";
        }
        $objJson .= "]}";

        echo $objJson;
        $mysqli->close();
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}


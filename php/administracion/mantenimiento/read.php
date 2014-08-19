<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $userKarview = $_SESSION["USERKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 3) {
        $consultaSql = "SELECT mv.id_vehiculo, p.nombres ,v.marca, v.vehiculo,sm.estandar_vehiculo, em.id_empresa, mv.id_estandar_vehiculo, em.empresa, mv.mt, mv.mk, mv.mtyk, mv.mtok, mv.mkilometraje, mv.mdias, mv.mfecha, mv.mobservacion, sm.estandar_vehiculo, mv.repaFecha, mv.repaDescripcion, mv.repaObservacion, mv.repuMarca, mv.repuModelo, mv.repuCodigo, mv.repuSerie, mv.repuEstado                 
FROM karviewdb.mantenimiento mv, karviewdb.estandar_vehiculos sm,  empresas em, karviewdb.vehiculos v, karviewdb.personas p where mv.id_vehiculo= v.id_vehiculo and mv.id_estandar_vehiculo=sm.id_estandar_vehiculo and v.id_persona=p.id_persona and v.id_empresa=em.id_empresa and em.id_empresa='$idEmpresa';";
    }
    if ($idRol == 1) {
        $consultaSql = "SELECT mv.id_vehiculo, p.nombres , v.marca, v.vehiculo, sm.estandar_vehiculo, em.id_empresa, mv.id_estandar_vehiculo, mv.valorTipoServicio,em.empresa, mv.valorTipoMantenimiento, mv.mkilometraje, mv.mdias, mv.mfecha, mv.mobservacion, sm.estandar_vehiculo, mv.repaFecha, mv.repaDescripcion, mv.repaObservacion, mv.repuMarca, mv.repuModelo, mv.repuCodigo, mv.repuSerie, mv.repuEstado                 
FROM karviewdb.mantenimiento mv, karviewdb.estandar_vehiculos sm,  empresas em, karviewdb.vehiculos v, karviewdb.personas p where mv.id_vehiculo= v.id_vehiculo and mv.id_estandar_vehiculo=sm.id_estandar_vehiculo and v.id_persona=p.id_persona and v.id_empresa=em.id_empresa ;";
    }
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idmantenimiento:'" . $myrow["id_vehiculo"] . "_" . $myrow["id_estandar_vehiculo"] . "',
                idempresa:" . $myrow["id_empresa"] . ",
                idestandar:" .$myrow["id_estandar_vehiculo"]. ",
                valorTipoServicio:" .$myrow["valorTipoServicio"]. ",
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                propietario:'" . $myrow["nombres"]. "',
                servicio:'" . utf8_encode($myrow["estandar_vehiculo"]) . "',
                vehiculo:'" . $myrow["marca"] . " " . $myrow["vehiculo"] . "',
                idvehiculo:".$myrow["id_vehiculo"].",
                valorTipoMantenimiento:" .$myrow["valorTipoMantenimiento"]. ",
                mkilometraje:" .$myrow["mkilometraje"]. ",
                mdias:" .$myrow["mdias"]. ",
                mfecha:'" .$myrow["mfecha"]. "',
                mobservacion:'" . utf8_encode($myrow["mobservacion"]) . "',
                repaFecha:'" . $myrow["repaFecha"] . "',
                repaDescripcion:'" . $myrow["repaDescripcion"] . "',
                repaObservacion:'" . $myrow["repaObservacion"] . "',
                repuMarca:'" . $myrow["repuMarca"] . "',
                repuModelo:'" . $myrow["repuModelo"] . "',
                repuCodigo:'" . $myrow["repuCodigo"] . "',
                repuSerie:'" . $myrow["repuSerie"] . "',
                repuEstado:" . $myrow["repuEstado"] . "
            },";
        }
        $objJson .= "]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}


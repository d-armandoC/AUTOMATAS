<?php

include ('../../../dll/config.php');
extract($_POST);


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if ($opcion == 1) {
        $existeVehiculos = substr_count($listVehiculos, ',');
        if ($existeVehiculos > 0) {
            $VEHC = str_replace(",", "','", $listVehiculos);
        } else {
            $VEHC = $listVehiculos;
        }
        $existeServicios = substr_count($listServicios, ',');
        if ($existeServicios > 0) {
            $SERV = str_replace(",", "','", $listServicios);
        } else {
            $SERV = $listServicios;
        }
        $consultaSql = "SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, sv.estandar_vehiculo, m.valorTipoServicio, concat (p.nombres,' ',p.apellidos) nombres
            FROM karviewdb.personas p, karviewhistoricodb.historicomantenimientovehiculo m, karviewdb.vehiculos vh, karviewdb.empresas emp, karviewdb.estandar_vehiculos sv, karviewdb.usuarios us 
            where m.id_vehiculo=vh.id_vehiculo and m.id_estandar_vehiculo=sv.id_estandar_vehiculo and vh.id_empresa= emp.id_empresa and m.responsable=us.id_persona and us.id_persona=p.id_persona  and vh.id_vehiculo IN ('$VEHC') and m.id_estandar_vehiculo IN ('$SERV') "
                . "and (m.fecha_registro between concat('$fechaIniMant',' ','$horaIniMant') and concat('$fechaFinMat',' ','$horaFinMant'))  group by id_vehiculo";
    } else if ($opcion == 2) {

        $existeServicios = substr_count($listServicios, ',');
        if ($existeServicios > 0) {
            $SERV = str_replace(",", "','", $listServicios);
        } else {
            $SERV = $listServicios;
        }
        $consultaSql = "SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, sv.estandar_vehiculo, m.valorTipoServicio, concat (p.nombres,' ',p.apellidos) nombres 
            FROM karviewdb.personas p, karviewhistoricodb.historicomantenimientovehiculo m, karviewdb.vehiculos vh, karviewdb.empresas emp, karviewdb.estandar_vehiculos sv, karviewdb.usuarios us 
            where m.id_vehiculo=vh.id_vehiculo and m.id_estandar_vehiculo=sv.id_estandar_vehiculo and vh.id_empresa= emp.id_empresa and vh.id_empresa='$cbxEmpresasMant' and m.responsable=us.id_persona and us.id_persona=p.id_persona and m.id_estandar_vehiculo IN ('$SERV') "
                . "and (m.fecha_registro between concat('$fechaIniMant',' ','$horaIniMant') and concat('$fechaFinMat',' ','$horaFinMant'))  group by id_vehiculo";
    }
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    $empresa = " ";
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "mantenimiento : [";
        while ($myrow = $result->fetch_assoc()) {
            $fechaRegSoat = "NO";
            $fechaFinSoat = "NO";
            $fechaRegMatricula ="NO";
            $fechaFinMatricula = "NO";
            $fechaRegSeguro = "NO";
            $fechaFinSeguro = "NO";
            $consultarRegiSoat = "SELECT rgm.fechaRegistro, rgm.fechaVencimiento FROM karviewdb.registros_mantenimiento rgm where rgm.id_vehiculo='" . $myrow["id_vehiculo"] . "' and rgm.id_registro =1;";
            $consultarRegiMatricula = "SELECT rgm.fechaRegistro, rgm.fechaVencimiento FROM karviewdb.registros_mantenimiento rgm where rgm.id_vehiculo='" . $myrow["id_vehiculo"] . "' and rgm.id_registro =2;";
            $consultarRegiSeguro = "SELECT rgm.fechaRegistro, rgm.fechaVencimiento FROM karviewdb.registros_mantenimiento rgm where rgm.id_vehiculo='" . $myrow["id_vehiculo"] . "' and rgm.id_registro =3;";
            $resultRegiSoat = $mysqli->query($consultarRegiSoat);
            $resultRegiMatricula = $mysqli->query($consultarRegiMatricula);
            $resultRegiSeguro = $mysqli->query($consultarRegiSeguro);

            if ($resultRegiSoat->num_rows > 0) {
                $rowRegiSoat = $resultRegiSoat->fetch_assoc();
                $fechaRegSoat = $rowRegiSoat["fechaRegistro"];
                $fechaFinSoat = $rowRegiSoat["fechaVencimiento"];
            }
            if ($resultRegiMatricula->num_rows > 0) {
                $rowRegiMatricula = $resultRegiMatricula->fetch_assoc();
                $fechaRegMatricula = $rowRegiMatricula["fechaRegistro"];
                $fechaFinMatricula = $rowRegiMatricula["fechaVencimiento"];
            }
            if ($resultRegiSeguro->num_rows > 0) {
                $rowRegiSeguro = $resultRegiSeguro->fetch_assoc();
                $fechaRegSeguro = $rowRegiSeguro["fechaRegistro"];
                $fechaFinSeguro = $rowRegiSeguro["fechaVencimiento"];
            }
            $objJson .= "{"
                    . "id_vehiculo:" . $myrow["id_vehiculo"] . ","
                    . "empresa:'" . $myrow["empresa"] . "',"
                    . "vehiculo:'" . $myrow["placa"]." " . $myrow["marca"] . "',"
                    . "fechaSoatReg:'" .$fechaRegSoat."',"
                    . "fechaSoatVenc:'".$fechaFinSoat."',"
                    . "fechaMatriculaReg:'".$fechaRegMatricula."',"
                    . "fechaMatriculaVenc:'".$fechaFinMatricula."',"
                    . "fechaSeguroReg:'".$fechaRegSeguro . "',"
                    . "fechaSeguroVenc:'" . $fechaFinSeguro . "',"
                    . "estandar:' " . utf8_encode($myrow["estandar_vehiculo"]) . "',"
                    . "idTipoServicio: " . $myrow["valorTipoServicio"] . ","
                    . "responsable:'" . $myrow["nombres"] . "',"
                    . "},";
        }
        $objJson .="],";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos que Mostrar'}";
    }
    $mysqli->close();
}

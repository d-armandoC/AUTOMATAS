<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    if ($rb3 == 1) {
        $consultaSql = "SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, count(*) as totalMantenimiento, 
            m.fechaSoatReg, m.fechaSoatVenc,m.descripSoat,m.fechaMatriculaReg ,m.fechaMatriculaVenc, m.descripMatricula, 
            m.fechaSeguroReg, m.fechaSeguroVenc , m.descripSeguro   FROM karviewhistoricodb.historicomantenimientovehiculo m, karviewdb.vehiculos vh, karviewdb.empresas emp where m.id_vehiculo=vh.id_vehiculo and vh.id_empresa= emp.id_empresa and vh.id_empresa='$idCompanyMantenimiento' and (m.fecha_registro between concat('$fechaInimanten',' ','$horaInManten') and concat('$fechaFinManten',' ','$horaFinManten'))  group by id_vehiculo";
    } else if ($rb3 == 2) {
        $consultaSql = "SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, count(*) as totalMantenimiento, 
            m.fechaSoatReg, m.fechaSoatVenc,m.descripSoat,m.fechaMatriculaReg ,m.fechaMatriculaVenc, m.descripMatricula, 
            m.fechaSeguroReg, m.fechaSeguroVenc , m.descripSeguro   FROM karviewhistoricodb.historicomantenimientovehiculo m, karviewdb.vehiculos vh, karviewdb.empresas emp where m.id_vehiculo=vh.id_vehiculo and vh.id_empresa= emp.id_empresa and vh.id_Vehiculo='$cbxVeh' and (m.fecha_registro between concat('$fechaInimanten',' ','$horaInManten') and concat('$fechaFinManten',' ','$horaFinManten'))  group by id_vehiculo";
    }
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    $empresa = " ";
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByMantenimiento : [";
        while ($myrow = $result->fetch_assoc()) {
            $fechaRegSoat = "NO";
            $fechaFinSoat = "NO";
             
            $fechaRegMatricula = "NO";
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
                    . "vehiculo:'" . $myrow["placa"] . " " . $myrow["marca"] . "',"
                    . "total:" . $myrow["totalMantenimiento"] . ","
                    . "fechaSoatReg:'" . $fechaRegSoat . "',"
                    . "fechaSoatVenc:'" . $fechaFinSoat . "',"
                    . "descripSoat:'" . $myrow["descripSoat"] . "',"
                    . "fechaMatriculaReg:'" . $fechaRegMatricula . "',"
                    . "fechaMatriculaVenc:'" . $fechaFinMatricula . "',"
                    . "descripMatricula:'" . $myrow["descripMatricula"] . "',"
                    . "fechaSeguroReg:'" . $fechaRegSeguro . "',"
                    . "fechaSeguroVenc:'" . $fechaFinSeguro . "',"
                    . "descripSeguro:'" . $myrow["descripSeguro"] . "'"
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

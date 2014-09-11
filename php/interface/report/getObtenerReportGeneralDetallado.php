<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    if($rb==1){
    $consultaSql ="SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, count(*) as totalMantenimiento, 
            m.fechaSoatReg, m.fechaSoatVenc,m.descripSoat,m.fechaMatriculaReg ,m.fechaMatriculaVenc, m.descripMatricula, 
            m.fechaSeguroReg, m.fechaSeguroVenc , m.descripSeguro   FROM karviewdb.mantenimiento m, karviewdb.vehiculos vh, karviewdb.empresas emp where m.id_vehiculo=vh.id_vehiculo and vh.id_empresa= emp.id_empresa and (m.fecha between concat('$fechaInimanten',' ','00:00:00') and concat('$fechaFinManten',' ','23:59:00'))  group by id_vehiculo";
    }else{
    $consultaSql ="SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, count(*) as totalMantenimiento, 
            m.fechaSoatReg, m.fechaSoatVenc,m.descripSoat,m.fechaMatriculaReg ,m.fechaMatriculaVenc, m.descripMatricula, 
            m.fechaSeguroReg, m.fechaSeguroVenc , m.descripSeguro   FROM karviewdb.mantenimiento m, karviewdb.vehiculos vh, karviewdb.empresas emp where m.id_vehiculo=vh.id_vehiculo and vh.id_empresa= emp.id_empresa and vh.id_empresa='$idCompanyExcesos' and (m.fecha between concat('$fechaInimanten',' ','00:00:00') and concat('$fechaFinManten',' ','23:59:00'))  group by id_vehiculo";
    }
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    $empresa=" ";
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByMantenimiento : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_vehiculo:".$myrow["id_vehiculo"].","
                    . "empresa:'" . $myrow["empresa"] . "',"
                    . "vehiculo:'" . $myrow["placa"] . " " . $myrow["marca"] . "',"
                    . "total:".$myrow["totalMantenimiento"].","
                    . "fechaSoatReg:'".$myrow["fechaSoatReg"]. "',"
                    . "fechaSoatVenc:'".$myrow["fechaSoatVenc"]. "',"
                    . "descripSoat:'".$myrow["descripSoat"]. "',"
                    . "fechaMatriculaReg:'".$myrow["fechaMatriculaReg"]. "',"
                    . "fechaMatriculaVenc:'".$myrow["fechaMatriculaVenc"]. "',"
                    . "descripMatricula:'".$myrow["descripMatricula"]. "',"
                    . "fechaSeguroReg:'".$myrow["fechaSeguroReg"]. "',"
                    . "fechaSeguroVenc:'".$myrow["fechaSeguroVenc"]. "',"
                    . "descripSeguro:'".$myrow["descripSeguro"]. "'"
                    
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

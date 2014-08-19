<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT m.id_cbxVehiculos,ev.nombre_servicio,m.kilometro,m.tiempo,"
            . " m.observacion, m.fecha_registro,m.email,"
            . " em.mensaje_email,em.fecha_inicio_evento,"
            . "em.fecha_mail_envio FROM mantenimiento_vehiculo m, "
            . "envio_mails_mantenimiento em,estandars_vehiculo ev"
            . " where( ((m.fecha_registro between '$fecha_Ini_Man' AND '$fecha_Fin_Man'))"
            . "and m.id_cbxEmpresa='$cbxEmpresas') "
            . "and m.id_cbxVehiculos =em.id_unidad and m.id_estandar_vehiculo=ev.id_estandar_vehiculo "
            . "and m.id_cbxVehiculos ='$cbxVeh' group by m.id_cbxVehiculos";


    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$cbxEmpresas';";
        $result1 = $mysqli->query($consultaSql1);
        $myrow1 = $result1->fetch_assoc();
        $empresa = $myrow1['empresa'];
        
        $objJson = "infByMan : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_cbxVehiculos:'" . $myrow["id_cbxVehiculos"] . "',"
                    . "nombre_servicio:'" . utf8_encode($myrow["nombre_servicio"]). "',"
                    . "kilometro: '" . $myrow["kilometro"] . "',"
                    . "tiempo:'" . $myrow["tiempo"] . "',"
                    . "observacion:'" . utf8_encode($myrow["observacion"]) . "',"
                    . "fecha_registro:'" . $myrow["fecha_registro"]. "',"
                    . "email:'" . $myrow["email"]. "',"
                    . "mensaje_email:'" . utf8_encode($myrow["mensaje_email"]). "',"
                    . "fecha_inicio_evento:'" . $myrow["fecha_inicio_evento"]. "',"
                    . "fecha_mail_envio:'" . $myrow["fecha_mail_envio"]. "',"

                    . "},";
        }
        $objJson .="],comp:'" . $empresa . "',fi:'" . $fecha_Ini_Man . "',ff:'" . $fecha_Fin_Man . "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    }
    else {
        echo "{failure: true, msg: 'No hay Datos que mostrar'}";
    }
    $mysqli->close();
}

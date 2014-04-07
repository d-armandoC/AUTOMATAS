<?php

extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT id_empresa, user_company ,"
            . "date_time_company,date_time_reg,phone_company, "
            . "code_company,client_company , sector_company, "
            . "address_company, vehiculo, minute,time_asig, "
            . "placa,atraso, num_house, reference "
            . "From ktaxydb.assigs "
            . "where id_empresa='$cbxEmpresasSof' AND "
            . "vehiculo=(select vehiculo from vehiculos where id_equipo = '$cbxBusesSof' ) "
            . "and date_time_company between '$fechaIni.$horaIni' and '$fechaFin.$horaFin'";


    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $consultaSql1 = "SELECT empresa FROM empresas where id_empresa='$cbxEmpresasSof';";
        $result1 = $mysqli->query($consultaSql1);
        $myrow1 = $result1->fetch_assoc();
        $cbxEmpresasPan = $myrow1['empresa'];
        $haveData = true;
        $objJson = "getCarreras: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_empresa:'" . $myrow["id_empresa"] . "',"
                    . "user_company:'" . $myrow["user_company"] . "',"
                    . "date_time_company:'" . $myrow["date_time_company"] . "',"
                    . "date_time_reg:'" . $myrow["date_time_reg"] . "',"
                    . "phone_company:'" . $myrow["phone_company"] . "',"
                    . "code_company:'" . $myrow["code_company"] . "',"
                    . "client_company:'" . $myrow["client_company"] . "',"
                    . "sector_company:'" . $myrow["sector_company"] . "',"
                    . "address_company:'" . $myrow["address_company"] . "',"
                    . "vehiculo:'" . $myrow["vehiculo"] . "',"
                    . "minute:'" . $myrow["minute"] . "',"
                    . "time_asig:'" . $myrow["time_asig"] . "',"
                    . "num_house:'" . $myrow["num_house"]
                    . "'},";
        }
        $objJson .="],nameEmpresa:'" .$cbxEmpresasPan. "'";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos quee mostrar'}";
    }
    $mysqli->close();
}
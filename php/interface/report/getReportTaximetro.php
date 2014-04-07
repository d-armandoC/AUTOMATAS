<?php

extract($_POST);
//echo $cbxEmpresasPan;
// $fechaIni;
// $fechaFin;
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_equipo,ciudad,fecha,id_empresa,serial,tiquete,hora_inicial,hora_final,"
            . "distancia,costo,paga,hora_registro_servidor,valido,tarifa,banderaso,tiempo_seg FROM taximetro_data where ((fecha between '$fechaIniTax' AND '$fechaFinTax')and (hora_inicial between '$horaIniTax' AND '$horaFinTax'))and id_equipo='$cbxBusesTax' ";


    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;


        $objJson = "datos : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
//                    
                    . "id_equipo:'" . $myrow["id_equipo"] . "',"
                    . "ciudad:'" . $myrow["ciudad"] . "',"
                    . "fecha:'" . $myrow["fecha"] . "',"
                    . "id_empresa:'" . $myrow["id_empresa"] . "',"
                    . "serial:'" . $myrow["serial"] . "',"
                    . "tiquete:'" . $myrow["tiquete"] . "',"
                    . "hora_inicial:'" . $myrow["hora_inicial"] . "',"
                    . "hora_final:'" . $myrow["hora_final"] . "',"
                    . "distancia:'" . $myrow["distancia"] . "',"
                    . "costo:'" . $myrow["costo"] . "',"
                    . "paga:'" . $myrow["paga"] . "',"
                    . "hora_registro_servidor:'" . $myrow["hora_registro_servidor"] . "',"
                    . "valido:'" . $myrow["valido"] . "',"
                    . "tarifa:'" . $myrow["tarifa"] . "',"
                    . "banderaso:'" . $myrow["banderaso"] . "',"
                    . "tiempo_seg:'" . $myrow["tiempo_seg"] . "',"
                    . "},";
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
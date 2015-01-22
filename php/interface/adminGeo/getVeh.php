<?php

extract($_POST);

include ('../../../dll/config.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT v.id_vehiculo,v.id_equipo, v.vehiculo, v.placa, concat(p.apellidos, ' ', p.nombres) as persona
            FROM vehiculos v, personas p
            where v.id_persona = p.id_persona
            and v.id_empresa=$cbxEmpresas
            ORDER BY v.vehiculo;
        ";

    $result = $mysqli->query($consultaSql);
    $haveData = false;
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "datos : [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                text:'" . $myrow["placa"] . "_" . utf8_encode($myrow["vehiculo"]) . "_" . utf8_encode($myrow["persona"]) . "',
                id:" . $myrow["id_vehiculo"] . ",
                placa:'" . $myrow["placa"] . "'  
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
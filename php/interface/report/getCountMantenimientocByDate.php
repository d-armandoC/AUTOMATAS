<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql ="SELECT m.id_vehiculo, vh.placa, vh.marca, emp.empresa, count(*) as totalMantenimiento FROM karviewdb.mantenimiento m, karviewdb.vehiculos vh, karviewdb.empresas emp where m.id_vehiculo=vh.id_vehiculo and vh.id_empresa= emp.id_empresa group by id_vehiculo;";
    $result = $mysqli->query($consultaSql);
    $haveData = false;
    $empresa=" ";
    if ($result->num_rows > 0) {
        $haveData = true;
        $objJson = "countByMantenimiento : [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id_equipo:".$myrow["id_vehiculo"].","
                    . "empresa:'" . $myrow["empresa"] . "',"
                    . "vehiculo:'" . $myrow["placa"] . " " . $myrow["marca"] . "',"
                    . "total:".$myrow["totalMantenimiento"]
                    . "},";
        }
        $objJson .="],comp:'" . $empresa . "',fi:'" . $fecha_Ini_Man . "',ff:'" . $fecha_Fin_Man . "'";
    }

    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos que Mostrar'}";
    }

    $mysqli->close();
}

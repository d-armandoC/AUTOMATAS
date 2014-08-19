<?php
include('../login/isLogin.php');
include ('../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $userKarview = $_SESSION["USERKARVIEW"];
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];
    $consultaSql = "SELECT id_estandar_vehiculo,estandar_vehiculo,tiempo, kilometro FROM karviewdb.estandar_vehiculos;";
    }
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $id_estandar_vehiculo = $myrow["id_estandar_vehiculo"];
            $nombre_servicio = $myrow["estandar_vehiculo"];
            $tiempo = $myrow["tiempo"];
            $kilometro = $myrow["kilometro"];
              $objJson .= "{"
                    . "id:" . ($id_estandar_vehiculo) . ","
                    . "text:'" .($nombre_servicio) . "',"
                    . "tiempo:'" .($tiempo) . "',"
                    . "kilometro:'".($kilometro) . "'},";
        }
        $objJson .="]}";
        echo utf8_encode($objJson);
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
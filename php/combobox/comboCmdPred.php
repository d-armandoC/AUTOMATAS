<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_GET);


if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = "SELECT  cmd.id_cmd_predefinido , cmd.descripcion FROM karviewdb.cmd_predefinidos cmd";
      $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "comandos: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_cmd_predefinido"] . ","
                    . "nombre:'" . utf8_encode($myrow["descripcion"]) . "'},";
        }
        $objJson .="]";
        echo "{success: true, $objJson }";
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }}

    //$salida = "{failure:true}";
//
//$consultaSql = "SELECT  cmd.id_cmd_predefinido , cmd.descripcion FROM karviewdb.cmd_predefinidos cmd";
//
//consulta($consultaSql);
//$resulset = variasFilas();
//
//$salida = "{'comandos': [";
//
//for ($i = 0; $i < count($resulset); $i++) {
//    $fila = $resulset[$i];
//    $salida .= "{
//            'id':'" . $fila["id_cmd_predefinido"]. "',
//            'nombre':'" . utf8_encode($fila["descripcion"]) . "'
//        }";
//    if ($i != count($resulset) - 1) {
//        $salida .= ",";
//    }
//}
//
//$salida .="]}";
//
//echo $salida;
//
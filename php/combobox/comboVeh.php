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

    if ($idRol == 4) {


        $consultaSql = "SELECT v.id_vehiculo,v.id_equipo, v.vehiculo, v.reg_municipal, v.placa, concat(p.apellidos, ' ', p.nombres) as persona
            FROM vehiculos v, personas p
            where v.id_persona = p.id_persona
            and v.id_vehiculo = 
                    (SELECT id_vehiculo 
                    FROM vehiculos 
                    WHERE id_persona = $idPersona                    
                    )
        ";
    } else {
        $consultaSql = "SELECT v.id_vehiculo,v.id_equipo, v.vehiculo, v.placa, concat(p.apellidos, ' ', p.nombres) as persona
            FROM vehiculos v, personas p
            where v.id_persona = p.id_persona
            and v.id_empresa=$cbxEmpresas
            ORDER BY v.vehiculo;
        ";
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $idEqp = $myrow["id_equipo"];
            $veh = $myrow["vehiculo"];
            $placa = $myrow["placa"];
            $persona = $myrow["persona"];

            $objJson .= "{"
                    . "id:" . $myrow["id_vehiculo"] . ","
                    . "text:'" .$placa . ' - ' . $veh . ' - ' . $persona . "'"
                    . "},";
        }
        $objJson .="]}";
        echo utf8_encode($objJson);
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}
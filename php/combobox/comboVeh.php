<?php

include('../login/isLogin.php');
include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
    $idPersona = $_SESSION["IDPERSONKTAXY"];
    $idRol = $_SESSION["IDROLKTAXY"];

    if ($idRol == 4) {
        $consultaSql = "SELECT v.id_equipo, v.vehiculo, v.reg_municipal, v.icon, v.estado, v.placa, concat(p.apellidos, ' ', p.nombres) as persona
            FROM vehiculos v, personas p
            where v.id_propietario = p.id_persona
            and v.id_equipo = 
                    (SELECT id_equipo 
                    FROM vehiculos 
                    WHERE id_propietario = $idPersona                    
                    )
        ";
    } else {
        $consultaSql = "SELECT v.id_equipo, v.vehiculo, v.reg_municipal, v.icon, v.estado, v.placa, concat(p.apellidos, ' ', p.nombres) as persona
            FROM vehiculos v, personas p
            where v.id_propietario = p.id_persona
            and v.id_empresa = '$cbxEmpresas'
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
            $regMunicipal = $myrow["reg_municipal"];
            $placa = $myrow["placa"];
            $persona = $myrow["persona"];

            $objJson .= "{"
                    . "id:'" . utf8_encode($idEqp) . "',"
                    . "text:'" . utf8_encode($idEqp . ' - ' . $regMunicipal . ' - ' . $placa . ' - ' . $veh . ' - ' . $persona) . "'"
                    . "},";
        }

        $objJson .="]}";
        echo utf8_encode($objJson);
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}
<?php
include('../login/isLogin.php');
include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "Error: No ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.";  
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKARVIEW"];
    $idPersona = $_SESSION["IDPERSONKARVIEW"];
    $idRol = $_SESSION["IDROLKARVIEW"];

    if ($idRol == 1 || $idRol == 2) {
        $expand = 'false';
        $consultaSql = 
            "SELECT v.id_vehiculo, v.id_equipo, v.vehiculo, v.icono, 
            e.id_empresa, e.empresa, p.nombres, p.apellidos
            FROM vehiculos v, empresas e, personas p
            WHERE v.id_empresa = e.id_empresa
            AND v.id_persona = p.id_persona
             ORDER BY e.empresa, v.vehiculo
"
        ;
    } else if ($idRol == 4) {
        $expand = 'true';
        $consultaSql = 
            "SELECT v.id_vehiculo,v.id_equipo, v.vehiculo, v.icono, 
            e.id_empresa, e.empresa, p.nombres, p.apellidos
            FROM vehiculos v, empresas e, personas p
            WHERE v.id_empresa = e.id_empresa
            AND v.id_persona = p.id_persona
            AND v.id_persona = '$idPersona'"
        ;
    } else {
        $expand = 'true';
        $consultaSql = 
            "SELECT v.id_vehiculo,v.id_equipo, v.vehiculo, v.icono,
            e.id_empresa, e.empresa, p.nombres, p.apellidos
            FROM vehiculos v, empresas e, personas p
            WHERE v.id_empresa = e.id_empresa
            AND v.id_persona = p.id_persona
            AND e.id_empresa = '$idEmpresa'
            ORDER BY v.vehiculo"
        ;
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $compare = '';

    if ($result->num_rows > 0) {
        $objJson = "[";
        while ($myrow = $result->fetch_assoc()) {
            $idCoop = $myrow["id_empresa"];            
            $idEqp = $myrow["id_vehiculo"];
            $veh = $myrow["vehiculo"];
            $owner = utf8_encode($myrow["apellidos"].' '.$myrow["nombres"]);
            $iconVeh = $myrow["icono"];
            if ($compare != $idCoop) {
                if ($compare != '') {
                    $objJson .= "]},";
                }
                $compare = $idCoop;
                $nameCoop = $myrow["empresa"];
                $iconCoop = "img/icon_empresa.png";
                $objJson .= "{text:'" . utf8_encode($nameCoop) . "',
                expanded:".$expand.",
                id: 'coop_".$idCoop."',
                icon: '". utf8_encode($iconCoop) ."', 
                leaf: false,
                children:[{text: 'N° ".$veh.": " . $owner . "',
                icon: '". utf8_encode($iconVeh) ."',
                id: '" . $idCoop . '_' . $idEqp . "',
                leaf:true},";
            } else {
                $objJson .= "{text: 'N° ".$veh.": " . $owner . "',
                icon: '". utf8_encode($iconVeh) ."',
                id: '" . $idCoop . '_' . $idEqp . "',
                leaf:true},";
            }
        }
        $objJson .= "]}]";
        echo $objJson;
    } else {
        echo "No hay datos que obtener";
    }
}

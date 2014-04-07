<?php

include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    //echo "Error: No se ha podido conectar a la Base de Datos.";
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
    $idPersona = $_SESSION["IDPERSONKTAXY"];
    $idRol = $_SESSION["IDROLKTAXY"];

    if ($idRol == 4) {
        $consultaSql = "select v.id_empresa, u.id_equipo, u.latitud, u.longitud, u.fecha,"
                . "u.hora, v.placa, v.vehiculo, u.velocidad, u.rumbo, u.direccion, se.desc_evento, u.parametro, v.icon, e.empresa "
                . "from ultimos_gps u, vehiculos v, empresas e, sky_eventos se "
                . "where u.id_equipo = v.id_equipo "
                . "and v.id_empresa = e.id_empresa "
                . "and u.parametro = se.parametro "
                . "and u.id_equipo = "
                . "(select id_equipo "
                . "from vehiculos "
                . "where id_propietario = $idPersona)"
        ;
    } else {
        $coopString = "";
        $coop = explode(";", $listCoop);
        for ($i = 0; $i < count($coop); $i++) {
            $coopString .= "'" . $coop[$i] . "',";
        }

        $coopString = substr($coopString, 0, -1);

        $consultaSql = "select v.id_empresa, u.id_equipo, u.latitud, u.longitud, u.fecha, "
            . "u.hora, v.placa, v.vehiculo, u.velocidad, u.rumbo, u.direccion, se.desc_evento, u.parametro, v.icon, e.empresa "
            . "from ultimos_gps u, vehiculos v, empresas e, sky_eventos se "
            . "where u.id_equipo = v.id_equipo "
            . "and v.id_empresa = e.id_empresa "
            . "and u.parametro = se.parametro "
            . "and v.id_empresa in ($coopString)"
        ;
    }

    $result = $mysqli->query($consultaSql);

    if ($result->num_rows > 0) {
        $objJson = "{dataGps: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "idCoop: '" . $myrow["id_empresa"] . "',"
                    . "company: '" . utf8_encode($myrow["empresa"]) . "',"
                    . "idEqp: '" . $myrow["id_equipo"] . "',"
                    . "vehiculo: " . $myrow["vehiculo"] . ","
                    . "nombre: '" . utf8_encode('VH: ' . $myrow["placa"] . ' - ' . $myrow["vehiculo"]) . "',"
                    . "lat: " . $myrow["latitud"] . ","
                    . "lon: " . $myrow["longitud"] . ","
                    . "fec: '" . $myrow["fecha"] . "',"
                    . "hor: '" . $myrow["hora"] . "',"
                    . "vel: " . $myrow["velocidad"] . ","
                    . "rumbo: " . $myrow["rumbo"] . ","
                    . "dir: '" . utf8_encode($myrow["direccion"]) . "',"
                    . "evt: '" . utf8_encode($myrow["desc_evento"]) . "',"
                    . "idEvt: " . $myrow["parametro"] . ","
                    . "icon: '" . $myrow["icon"] . "'},";
        }
        $objJson.= "]}";

        echo $objJson;
    } else {
        //echo "No hay datos que Obtener";
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}

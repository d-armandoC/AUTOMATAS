<?php
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = 
        "SELECT v.id_vehiculo, v.placa, v.id_equipo, v.id_empresa,
        v.vehiculo, v.id_propietario, v.reg_municipal, v.year,
        v.marca, v.modelo, v.num_motor, v.num_chasis, v.image,
        v.imei, v.id_operadora, v.lugar_instalacion,
        v.have_taximetro, v.id_taximetro, v.fecha_instalacion, v.fecha_hora_registro,
        v.id_interfaz, v.id_tipo_equipo, v.observacion, v.num_chip, v.num_cel,
        e.empresa, p.nombres, p.apellidos, CONCAT(pt.apellidos, ' ', pt.nombres) as id_tecnico
        FROM vehiculos v, empresas e, personas p, personas pt
        WHERE v.id_empresa = e.id_empresa
        AND v.id_propietario = p.id_persona
        AND v.id_tecnico = pt.id_persona
        ORDER BY e.empresa, v.vehiculo
        ";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idVeh:".$myrow["id_vehiculo"].",
                placa:'" . utf8_encode($myrow["placa"]) . "',
                idEquipo:'" . utf8_encode($myrow["id_equipo"]) . "',
                idEmpresa:'" . utf8_encode($myrow["id_empresa"]) . "',
                vehiculo:'" . utf8_encode($myrow["vehiculo"]) . "',
                cbxPropietario:".$myrow["id_propietario"].",
                regMunicipal:'" . utf8_encode($myrow["reg_municipal"]) . "',
                year:" . $myrow["year"] . ",
                marca:'" . utf8_encode($myrow["marca"]) . "',
                modelo:'" . utf8_encode($myrow["modelo"]) . "',
                numMotor:'" . utf8_encode($myrow["num_motor"]) . "',
                numChasis:'" . utf8_encode($myrow["num_chasis"]) . "',
                labelImage:'" . utf8_encode($myrow["image"]) . "',
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                persona:'" . utf8_encode($myrow["nombres"]." ".$myrow["apellidos"]) . "',
                chip:'" . utf8_encode($myrow["num_chip"]) . "',
                celular:'" . utf8_encode($myrow["num_cel"]) . "',
                imei:'" . utf8_encode($myrow["imei"]) . "',
                cbxOperadora:" . $myrow["id_operadora"] . ",
                cbxTecnico:'" . utf8_encode($myrow["id_tecnico"]) . "',
                siteInst:'" . utf8_encode($myrow["lugar_instalacion"]) . "',
                cbxTaximetro:'" . $myrow["have_taximetro"] . "',
                idTaximetro:'" . utf8_encode($myrow["id_taximetro"]) . "',
                dateInst:'" . $myrow["fecha_instalacion"] . "',
                dateTimeRegistro:'" . $myrow["fecha_hora_registro"] . "',
                cbxInterfaz:" . $myrow["id_interfaz"] . ",
                cbxTipoEquipo:" . $myrow["id_tipo_equipo"] . ",
                obser:'" . utf8_encode($myrow["observacion"]) . "'
            },";
        }
        $objJson .= "]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
?>

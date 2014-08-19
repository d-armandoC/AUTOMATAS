<?php
include ('../../../dll/config.php');
extract($_GET);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = 
        "SELECT v.id_vehiculo, v.placa, v.id_equipo, eqp.equipo, v.id_empresa,
        v.vehiculo, v.id_persona, v.year,
        v.marca, v.modelo, v.num_motor, v.num_chasis, v.imagen,
        v.observacion,v.id_clase_vehiculo, cv.clase_vehiculo,
        e.empresa, p.nombres, p.apellidos, CONCAT(pt.apellidos, ' ', pt.nombres) as id_tecnico
        FROM vehiculos v, empresas e, personas p, personas pt, equipos eqp, karviewdb.clase_vehiculos cv
        WHERE v.id_empresa = e.id_empresa
        AND v.id_persona = p.id_persona 
        AND v.id_clase_vehiculo=cv.id_clase_vehiculo
        AND v.id_persona = pt.id_persona
       AND v.id_equipo = eqp.id_equipo
       ORDER BY e.empresa, v.vehiculo
        ";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{veh: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idVeh:'".$myrow["id_vehiculo"]."',
                placa:'" . utf8_encode($myrow["placa"]) . "',
                equipo:'".utf8_encode($myrow["equipo"]) . "',
                idEmpresa:'".$myrow["id_empresa"]. "',
                vehiculo:'" . utf8_encode($myrow["vehiculo"]) . "',
                cbxPropietario:'".$myrow["id_persona"]."',
                year:'".$myrow["year"]."',
                marca:'" . utf8_encode($myrow["marca"]) . "',
                modelo:'" . utf8_encode($myrow["modelo"]) . "',
                numMotor:'" . utf8_encode($myrow["num_motor"]) . "',
                numChasis:'" . utf8_encode($myrow["num_chasis"]) . "',
                labelImage:'" . utf8_encode($myrow["imagen"]) . "',
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                persona:'" . ($myrow["nombres"]." ".$myrow["apellidos"]) . "',
                clase_vehiculo:'".$myrow["clase_vehiculo"]. "',
                obser:'".utf8_encode($myrow["observacion"])."',
                cbxClaseVehiculo:'".$myrow["id_clase_vehiculo"]."'
            },";
        }
        $objJson .= "]}";

        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
?>

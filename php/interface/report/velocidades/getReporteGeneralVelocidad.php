<?php

include ('../../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.'}";
} else {
    if ($idCompanyExcesosDT == 1) {
        $consultaSql = "select ev.id_vehiculo,sum(ev.cantidad) as totalCant,"
                . "sum(ev.velocidad_maxima) as totalVel,e.empresa,concat(p.apellidos,' ',p.nombres)as persona, "
                . "v.reg_municipal,v.placa "
                . "FROM kbushistoricodb.exceso_velocidades ev, kbusdb.vehiculos v,kbusdb.personas p,kbusdb.empresas e where ev.id_vehiculo=v.id_vehiculo and v.id_persona=p.id_persona and  v.id_empresa=e.id_empresa and ev.fecha between '$fechaIniExcesos' and '$fechaFinExcesos'  group by ev.id_vehiculo";

        $result = $mysqli->query($consultaSql);
        $promedio = 0;
        $vehiculo = 0;
        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $vehiculo = $myrow["id_vehiculo"];
                $consultaSql1 = "SELECT count(*) as total FROM kbushistoricodb.exceso_velocidades where id_vehiculo='$vehiculo' and fecha between '$fechaIniExcesos' and '$fechaFinExcesos' group by id_vehiculo";
                $result1 = $mysqli->query($consultaSql1);
                $myrow1 = $result1->fetch_assoc();
                $promedio = $myrow["totalVel"] / $myrow1["total"];
                $json .= "{"
                        . "vehiculo: " . $myrow["id_vehiculo"] . ","
                        . "reg_municipal: '" . $myrow["reg_municipal"] . "',"
                        . "persona: '" . utf8_encode($myrow["persona"]) . "',"
                        . "empresa: '" . utf8_encode($myrow["empresa"]) . "',"
                        . "placa:' " . $myrow["placa"] . "',"
                        . "totalCant: " . $myrow["totalCant"] . ","
                        . "totalVel: " . $promedio . ","
                        . "},";
            }
            $json .="]";
            $mysqli->close();

            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    } else {
        $consultaSql = "select ev.id_vehiculo,sum(ev.cantidad) as totalCant,"
                . "sum(ev.velocidad_maxima) as totalVel,e.empresa,concat(p.apellidos,' ',p.nombres)as persona, "
                . "v.reg_municipal,v.placa "
                . "FROM kbushistoricodb.exceso_velocidades ev, kbusdb.vehiculos v,kbusdb.personas p,kbusdb.empresas e where ev.id_vehiculo=v.id_vehiculo and v.id_persona=p.id_persona and  v.id_empresa=e.id_empresa and ev.fecha between '$fechaIniExcesos' and '$fechaFinExcesos' and e.id_empresa='$idCompanyExcesosDT' group by ev.id_vehiculo";

        $result = $mysqli->query($consultaSql);
        $promedio = 0;
        $vehiculo = 0;
        if ($result->num_rows > 0) {
            $json = "data: [";
            while ($myrow = $result->fetch_assoc()) {
                $vehiculo = $myrow["id_vehiculo"];
                $consultaSql1 = "SELECT count(*) as total FROM kbushistoricodb.exceso_velocidades where id_vehiculo='$vehiculo' and fecha between '$fechaIniExcesos' and '$fechaFinExcesos' group by id_vehiculo";
                $result1 = $mysqli->query($consultaSql1);
                $myrow1 = $result1->fetch_assoc();
                $promedio = $myrow["totalVel"] / $myrow1["total"];
                $json .= "{"
                        . "vehiculo: " . $myrow["id_vehiculo"] . ","
                        . "reg_municipal: '" . $myrow["reg_municipal"] . "',"
                        . "persona: '" . utf8_encode($myrow["persona"]) . "',"
                        . "empresa: '" . utf8_encode($myrow["empresa"]) . "',"
                        . "placa:' " . $myrow["placa"] . "',"
                        . "totalCant: " . $myrow["totalCant"] . ","
                        . "totalVel: " . $promedio . ","
                        . "},";
            }
            $json .="]";
            $mysqli->close();

            echo "{success: true, $json}";
        } else {
            echo "{failure: true, message:'No hay datos entre estas Fechas y Horas.'}";
        }
    }
}
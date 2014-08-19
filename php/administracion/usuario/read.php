<?php
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $consultaSql = 
        "SELECT u.id_usuario, p.cedula, p.nombres, p.apellidos,
        ru.nombre, e.empresa, u.usuario, u.clave, p.id_persona, e.id_empresa
        FROM usuarios u, personas p, rol_usuarios ru, empresas e
        WHERE u.id_persona = p.id_persona
        AND u.id_rol_usuario = ru.id_rol_usuario
        AND u.id_empresa = e.id_empresa
        order by p.apellidos";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    
    if ($result->num_rows > 0) {
        $objJson = "{usuarios: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idUser:".$myrow["id_usuario"].",
                cedula:'" . $myrow["cedula"] . "',
                idPerson:".$myrow["id_persona"].",
                person:'" . utf8_encode($myrow["apellidos"]." ".$myrow["nombres"]) . "',
                rol:'" . utf8_encode($myrow["nombre"]) . "',
                idEmp:" . utf8_encode($myrow["id_empresa"]) . ",
                empresa:'" . utf8_encode($myrow["empresa"]) . "',
                usuario:'" . utf8_encode($myrow["usuario"]) . "',
                clave:'" . utf8_encode($myrow["clave"]) . "'            
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
?>

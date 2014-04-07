<?php
include('../../login/isLogin.php');
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $idEmpresa = $_SESSION["IDCOMPANYKTAXY"];
    $idRol = $_SESSION["IDROLKTAXY"];

    if ($idRol == 1) {
        $consultaSql = 
            "SELECT ee.empresa, p.id_persona, p.cedula, p.nombres,
            p.apellidos, p.email, e.empleo, p.fecha_nacimiento, p.direccion,
            p.celular
            FROM personas p, empleos e, empresas ee
            WHERE p.id_empleo = e.id_empleo
            AND p.id_empresa = ee.id_empresa
            ORDER BY p.apellidos
        ";
    } else {
        $consultaSql = 
            "SELECT ee.empresa, p.id_persona, p.cedula, p.nombres,
            p.apellidos, p.email, e.empleo, p.fecha_nacimiento, p.direccion,
            p.celular
            FROM personas p, empleos e, empresas ee
            WHERE p.id_empleo = e.id_empleo
            AND p.id_empresa = ee.id_empresa
            AND P.ID_EMPRESA = '$idEmpresa'
            ORDER BY p.apellidos
        ";
    }

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{personas: [";

        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{            
                idPerson:".$myrow["id_persona"].",
                empresa:'".utf8_encode($myrow["empresa"])."',
                cedula:'" . $myrow["cedula"] . "',
                nombres:'" . utf8_encode($myrow["nombres"]) . "',
                apellidos:'" . utf8_encode($myrow["apellidos"]) . "',            
                email:'" . utf8_encode($myrow["email"]) . "',
                cbxEmpleo:'" . utf8_encode($myrow["empleo"]) . "',
                fechaNacimiento:'" . $myrow["fecha_nacimiento"] . "',
                direccion:'" . utf8_encode($myrow["direccion"]) . "',
                celular:'" .$myrow["celular"] . "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
?>

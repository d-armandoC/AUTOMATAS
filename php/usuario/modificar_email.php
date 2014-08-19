<?php

extract($_POST);
include("../login/isLogin.php");
$userKarview = $_SESSION["USERKARVIEW"];
//echo $userKTaxy;

include ('../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la base de datos,<br>compruebe su conexión a la internet.'}";
} else {
    $consultaPersona = "SELECT p.id_persona FROM  personas p, usuarios u where p.id_persona=u.id_persona and u.usuario='$userKarview'";
    $result = $mysqli->query($consultaPersona);
    $miFila = $result->fetch_assoc();
    $persona = $miFila['id_persona'];
    if ($result->num_rows == 1) {
        $insertSql = "UPDATE personas SET email='$new_email' where id_persona='$persona'";
        if (!$mysqli->query($insertSql)) {
            echo "{failure: true, msg: 'Problemas al modificar en la base de datos.'}";
        } else {
            $_SESSION["EMAIL"] = $new_email;
            echo '{success: true, msg: "Email modificado correctamente."}';
        }
    } else {
        echo "{failure: true, msg: 'Ingrese correctamente.'}";
    }
    $mysqli->close();
}
 
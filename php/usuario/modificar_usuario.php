<?php

extract($_POST);
include("../login/isLogin.php");
$userKarview = $_SESSION["USERKARVIEW"];
$val = 1;
include ('../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la base de datos,<br>compruebe su conexión a la internet.'}";
} else {
    $consul = "select usuario from usuarios";
    $result = $mysqli->query($consul);
    while ($myrow = $result->fetch_assoc()) {
        if (strcmp($myrow['usuario'], $confirm_usuario) == 0) {
            $val = 0;
            break;
        }
    }

    if ($val == 0) {
        echo "{failure: true, msg: 'El usuario ya existe.'}";
    } else {
        if ($val == 1) {
            $consul1 = "SELECT id_usuario FROM  usuarios where usuario='$userKarview'";
            $result1 = $mysqli->query($consul1);
            $myrow1 = $result1->fetch_assoc();
            $id_usuario = $myrow1['id_usuario'];
            echo $id_usuario;

            $insertSql = "UPDATE usuarios SET usuario='$confirm_usuario' WHERE id_usuario = '$id_usuario'";

            if (!$mysqli->query($insertSql)) {
                echo "{failure: true, msg: 'Problemas al modificar en la base de datos.'}";
            } else {
                $_SESSION["USERKARVIEW"] = $confirm_usuario;
                echo '{success: true, msg: "Usuario modificado correctamente."}';
            }
        }
    }
    $mysqli->close();
}
  
 
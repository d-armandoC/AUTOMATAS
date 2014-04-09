<?php
extract($_POST);
include("../login/isLogin.php");
 $userKTaxy = $_SESSION["USERKARVIEW"]; 
 
  
$salt = "KR@D@C";
$passwordencript = md5(md5(md5($passwordInitial) . md5($salt)));
$passwordNew = md5(md5(md5($newpassword) . md5($salt)));
include ('../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{failure:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $insertSql = "select * from usuarios where usuario='$userKTaxy' and clave= '$passwordencript'";
    $result = $mysqli->query($insertSql);
    if ($result->num_rows == 1) {
        $insertSql = "UPDATE usuarios SET clave='$passwordNew' WHERE clave = '$passwordencript' AND usuario = '$userKTaxy'";
        if (!$mysqli->query($insertSql)) {
            echo "{failure: true, msg: 'Problemas al Insertar Datos'}";
        } else {
            echo '{success:true, msg: "Contraseña Modificada."}';
        }
    } else {
        echo "{failure: true, msg: 'Usuario no Registrado o Usted no esta en Su Propia Cuenta'}";
    }
    $mysqli->close();
}
  
 

 
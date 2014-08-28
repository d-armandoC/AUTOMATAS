<?php
include ('../../dll/config.php');
include('isLogin.php');
//cerrarConexion();

session_destroy();
header('Location: ../../index.php');
?>
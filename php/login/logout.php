<?php
include('isLogin.php');
require_once('../../dll/conect.php');
cerrarConexion();

session_destroy();
header('Location: ../../index.php');
?>
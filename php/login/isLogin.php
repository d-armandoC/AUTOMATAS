<?php
//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
	session_start();
} else {
	//$rutaPrincipal = "http://200.0.29.121:8080/k-taxy/";
	$rutaPrincipal = "index.php";

	//Comprobar si esta logeado
	if (!isset($_SESSION["IDCOMPANYKTAXY"]) || 
		!isset($_SESSION["USERKTAXY"]) || 
		!isset($_SESSION["SESIONKTAXY"])) {    
	    header("Location: $rutaPrincipal");
		exit();
	}
}
?>


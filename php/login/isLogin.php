<?php
//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
	session_start();
} else {
	//$rutaPrincipal = "http://200.0.29.121:8080/k-taxy/";
	$rutaPrincipal = "index.php";

	//Comprobar si esta logeado
	if (!isset($_SESSION["IDCOMPANYKARVIEW"]) || 
		!isset($_SESSION["USERKARVIEW"]) || 
		!isset($_SESSION["SESIONKARVIEW"])) {    
	    header("Location: $rutaPrincipal");
		exit();
	}
}
?>


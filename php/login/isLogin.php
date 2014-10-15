<?php
//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
	session_start();
} else {
	//$rutaPrincipal = "";
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


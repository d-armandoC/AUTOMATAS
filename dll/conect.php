<?php

$Conexion_ID = 0;
$Consulta_ID = 0;


/* numero de error y texto error */
$Errno = 0;
$Error = "";
$BaseDatos = "karviewdb";
$Servidor = "localhost";
$Usuario = "root";
$pss = "";

// Conectamos al servidor
$Conexion_ID = mysql_connect($Servidor, $Usuario, $pss);

if (!$Conexion_ID) {
    $Error = "Error: No te has podido conectar a la Base de Datos.";
    echo "<script>alert('$Error');</script>";    
    echo "<script>location.href='../../index.php'</script>";
    //exit();
} else {
    
    $_SESSION["idBD"] = $Conexion_ID;
}

//seleccionamos la base de datos
if (!@mysql_select_db($BaseDatos, $Conexion_ID)) {
    $Error = "Imposible abrir " . $BaseDatos;
    echo $Error;
}


/* Ejecuta un consulta */
function consulta($sql) {
    if ($sql == "") {
        $Error = "No ha especificado una consulta SQL";
        return 0;
    }
    //ejecutamos la consulta
    $resultado = mysql_query($sql, $_SESSION["idBD"]);
    /*echo $resultado;
    if (!$resultado) {
        $Errno = mysql_errno();
        $Error = mysql_error();
        return 0;
    } else {
        return 1;
    }*/
    @$_SESSION["idSQL"] = mysql_query($sql, $_SESSION["idBD"]);
    if (!$_SESSION["idSQL"]) {
        $Errno = mysql_errno();
        $Error = mysql_error();
        return 0;
    }else{
        return 1;
    }
}

/*
 * Consulta JSON
 *
 */
function consultaJSON($sql){
    return mysql_query($sql, $_SESSION["idBD"]);
}

/*
 * Devuelve todas las filas de la Consulta
 * de forma que es un Array dentro de otro.
 * (nombres de campos en MAYUSCULAS)
 *
 */
function variasFilas() {
    $vector = null;
    $pos = 0;

    while ($row = @mysql_fetch_row($_SESSION["idSQL"])) {
        $fila = "";
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = @mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

/*
 * Devuelve la primer fila de la consulta
 * (nombres de campos en MAYUSCULAS)
 */
function unicaFila() {

    $fila = "";
    while ($row = mysql_fetch_row($_SESSION["idSQL"])) {
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }        
        return $fila;
    }
}

/*
 * Se termina la conexi�n esto por cada sesi�n.
 */
function cerrarConexion() {
    @mysql_close($_SESSION["idBD"]);
}

?>

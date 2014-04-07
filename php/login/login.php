<?php

include ('../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    $Error = "Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.";
    echo "<script>alert('$Error');</script>";
    echo "<script>location.href='../../index.php'</script>";
} else {
    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($ps) . md5($salt)));

    $consultaSql = "SELECT u.id_usuario, u.usuario, u.id_rol_usuario, 
        u.id_persona, e.id_empresa, e.empresa, p.nombres, p.apellidos
        FROM usuarios u, personas p, empresas e
        WHERE u.id_persona = p.id_persona
        AND u.id_empresa = e.id_empresa
        AND u.usuario = ?
        AND u.clave = ?
        "
    ;

    /* crear una sentencia preparada */
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("ss", $us, $encriptClave);
        /* ejecutar la consulta */
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $myrow = $result->fetch_assoc();

            // Deteccion de la ip y del proxy
            if (isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"])) {
                $ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
                $array = split(",", $ip);
                $host = @gethostbyaddr($ip_proxy);
                $ip_proxy = $HTTP_SERVER_VARS["REMOTE_ADDR"];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
                $host = @gethostbyaddr($ip);
            }

            $idUsuario = $myrow["id_usuario"];
            //$fecha = @date("Y-m-d");
            //$hora = @date("H:i:s");

            $consultaSql = "INSERT INTO accesos_historico (ip, host, id_usuario, fecha, hora, latitud, longitud)
                VALUES (?,?,?,DATE(NOW()),TIME(NOW()),?,?)
                "
            ;
            $stmt = $mysqli->prepare($consultaSql);

            if ($stmt) {
                $stmt->bind_param("ssidd", $ip, $host, $idUsuario, $latitud, $longitud);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    session_start();
                    $_SESSION["INIKTAXY"] = 'http://200.0.29.117:8080/k-taxy/';
                    $_SESSION["IDCOMPANYKTAXY"] = $myrow["id_empresa"];
                    $_SESSION["IDPERSONKTAXY"] = $myrow["id_persona"];
                    $_SESSION["COMPANYKTAXY"] = utf8_encode($myrow["empresa"]);
                    $_SESSION["IDUSERKTAXY"] = $myrow["id_usuario"];
                    $_SESSION["USERKTAXY"] = utf8_encode($myrow["usuario"]);
                    $_SESSION["IDROLKTAXY"] = $myrow["id_rol_usuario"];
                    $_SESSION["PERSONKTAXY"] = utf8_encode($myrow["apellidos"] . " " . $myrow["nombres"]);
                    $_SESSION["SESIONKTAXY"] = true;

                    switch ($myrow["id_rol_usuario"]) {
                        case 1:
                            $_SESSION["NAMESESIONKTAXY"] = "index_admin.php";
                            echo "<script type='text/javascript'>location.href='../../index_admin.php'</script>";
                            break;
                        case 2:
                            $_SESSION["NAMESESIONKTAXY"] = "index_central.php";
                            echo "<script type='text/javascript'>location.href='../../index_central.php'</script>";
                            break;
                        case 3:
                            $_SESSION["NAMESESIONKTAXY"] = "index_municipio.php";
                            echo "<script type='text/javascript'>location.href='../../index_municipio.php'</script>";
                            break;
                        case 4:
                            $_SESSION["NAMESESIONKTAXY"] = "index_propietario.php";
                            echo "<script type='text/javascript'>location.href='../../index_propietario.php'</script>";
                            break;
                        case 6:
                            $_SESSION["NAMESESIONKTAXY"] = "index_usuarios.php";
                            echo "<script type='text/javascript'>location.href='../../index_usuarios.php'</script>";
                            break;
                    }
                } else {
                    $Error = utf8_decode("Problemas al Insertar en la Tabla.");
                    echo "<script>alert('$Error');</script>";
                    echo "<script>location.href='../../index.php'</script>";
                }
            } else {
                $Error = utf8_decode("Problemas en la Construcción de la Consulta.");
                echo "<script>alert('$Error');</script>";
                echo "<script>location.href='../../index.php'</script>";
            }
        } else {
            $Error = utf8_decode("Usuario o Contraseña Incorrectas");
            echo "<script>alert('$Error');</script>";
            echo "<script>location.href='../../index.php'</script>";
        }
    } else {
        $Error = utf8_decode("Problemas en la Construcción de la Consulta.");
        echo "<script>alert('$Error');</script>";
        echo "<script>location.href='../../index.php'</script>";
    }

    $stmt->close();
    $mysqli->close();
}
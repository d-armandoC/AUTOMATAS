<?php

include('../login/isLogin.php');

extract($_POST);

if (isset($_SESSION["IDROLKTAXY"])) {
    if ((int)$idRolKTaxy !== $_SESSION["IDROLKTAXY"]) {
        echo "1";
    } else {
        echo "0";
    }
} else {
    echo "1";
}


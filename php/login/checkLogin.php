<?php

include('../login/isLogin.php');

extract($_POST);

if (isset($_SESSION["IDROLKARVIEW"])) {
    if ((int)$idRolKarview !== $_SESSION["IDROLKARVIEW"]) {
        echo "1";
    } else {
        echo "2";
    }
} else {
    echo "1";
}


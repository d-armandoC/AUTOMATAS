<?php
    if (isset($_SESSION["IDROLKARVIEW"])) {
        echo $_SESSION["IDROLKARVIEW"];
    }else{
         header("Location: ../index.php");
    }

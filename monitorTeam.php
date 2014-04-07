<?php
    include("php/login/isLogin.php");
    if (!isset($_SESSION["IDROLKTAXY"])) {
      header("Location: index.php");
    } else {
        if ($_SESSION["IDROLKTAXY"] == 2) {
            header("Location: index_central.php");
        } else if ($_SESSION["IDROLKTAXY"] == 3) {
            header("Location: index_municipio.php");
        } else if ($_SESSION["IDROLKTAXY"] == 4) {
            header("Location: index_propietario.php");
        } else if ($_SESSION["IDROLKTAXY"] == 6) {
            header("Location: index_usuarios.php");
        }
    }
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>K-Taxy</title>
        <link rel="shortcut icon" href="img/icon_monitoreo.png" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/resources/css/ext-all.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/css/ItemSelector.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/grid/css/RangeMenu.css">
        
        <link rel="stylesheet" type="text/css" href="css/monitorTeam.css">
        
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/ext-all.js"></script>
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/examples/example-data.js"></script>
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/examples/shared/examples.js"></script>
        
        <script type="text/javascript">
            <?php            
            echo "
                var idRolKTaxy = ".$_SESSION["IDROLKTAXY"].";
                ";
            ?>
        </script>
        
        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script type="text/javascript" src="js/options/monitorTeam.js"></script>
    </head>
    <body oncontextmenu = "return false">        
        <header></header>
        <nav></nav>
        <footer></footer>
    </body>
</html>
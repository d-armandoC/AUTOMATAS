<?php
    include("dll/config.php");
    include("php/login/isLogin.php");
    if (!isset($_SESSION["IDROLKARVIEW"])) {
      header("Location: index.php");
    } else {
        if ($_SESSION["IDROLKARVIEW"] == 1) {
            header("Location: index_admin.php");
        } else if ($_SESSION["IDROLKARVIEW"] == 2) {
            header("Location: index_central.php");
        } else if ($_SESSION["IDROLKARVIEW"] == 3) {
            header("Location: index_municipio.php");
        } else if ($_SESSION["IDROLKARVIEW"] == 4) {
            header("Location: index_propietario.php");
        }
    }
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon?>" type="image/x-icon">
        <!--Vuelve a la visualizacion del viewport adaptable al tamaño del dispositivo--> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/resources/css/ext-all.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/shared/example.css">
        
        <link rel="stylesheet" type="text/css" href="css/style_user.css"/>
        
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/ext-all.js"></script>
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/examples/example-data.js"></script>
        <script type="text/javascript" src="extjs-docs-4.2.2/extjs-build/examples/shared/examples.js"></script>
        
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>

        <script type="text/javascript">
            <?php            
            echo "               
                var idCompanyKarview = '".$_SESSION["IDCOMPANYKARVIEW"]."';
                var userKarview = '".$_SESSION["USERKARVIEW"]."';
                var idRolKarview = ".$_SESSION["IDROLKARVIEW"].";
                var personKarview = '".$_SESSION["PERSONKARVIEW"]."';
                ";
            ?>
        </script>

        <script type="text/javascript" src="js/requerid/stores.js"></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>

        <script type="text/javascript" src="js/roles/usuarios.js"></script>
        <script type="text/javascript" src="js/mapa_user.js"></script>
    </head>
    <body oncontextmenu = "return false">
        <header></header>
        <nav></nav>
        <footer></footer>
    </body>
</html>
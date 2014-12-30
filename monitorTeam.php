<?php
include("php/login/isLogin.php");
if (!isset($_SESSION["IDROLKARVIEW"])) {
    header("Location: index.php");
} else {
    if ($_SESSION["IDROLKARVIEW"] == 2) {
        header("Location: index_central.php");
    } else if ($_SESSION["IDROLKARVIEW"] == 3) {
        header("Location: index_municipio.php");
    } else if ($_SESSION["IDROLKARVIEW"] == 4) {
        header("Location: index_propietario.php");
    } else if ($_SESSION["IDROLKARVIEW"] == 6) {
        header("Location: index_usuarios.php");
    }
}
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>Karview:Monitoreo</title>
        <link rel="shortcut icon" href="img/icon_monitoreo.png" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css">

        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">

        <link rel="stylesheet" type="text/css" href="css/principal.css">   
        <link rel="stylesheet" type="text/css" href="css/monitorTeam.css">

        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>
        <!--<script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/options-toolbar.js"></script>-->
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/packages/ext-charts/build/ext-charts.js"></script>


        <script type="text/javascript">
<?php
echo "
                var idRolKarview = " . $_SESSION["IDROLKARVIEW"] . ";
                ";
?>
        </script>

        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script type="text/javascript" src="js/options/monitorTeam.js"></script>

        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
        <script type="text/javascript" src="js/mapaMonitor.js"></script>
    </head>
    <body oncontextmenu = "return false">        
        <header></header>
        <nav></nav>
        <footer></footer>
    </body>
</html>
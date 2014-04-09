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
        } else if ($_SESSION["IDROLKARVIEW"] == 6) {
            header("Location: index_usuarios.php");
        }
    }
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon?>" type="image/x-icon">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/resources/css/ext-all.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/css/ItemSelector.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-4.2.2/extjs-build/examples/ux/grid/css/RangeMenu.css">
        
        <link rel="stylesheet" type="text/css" href="css/principal.css">
        
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

        <script type="text/javascript" src="js/roles/propietarios.js"></script>
        <script type="text/javascript" src="js/mapa.js"></script>

        <script type="text/javascript" src="js/complements/loadLayer.js"></script>        
        <script type="text/javascript" src="js/complements/drawLine.js"></script>
        <script type="text/javascript" src="js/complements/clearLayer.js"></script>                
        <script type="text/javascript" src="js/complements/showDataLayer.js"></script>
        <script type="text/javascript" src="js/complements/getPositon.js"></script>

        <script type="text/javascript" src="js/administracion/ventanaPersonal.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaVehiculo.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuario.js"></script>

        <script type="text/javascript" src="js/interface/report/ventanaAsignacion.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaBanderas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaEstadoVeh.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaExcesosVelocidad.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaFranjasHorarias.js"></script>        
        <script type="text/javascript" src="js/interface/report/ventanaNoAtendidas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaPanico.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaRutas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaServicios.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaSoftware.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaTaximetro.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaTrabajoFlota.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaEventos.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaGeocercas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaSimbologia.js"></script>

        <script type="text/javascript" src="js/interface/adminGeo/ventanaVerGeo.js"></script>
        <script type="text/javascript" src="js/interface/adminGeo/ventanaAgregarGeo.js"></script>

        <script type="text/javascript" src="js/interface/edit/ventanaEditEmp.js"></script>
        
        <script type="text/javascript" src="js/extra/ventanaDireccion.js"></script>
        <script type="text/javascript" src="js/extra/ventanaCreditos.js"></script>
    </head>
    <body oncontextmenu = "return false">        
        <header></header>
        <nav></nav>
        <section id = 'icono'>
            <a href='http://www.kradac.com'>
            <img alt="www.kradac.com"  src='img/credits.png'/>
            </a>
        </section>        
        <footer></footer>
    </body>
</html>
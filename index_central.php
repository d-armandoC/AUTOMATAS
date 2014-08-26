<?php
    include("dll/config.php");
    include("php/login/isLogin.php");
    if (!isset($_SESSION["IDROLKARVIEW"])) {
      header("Location: index.php");
    } else {
        if ($_SESSION["IDROLKARVIEW"] == 1) {
            header("Location: index_admin.php");
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
        <title><?php echo $site_title?></title>
      <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
       <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
       <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        
       <link rel="stylesheet" type="text/css" href="css/principal.css">        
        
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
       <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
       <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
       <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>
       <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/options-toolbar.js"></script>
       <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>
       
       <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/packages/ext-charts/build/ext-charts.js"></script>
       
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>

        <script type="text/javascript">
            <?php            
            echo "               
                var idCompanyKarview = '".$_SESSION["IDCOMPANYKARVIEW"]."';
                var companyKarview = '".$_SESSION["COMPANYKARVIEW"]."';
                var userKarview = '".$_SESSION["USERKARVIEW"]."';
                var idRolKarview = ".$_SESSION["IDROLKARVIEW"].";
                var personKarview = '".$_SESSION["PERSONKARVIEW"]."';
                ";
            ?>
        </script>
                        
        <script type="text/javascript" src="js/requerid/stores.js"></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>

        <script type="text/javascript" src="js/roles/central.js"></script>
        <script type="text/javascript" src="js/mapa.js"></script>

        <script type="text/javascript" src="js/complements/loadLayer.js"></script>        
        <script type="text/javascript" src="js/complements/drawLine.js"></script>
        <script type="text/javascript" src="js/complements/clearLayer.js"></script>                
        <script type="text/javascript" src="js/complements/showDataLayer.js"></script>
        <script type="text/javascript" src="js/complements/getPositon.js"></script>

        <script type="text/javascript" src="js/administracion/ventanaPersonal.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaVehiculo.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuario.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaSendMail.js"></script>

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
        <script type="text/javascript" src="js/interface/adminGeo/ventanaSendMailGeo.js"></script>

        <script type="text/javascript" src="js/interface/edit/ventanaEditEmp.js"></script>
        
        <script type="text/javascript" src="js/extra/ventanaDireccion.js"></script>
        <script type="text/javascript" src="js/extra/ventanaCreditos.js"></script>
        <script type="text/javascript" src="js/cuenta_Usuario/ventana_cambiar.js"></script>
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
<?php
include("dll/config.php");
include("php/login/isLogin.php");
if (!isset($_SESSION["IDROLKARVIEW"])) {
    header("Location: index.php");
} else {
    if ($_SESSION["IDROLKARVIEW"] == 1) {
        header("Location: index_admin.php");
    } else if ($_SESSION["IDROLKARVIEW"] == 3) {
        header("Location: index_propietario.php");
    }
}
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title ?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon ?>" type="image/x-icon">

        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/css/ItemSelector.css"> 
        <link rel="stylesheet" type="text/css" href="css/principal.css">       

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/packages/ext-charts/build/ext-charts.js"></script>


        <script type="text/javascript">
<?php
echo "               
                var idCompanyKarview = '" . $_SESSION["IDCOMPANYKARVIEW"] . "';
                var userKarview = '" . $_SESSION["USERKARVIEW"] . "';
                var idRolKarview = " . $_SESSION["IDROLKARVIEW"] . ";
                var personKarview = '" . $_SESSION["PERSONKARVIEW"] . "';
                var correo = '" . $_SESSION["EMAIL"] . "';
                ";
?>
        </script>
        <script type="text/javascript" src="js/ext-lang-es.js"></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script type="text/javascript" src="js/roles/empresas.js"></script>
        <script type="text/javascript" src="js/complements/loadLayer.js"></script>        
        <script type="text/javascript" src="js/complements/drawLine.js"></script>
        <script type="text/javascript" src="js/complements/clearLayer.js"></script>                
        <script type="text/javascript" src="js/complements/showDataLayer.js"></script>
        <script type="text/javascript" src="js/complements/getPositon.js"></script>

        <script type="text/javascript" src="js/administracion/ventanaPersonal.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaVehiculo.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuario.js"></script>
        <script type="text/javascript" src="js/administracion/cmd/ventanaCmd.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaSendMail.js"></script>


        <script type="text/javascript" src="js/interface/report/ventanaAsignacion.js"></script>
        <script type="text/javascript" src="js/interface/report/recorridoGeneral.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaEstadoVeh.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaFranjasHorarias.js"></script>        
        <script type="text/javascript" src="js/interface/report/ventanaNoAtendidas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaRutas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaServicios.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaSoftware.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaTaximetro.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaEventos.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaGeocercas.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaSimbologia.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaRegistroPanico.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaReporteMantenimiento.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaReporteMantenimientoDetallado.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaCmdHist.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaReporteParadas.js"></script>
        <script type="text/javascript" src="js/interface/adminGeo/ventanaSendMailGeoPrueba.js"></script>
        <script type="text/javascript" src="js/interface/report/ventanaReporteExcesosVelocidadNew.js"></script>
        <script type="text/javascript" src="js/interface/adminGeo/ventanaAgregarGeo.js"></script>
        <script type="text/javascript" src="js/interface/adminGeo/ventanaSendMailGeoPrueba.js"></script>


        <script type="text/javascript" src="js/extra/Video.js"></script>
        <script type="text/javascript" src="js/extra/ventanaVehiculosLugares.js"></script>
        <script type="text/javascript" src="js/extra/ventanaCreditos.js"></script>
        <script type="text/javascript" src="js/extra/ventanaVideos.js"></script>
        <script type="text/javascript" src="js/cuenta_Usuario/ventana_cambiar.js"></script>
        <script type="text/javascript" src="js/cuenta_Usuario/modificarUsuario.js"></script>
        <script type="text/javascript" src="js/cuenta_Usuario/actualizarEmail.js"></script>

        <!--Stors-->
        <script type="text/javascript" src="js/requerid/stores.js"></script>

        <!--Mapa-->
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
        <script type="text/javascript" src="js/mapa.js"></script>
        <!--Fin Mapa-->
    </head>
    <!--    <body oncontextmenu = "return false">        
            <header></header>
            <nav></nav>
            <section id = 'icono'>
                <div style="position: absolute; bottom: -75px; right: 0px">
                    <a href='http://www.kradac.com'>
                        <img alt="www.kradac.com"   src='img/credits.png'/>
                    </a>    
                </div>
            </section>        
            <footer></footer>
        </body>-->
</html>
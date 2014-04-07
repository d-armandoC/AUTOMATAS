<?php
    include("dll/config.php");
    include("php/login/isLogin.php");
    if (!isset($_SESSION["IDROLKTAXY"])) {
      header("Location: index.php");
    } else {        
        if ($_SESSION["IDROLKTAXY"] == 1) {
            header("Location: index_admin.php");
        } else if ($_SESSION["IDROLKTAXY"] == 2) {
            header("Location: index_central.php");
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

        <!-- Scripts in development mode -->
        <script type="text/javascript" src="jsPDF/jspdf.js"></script>
        <script type="text/javascript" src="jsPDF/libs/Blob/FileSaver.js"></script>
        <script type="text/javascript" src="jsPDF/libs/Blob.js/Blob.js"></script>
        <script type="text/javascript" src="jsPDF/libs/Blob.js/BlobBuilder.js"></script>

        <script type="text/javascript" src="jsPDF/libs/Deflate/deflate.js"></script>
        <script type="text/javascript" src="jsPDF/libs/Deflate/adler32cs.js"></script>

        <script type="text/javascript" src="jsPDF/jspdf.plugin.addimage.js"></script>
        <script type="text/javascript" src="jsPDF/jspdf.plugin.from_html.js"></script>
        <script type="text/javascript" src="jsPDF/jspdf.plugin.ie_below_9_shim.js"></script>
        <script type="text/javascript" src="jsPDF/jspdf.plugin.sillysvgrenderer.js"></script>
        <script type="text/javascript" src="jsPDF/jspdf.plugin.split_text_to_size.js"></script>
        <script type="text/javascript" src="jsPDF/jspdf.plugin.standard_fonts_metrics.js"></script>

        <script type="text/javascript">
            <?php            
            echo "               
                var idCompanyKTaxy = '".$_SESSION["IDCOMPANYKTAXY"]."';
                var userKTaxy = '".$_SESSION["USERKTAXY"]."';
                var idRolKTaxy = ".$_SESSION["IDROLKTAXY"].";
                var personKTaxy = '".$_SESSION["PERSONKTAXY"]."';
                ";
            ?>
        </script>

        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script type="text/javascript" src="js/requerid/stores.js"></script>
        
        <script type="text/javascript" src="js/roles/municipio.js"></script>
        <script type="text/javascript" src="js/mapa.js"></script>

        <script type="text/javascript" src="js/complements/loadLayer.js"></script>        
        <script type="text/javascript" src="js/complements/drawLine.js"></script>
        <script type="text/javascript" src="js/complements/clearLayer.js"></script>                
        <script type="text/javascript" src="js/complements/showDataLayer.js"></script>
        <script type="text/javascript" src="js/complements/getPositon.js"></script>

        <script type="text/javascript" src="js/administracion/ventanaPersonal.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaVehiculo.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuario.js"></script>
        <script type="text/javascript" src="js/administracion/cmd/ventanaCmd.js"></script>
        <script type="text/javascript" src="js/administracion/cmd/ventanaCmdHist.js"></script>
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
        
        <script type="text/javascript" src="js/extra/Video.js"></script>
        <script type="text/javascript" src="js/extra/ventanaDireccion.js"></script>
        <script type="text/javascript" src="js/extra/ventanaVehiculosLugares.js"></script>
        <script type="text/javascript" src="js/extra/ventanaCreditos.js"></script>
        <script type="text/javascript" src="js/extra/ventanaVideos.js"></script>
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
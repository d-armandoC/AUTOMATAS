<?php
extract($_POST);
include ('../../../dll/config.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    
    $consultaSql = "SELECT sky_evento,color FROM karviewdb.sky_eventos;";
 $result = $mysqli->query($consultaSql);
 $haveData=false;
  if ($result->num_rows > 0) {
      $haveData=true;
        $objJson = "simbologia: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                   evento:'" . $myrow ["sky_evento"] . "',
                   color:'".$myrow ["color"]."'
                    },";
        }
        $objJson .="]";
    }
    if ($haveData) {
        echo "{success: true,$objJson}";
    } else {
        echo "{failure: true, msg: 'No hay Datos quee mostrar'}";
    }
    $mysqli->close();
    
}

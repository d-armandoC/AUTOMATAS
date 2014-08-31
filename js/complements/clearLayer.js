/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function limpiarCapasAll(){    
    clearLienzoPointTravel();
    limpiarCapasHistorico();    
    lienzoLocalizar.destroyFeatures();
    
}

function limpiarCapasHistorico(){
    limpiarCapaRecorridosHisto();
    limpiarCapaPuntosHisto();    
}

function limpiarCapaRecorridosHisto(){    
    lienzoRecorridoHistorico.destroyFeatures();
    removerMarcas();
}

function limpiarCapaPuntosHisto(){    
    lienzoPuntosRec.destroyFeatures();
    //Comprobar si existe algun popUp abierto
    if (map.popups.length == 1) {
        map.removePopup(map.popups[0]);
    }
}

/**
 * Quita las marcas de inicio y de fin de recorrido
 */
function removerMarcas(){
    markerInicioFin.clearMarkers();
}

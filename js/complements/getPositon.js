/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function graficarCoop(){
    var coopToShow = "";
    for ( var i = 0;  i < showCoopMap.length; i++){
        if (showCoopMap[i][2]) { // 0: AS :: 1: ANDINASUR :: 2: true/false (isChecked)
            coopToShow += showCoopMap[i][0]+";";
        }
    }

    if (coopToShow != "") {
        Ext.create('Ext.data.Store', {
            autoLoad : true,
            model: 'ultimos_gps',
            proxy: {
                type: 'ajax',
                url : 'php/interface/monitoring/ultimosGPS.php?listCoop='+coopToShow.substring(0, coopToShow.length-1),
                reader : {
                    type : 'json',
                    root : 'dataGps'
                }
            },
            fields : ['idCoop', 'company', 'idEqp', 'vehiculo', 'nombre', 'lat', 'lon', 'fec', 'hor', 'vel', 'rumbo', 'dir','evt','idEvt','icon'],
            listeners : {
                load : function(thisObject, records, successful, eOpts){
                    if (successful) {
                        if (records.length > 0) {
                            addVehiculosToCanvas(records);
                        } else {
                            lienzoSolicitudes.destroyFeatures();
                        }
                    } else {
                        Ext.example.msg('Error','No se ha podido conectar a la Base de Datos.<br>Compruebe su Conexión a Internet');
                    }
                }
            }        
        });
    }

    setTimeout( function(){        
        graficarCoop();
    }
    , 5 * 1000 );
}

//Recuperar la posición de una central
function getPosCentral(){
    Ext.define('centrales', {
        extend : 'Ext.data.Model',
        fields : ['d']
    });

    Ext.create('Ext.data.Store', {
        autoLoad : true,
        model: 'centrales',
        proxy: {
            type: 'ajax',
            url : 'php/interface/monitoring/posCentrales.php',
            reader : {
                type : 'json'
            },
        },
        listeners : {
            load : function(thisObject, records, successful, eOpts){
                if (records != null) {
                    var obj = records[0].data;                
                    if (obj.d.length > 0) {
                        console.log(obj);
                        lienzoCentral.destroyFeatures();
                        addCompanyToCanvas(obj.d);
                    }
                };
            }
        }        
    });
}

function getPosSolicitudes(){
    Ext.define('solicitudes', {
        extend : 'Ext.data.Model',
        fields : ['d']
    });

    Ext.create('Ext.data.Store', {
        autoLoad : true,
        model: 'solicitudes',
        proxy: {
            type: 'ajax',
            url : 'php/roles/usuarios/getSolicitudes.php',
            reader : {
                type : 'json'
            },
        },
        listeners : {
            load : function(thisObject, records, successful, eOpts){
                if (records != null) {
                    var obj = records[0].data;                
                    if (obj.d.length > 0) {
                        //lienzoSolicitudes.destroyFeatures();
                        addSolicitudesToCanvas(obj.d);
                    }                
                }
            }
        }        
    });

    setTimeout( function(){        
        getPosSolicitudes();
    }
    , 5 * 1000 );
}
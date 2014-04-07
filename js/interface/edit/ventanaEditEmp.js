/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var winEditarPuntos;
var proxy;
var gridPosEmp;

Ext.onReady(function(){    

    gridPosEmp = Ext.create('Ext.grid.GridPanel', {
        store: storePosEmpresas,
        columns: [
            {header : 'Id', width : 100, dataIndex : 'id_empresa'},
            {header : 'Empresa', width : 150, dataIndex : 'empresa'},
            {header : 'Latitud', width : 100, dataIndex : 'latitud'},
            {header : 'Longitud', width : 100, dataIndex : 'longitud'}
        ],
        viewConfig: {
            forceFit: true
        },
        autoScroll  : true,
        frame       : true,
        buttons: [{
            iconCls: 'icon-save',
            text    : 'Guardar',
            handler: function() {
                //enviar los datos de la tabla a la base
                guardarPuntosRuta();
                Ext.example.msg('Mensaje', 'La Posicion Nueva de la Empresa ha sido Guardada');
            }
        },{
            iconCls: 'icon-cancelar',
            text: 'Cancelar',                
            tooltip : 'Salir de la Ventana',
            handler: function(){
                if (winEditarPuntos) {
                    storePosEmpresas.reload();
                    getPosCentral();
                    winEditarPuntos.hide();
                }
            }
        }]
    });

});

/**
 * Permite guardar los puntos que se recolecten para la nueva ruta dentro del
 * servidor...
 */
function guardarPuntosRuta(){
    Ext.Ajax.request({
        url     : 'php/interface/monitoring/setLatLonEmp.php',
        method  : 'POST',
        success: function (result) {
            var r = Ext.JSON.decode(result.responseText);
            winEditarPuntos.hide();
            //limpiarCapas();
            activarArrastrePuntos(false);
            storePosEmpresas.commitChanges();
        },
        timeout : 1000,
        params: {
            puntos  : getJsonOfStore(storePosEmpresas)
        }
    });
}

/**
 * Convierte en json lo que este almacenado en un store
 */
function getJsonOfStore(store){    
    var datar = new Array();
    var jsonDataEncode = "";
    //var records = store.getRange();
    var records = store.getModifiedRecords();
    //console.info(records);
    for (var i = 0; i < records.length; i++) {
        datar.push(records[i].data);
    }    
    jsonDataEncode = Ext.JSON.encode(datar);

    return jsonDataEncode;
}

/**
* Muestra la ventana de la lista de puntos que dibujan una ruta para ser ingresados
* o editados dependiendo del parametro de carga de datos
*/
function ventanaEditarPuntos(){
    if(!winEditarPuntos){
        winEditarPuntos = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Editar Posiciones de Empresa',
            iconCls : 'icon-edit',
            resizable : true,
            width : 500,
            height : 300,
            closeAction : 'hide',
            plain : false,
            items : [gridPosEmp],
            listeners : {
                close : function( panel, eOpts ){
                    activarArrastrePuntos(false);
                    storePosEmpresas.reload();
                    getPosCentral();
                }
            }
        });
        permitirArrastrarPuntosRutas();
    }
    activarArrastrePuntos(true);    
    winEditarPuntos.show();
}

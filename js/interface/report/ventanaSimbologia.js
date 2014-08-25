var contenedorWinSim;
var winSim;

Ext.onReady(function() {

    var tabla;

    Ext.Ajax.request({
        url: 'php/interface/report/getColorsSim.php',        
        success: function(response, opts){            
            var dataServer = eval('(' + response.responseText + ')');
            tabla = '<TABLE id="tablestados">';
            for(var i = 0; i < dataServer.simbologia.length; i++){
                var auxEl = dataServer.simbologia[i];               

                tabla +=  '<TR';
                if ((i%2)==0) {
                    tabla += ' class="alt"'; //diseño
                }
                tabla +=  '> ' +
                '    <TD  align="center"> ' +
                '       <div style ="background-color:' + auxEl.color +
                '; color: black; width:15px">. </div>'+
                '    </TD> ' +
                '    <TD align="left">' + auxEl.evento +
                '    </TD> ' +
                '</TR> ';
            }

            tabla += 
                '<TR class="alt"> ' +
                '   <TD> <IMG SRC="img/inicio.png"></TD> ' +
                '   <TD align="left">Inicio de Recorrido</TD> ' +
                '</TR> ' +

                '<TR> ' +
                '   <TD> <IMG SRC="img/fin.png"></TD> ' +
                '   <TD align="left">Fin de Recorrido</TD> ' +
                '</TR> ' +

            ' </TABLE>';            

            contenedorWinSim = Ext.create('Ext.form.Panel', {
                frame: true,                
                bodyStyle:'padding:5px 5px 0',
                autoScroll:true,                                
                items: [{
                    html : tabla                    
                }],        
                buttons: [{
                    text: 'Cancelar',
                    iconCls: 'icon-cancelar',
                    handler: limpiar_datosSim
                }]
            });
        }
    });
    
});

function limpiar_datosSim() {
    if (winSim) {
        winSim.hide();
    }
}

function ventanaSimbologia() {
    if (!winSim) {
        winSim = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Simbologia de Recorridos',
            iconCls: 'icon-edit',
            resizable: false,
            width: 350,
            height: 250,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinSim],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosSim();
                    contenedorWinSim.getForm().reset();
                }
            }
        });
    }
    contenedorWinSim.getForm().reset();
    winSim.show();
}
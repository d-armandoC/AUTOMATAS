var winCred;

function credits(){
    if(!winCred){
        var contenedorWinC = Ext.create('Ext.form.Panel', {
            id: 'panel-credit',
            labelAlign:"left",
            frame:true,
            bodyStyle:"padding:5px 5px 0",
            labelWidth:60,
            width:500,
            items:[{
                frame : true,
                html:'<div id="efecto"><center> '+
                '<img src="img/logo.png" width="200px" height="50px"> <br>'+
                'bruno.valarezo@kradac.com <br>'+
                'hugo.ramirez@kradac.com <br>'+
                'dalton.agila@kradac.com <br>'+
                '</center><br><br><p align=right>K-TAXY</p>'+
                '</div>'
            }],
            buttonAlign:"center",
            buttons:[{
                text:"OK",
                handler: function(){
                    winCred.hide();
                    spot.hide();
                }
            }]
        });

        winCred = Ext.create('Ext.window.Window',{
            layout:"fit",
            iconCls: 'icon-credits',
            title:"Creditos",
            resizable:false,
            width:300,
            height:250,
            closeAction:"hide",
            plain:true,
            items:[contenedorWinC],
            listeners: {
                close: function( panel, eOpts ) {
                    spot.hide();
                }
            }
        });

        Ext.create('Ext.fx.Anim', {
            target: contenedorWinC,
            duration: 2000,
            from: {
                opacity: 0,       // Transparent
            },
            to: {
                opacity: 1,       // Opaque
            }
        });
    }
    winCred.show();
}
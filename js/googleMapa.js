var mapwin;
Ext.onReady(function(){        
    mapwin = Ext.create('Ext.ux.GMapPanel', {
        title : "Mapa",
        center: {
            geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
            marker: {title: 'Fenway Park'}
        },
        markers: [{
            lat: 42.339641,
            lng: -71.094224,
            title: 'Boston Museum of Fine Arts',
            listeners: {
                click: function(e){
                    Ext.Msg.alert('It\'s fine', 'and it\'s art.');
                }
            }
        },{
            lat: 42.339419,
            lng: -71.09077,
            title: 'Northeastern University'
        }]        
    });
 });
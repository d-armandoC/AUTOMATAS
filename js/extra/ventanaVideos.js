var winVideo;

function showVideo(){
    if(!winVideo){
        var formVideo = Ext.create('Ext.form.Panel', {
            items:[{
                xtype: 'video',
                src: [
                    // browser will pick the format it likes most:
                    { src: 'videos/Kinect + Bioloid.mp4', type: 'video/mp4' }
                    /*{ src: 'http://dev.sencha.com/desktopvideo.mp4', type: 'video/mp4' },
                    { src: 'http://dev.sencha.com/desktopvideo.ogv', type: 'video/ogg' },
                    { src: 'http://dev.sencha.com/desktopvideo.mov', type: 'video/quicktime' }*/
                ],
                //poster: 'http://b.vimeocdn.com/ts/148/397/148397103_640.jpg',
                poster: 'img/k-taxy.png',
                autobuffer: true,
                autoplay : true,
                controls : true
            }]
        });

        winVideo = Ext.create('Ext.window.Window',{
            title: 'Videos',
            iconCls: 'icon-video',
            animCollapse: false,
            border: false,
            layout: 'fit',
            items:[formVideo]
        });
    }
    winVideo.show();
}
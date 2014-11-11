var contenedorWinDireccion;
var WinDireccion;

var cbxPais;
var cbxCiudad;
var cbxBarrio;
var avenidaP;
var avenidaS;
var longitud;
var latitud;
var obtenerCoordenadas;
var guardarDireccion;

Ext.onReady(function(){
    
    
    var storePais = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/extra/comboPaises.php',
            reader : {
                type : 'json',
                root: 'pais'
            }
        },
        fields : ['id', 'nombre']
    });

    cbxPais = Ext.create('Ext.form.ComboBox', {        
        fieldLabel : 'Pais:',
        id : 'cbxPaisDireccion',
        name : 'cbxPais',
        store : storePais,
        valueField : 'id',
        displayField : 'nombre',
        queryMode : 'local',
        emptyText : 'Seleccionar Pais...',
        listeners:{
            select: function (combo, records, eOpts){
                cbxCiudad.enable();
                cbxCiudad.clearValue();

                storeCiudad.load({
                    params : {
                        cbxPais : records[0].data.id
                    }
                });
            }
        }
    });

    var storeCiudad = Ext.create('Ext.data.JsonStore', {
        proxy : {
            type : 'ajax',
            url:'php/extra/comboCiudad.php',
            reader : {
                type : 'json',
                root: 'ciudad'
            }
        },
        fields : ['id', 'nombre']
    });

    cbxCiudad = Ext.create('Ext.form.ComboBox', {        
        fieldLabel : 'Ciudad:',
        id : 'cbxCiudadDireccion',
        name : 'cbxCiudad',
        store : storeCiudad,        
        valueField : 'id',
        displayField : 'nombre',
        queryMode : 'local',
        emptyText : 'Seleccionar Ciudad...',
        disabled : true,
        listeners:{
            select: function (combo, records, eOpts){
                cbxBarrio.enable();
                cbxBarrio.clearValue();

                storeBarrio.load({
                    params : {
                        cbxCiudad : records[0].data.id
                    }
                });
            }        
        }
    });

    var storeBarrio = Ext.create('Ext.data.JsonStore', {
        proxy : {
            type : 'ajax',
            url:'php/extra/comboBarrio.php',
            reader : {
                type : 'json',
                root: 'barrio'
            }
        },
        fields : ['id', 'nombre']
    });

    cbxBarrio = Ext.create('Ext.form.ComboBox', {        
        fieldLabel : 'Barrio o Sector:',
        id : 'cbxBarrioDireccion',
        name : 'cbxBarrio',
        store : storeBarrio,
        valueField : 'id',
        displayField : 'nombre',
        queryMode : 'local',
        emptyText : 'Seleccionar Barrio...',
        disabled : true,
        listeners:{
            select: function (combo, records, eOpts){
                avenidaP.enable();
            }        
        }
    });

    avenidaP = Ext.create('Ext.form.field.Text',{
        name: 'avenidaP',
        fieldLabel: 'Avenida Prin.:',
        allowBlank: false,
        emptyText : 'Ingresar Avenida Principal',
        minLength : 5,
        maxLength : 45,
        disabled : true,
        listeners : {
            change : function( thisObject, newValue, oldValue, eOpts ){
                avenidaS.enable();                
            }
        }
    });

    avenidaS = Ext.create('Ext.form.field.Text',{
        name: 'avenidaS',
        fieldLabel: 'Avenida Sec.:',
        allowBlank: false,
        emptyText : 'Ingresar Avenida Secundaria',
        minLength : 5,
        maxLength : 45,
        disabled : true,
        listeners : {
            change : function( thisObject, newValue, oldValue, eOpts ){
                obtenerCoordenadas.enable();                
            }
        }
    });

    latitud = Ext.create('Ext.form.field.Text',{
        name: 'latitud',
        fieldLabel: 'Latitud:',
        allowBlank: false,
        emptyText : 'Latidud...',
        disabled : true,
        listeners : {
            change : function( thisObject, newValue, oldValue, eOpts ){
                guardarDireccion.enable();                
            }
        }
    });

    longitud = Ext.create('Ext.form.field.Text',{
        name: 'longitud',
        fieldLabel: 'Longitud:',
        allowBlank: false,
        emptyText : 'Longitud...',
        disabled : true
    });

    guardarDireccion = Ext.create('Ext.button.Button', {
        text : 'Guardar',
        icon : 'img/save.gif',
        disabled: true,
        handler: function() {

            Ext.MessageBox.show({
               title: 'Cargando',
               msg: 'Guardando Direccion...',
               progressText: 'Iniciando...',
               width:300,
               progress:true,
               closable:false
           });

            contenedorWinDireccion.getForm().submit({
                url : 'php/extra/ingresarDireccion.php',
                params : {
                    latitud : latitud.getValue(),
                    longitud : longitud.getValue()
                },
                waitMsg : 'Comprobando Datos...',
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No se pudo guardar la Direccion...',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                success: function (form, action) {
                    Ext.MessageBox.hide();

                    Ext.example.msg("Mensaje", "Direccion Guardada");                    

                    limpiar_datos_Direccion();
                }
            });
        }
    });

    obtenerCoordenadas = Ext.create('Ext.button.Button',{
        text : 'Obtener Coord.',
        iconCls : 'icon-show-geo',
        disabled : true,
        handler : function(){
            obtener = true;            
        }
    });

    contenedorWinDireccion = Ext.create('Ext.form.Panel', {
        frame : true,                
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 100,
            anchor: '100%'
        },        
        items : [
            cbxPais,
            cbxCiudad,
            cbxBarrio,
            avenidaP,
            avenidaS,
            latitud,
            longitud
        ],
        buttons: [obtenerCoordenadas,
            guardarDireccion,{
            text: 'Cancelar',
            icon : 'img/cross.gif',
            handler: function(){
                limpiar_datos_Direccion();
            }
        }]
    });
});

function limpiar_datos_Direccion(){
    contenedorWinDireccion.getForm().reset();
    cbxCiudad.disable();
    cbxBarrio.disable();
    avenidaP.disable();
    avenidaS.disable();
    obtenerCoordenadas.disable();
    guardarDireccion.disable();    
    if(WinDireccion){
        obtener = false;
        WinDireccion.hide();
    }
}

function ventDireccion(){
	if(!WinDireccion){
        WinDireccion = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Ingresar Direccion',
            id : 'vtnDireccion',
            resizable : false,
            width : 360,
            height : 300,
            closeAction : 'hide',
            plain : false,            
            items : [contenedorWinDireccion],
            listeners : {
                close : function( panel, eOpts ){
                    obtener = false;
                    limpiar_datos_Direccion();                    
                }
            }
        });
    }
    contenedorWinDireccion.getForm().reset();
    WinDireccion.show();
}
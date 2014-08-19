var contenedorWinAddGeo;
var winAddGeo;
var vertPolygon="";
var trazando=0;

Ext.onReady(function() {

    var storeVeh = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        proxy : {
            type : 'ajax',
            url:'php/combobox/comboVeh.php',
            reader : {
                type : 'json',
                root: 'veh'
            }
        },
        fields : [{name:'value',mapping:'id'}, {name:'text',mapping:'nombre'}]
    });

    var formDrawGeo = Ext.create('Ext.form.Panel', {
        frame : true,
        items : [{
            xtype : 'radiogroup',
            fieldLabel : 'Tipo de Dibujo',
            items: [{
                boxLabel: 'Regular', 
                name: 'rb-auto', 
                inputValue: 1                
            },{ 
                boxLabel: 'Irregular', 
                name: 'rb-auto', 
                inputValue: 2                    
            }],
            listeners : {
                change : function( thisObj, newValue, oldValue, eOpts ) {
                    Object.getOwnPropertyNames(newValue).forEach(function(val, idx, array) {                    
                        if (newValue[val] == 1) {
                            trazando = 0;

                            lienzoGeoCercas.destroyFeatures();
                            for(var key in drawControls) {
                                var control = drawControls[key];
                                control.deactivate();
                            }

                            contenedorWinAddGeo.down('[name=area]').setValue('');
                            formDrawGeo.down('[name=radio_figura]').enable();
                            polygonControl.activate();
                        } else {
                            formDrawGeo.down('[name=radio_figura]').disable();
                            trazando=1;                                
                            estadoControlD("polygon");
                            polygonControl.deactivate();
                        }
                            //print(val + " -> " + obj[val]);
                        });
                }
            }
        }, {
            xtype : 'radiogroup',
            name : 'radio_figura',
            fieldLabel : 'Figura',
            disabled : true,
            columns: 1,               
            items: [
                { boxLabel: 'Triangulo', name: 'rb-figura', inputValue: 3},
                { boxLabel: 'Cuadrado', name: 'rb-figura', inputValue: 4},
                { boxLabel: 'Pentagono', name: 'rb-figura', inputValue: 5},
                { boxLabel: 'Exagono', name: 'rb-figura', inputValue: 6},
                { boxLabel: 'Circulo', name: 'rb-figura', inputValue: 40}
            ],
            listeners : {
                change : function( thisObj, newValue, oldValue, eOpts ) {
                    Object.getOwnPropertyNames(newValue).forEach(function(val, idx, array) {                        
                        setOptions({sides: parseInt(newValue[val])});
                    });
                }
            }
        }],
        buttons : [{
            text : 'OK',
            iconCls : 'icon-accept',
            handler : function() {
                if (contenedorWinAddGeo.down('[name=area]').getValue() != '') {
                    winDrawGeo.hide();
                    winAddGeo.show();    
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'Aun no dibuja una Geocerca',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
                
            }
        }]
    });

    var winDrawGeo = Ext.create('Ext.window.Window', {
        title : 'Dibujar Geocerca',
        layout : 'fit',
        iconCls : 'icon-trazar',
        width : 300,
        height : 220,
        closeAction : 'hide',
        items : [formDrawGeo]
    });

    contenedorWinAddGeo = Ext.create('Ext.form.Panel', {
        margins : '0 0 0 3',
        bodyStyle : 'padding: 10px; background-color: #DFE8F6',
        baseCls : 'x-plain',        
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        
        items: [//////
            {
            layout : 'column',
            baseCls: 'x-plain',
            items: [{
                columnWidth: .5,
                baseCls: 'x-plain',
                items : [
                    {
                    xtype : 'combobox',
                    fieldLabel: 'Cooperativa',
                    afterLabelTextTpl: required,
                    name: 'cbxEmpresas',
                    store : storeEmpresas,
                    valueField : 'id',
                    displayField : 'text',
                    queryMode : 'local',
                    editable : false,
                    allowBlank : false,
                    emptyText : 'Escoja la Cooperativa...',                    
                    listeners: {
                        select: function(combo, records, eOpts) {

                            var listSelected = this.up('form').down('[name=listVeh]');
                            listSelected.clearValue();
                            listSelected.fromField.store.removeAll();

                            storeVeh.load({
                                params: {
                                    cbxEmpresas: records[0].data.id
                                }
                            });
                        }
                    }
                },{
                    xtype: 'textfield',
                    afterLabelTextTpl: required,
                    allowBlank : false,
                    name: 'nameGeo',
                    fieldLabel: 'Geocerca:',
                    tooltip : 'Nombre de la Geocerca',
                    maxLength : 45       
                },
                //////
                        {
                    layout : 'column',
                    baseCls: 'x-plain',
                    items : [{
                        columnWidth: .9,
                        baseCls: 'x-plain',
                        items : [{
                            xtype : 'textfield',
                            afterLabelTextTpl: required,
                            name : 'area',                    
                            fieldLabel : 'Area:',
                            disabled : true
                        }]
                    },{
                        columnWidth: .1,
                        baseCls: 'x-plain',
                        items : [{
                            xtype : 'button',
                            iconCls : 'icon-trazar',
                            tooltip : 'Trazar Geocerca',
                            handler : function() {
                                /*winAddGeo.hide();
                                winDrawGeo.show();*/
                                trazando=1;                                
                                estadoControlD("polygon");
                                winAddGeo.hide();
                            }
                        }]                    
                    }]                    
                }
            ]
            },{
                columnWidth: .5,
                baseCls: 'x-plain',
                items : [{
                    xtype : 'textareafield',
                    grow : true,
                    name : 'desGeo',
                    fieldLabel : 'Descripcion',
                    tooltip : 'Descripción de la Geocerca',
                    width : '100%',
                    maxLength : 150
                }]
            }]
        },{
            xtype : 'form',
            width : 570,
            height : 200,
            bodyPadding : 20,
            layout : 'fit',
            baseCls: 'x-plain',
            items : [{
                xtype: 'itemselector',            
                name: 'listVeh',                
                anchor : '100%',
                store: storeVeh,
                displayField: 'text',
                valueField: 'value',            
                allowBlank: false,
                msgTarget: 'side',
                fromTitle: 'Vehiculos',
                toTitle: 'Seleccionados'
            }]            
        }],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-save',                
                text: 'Guardar',                              
                tooltip : 'Guardar Geocerca',
                handler: function() {                    
                    var form = this.up('form').getForm();
                    
                    if (form.isValid()){                        

                        if (vertPolygon != "") {                            
                            form.submit({
                                url : "php/interface/adminGeo/geoNew.php",
                                waitMsg : "Guardando...",
                                params : {                                    
                                    coord : vertPolygon,
                                    area : contenedorWinAddGeo.down('[name=area]').getValue()
                                },
                                failure : function(form, action) {
                                    Ext.MessageBox.show({
                                        title:"Problemas",
                                        msg:"No se puede guardar la Geocerca",
                                        buttons:Ext.MessageBox.OK,                                  
                                        icon:Ext.MessageBox.ERROR
                                    })
                                },
                                
                                success : function(form, action) {
                                    storeGeocercas.reload();
                                    lienzoGeoCercas.destroyFeatures();
                                    formSendMailGeo.getForm().reset();
                                    storeMailsGeo.removeAll();
                                    
                                    Ext.MessageBox.show({
                                        title:"Correcto",
                                        msg:"GeoCerca guardada",
                                        buttons:Ext.MessageBox.OK,
                                        icon:Ext.MessageBox.INFO
                                    });                                    
                                    limpiar_datosAddGeo();                                    
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title:"Sin Geocerca",
                                msg:"Aún no traza la GeoCerca",
                                buttons:Ext.MessageBox.OK,
                                icon:Ext.MessageBox.ERROR
                                })
                            }
                    }
                }
            },{
                iconCls: 'icon-cancelar',
                text: 'Cancelar',                
                tooltip : 'Salir de la Ventana',                
                handler: limpiar_datosAddGeo
            }]
        }]
    });
});

function limpiar_datosAddGeo() {
    lienzoGeoCercas.destroyFeatures();
    contenedorWinAddGeo.getForm().reset();   

    //Ext.getCmp('itemselector-field').fromField.store.removeAll();

    if (winAddGeo) {
        winAddGeo.hide();
    }
}

function ventanaAddGeo() {
    if (!winAddGeo) {
        winAddGeo = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Agregar Geocercas',
            iconCls: 'icon-add-geo',
            resizable: false,
            width: 600,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinAddGeo],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosAddGeo();
                }
            }
        });
    }
    contenedorWinAddGeo.getForm().reset();
    winAddGeo.show();
}
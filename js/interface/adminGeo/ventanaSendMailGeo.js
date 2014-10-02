var winSendMailGeo;
var formSendMailGeo;

Ext.onReady(function(){

    var id_persona = -1;
    var id_geocerca = -1;

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxGeoBD.enable();
                cbxGeoBD.clearValue();

                storeGeo.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxGeoBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Geocerca:',        
        name: 'cbxGeo',
        store: storeGeo,
        valueField: 'id',
        displayField: 'nombre',
        queryMode: 'local',
        emptyText: 'Seleccionar Geocerca...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 325
        },
        listeners: {
            select: function(combo, records, eOpts) {                

                storeMailsGeo.load({
                    params: {
                        id_geo: records[0].data.id
                    }
                });
            }
        }
    });

    var columns = [
        {header: "Id Per", width: 50, sortable: true, dataIndex: 'id_persona'},
        {header: "Id Geo", width: 50, sortable: true, dataIndex: 'id_geocerca'},
        {header: "Persona", flex: 10, sortable: true, dataIndex: 'persona'},
        {header: "Email", flex: 10, sortable: true, dataIndex: 'email'},
        {xtype: 'checkcolumn', header: "Entrada Geocerca", flex: 7, sortable: true, dataIndex: 'in_geo'},
        {xtype: 'checkcolumn', header: "Salida Geocerca", flex: 7, sortable: true, dataIndex: 'out_geo'}        
    ];

    var gridMails = Ext.create('Ext.grid.Panel', {
        title: 'Mails',
        height : 260,
        store: storeMailsGeo,
        columns: columns,
        selType: 'cellmodel',
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ],
        listeners : {
            select : function( thisObject, record, index, eOpts ) {
                this.up('form').down('#delete').enable();
                id_persona = record.data.id_persona;
                id_geocerca = record.data.id_geocerca;
            }
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                iconCls : 'icon-find-geo',
                scope : this,
                tooltip : 'Geocercas',
                handler : ventanaVerGeo
            },{
                iconCls : 'icon-personal',
                scope : this,
                tooltip : 'Personas',
               // handler : ventAddPersonal
            },{
                iconCls: 'icon-add',
                disabled: true,
                text: 'Agregar',
                itemId: 'add',
                scope: this,
                handler: function(){
                    var form = formSendMailGeo.getForm();
                    form.getValues(true);
                    if (form.isValid()){
                        form.submit({
                            url : "php/interface/adminGeo/email/setPersonGeo.php",
                            waitMsg : "Guardando...",                            
                            failure : function(form, action) {
                                Ext.MessageBox.show({
                                    title:"Problemas",
                                    msg: action.result.msg,
                                    buttons:Ext.MessageBox.OK,                                  
                                    icon:Ext.MessageBox.ERROR
                                })
                            },

                            success : function(form, action) {
                                storeMailsGeo.reload();                                
                                Ext.example.msg("Mensaje", 'Persona(s) Agregada a la Lista de Mails');
                                Ext.Msg.alert('Success', action.result.msg).hide();
                            }
                        });
                    }
                }
            }, {
                iconCls: 'icon-delete',
                text: 'Eliminar',
                disabled: true,
                itemId: 'delete',                
                handler: function(){
                    var form = formSendMailGeo.getForm();
                    form.submit({
                        url : "php/interface/adminGeo/email/deletePersonGeo.php",
                        waitMsg : "Guardando...",
                        params : {
                            id_person : id_persona,
                            id_geocerca : id_geocerca
                        },

                        failure : function(form, action) {
                            Ext.MessageBox.show({
                                title:"Problemas",
                                msg: action.result.msg,
                                buttons:Ext.MessageBox.OK,                                  
                                icon:Ext.MessageBox.ERROR
                            })
                        },

                        success : function(form, action) {
                            storeMailsGeo.reload();
                            formSendMailGeo.down('#delete').disable();
                            Ext.example.msg("Mensaje", 'Persona Eliminada de la Lista de Mails');
                            Ext.Msg.alert('Success', action.result.msg).hide();
                        }
                    });                    
                }
            }]
        }],
        buttons: [{
            text    : 'Guardar',
            iconCls : 'icon-save',
            handler: function() {
                var datos = new Array();
                var jsonDataEncode = "";
                var records = storeMailsGeo.getModifiedRecords();
                for (var i = 0; i < records.length; i++) {
                    datos.push(records[i].data);
                }
                jsonDataEncode = Ext.JSON.encode(datos);                

                Ext.Ajax.request({
                    url : 'php/interface/adminGeo/email/setMails.php',
                    waitMsg : 'Guardando Envio de Mails...',
                    success: function (response, opts) {
                        
                        if (response.responseText) {
                            storeMailsGeo.commitChanges();

                            Ext.MessageBox.show({
                                title   : 'Exito...',
                                msg     : 'Envio de Mails Guardados Correctamente...',
                                buttons : Ext.MessageBox.OK,
                                icon    : Ext.MessageBox.INFO
                            });
                        } else {
                            Ext.MessageBox.show({
                                title   : 'Exito...',
                                msg     : 'No ha Realizado Cambios...',
                                buttons : Ext.MessageBox.OK,
                                icon    : Ext.MessageBox.ERROR
                            });
                        }                        
                    },                    
                    params: {
                        puntos  : jsonDataEncode
                    }
                });

            }
        },{
            text: 'Cancelar',
            iconCls: 'icon-cancelar',
            handler: limpiarWinSendMailGeo
        }]
    });

    formSendMailGeo = Ext.create('Ext.form.Panel',{
        frame : true,
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width : 260            
        },
        items : [{
            layout : 'column',
            baseCls: 'x-plain',
            items : [{
                columnWidth: .5,
                baseCls: 'x-plain',
                items : [{
                    xtype: 'multiselect',
                    title : 'Personas',
                    msgTarget: 'side',            
                    name: 'listPerson',
                    width : '90%',
                    height : 150,
                    store: storePersonas,
                    valueField: 'id',
                    displayField: 'text',            
                    ddReorder: true,
                    listeners : {
                        change : function( thisObject, newValue, oldValue, eOpts ){
                            this.up('form').down('#add').enable();
                        }                        
                    }
                }]
            },{
                columnWidth: .5,
                baseCls: 'x-plain',
                items : [
                    cbxEmpresasBD,
                    cbxGeoBD
                ]
            }]
        }, gridMails]
    });
    
});

function limpiarWinSendMailGeo(){
    formSendMailGeo.getForm().reset();
    storeMailsGeo.removeAll();
    if (winSendMailGeo) {
        winSendMailGeo.hide();
    }    
}

function ventanaEnvioMailGeo(){
    if(!winSendMailGeo){
        winSendMailGeo = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Envio de Mails en Geocercas',
            iconCls : 'icon-email',
            resizable : false,
            width : 700,
            height : 460,
            closeAction : 'hide',
            plain : false,
            items : [formSendMailGeo],
            listeners : {
                close : function(panel, eOpts) {
                    limpiarWinSendMailGeo();
                }
            }
        });
    }    
    winSendMailGeo.show();
}
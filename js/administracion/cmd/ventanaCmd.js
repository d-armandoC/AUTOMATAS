var contenedorwinCmd;
var winCmd;

Ext.onReady(function() {
    var responseExiste = false, contResponse = 0;

    var storeCmdPred = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/combobox/comboCmdPred.php',
            reader : {
                type : 'json',
                root: 'comandos'
            }
        },
        fields : ['id', 'nombre']
    });

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
                cbxVehBD.enable();
                cbxVehBD.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo',        
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 300
        }
    });

    var radioCmd = Ext.create('Ext.form.RadioGroup',{
        fieldLabel: 'Tipo Cmd',
        items: [{
            boxLabel: 'Manual', 
            name: 'rb-auto', 
            inputValue: 1
        },{ 
            boxLabel: 'Predefinido', 
            name: 'rb-auto', 
            inputValue: 2,
            checked: true
        }],
        listeners : {
            change : function( thisObj, newValue, oldValue, eOpts ) {
                Object.getOwnPropertyNames(newValue).forEach(function(val, idx, array) {                    
                    if (newValue[val] == 1) {
                        contenedorwinCmd.down('[name=cmdManual]').enable();
                        contenedorwinCmd.down('[name=cbxCmdPred]').disable();
                    } else {
                        contenedorwinCmd.down('[name=cmdManual]').disable();
                        contenedorwinCmd.down('[name=cbxCmdPred]').enable();
                    }
                    //print(val + " -> " + obj[val]);
                });
            }
        }
    });

    var cbxCmdPredBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Predefinido', 
        name: 'cbxCmdPred',
        store: storeCmdPred,
        valueField: 'id',
        displayField: 'nombre',
        queryMode: 'local',
        emptyText: 'Seleccionar Comando...',
        editable: false,
        allowBlank: false        
    });

    var cmdManual = Ext.create('Ext.form.field.Text', {        
        fieldLabel: 'Manual',
        name: 'cmdManual',
        allowBlank: false,
        disabled : true
    });

    var response = Ext.create('Ext.form.Label', {
        text : 'Respuesta: ',
        name : 'response',
        style: {
            color: 'red'
        }
    });

    contenedorwinCmd = Ext.create('Ext.form.Panel', {
        frame: true,
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            anchor : '100%'
        },
        items: [
            cbxEmpresasBD,
            cbxVehBD,
            radioCmd,
            cbxCmdPredBD,
            cmdManual,
            response
        ],
        buttons: [{
            text: 'Enviar',
            iconCls: 'icon-send-cmd',
            handler: function() {
                if (contenedorwinCmd.getForm().isValid()) {
                    response.setText('Respuesta:');
                    contenedorwinCmd.submit({                            
                        url: 'php/administracion/vehiculo/cmd/setCmd.php',                            
                        waitMsg: 'Comprobando Datos...',
                        failure: function(form, action) {                                
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: 'No se pudo Enviar el Comando...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function(form, action) {
                            Ext.example.msg('Mensaje', 'Comando Encolado para el Envio.');                                
                            responseExiste = false;
                            contResponse = 0;
                            searchResponse();
                        }                        
                    });
                }
            }
        }, {
            text: 'Cancelar',
            iconCls: 'icon-cancelar',
            handler: limpiar_datosComands
        }]
    });

    var searchResponse = function reloadClock() {        
        if (!responseExiste) {
            if (contResponse < 10) {
                contenedorwinCmd.submit({                            
                    url: 'php/administracion/vehiculo/cmd/getResponseCmd.php',
                    failure: function(form, action) {                                
                        responseExiste = false;
                        contResponse++;
                    },
                    success: function(form, action) {
                        response.update('<span style="color:green;">Respuesta: </span><span style="color:black;">'+ action.result.msg+'</span>');
                        responseExiste = true;
                    }                        
                });

                Ext.Function.defer(searchResponse, 2000, this);
            } else {
                response.setText('Sin Respuesta (tardo mas de 20 seg.)');
                responseExiste = true;
            } 
        }         
    }
});

function limpiar_datosComands() {
    contenedorwinCmd.getForm().reset();
    contenedorwinCmd.down('[name=cbxVeh]').disable();
    contenedorwinCmd.down('[name=response]').update('Respuesta:');

    if (winCmd) {
        winCmd.hide();
    }
}

function ventComands() {
    if (!winCmd) {
        winCmd = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Envio de Comandos',
            iconCls: 'icon-cmd',
            resizable: false,
            width: 350,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinCmd],
            listeners : {
                close : function(panel, eOpts) {
                    limpiar_datosComands();
                }
            }
        });
    }
    contenedorwinCmd.getForm().reset();
    winCmd.show();
}
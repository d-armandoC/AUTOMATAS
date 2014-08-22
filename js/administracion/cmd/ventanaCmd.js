var formWinCmd;
var winCmd;

Ext.onReady(function() {
    var responseExiste, contResponse;
    
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

    var cbxDevice = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '<b>Equipo</b>',
        name: 'idDevice',
        store: storeDevice,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Equipo...',
        allowBlank: false
    });

    var radioCmd = Ext.create('Ext.form.RadioGroup',{
        fieldLabel: '<b>Tipo Cmd</b>',
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
                    if (newValue[val] === 1) {
                        formWinCmd.down('[name=cmdManual]').enable();
                        formWinCmd.down('[name=cbxCmdPred]').disable();
                    } else {
                        formWinCmd.down('[name=cmdManual]').disable();
                        formWinCmd.down('[name=cbxCmdPred]').enable();
                    }
                });
            }
        }
    });

    var cbxCmdPredBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '<b>Predefinido</b>', 
        name: 'cbxCmdPred',
        store: storeCmdPred,
        valueField: 'id',
        displayField: 'nombre',
        queryMode: 'local',
        emptyText: 'Seleccionar Comando...',
        editable: false,
        allowBlank: false        
    });

    var cmdManual = Ext.create('Ext.form.field.TextArea', {        
        fieldLabel: '<b>Manual</b>',
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

    formWinCmd = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 10 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor : '100%'
        },
        items: [
            cbxDevice,
            radioCmd,
            cbxCmdPredBD,
            cmdManual,
            response
        ],
        buttons: [{
            text: 'Enviar',
            iconCls: 'icon-send-cmd',
            handler: function() {
                if (formWinCmd.getForm().isValid()) {
                    response.setText('Respuesta:');
                    formWinCmd.submit({                            
                        url: 'php/interface/report/cmd/setCmd.php',                            
                        waitMsg: 'Comprobando Datos...',
                        failure: function(form, action) {                                
                            Ext.MessageBox.show({
                                title: 'Mensaje',
                                msg: 'No se pudo Enviar el Comando...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
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
            iconCls: 'icon-cancel',
            handler: function(){
                winCmd.hide();
            }
        }]
    });

    var searchResponse = function reloadClock() {        
        if (!responseExiste) {
            if (contResponse < 20) {
                formWinCmd.submit({                            
                    url: 'php/administracion/device/cmd/getResponseCmd.php',
                    failure: function(form, action) { 
                        response.update('<span style="color:green;">Respuesta: </span><span style="color:blue;">'+ action.result.message+'</span>');
                        responseExiste = false;
                        contResponse++;
                    },
                    success: function(form, action) {
                        response.update('<span style="color:green;">Respuesta: </span><span style="color:black;">'+ action.result.message+'</span>');
                        responseExiste = true;
                    }                        
                });

                Ext.Function.defer(searchResponse, 2000, this);
            } else {
                response.setText('Sin Respuesta, (tardo mas de 40 seg.)');
                responseExiste = true;
            } 
        }         
    };
});

function ventComands() {
    if (!winCmd) {
        winCmd = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Envio de Comandos',
            iconCls: 'icon-cmd',
            resizable: false,
            width: 350,
            height: 315,
            closeAction: 'hide',
            plain: false,
            items: formWinCmd
        });
    }
    formWinCmd.getForm().reset();
    formWinCmd.down('[name=response]').update('Respuesta:');
    winCmd.show();
}
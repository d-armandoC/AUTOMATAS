var panel1;
var winusuario;

Ext.onReady(function() {

    panel1 = Ext.create('Ext.form.Panel', {
        height: 100,
        width: 500,
        border: true,
        items: [{xtype: 'form',
                padding: '30 30 30 30',
                frame: true,
                bodyStyle: "background-image: url('img/newpassword.png'); background-repeat:no-repeat;",
                items: [
                    {
                        padding: '5 20 10 80',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'passwordInitial',
                        emptyText: 'Ingrese Contraseña Actual...',
                        itemId: 'password',
                        inputType: 'password',
                        allowBlank: false,
                        anchor: '95%'
                    },
                    {
                        padding: '5 20 10 80',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'newpassword',
                        emptyText: 'Ingrese Nueva Contraseña...',
                        itemId: 'pass',
                        inputType: 'password',
                        allowBlank: false,
                        anchor: '95%'

                    },
                    {
                        padding: '5 20 10 80',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'confirmPassword',
                        emptyText: 'Confirme Contraseña...',
                        inputType: 'password',
                        vtype: 'password',
                        initialPassField: 'pass',
                        anchor: '95%'
                    },
                    {xtype: 'button',
                        margin: '5 25 25 45',
                        text: 'Actualizar',
                        iconCls: 'icon-update',
                        handler: function() {
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: './php/usuario/modificarpasswordUsuario.php',
                                    success: function(form, action) {
                                        Ext.Msg.alert('Success', action.result.msg);
                                        form.reset();
                                    },
                                    failure: function(form, action) {
                                        switch (action.failureType) {
                                            case Ext.form.action.Action.CLIENT_INVALID:
                                                Ext.Msg.alert('Failure', 'GUARDADO');
                                                break;
                                            case Ext.form.action.Action.CONNECT_FAILURE:
                                                Ext.Msg.alert('Failure', 'FALLA');
                                                this.up('form').getForm().reset();
                                                break;
                                            case Ext.form.action.Action.SERVER_INVALID:
                                                Ext.Msg.alert('Failure', action.result.msg);
                                        }
                                    }
                                });
                            } else {
                                Ext.Msg.alert('Failure', 'Llene los campos de Forma correcta.');
                            }
                        }


                    },
                    {xtype: 'button',
                        margin: '0 10 25 20',
                        text: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function() {
                            this.up('form').getForm().reset();
                            winusuario.hide();
                        }
                    }
                ]

            }]
    });
});

function ventanaCambiarContrasenia() {
    if (!winusuario) {
        winusuario = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Cambiar Contraseña',
            iconCls: 'icon-key',
            resizable: false,
            width: 370,
            height: 230,
            closeAction: 'hide',
            plain: false,
            items: [panel1]
        });
    }
    panel1.getForm().reset();
    winusuario.show();
}
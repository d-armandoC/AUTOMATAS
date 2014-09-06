var panel_Cambiar_Usuario;
var winusuario_usuario;

Ext.onReady(function() {


    panel_Cambiar_Usuario = Ext.create('Ext.form.Panel', {
        height: 100,
        width: 500,
        items: [{xtype: 'form',
                padding: '10 10 10 10',
                bodyStyle: "background-image: url('img/Crystal_Clear_app_Login_Manager.png'); background-repeat:no-repeat;",
                items: [
                    {
                        padding: '10 0 0 125',
                        xtype: 'label',
                        afterLabelTextTpl: required,
                        name: 'mensaje1',
                        text: 'Usuario actual:',
                        id: 'id_mensaje1',
                    },
                    {
                        padding: '10 20 10 20',
                        xtype: 'label',
                        afterLabelTextTpl: required,
                        name: 'usuario_actual',
                        text: userKarview,
                        id: 'id_usuario',
                        anchor: '100%'
                    },
                    {
                        padding: '10 20 10 125',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'new_usuario',
                        itemId: 'n_usuario',
                        blankText: 'Este campo es obligatorio',
                        id: 'new_user',
                        emptyText: 'Ingrese nuevo usuario...',
                        allowBlank: false,
                        anchor: '100%'

                    },
                    {
                        padding: '10 20 10 125',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'confirm_usuario',
                        blankText: 'Este campo es obligatorio',
                        itemId: 'conf_usuario',
                        id: 'id_usuarioNuevo',
                        vtype: 'password',
                        emptyText: 'Confirme usuario...',
                        initialPassField: 'n_usuario',
                        anchor: '100%'
                    },
                    {xtype: 'button',
                        margin: '30 0 0 80',
                        text: 'Actualizar ',
                        iconCls: 'icon-update',
                        handler: function() {
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                if (Ext.getCmp('id_usuarioNuevo').getValue() == Ext.getCmp('new_user').getValue() & (Ext.getCmp('id_usuarioNuevo').getValue() != userKarview)) {
                                    form.submit({
                                        url: './php/usuario/modificar_usuario.php',
                                        success: function(form, action) {
                                            Ext.MessageBox.show({
                                                title: 'Mensaje',
                                                msg: action.result.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            winusuario_usuario.hide();

                                        },
                                        failure: function(form, action) {
                                            switch (action.failureType) {
                                                case Ext.form.action.Action.CONNECT_FAILURE:
                                                    Ext.MessageBox.show({
                                                        title: 'Mensaje',
                                                        msg: 'Verifique su conexión a la internet,<br>no hay conexión con el servidor.',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    panel1.getForm().reset();
                                                    break;

                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.MessageBox.show({
                                                        title: 'Mensaje',
                                                        msg: action.result.msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    panel_Cambiar_Usuario.getForm().reset();
                                                    break;
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: 'Mensaje',
                                        msg: 'Verifique usuario ingresado.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                    panel_Cambiar_Usuario.getForm().reset();

                                }
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Mensaje',
                                    msg: 'Verifique usuario ingresado.',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                                panel_Cambiar_Usuario.getForm().reset();

                            }
                        }

                    },
                    {xtype: 'button',
                        margin: '20 0 0 85',
                        text: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function() {
                            winusuario_usuario.hide();
                        }

                    }
                ]

            }]
    });
});

function ventanaModificarUsuario() {

    if (!winusuario_usuario) {
        winusuario_usuario = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Modificar usuario',
            iconCls: 'icon-personal',
            resizable: false,
            width: 450,
            height: 240,
            closeAction: 'hide',
            plain: false,
            items: [panel_Cambiar_Usuario]
        });

    }
    panel_Cambiar_Usuario.getForm().reset();
    winusuario_usuario.show();
}
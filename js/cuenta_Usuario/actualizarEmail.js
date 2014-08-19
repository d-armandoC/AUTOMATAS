var panel_Cambiar_Email;
var winusuario_email;

var emailValido;
var emailConfir;
var email;


Ext.onReady(function() {


    panel_Cambiar_Email = Ext.create('Ext.form.Panel', {
        height: 100,
        width: 500,
        items: [{xtype: 'form',
                padding: '10 10 10 10',
                bodyStyle: "background-image: url('img/d00.png');background-repeat:no-repeat;",
                items: [
                    {
                        padding: '10 10 10 125',
                        xtype: 'label',
                        afterLabelTextTpl: required,
                        name: 'mensaje',
//                        text: 'Correo Actual:',
                        id: 'id_mensaje',
                        anchor: '90%'

                    },
                    {
//                        padding: '10 30 10 125',
                        xtype: 'label',
                        afterLabelTextTpl: required,
                        name: 'email_actual',
                        text: email,
                        id: 'id_email',
                        anchor: '90%'
                    },
                    {
                        padding: '10 20 10 125',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'new_email',
                        itemId: 'n_email',
                        id: 'new_email1',
                        vtype: 'email',
                        emptyText: 'Su nuevo email',
                        allowBlank: false,
                        anchor: '90%',
                        enableKeyEvents: true,
                        listeners: {
                            keypress: function(thisObject, e, eOpts) {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    if (emailConfir) {
                                        Ext.getCmp('actualizar').setDisabled(false);
                                    } else {
                                        Ext.getCmp('actualizar').setDisabled(true);
                                    }
                                    emailValido = true;
                                } else {
                                    Ext.getCmp('actualizar').setDisabled(true);
                                }
                            }
                        }

                    },
                    {
                        padding: '10 20 10 125',
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        name: 'confirm_email',
                        itemId: 'c_email',
                        id: 'id_emailNuevo',
                        vtype: 'email',
                        emptyText: 'Confirme nuevo email',
                        initialPassField: 'n_email',
                        anchor: '90%',
                        enableKeyEvents: true,
                        listeners: {
                            keypress: function(thisObject, e, eOpts) {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    if (emailValido) {
                                        Ext.getCmp('actualizar').setDisabled(false);
                                    } else {
                                        Ext.getCmp('actualizar').setDisabled(true);
                                    }
                                    emailConfir = true;
                                } else {
                                    Ext.getCmp('actualizar').setDisabled(true);
                                }
                            }
                        }
                    },
                    {xtype: 'button',
                        margin: '20 45 9 150',
                        text: 'Actualizar ',
                        iconCls: 'icon-update',
                        id: 'actualizar',
                        disabled: true,
                        handler: function() {
                            var form = this.up('form').getForm();
                            if (form.isValid()) {
                                if (Ext.getCmp('new_email1').getValue() === Ext.getCmp('id_emailNuevo').getValue()) {
                                    form.submit({
                                        url: './php/usuario/modificar_email.php',
                                        success: function(form, action) {
                                            Ext.MessageBox.show({
                                                title: 'Mensaje',
                                                msg: action.result.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            email = Ext.getCmp('id_emailNuevo').getValue();
                                            panel_Cambiar_Email.getForm().reset();
                                            Ext.getCmp('id_mensaje').setText('Email actual:');
                                            Ext.getCmp('id_email').setText(email);
                                            winusuario_email.hide();
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
                                                    panel_Cambiar_Email.getForm().reset();
                                                    break;
                                                case Ext.form.action.Action.SERVER_INVALID:
                                                    Ext.MessageBox.show({
                                                        title: 'Mensaje',
                                                        msg: action.result.msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    panel1.getForm().reset();
                                                    break;
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: 'Mensaje',
                                        msg: 'Verifique el nuevo email ingresado.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                    Ext.getCmp('id_emailNuevo').setValue('');
                                }
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Mensaje',
                                    msg: 'Email ingresado es incorrecto.',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                                panel_Cambiar_Email.getForm().reset();

                            }
                        }


                    },
                    {xtype: 'button',
                        margin: '20 45 9 7',
                        text: 'Cancelar',
                        iconCls: 'icon-cancelar',
                        handler: function() {
                            panel_Cambiar_Email.getForm().reset();
                            winusuario_email.hide();
                        }

                    }
                ]

            }]
    });
});

function ventanaActualizarEmail() {
    if (!winusuario_email) {
        winusuario_email = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Actualizar email',
            iconCls: 'icon-email ',
            resizable: false,
            width: 480,
            height: 240,
            closeAction: 'hide',
            plain: false,
            items: [panel_Cambiar_Email]
        });

    }
    if (email !== '') {
        Ext.getCmp('id_mensaje').setText('Email actual:');
    } else {
        Ext.example.msg('Mensaje', 'Usted no tiene registrado un email');
        Ext.getCmp('id_mensaje').setText('Por favor ingrese su email y presione actualizar');
    }
    panel_Cambiar_Email.getForm().reset();
    winusuario_email.show();

}
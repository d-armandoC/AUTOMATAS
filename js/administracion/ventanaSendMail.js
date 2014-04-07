var winSendMail;
var formSendMail;

Ext.onReady(function() {
    var recordPerson = null;
    var storeEvents = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/administracion/mail/getMails.php',
            reader: {
                type: 'json',
                root: 'mails'
            }
        },
        fields: ['idEmpresa', 'parametro', 'event', 'state']
    });

    formSendMail = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        defaults: {
            padding: '0 5 0 0'
        },
        tbar: [{
                xtype: 'label',
                padding: '0 0 0 5',
                html: '<b>Escoja la Cooperativa de la Cual desea recibir los Mails.</b>'
            }, '->', {
                xtype: 'combobox',
                padding: '5 5 5 0',
                labelWidth: 75,
                width: 250,
                fieldLabel: '<b>Cooperativa</b>',
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
                        if (recordPerson !== null) {
                            storeEvents.load({
                                params: {
                                    idPerson: recordPerson.data.id,
                                    cbxEmpresas: records[0].data.id
                                }
                            });
                        }
                    }
                }
            }],
        items: [{
                region: 'west',
                width: '50%',
                xtype: 'grid',
                id: 'form-person-mail',
                title: '<center>Personas</center>',
                columns: [
                    {header: '<center><b>Persona</b><center>', flex: 1, dataIndex: 'text'},
                    {header: '<b>Ingresada Por</b>', dataIndex: 'empresa', renderer: formatCompany}
                ],
                store: storePersonas,
                listeners: {
                    select: function(thisObj, record, index, eOpts) {
                        recordPerson = record;
                        Ext.getCmp('button-save-mail').enable();

                        storeEvents.load({
                            params: {
                                idPerson: record.data.id,
                                cbxEmpresas: winSendMail.down('[name=cbxEmpresas]').getValue()
                            }
                        });
                    }
                }
            }, {
                region: 'center',
                xtype: 'grid',
                id: 'form-event-mail',
                title: '<center>Eventos</center>',
                columns: [
                    {header: '<center><b>Evento</b><center>', flex: 1, dataIndex: 'event'},
                    {xtype: 'checkcolumn', header: "<b>Enviar</b>", sortable: true, menuDisabled: true, dataIndex: 'state'}
                ],
                store: storeEvents,
                buttons: [{
                        text: 'Guardar',
                        id: 'button-save-mail',
                        iconCls: 'icon-save',
                        disabled: true,
                        handler: function() {
                            var comboEmpresa = winSendMail.down('[name=cbxEmpresas]');
                            if (comboEmpresa.isValid()) {
                                if (storeEvents.getModifiedRecords().length > 0) {
                                    var datos = new Array();
                                    var jsonDataEncode = "";
                                    var records = storeEvents.getModifiedRecords();
                                    for (var i = 0; i < records.length; i++) {
                                        datos.push(records[i].data);
                                    }
                                    jsonDataEncode = Ext.JSON.encode(datos);

                                    var form = Ext.create('Ext.form.Panel');
                                    form.submit({
                                        url: 'php/administracion/mail/setMails.php',
                                        waitMsg: 'Guardando Envio de Mails...',
                                        params: {
                                            puntos: jsonDataEncode,
                                            cbxEmpresas: comboEmpresa.getValue(),
                                            idPersona: recordPerson.data.id
                                        },
                                        success: function(form, action) {
                                            storeEvents.commitChanges();

                                            Ext.MessageBox.show({
                                                title: 'Exito...',
                                                msg: action.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                        },
                                        failure: function(form, action) {
                                            console.log(action);
                                            Ext.MessageBox.show({
                                                title: 'Error...',
                                                msg: action.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.ERROR
                                            });
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: 'Error...',
                                        msg: 'No ha Realizado Cambios...',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            }
                        }
                    }]
            }]
    });
});

function ventanaEnvioMail() {
    if (!winSendMail) {
        winSendMail = Ext.create('Ext.window.Window', {
            title: 'Envio de Mails',
            iconCls: 'icon-email',
            resizable: false,
            width: 730,
            height: 350,
            closeAction: 'hide',
            layout: 'fit',
            items: formSendMail
        });
    }
    winSendMail.show();
}
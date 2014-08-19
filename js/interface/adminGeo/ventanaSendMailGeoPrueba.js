var windowMailGeocercas;
var formMailGeocercas;
var idGeocerca;

Ext.onReady(function() {
    var recordPerson = null;

    var cbxGeocercas = Ext.create('Ext.form.ComboBox', {
        fieldLabel: '<b>Geocerca</b>',
        name: 'idCompany',
        store: storeGeo,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Empresa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                idGeocerca = records[0].data.id;
                Ext.getCmp('grid-mail-limit').disable();
                Ext.getCmp('grid-person-limit').getView().deselect(Ext.getCmp('grid-person-limit').getSelection());
            }
        }
    });


    formMailGeocercas = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        defaults: {
            padding: '0 5 0 0'
        },
        items: [{
                xtype: 'form',
                region: 'north',
                id: 'form-mail-limit',
                layout: 'column',
                bodyPadding: '10, 10, 10, 10',
                items: [{
                        columnWidth: .5,
                        items: [cbxGeocercas]
                    }]
            }, {
                region: 'west',
                width: '60%',
                xtype: 'grid',
                id: 'grid-person-limit',
                iconCls: 'icon-person',
                title: 'Personas',
                columns: [
                    {header: '<center><b>Persona</b><center>', flex: 1, dataIndex: 'text'},
                    {header: '<b>Ingresada Por  </b>',flex: 1, dataIndex: 'empresa'}
                ],
                store: storePersonas,
                listeners: {
                    select: function(thisObj, record, index, eOpts) {
                        var form = Ext.getCmp('form-mail-limit').getForm();
                        if (form.isValid()) {
                            Ext.getCmp('grid-mail-limit').enable();
                            recordPerson = record;
                            Ext.getCmp('button-save-mail-limit').enable();
                            console.log(record.data.id);
                            console.log(idGeocerca);
                            storeMensajeGeos.load({
                                params: {
                                    idPerson: record.data.id,
                                    idGeos: idGeocerca
                                }});
                        }
                    }
                }
               }, {
                region: 'center',
                xtype: 'grid',
                id: 'grid-mail-limit',
                disabled: true,
                title: '<center>Estado</center>',
                columns: [
                    {header: '<center>Estado</center>', flex: 1, dataIndex: 'estado'},
                    {xtype: 'checkcolumn', header: "Enviar", sortable: true, menuDisabled: true, dataIndex: 'state'}
                ],
                store: storeMensajeGeos,
                buttons: [{
                        text: 'Guardar',
                        id: 'button-save-mail-limit',
                        iconCls: 'icon-save',
                        disabled: true,
                        handler: function() {
                            if (storeMensajeGeos.getModifiedRecords().length > 0) {
                                var datos = new Array();
                                var jsonDataEncode = "";
                                var records = storeMensajeGeos.getModifiedRecords();
                                for (var i = 0; i < records.length; i++) {
                                    datos.push(records[i].data);
                                }
                                jsonDataEncode = Ext.JSON.encode(datos);
                                var form = Ext.create('Ext.form.Panel');
                                form.submit({
                                    url: 'php/interface/geosAdministrador/fijarGeosMensajes.php',
                                    waitMsg: 'Guardando Envio de Mails...',
                                    params: {
                                        puntos: jsonDataEncode,
                                        idPerson: recordPerson.data.id,
                                        idGeos: idGeocerca
                                    },
                                    success: function(form, action) {
                                        storeMensajeGeos.commitChanges();

                                        Ext.MessageBox.show({
                                            title: 'Exito...',
                                            msg: action.result.message,
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                    },
                                    failure: function(form, action) {
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
                    }]
            }]
    });
});

function visualizarEnviosGeoCercas() {
    if (!windowMailGeocercas) {
        windowMailGeocercas = Ext.create('Ext.window.Window', {
            title: 'Envio de Correos Geocerca',
            iconCls: 'icon-email',
            resizable: false,
            width: 750,
            height: 300,
            closeAction: 'hide',
            layout: 'fit',
            items: formMailGeocercas
        });
    }
    windowMailGeocercas.show();
}


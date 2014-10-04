var contenedorgeocerca;
var wingeocerca;
var storeVehiculosGeos1;

Ext.onReady(function() {

    storeVehiculosGeos1 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboVeh.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, 'text']
    });

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresasV',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        listeners: {
              select: function(combo, records, eOpts) {
                var listSelected = contenedorwinEvt.down('[name=listVehEvent]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();

                  storeVehiculosGeos1.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });


    contenedorgeocerca = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        frame: false,
        padding: '5 5 5 5',
        items: [{
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    cbxEmpresasBD,
                                ]
                            }]
                    }]
            }, {
                xtype: 'form',
                bodyStyle: 'padding: 10px 0 10px 0',
                width: 570,
                baseCls: 'x-plain',
                items: [{
                        xtype: 'itemselector',
                        name: 'listVehEvent',
                        anchor: '97%',
                        height: 150,
                        store: storeVehiculosGeos1,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Vehiculos',
                        toTitle: 'Seleccionados'
                    }]
            }, {
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                }
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorgeocerca.getForm().isValid()) {
                        loadGridEvents();
                    } else {
                        Ext.MessageBox.show({
                            title: 'Atencion',
                            msg: 'LLene los espacios vacios',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEvt
            }]
    });
});

function limpiar_datosEvt() {
    contenedorgeocerca.getForm().reset();
    if (wingeocerca) {
        wingeocerca.hide();
    }
}

function ventanaGeocercaVehiculos() {
    if (!wingeocerca) {
        wingeocerca = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Elegir Vehiculos',
            iconCls: 'icon-car',
            resizable: false,
            width: 600,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: [contenedorgeocerca]
        });
    }
    contenedorgeocerca.getForm().reset();
    wingeocerca.show();
}
//diego
function loadGridEvents() {
    Ext.getCmp('multiselectvehiculos1').getStore().removeAll();
    var listVeh = contenedorgeocerca.down('[name=listVehEvent]').getValue();
    var empresa = contenedorgeocerca.down('[name=cbxEmpresasV]').getValue();
    console.log(listVeh);
    console.log(empresa);
    //limpio mi estore para llenar
    mystore.removeAll();
    //rrecorro la lista de vehiculos seleccionados
    for (var i = 0; i < listVeh.length; i++) {
        for (var i = 0; i < storeVehiculosGeos1.data.length; i++) {
            if (storeVehiculosGeos1.getAt(i).data.value === listVeh[i]) {
                var id = storeVehiculosGeos1.getAt(i).data.id;
                console.log(id);
                //creo un objeto de tipo vehiculo y agrego los nuevos valores
                var r = Ext.create('Employee', {
                    id: storeVehiculosGeos1.getAt(i).data.id,
                    text: storeVehiculosGeos1.getAt(i).data.text,
                });
                //inserto mi nuevos datos
                mystore.insert(0, r);
            }
        }
    }
    //solo para ver si se esta agrgando
    for (var i = 0; i < mystore.data.length; i++) {
        console.log(mystore.getAt(i).data.text);
    }


}

function obtenerVehiculo(val) {
    for (var i = 0; i < storeVehiculosGeos1.data.length; i++) {
        if (storeVehiculosGeos1.getAt(i).data.id === val) {
            return storeVehiculosGeos1.getAt(i).data.text;
        }
    }
}
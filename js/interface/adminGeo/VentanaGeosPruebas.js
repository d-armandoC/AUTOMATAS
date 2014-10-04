var winAddGeocerca;
var gridGeocercas;
var formGeocercas;
var vertPolygonos = "";
var trazar = 0;
var gridStoreGeocercas;
var listVehiculos = "";
var drawRoute;
var geometria;
var id_empresageos = 0;
var vistaVehiculosGeocercas;
var storeVehGeocerca;
var storeVeh = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboVeh.php',
        reader: {
            type: 'json',
            root: 'veh'
        }
    },
    fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
});
storeVehGeocerca = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/interface/adminGeo/geoVeh.php',
        reader: {
            type: 'json',
            root: 'veh_geo'
        }
    },
    fields: ['id', 'nombre']
});
//diego
//para nuevo store que me sirve para llenar los nuevos datos
Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'},
    ]
});
//agrego el tipo de store
// create the Data Store
var mystore = Ext.create('Ext.data.Store', {
    // destroy the store if the grid is destroyed
    autoDestroy: true,
    model: 'Employee',
    proxy: {
        type: 'ajax',
        url: 'php/interface/adminGeo/geoVeh.php',
        reader: {
            type: 'json',
            root: 'veh_geo'
        }
    },
//        data: dataPrueba(),
    sorters: [{
            property: 'start',
            direction: 'ASC'
        }]
});


Ext.onReady(function() {


    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id_geo', mapping: 'id'},
            {name: 'id_empresa'},
            {name: 'geocerca'},
            {name: 'desc_geo'},
            {name: 'empresa'},
            {name: 'listVeh'},
            {name: 'areaGeocerca'},
            {name: 'idPrueba', type: 'string'}
        ]
    });
    // crea los datos del store
    gridStoreGeocercas = Ext.create('Ext.data.Store', {
        autoDestroy: true,
        autoLoad: true,
        autoSync: true,
        model: 'DataObject',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/geos/read.php',
                create: 'php/administracion/geos/create.php',
                update: 'php/administracion/geos/update.php'
//                destroy: 'php/administracion/personal/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'adminGeo',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function(proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function(store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    //gridGeocerca.reload();
                    if (operation.state) {
                        formGeocercas.getForm().reset();
                        // storePersonas.reload();
                        formPersonal.getForm().reset();
                    }
                }
            }
        }
    });
    // declare the source Grid
    gridGeocercas = Ext.create('Ext.grid.Panel', {
        store: gridStoreGeocercas,
        columns: [
            {header: "Geocerca", width: 160, sortable: true, dataIndex: 'geocerca'},
            {header: "Empresa", width: 110, sortable: true, dataIndex: 'empresa', renderer: formatCompany},
            {header: "Descripcion", width: 210, sortable: true, dataIndex: 'desc_geo', filter: {type: 'string'}},
            {header: "Area", width: 90, sortable: true, dataIndex: 'areaGeocerca', filter: {type: 'string'}},
//            {header: "Ingresado Por", width: 100, sortable: true, dataIndex: 'empresa', renderer : formatCompany, filter: {type: 'list', store: storeEmpresasList}}
        ],
        stripeRows: true,
        width: '30%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros Geocercas',
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecord(selected[0] || null);
                var record = selected[0];
                Ext.getCmp('multiselectvehiculos1').reset();
                formRecordsGeo.getForm().loadRecord(record);
                idGeo = record.data.id;
//diego
                storeVehGeocerca.load({
                    params: {
                        empresa: record.data.id_empresa,
                        idGeo: record.data.id
                    }
                });
                if (storeVehGeocerca.data.lenght=== 0) {
                    mystore.removeAll();
                    
                }else{
                     mystore.removeAll();
                    //creo un objeto de tipo vehiculo y agrego los nuevos valores
                    var r = Ext.create('Employee', {
                        id: storeVehGeocerca.getAt(0).data.id,
                        text: storeVehGeocerca.getAt(0).data.nombre,
                    });
                    //inserto mi nuevos datos
                    mystore.insert(0, r);
                }




            }
        }
    });


    var storeVeh = Ext.create('Ext.data.JsonStore', {
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

    formGeocercas = Ext.create('Ext.form.Panel', {
        id: 'panel-datos',
        region: 'center',
//        autoScroll: true,
        title: '<b>Información de Geocerca</b>',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        // labelWidth: 120,
        margins: '0 0 0 3',
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Geocerca</b>',
                //collapsible: true,
                layout: 'hbox',
                padding: '5 5 10 10',
                defaults: {
                    padding: '0 0 15 30',
                    baseCls: 'x-plain',
                    layout: 'hbox',
                    defaults: {
                        labelWidth: 100
                    }
                }
                ,
                items: [
                    {
                        defaults: {
                            padding: '0 15 0 0',
                            baseCls: 'x-plain',
                            layout: 'vbox',
                            defaults: {
                                labelWidth: 100
                            }
                        },
                        items: [
                            {
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '<b>Geocerca</b>',
                                        afterLabelTextTpl: required,
                                        name: 'geocerca',
                                        allowBlank: false,
                                        emptyText: 'Ingresar Nombres...',
                                    },
                                    {
                                        xtype: 'textareafield',
                                        grow: true,
                                        name: 'desc_geo',
                                        fieldLabel: '<b>Descripción</b>',
                                        tooltip: 'Descripcion de la Geocerca',
                                    },
                                    {
                                        xtype: 'label',
                                        forId: 'myFieldId',
                                        id: 'idPrueba',
                                        name: 'idPrueba',
                                        margin: '0 0 0 10'
                                    }
                                    ,
                                    {
                                        xtype: 'panel',
                                        layout: 'hbox',
                                        defaults: {
                                            margin: '0 5 0 0'
                                        },
                                        items: [
                                            {
                                                xtype: 'numberfield',
                                                id: 'numberfield-point-route',
                                                fieldLabel: 'Cant. Puntos',
                                                afterLabelTextTpl: required,
                                                disabled: true,
                                                name: 'countPointsRoute',
                                                allowBlank: false,
                                                minValue: 2,
                                                width: 225
                                            }, {
                                                id: 'btn-draw-edit-route',
                                                iconCls: 'icon-add',
                                                xtype: 'button',
                                                value: 0,
                                                handler: function() {
                                                    if (drawRoute === true) {
                                                        drawLine.activate();
                                                    }
//                                                    else {
//                                                        modifyLine.activate();
//                                                        modifyLine.activate();
//                                                        Ext.create('Ext.menu.Menu', {
//                                                            width: 100,
//                                                            floating: true, // usually you want this set to True (default)
//                                                            renderTo: 'map', // usually rendered by it's containing componen
//                                                            items: [{
//                                                                    iconCls: 'icon-valid',
//                                                                    text: 'Terminar',
//                                                                    handler: function() {
//                                                                        geometria = lines.features[0].geometry; //figura
//                                                                        var area = geometria.getArea() / 1000;
//                                                                        area = Math.round(area * 100) / 100;
//                                                                        Ext.getCmp('numberfield-point-route').setValue(area + ' km2');
//                                                                        modifyLine.deactivate();
//                                                                        winAddGeocerca.show();
//                                                                    }
//                                                                }]
//                                                        }).show();
//                                                    }
                                                    winAddGeocerca.hide();
                                                }
                                            }, {
                                                id: 'btn-delete-route',
                                                iconCls: 'icon-delete',
                                                xtype: 'button',
                                                disabled: true,
                                                handler: function() {
                                                    lines.destroyFeatures();
                                                    Ext.getCmp('numberfield-point-route').reset();
                                                    Ext.getCmp('btn-delete-route').disable();
                                                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                                                    drawRoute = true;
                                                }
                                            }]
                                    },
                                    {
                                        xtype: 'button',
                                        fieldLabel: '<b>Agregar</b>',
                                        iconCls: 'icon-add',
                                        tooltip: 'Asignar Vehiculos a la Geocerca',
                                        text: 'Asignar Vehiculos',
                                        handler: function() {
                                            ventanaGeocercaVehiculos();
                                        }
                                    }
// 
                                ]}]},
                    {
                        items: [{
                                xtype: 'fieldset',
                                checkboxToggle: true,
                                title: 'Vehiculos de la Geocerca',
                                defaultType: 'textfield',
                                collapsed: false,
                                layout: 'anchor',
                                width: 240,
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'multiselect',
                                        title: 'Vehiculos',
                                        msgTarget: 'side',
                                        name: 'vehiculos',
                                        id: 'multiselectvehiculos1',
                                        store: mystore,
                                        height: 132,
                                        valueField: 'id',
                                        displayField: 'text',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
        ,
        listeners: {
            create: function(form, data) {
                gridStoreGeocercas.insert(0, data);
                gridStoreGeocercas.reload();
//                storeMails.reload();
//                storeMailsGeo.reload();
//                storePersonas.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updateGeo', text: 'Actualizar', scope: this, tooltip: 'Actualizar Datos', handler: onUpdatePerson},
                    {iconCls: 'icon-user-add', itemId: 'createGeo', text: 'Crear', scope: this, tooltip: 'Crear Persona', handler: onCreatePerson},
                    {iconCls: 'icon-delete', itemId: 'deleteGeo', text: 'Eliminar', scope: this, tooltip: 'Eliminar Persona', handler: onDeleteClick},
                    {iconCls: 'icon-limpiar', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this, handler: onResetPerson},
                    {iconCls: 'icon-cancelar', text: 'Cancelar', tooltip: 'Cancelar', scope: this, handler: clearWinPerson}
                ]
            }]
    });
});
function ventanaGeocerca() {
    if (!winAddGeocerca) {
        winAddGeocerca = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administrar Geocercas',
            iconCls: 'icon-personal',
            resizable: false,
            width: 990,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridGeocercas,
                        formGeocercas
                    ]}]
        });
    }
    onResetPerson();
    winAddGeocerca.show();
    formGeocercas.down('#updateGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.down('#deleteGeo').disable();
    if (gridGeocercas.getStore().getCount() === 0) {
        gridGeocercas.getStore().load();
    }
    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetEl = document.getElementById('panel-datos');
    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {
            // Añadir un poco de brillo al momento de entrar al contenedor
            formGeocercas.body.stopAnimation();
            formGeocercas.body.highlight();
        },
        notifyDrop: function(ddSource, e, data) {
            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            setActiveRecord(selectedRecord || null);
            // Carga los registro en el form            
            formGeocercas.getForm().loadRecord(selectedRecord);
            formGeocercas.down('#updateGeo').enable();
            formGeocercas.down('#createGeo').disable();
            formGeocercas.down('#deleteGeo').enable();
            return true;
        }
    });
}


function setActiveRecord(record) {
    formGeocercas.activeRecord = record;
    if (record) {
        formGeocercas.down('#updateGeo').enable();
        formGeocercas.getForm().loadRecord(record);
    } else {
        formGeocercas.down('#updateGeo').disable();
        formGeocercas.getForm().reset();
    }
}

function onUpdatePerson() {
    var active = formGeocercas.activeRecord,
            form = formGeocercas.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetPerson();
    }
}

function onCreatePerson() {
    var idGeocerca = vistaVehiculosGeocercas.down('[name=cbxEmpresasgeos]').getValue();
    //Ext.getCmp('myFieldId').setValue(idGeocerca);
    var form = formGeocercas.getForm();
    if (form.isValid()) {
        formGeocercas.fireEvent('create', formGeocercas, form.getValues());
        formGeocercas.down('#updateGeo').disable();
        form.reset();
    }
}

function onResetPerson() {
//    var listSelected = formGeocercas.getForm().down('[name=vehiculos]');
//    listSelected.clearValue();
//    listSelected.fromField.store.removeAll(); Ext.getCmp('multiselectvehiculos1').getStore().removeAll();

    Ext.getCmp('multiselectvehiculos1').getStore().removeAll();
    setActiveRecord(null);
    formGeocercas.down('#deleteGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.getForm().reset();
//    lines.destroyFeatures();
    Ext.getCmp('numberfield-point-route').reset();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
    drawRoute = true;
    //id: 'btn-draw-edit-route',
}

function clearWinPerson() {
    formGeocercas.down('#deleteGeo').disable();
    formGeocercas.down('#createGeo').enable();
    winAddGeocerca.hide();
    lines.destroyFeatures();
    Ext.getCmp('numberfield-point-route').reset();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
    drawRoute = true;
}

function onDeleteClick() {
    var selection = gridGeocercas.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridGeocercas.store.remove(selection);
        formGeocercas.down('#deleteGeo').disable();
        formGeocercas.down('#createGeo').enable();
    }
}





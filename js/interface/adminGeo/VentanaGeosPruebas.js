var winAddGeocerca;
var gridGeocerca;
var formGeocerca;
var vertPolygon = "";
var trazando = 0;
var gridStoreGeos;
var listVeh = "";
var storeVehGeo = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
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
            {name: 'areaGeocerca'}
        ]
    });

    // crea los datos del store
    gridStoreGeos = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObject',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/geos/read.php',
                create: 'php/administracion/geos/create.php?listVeh=' + listVeh,
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
                        formGeocerca.getForm().reset();
                        // storePersonas.reload();
                        formPersonal.getForm().reset();
                    }
                }
            }
        }
    });

    // declare the source Grid
    gridGeocerca = Ext.create('Ext.grid.Panel', {
        store: gridStoreGeos,
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
                console.log(record);

//                    formPanelGrid.down('#showButton').enable();
//                    formPanelGrid.down('#delete').enable();
                formRecordsGeo.getForm().loadRecord(record);
                idGeo = record.data.id;
                storeVehGeo.load({
                    params: {
                        empresa: record.data.id_empresa,
                        idGeo: record.data.id
                    }
                });

            }
        }
    });

    formGeocerca = Ext.create('Ext.form.Panel', {
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
                                        layout: 'column',
                                        baseCls: 'x-plain',
                                        items: [{
                                                columnWidth: .9,
                                                baseCls: 'x-plain',
                                                items: [{
                                                        xtype: 'textfield',
                                                        afterLabelTextTpl: required,
                                                        name: 'areaGeocerca',
                                                        fieldLabel: '<b>Area:</b>',
                                                        // disabled: true
                                                    }]
                                            }, {
                                                columnWidth: .1,
                                                baseCls: 'x-plain',
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        iconCls: 'icon-trazar',
                                                        tooltip: 'Trazar Geocerca',
                                                        handler: function() {
                                                            // winAddGeo.hide();
//                                                    winDrawGeo.show();
                                                            trazando = 1;
                                                            estadoControlD("polygon");
                                                            // winAddGeo.hide();
                                                        }
                                                    }]
                                            }]
                                    },
                                    {
                                        xtype: 'button',
                                        fieldLabel: '<b>Agregar</b>',
                                        iconCls: 'icon-add',
                                        tooltip: 'Agregar Vehiculos',
                                        text: 'Crear Vehiculo',
                                        handler: function() {
                                            // winAddGeo.hide();
//                                                    winDrawGeo.show();
//                                            trazando = 1;
//                                            estadoControlD("polygon");
                                            // winAddGeo.hide();
                                        }
                                    }

//                                    {
//                                iconCls: 'icon-add',
//                                text: 'Agregar Vehiculos ',
//                                tooltip: 'Agregar Vehiculos',
//                                scope: this,
////                                handler: ventanaAddGeo
//                            }
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
                                        id: 'multiselect-vehiculos1',
                                        height: 132,
                                        store: storeVehGeo,
                                        valueField: 'id',
                                        displayField: 'nombre',
                                        ddReorder: true,
                                        listeners: {
                                            select: function(combo, records, eOpts) {

                                                storeVeh.load({
                                                    params: {
                                                        cbxEmpresas: records[0].data.id
                                                    }
                                                });
                                            }
                                        }
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
                gridStoreGeos.insert(0, data);
                gridStoreGeos.reload();
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
                        gridGeocerca,
                        formGeocerca
                    ]}]
        });
    }
    onResetPerson();
    winAddGeocerca.show();

    formGeocerca.down('#updateGeo').disable();
    formGeocerca.down('#createGeo').enable();
    formGeocerca.down('#deleteGeo').disable();

    if (gridGeocerca.getStore().getCount() === 0) {
        gridGeocerca.getStore().load();
    }
    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetEl = document.getElementById('panel-datos');
    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {
            // Añadir un poco de brillo al momento de entrar al contenedor
            formGeocerca.body.stopAnimation();
            formGeocerca.body.highlight();
        },
        notifyDrop: function(ddSource, e, data) {
            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            setActiveRecord(selectedRecord || null);
            // Carga los registro en el form            
            formGeocerca.getForm().loadRecord(selectedRecord);

            formGeocerca.down('#updateGeo').enable();
            formGeocerca.down('#createGeo').disable();
            formGeocerca.down('#deleteGeo').enable();
            return true;
        }
    });
}

function setActiveRecord(record) {
    formGeocerca.activeRecord = record;
    if (record) {
        formGeocerca.down('#updateGeo').enable();
        formGeocerca.getForm().loadRecord(record);
    } else {
        formGeocerca.down('#updateGeo').disable();
        formGeocerca.getForm().reset();
    }
}

function onUpdatePerson() {
    var active = formGeocerca.activeRecord,
            form = formGeocerca.getForm();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetPerson();
    }
}

function onCreatePerson() {
    var form = formGeocerca.getForm();
    if (form.isValid()) {
        formGeocerca.fireEvent('create', formGeocerca, form.getValues());
        formGeocerca.down('#updateGeo').disable();
        form.reset();
        console.log("crando");
    }
}

function onResetPerson() {
    setActiveRecord(null);
    formGeocerca.down('#deleteGeo').disable();
    formGeocerca.down('#createGeo').enable();
    formGeocerca.getForm().reset();
}

function clearWinPerson() {
    formGeocerca.down('#deleteGeo').disable();
    formGeocerca.down('#createGeo').enable();
    winAddGeocerca.hide();
}

function onDeleteClick() {
    var selection = gridGeocerca.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridGeocerca.store.remove(selection);
        formGeocerca.down('#deleteGeo').disable();
        formGeocerca.down('#createGeo').enable();
    }
}





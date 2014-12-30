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


var storeVehGeocerca = Ext.create('Ext.data.JsonStore', {
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
//para nuevo store que me sirve para llenar los nuevos datos
Ext.define('Employee', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'},
    ]
});
var mystore = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    model: 'Employee',
    proxy: {
        type: 'memory'
    },
    sorters: [{
            property: 'start',
            direction: 'ASC'
        }]
});


Ext.onReady(function () {
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
        autoLoad: true,
        autoSync: true,
        model: 'DataObject',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/geos/read.php'
//                create: 'php/administracion/geos/create.php',
//                update: 'php/administracion/geos/update.php'
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
                exception: function (proxy, response, operation) {
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
            write: function (store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    if (operation.state) {
                        formGeocercas.getForm().reset();
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
            {header: "Area", width: 90, sortable: true, dataIndex: 'areaGeocerca', filter: {type: 'string'}}
        ],
        stripeRows: true,
        width: '30%',
        margins: '0 2 0 0',
        region: 'west',
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecord(selected[0] || null);
                var record = selected[0];
                formGeocercas.getForm().loadRecord(record);
                recargar(record.data.id_empresa, record.data.id);
                idGeo = record.data.id;
                lines.destroyFeatures();
                var ga = storeVehGeocerca.data.length;
                mystore.reload();
                if (ga > 0) {
                    storeVehGeocerca.reload();
                    drawPoligonoGeocerca(record.data.geocercaPuntos);
                    mystore.removeAll();
                    var listSelect = formGeocercas.down('[name=vehiculos]');
                    listSelect.clearValue();
                    for (var i = 0; i < storeVehGeocerca.data.length; i++) {
                        var r = Ext.create('Employee', {
                            id: storeVehGeocerca.getAt(i).data.id,
                            text: storeVehGeocerca.getAt(i).data.nombre
                        });
                        mystore.insert(0, r);
                    }
                } else {
                    formGeocercas.down('[name=vehiculos]').clearValue();
                    console.log('no hay datos');
                    mystore.removeAll();
                    mystore.reload();
                }
            }
        }
    });

    function recargar(idEmpresa, idGeo) {
        storeVehGeocerca.load({
            params: {
                empresa: idEmpresa,
                idGeo: idGeo
            }
        });

    }


    formGeocercas = Ext.create('Ext.form.Panel', {
        id: 'panel',
        region: 'center',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        margins: '0 0 0 3',
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Geocerca</b>',
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
                                        emptyText: 'Nombre de Geocerca...'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        grow: true,
                                        name: 'desc_geo',
                                        fieldLabel: '<b>Descripción</b>',
                                        tooltip: 'Descripcion de la Geocerca',
                                        emptyText: 'Descripción de la Geocerca...'
                                    },
                                    {
                                        xtype: 'label',
                                        forId: 'myFieldId',
                                        id: 'idPrueba',
                                        name: 'idPrueba',
                                        margin: '0 0 0 10'
                                    },
                                    {
                                        xtype: 'panel',
                                        layout: 'hbox',
                                        baseCls: 'x-plain',
                                        defaults: {
                                            margin: '0 5 20 0'
                                        },
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                afterLabelTextTpl: required,
                                                id: 'numberfield-point-route',
                                                name: 'areaGeocerca',
                                                fieldLabel: '<b>Area<b>',
                                                editable: false,
                                                allowBlank: false,
                                                emptyText: 'Area de la Geocerca...',
                                            }
                                            , {
                                                id: 'btn-draw-edit-route',
                                                iconCls: 'icon-add',
                                                xtype: 'button',
                                                value: 0,
                                                handler: function () {
                                                    if (drawRoute === true) {
                                                        drawLine.activate();
                                                        geosArea = true;
                                                        geosVertice = true;
                                                    } else {
                                                        geosArea = true;
                                                        geosVertice = true;
                                                        modifyLine.activate();
                                                        modifyLine.activate();
                                                        Ext.create('Ext.menu.Menu', {
                                                            width: 100,
                                                            floating: true, // usually you want this set to True (default)
                                                            renderTo: 'map', // usually rendered by it's containing componen
                                                            items: [{
                                                                    iconCls: 'icon-valid',
                                                                    text: 'Terminar',
                                                                    handler: function () {
                                                                        geometria = lines.features[0].geometry; //figura
                                                                        var linearRing = new OpenLayers.Geometry.LinearRing(geometria.getVertices());
                                                                        var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
                                                                        var areaEdit = polygonFeature.geometry.getArea() / 1000;
                                                                        areaEdit = Math.round(areaEdit * 100) / 100;
                                                                        Ext.getCmp('numberfield-point-route').setValue(areaEdit + ' km2');
                                                                        modifyLine.deactivate();
                                                                        var nuevosVertces = geometria.getVertices();
                                                                        var coordenadasEdit = '';
                                                                        for (var i = 0; i < nuevosVertces.length; i++) {
                                                                            nuevosVertces[i] = nuevosVertces[i].transform(new OpenLayers.Projection('EPSG:900913'),
                                                                                    new OpenLayers.Projection('EPSG:4326'));
                                                                            coordenadasEdit += nuevosVertces[i].x + ',' + nuevosVertces[i].y;
                                                                            if (i != nuevosVertces.length - 1) {
                                                                                coordenadasEdit += ';';
                                                                            }
                                                                        }
                                                                        console.log("Nuevas Cordenadas editadas  "+coordenadasEdit);
                                                                        winAddGeocerca.show();
                                                                    }
                                                                }]
                                                        }).show();
                                                        geosVertice = true;
                                                    }
                                                    winAddGeocerca.hide();
                                                }
                                            }, {
                                                id: 'btn-delete-route',
                                                iconCls: 'icon-delete',
                                                xtype: 'button',
                                                disabled: true,
                                                handler: function () {
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
                                        handler: function () {
                                            ventanaGeocercaVehiculos();
                                            var listSelected = contenedorgeocerca.down('[name=listVehiGeos]');
                                            listSelected.clearValue();
                                            listSelected.fromField.store.removeAll();
                                        }
                                    }
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
                                        displayField: 'text'
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
            create: function (form, data) {
                gridStoreGeocercas.insert(0, data);
                gridStoreGeocercas.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updateGeo', text: 'Actualizar', scope: this, tooltip: 'Actualizar Datos', handler: onUpdateGeocerca},
                    {iconCls: 'icon-user-add', itemId: 'createGeo', text: 'Crear', scope: this, tooltip: 'Crear Persona', handler: onCreateGeocerca},
                    {iconCls: 'icon-delete', itemId: 'deleteGeo', text: 'Eliminar', scope: this, tooltip: 'Eliminar Persona', handler: onDeleteClick},
                    {iconCls: 'icon-limpiar', itemId: 'limpiarGeocerca', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this, handler: onResetGeocerca},
                    {iconCls: 'icon-cancelar', text: 'Cancelar', tooltip: 'Cancelar', scope: this, handler: clearWinGeocerca}
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
            height: 320,
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
    onResetGeocerca();
    winAddGeocerca.show();
    formGeocercas.down('#updateGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.down('#deleteGeo').disable();
    if (gridGeocercas.getStore().getCount() === 0) {
        gridGeocercas.getStore().load();
    }
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

function onUpdateGeocerca() {
    var active = formGeocercas.activeRecord,
            form = formGeocercas.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetGeocerca();
    }
}

function onCreateGeocerca() {
    var form = formGeocercas.getForm();
    console.log(coordenadasGeos);
    if (form.isValid()) {
        if (coordenadasGeos != "") {

            form.submit({
                url: "php/interface/adminGeo/geoNew.php",
                waitMsg: "Guardando...",
                params: {
                    coord: coordenadasGeos,
                    area: formGeocercas.down('[name=areaGeocerca]').getValue(),
                    vehiculolist: idVehiculos,
                    idempresa: idempresaGeocerca
                },
                failure: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Problemas",
                        msg: "No se puede guardar la Geocerca",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    })
                },
                success: function (form, action) {
                    Ext.MessageBox.show({
                        title: "Correcto",
                        msg: "GeoCerca guardada",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                    });
                    formGeocercas.getForm().reset();
                    gridStoreGeocercas.reload();
                }
            });
        } else {
            Ext.MessageBox.show({
                title: "Sin Geocerca",
                msg: "Aún no traza la GeoCerca",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
}

function onResetGeocerca() {
    Ext.getCmp('multiselectvehiculos1').getStore().removeAll();
    setActiveRecord(null);
    formGeocercas.down('#deleteGeo').disable();
    formGeocercas.down('#createGeo').enable();
    formGeocercas.getForm().reset();
    Ext.getCmp('numberfield-point-route').reset();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
    drawRoute = true;
    lines.destroyFeatures();
}

function clearWinGeocerca() {
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

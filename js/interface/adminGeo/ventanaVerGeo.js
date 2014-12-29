//var contenedorWinShowGeo;
//var winShowGeo;
//var formRecordsGeo;
//var formPanelGrid;
//
//Ext.onReady(function() {
//
//    var idGeo, idEqpSelected;
//
//    var storeVehGeo = Ext.create('Ext.data.JsonStore', {
//        autoDestroy: true,
//        proxy: {
//            type: 'ajax',
//            url: 'php/interface/adminGeo/geoVeh.php',
//            reader: {
//                type: 'json',
//                root: 'veh_geo'
//            }
//        },
//        fields: ['id', 'nombre']
//    });
//
//    formPanelGrid = Ext.widget('form', {
//        width: '35%',
//        margins: '0 2 0 0',
//        region: 'west',
//        title: 'Geocercas',
//        items: [{
//                xtype: 'grid',
//                name: 'grid_geo',
//                dockedItems: [{
//                        xtype: 'toolbar',
//                        items: [{
//                                iconCls: 'icon-show-geo',
//                                itemId: 'showButton',
//                                text: 'Ver',
//                                scope: this,
//                                disabled: true,
//                                tooltip: 'Ver Geocerca',
//                                handler: function() {
//                                    lienzoGeoCercas.destroyFeatures();
//                                    selectCtrl.activate();
//
//                                    Ext.MessageBox.show({
//                                        title: "Trazado de Geocerca",
//                                        msg: "GeoCerca",
//                                        progressText: "Trazando...",
//                                        wait: true,
//                                        waitConfig: {
//                                            interval: 200
//                                        }
//                                    });
//
//                                    Ext.Ajax.request({
//                                        url: "php/interface/adminGeo/geoPoints.php",
//                                        params: {
//                                            idGeo: idGeo
//                                        },
//                                        success: function(response, opts) {
//                                            Ext.MessageBox.hide();
//
//                                            var g = Ext.JSON.decode(response.responseText);
//                                            var h = new Array();
//                                            for (var i in g.geo_points) {
//                                                if (g.geo_points[i].latitud != undefined && g.geo_points[i].longitud != undefined) {
//                                                    var punto = new OpenLayers.Geometry.Point(g.geo_points[i].longitud, g.geo_points[i].latitud);
//                                                    punto.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
//                                                    h.push(punto);
//                                                }
//                                            }
//
//                                            h.push(h[0]);
//                                            var c = new OpenLayers.Geometry.LinearRing(h);
//                                            var e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([c]), null, null);
//                                            lienzoGeoCercas.addFeatures([e]);
//                                            map.setCenter(new OpenLayers.LonLat(h[0].x, h[0].y), 16);
//                                        }
//                                    });
//                                }
//                            }, {
//                                iconCls: 'icon-add',
//                                text: 'Agregar',
//                                tooltip: 'Agregar Nueva Geocerca',
//                                scope: this,
//                                handler: ventanaAddGeo
//                            }, {
//                                iconCls: 'icon-delete',
//                                text: 'Eliminar',
//                                tooltip: 'Eliminar Geocerca',
//                                disabled: true,
//                                itemId: 'delete',
//                                scope: this,
//                                handler: function() {
//                                    var selection = formPanelGrid.down('[name=grid_geo]').getView().getSelectionModel().getSelection()[0];
//                                    if (selection) {
//                                        Ext.MessageBox.show({
//                                            title: "Eliminando Geocerca",
//                                            msg: "Geocercas",
//                                            progressText: "Eliminando...",
//                                            wait: true,
//                                            waitConfig: {
//                                                interval: 200
//                                            }
//                                        });
//
//                                        Ext.Ajax.request({
//                                            url: "php/interface/adminGeo/geoDelete.php",
//                                            params: {
//                                                idGeo: idGeo
//                                            },
//                                            success: function(response, opts) {
//                                                Ext.MessageBox.hide();
//                                                if (response.responseText) {
//                                                    Ext.example.msg('Mensaje', 'Geocerca Eliminada Correctamente');
//                                                    //formPanelGrid.down('[name=grid_geo]').store.remove(selection);
//                                                    storeGeocercas.reload();
//                                                } else {
//                                                    Ext.MessageBox.show({
//                                                        title: "Problemas",
//                                                        msg: "No se pudo Eliminar la GeoCerca",
//                                                        buttons: Ext.MessageBox.OK,
//                                                        icon: Ext.MessageBox.ERROR
//                                                    });
//                                                }
//                                                formRecordsGeo.getForm().reset();
//                                                formSendMailGeo.getForm().reset();
//                                                Ext.getCmp('multiselect-vehiculos').getStore().removeAll();
//                                                storeMailsGeo.removeAll();
//                                            }
//                                        });
//                                    }
//                                }
//                            }]
//                    }],
//                columns: [
//                    {header: "Geocerca", flex: 3, sortable: true, dataIndex: 'geocerca'},
//                    {header: "Empresa", flex: 4, sortable: true, dataIndex: 'empresa', renderer: formatCompany}
//                ],
//                height: 379,
//                store: storeGeocercas,
//                listeners: {
//                    selectionchange: function(thisObject, selected, eOpts) {
//                        var record = selected[0];
//                        if (record) {
//                            formPanelGrid.down('#showButton').enable();
//                            formPanelGrid.down('#delete').enable();
//
//                            formRecordsGeo.getForm().loadRecord(record);
//
//                            idGeo = record.data.id_geocerca;
//
//                            storeVehGeo.load({
//                                params: {
//                                    empresa: record.data.id_empresa,
//                                    idGeo: idGeo
//                                }
//                            });
//                        }
//                    }
//                }
//            }]
//    });
//
//    formRecordsGeo = Ext.create('Ext.form.Panel', {
//        region: 'center',
//        title: 'Informacion de Geocercas',
//        activeRecord: null,
//        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
//        labelWidth: 100,
//        margins: '0 0 0 3',
//        fieldDefaults: {
//            msgTarget: 'side',
//            labelWidth: 100
//        },
//        defaults: {
//            anchor: '100%'
//        },
//        items: [
//            {
//                xtype: 'fieldset',
//                checkboxToggle: true,
//                title: 'Geocerca',
//                // defaultType: 'textfield',
//                collapsed: false,
//                layout: 'anchor',
//                defaults: {
//                    anchor: '100%'
//                },
//                items: [
//                    {
//                        xtype: 'textfield',
//                        fieldLabel: '<b>Geocerca</b>',
//                        afterLabelTextTpl: required,
//                        name: 'geocerca',
//                        allowBlank: false,
//                        emptyText: 'Ingresar Nombres...',
//                    },
//                    {
//                        xtype: 'textareafield',
//                        grow: true,
//                        name: 'descripcion',
//                        fieldLabel: '<b>Descripción</b>',
//                        tooltip: 'Descripcion de la Geocerca',
//                    },
//                    {
//                        layout: 'column',
//                        baseCls: 'x-plain',
//                        items: [{
//                                columnWidth: .9,
//                                baseCls: 'x-plain',
//                                items: [
//                                    {
//                                        xtype: 'combobox',
//                                        fieldLabel: '<b>Empresa</b>',
//                                        afterLabelTextTpl: required,
//                                        blankText: 'Este campo es Obligatorio',
//                                        name: 'idEmp',
//                                        store: storeEmpresas,
//                                        valueField: 'id',
//                                        displayField: 'text',
//                                        queryMode: 'local',
//                                        editable: false,
//                                        allowBlank: false,
//                                        emptyText: 'Escoja la Empresa...',
//                                    }
//                                ]
//                            }, {
//                                columnWidth: .1,
//                                baseCls: 'x-plain',
//                                items: [
//                                    {
//                                        xtype: 'button',
//                                        iconCls: 'icon-central',
//                                        tooltip: 'Agregar Nueva Empresa',
//                                        handler: function() {
//                                            showWinAdminCompany();
//                                        }
//                                    }
//                                ]
//                            }
//                        ]
//                    },
//                ]
//            }, {
//                xtype: 'multiselect',
//                title: 'Vehiculos',
//                msgTarget: 'side',
//                name: 'multiselect-vehiculos',
//                id: 'multiselect-vehiculos',
//                height: 163,
//                store: storeVehGeo,
//                valueField: 'id',
//                displayField: 'nombre',
//                ddReorder: true,
//                listeners: {
//                    change: function(thisObject, newValue, oldValue, eOpts) {
//                        idEqpSelected = newValue;
//                        formRecordsGeo.down('#delete-Veh-Geo').enable();
//                    }
//                }
//            }
//        ],
//        dockedItems: [{
//                xtype: 'toolbar',
//                dock: 'bottom',
//                ui: 'footer',
//                items: ['->', {
//                        iconCls: 'icon-delete',
//                        text: 'Eliminar',
//                        itemId: 'delete-Veh-Geo',
//                        disabled: true,
//                        tooltip: 'Eliminar Vehiculo de la Geocerca',
//                        handler: function() {
//                            Ext.MessageBox.show({
//                                title: "Eliminando Vehiculo de Geocerca",
//                                msg: "Vehiculos Geocerca",
//                                progressText: "Eliminando...",
//                                wait: true,
//                                waitConfig: {
//                                    interval: 200
//                                }
//                            });
//
//                            Ext.Ajax.request({
//                                url: "php/interface/adminGeo/geoDeleteVeh.php",
//                                params: {
//                                    idEqp: idEqpSelected
//                                },
//                                success: function(response, opts) {
//                                    Ext.MessageBox.hide();
//                                    if (response.responseText) {
//                                        Ext.example.msg('Mensaje', 'Vehiculo Eliminado Correctamente');
//                                        storeVehGeo.reload();
//                                    } else {
//                                        Ext.MessageBox.show({
//                                            title: "Problemas",
//                                            msg: "No se pudo Eliminar Vehiculo de la GeoCerca",
//                                            buttons: Ext.MessageBox.OK,
//                                            icon: Ext.MessageBox.ERROR
//                                        });
//                                    }
//                                }
//                            });
//                        }
//                    }, {
//                        iconCls: 'icon-cancelar',
//                        text: 'Cancelar',
//                        tooltip: 'Salir de la Ventana',
//                        handler: function() {
//                            limpiar_datosVerGeo();
//                        }
//                    }]
//            }]
//    });
//
////    contenedorWinShowGeo = Ext.create('Ext.form.Panel', {
////        layout: 'border',
////        bodyPadding: 5,
////        items: [
////            formPanelGrid,
////            formRecordsGeo
////        ]
////    });
//});
//
//function limpiar_datosVerGeo() {
//    contenedorWinShowGeo.getForm().reset();
//    contenedorWinShowGeo.down('#delete-Veh-Geo').disable();
//    contenedorWinShowGeo.down('#showButton').disable();
//    contenedorWinShowGeo.down('#delete').disable();
//    selectCtrl.deactivate();
//    lienzoGeoCercas.destroyFeatures();
//    storeGeocercas.reload();
//
//    Ext.getCmp('multiselect-vehiculos').getStore().removeAll();
//    if (winShowGeo) {
//        winShowGeo.hide();
//    }
//}
//
//function ventanaVerGeo() {
//    if (!winShowGeo) {
//        winShowGeo = Ext.create('Ext.window.Window', {
//            layout: 'fit',
//            title: 'Ver Geocercas',
//            iconCls: 'icon-find-geo',
//            resizable: false,
//            width: 670,
//            height: 500,
//            closeAction: 'hide',
//            plain: false,
//            items: [{
//                    layout: 'border',
//                    bodyPadding: 5,
//                    items: [formPanelGrid,
//                        formRecordsGeo]
//                }]
//            ,
//            listeners: {
//                close: function(panel, eOpts) {
//                    limpiar_datosVerGeo();
//                }
//            }
//        });
//    }
//   // contenedorWinShowGeo.getForm().reset();
//    winShowGeo.show();
//}
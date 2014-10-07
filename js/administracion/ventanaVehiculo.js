var winAddVeh;
var contenedorVeh;
var formRecordsVeh;
var gridRecordsVeh;
var formImage;

var labelTecnico = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'gray'
    }
});

var labelRegistro = Ext.create('Ext.form.Label', {
    text: '',
    style: {
        color: 'gray'
    }
});


Ext.onReady(function() {
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectVeh', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idVeh'},
            {name: 'placa'},
            {name: 'idEmpresa', type: 'int'},
            {name: 'cbxPropietario', type: 'int'},
            {name: 'cbxClaseVehiculo', type: 'int'},
            {name: 'marca'},
            {name: 'modelo'},
            {name: 'numMotor'},
            {name: 'numChasis'},
            {name: 'idEquipo'},
            {name: 'vehiculo'},
            {name: 'regMunicipal'},
            {name: 'year', type: 'int'},
            {name: 'imageVehicle'},
            {name: 'obser'},
            {name: 'empresa'},
            {name: 'persona'},
            {name: 'equipo'},
            {name: 'clase_vehiculo', type: 'string'}

        ]
    });

    // crea los datos del store
    var gridStoreVehiculo = Ext.create('Ext.data.Store', {
        autoSync: true,
        model: 'DataObjectVeh',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/vehiculo/read.php',
                create: 'php/administracion/vehiculo/create.php',
                update: 'php/administracion/vehiculo/update.php',
                destroy: 'php/administracion/vehiculo/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'veh',
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
                    gridStoreVehiculo.reload();
                    store_equipo.reload();
//                    gridRecordsVeh.reload();
                    formRecordsVeh.getForm().reset();
                    onResetVeh();
                    if (operation.state) {
                        formRecordsVeh.down('#updateVeh').disable();
                        formRecordsVeh.getForm().reset();
                        storeTreeVehTaxis.reload();
                        labelTecnico.setText('');
                        labelRegistro.setText('');
                    }
                }

            }

        }
    });

    // Column Model shortcut array
    var columns = [
         Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {header: "Equipo", width: 80, sortable: true, dataIndex: 'equipo', filter: {type: 'string'}},
        {header: "Organización", width: 110, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {header: "Alias", width: 100, sortable: true, dataIndex: 'vehiculo', filter: {type: 'string'}},
        {header: "Placa", width: 80, sortable: true, dataIndex: 'placa', filter: {type: 'string'}},
        {header: "Propietario", width: 200, sortable: true, dataIndex: 'persona', filter: {type: 'string'}},
        {header: "Marca de Vehiculo", width: 100, sortable: true, dataIndex: 'marca', filter: {type: 'list', store: storeMarVehList}},
        {header: "Año", width: 50, sortable: true, dataIndex: 'year', filterable: true},
    ];

    // declare the source Grid
    gridRecordsVeh = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStoreVehiculo,
        columns: columns,
        enableDragDrop: true,
        stripeRows: true,
        height: 400,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                    if (gridStoreVehiculo.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            var data_type = 'data:application/vnd.ms-excel';
                            var numFil = gridStoreVehiculo.data.length;
                            var numCol = 11;
                            var tiLetra = 'Calibri';
                            var titulo = 'Vehiculos';
                            var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                            table_div += "</DocumentProperties> " +
                                    "<Styles> " +
                                    "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                    "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                    "<Style ss:ID='datos'><NumberFormat ss:Format='@'/></Style> " +
                                    "</Styles>";
                            //Definir el numero de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
                            table_div += "<Worksheet ss:Name='Datos'>";//Nombre de la hoja
                            table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='60' ss:DefaultRowHeight='15'>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Propietario</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Clase</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Marca</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Modelo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Num. Motor</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Num. Chasis</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Año</Data></Cell>" +
                                    "</Row>";
                            
                            for (var i = 0; i < numFil; i++) {
                                console.log(gridStoreVehiculo.data.items[i].data);
                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.empresa + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.persona+ " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.equipo + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.placa + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.clase_vehiculo + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.marca + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.modelo + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.vehiculo + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.numMotor + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.numChasis + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStoreVehiculo.data.items[i].data.year+ " </Data></Cell > " +
                                        "</Row>";
                            }
                            table_div += "</Table> </Worksheet></Workbook>";
                            var table_xml = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_xml;
                            a.download = 'Vehiculos' + '.xml';
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: '<center> El servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                }
            }],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecordVeh(selected[0] || null);
            },
//            itemmousedown: function(thisObject, record, item, index, e, eOpts) {
//                console.log('mouse sobre item');
//            }
        }
    });

//    formImage = Ext.create('Ext.form.Panel', {
//        baseCls: 'x-plain',
//        items: [
//            {
//                xtype: 'filefield',
//                labelWidth: 80,
//                name: 'image',
//                emptyText: "Máximo 2MB",
//                fieldLabel: "<b>Foto</b>",
////                buttonText: '<img src="img/icon_upload.png"></img>',
//                buttonConfig: {
//                    iconCls: 'icon-upload',
//                    text: '',
//                    tooltip: 'Escoger Imagen'
//                },
//                width: 220,
//                listeners: {
//                    change: function(thisObj, value, eOpts) {
//                        formImage = this.up('form');
//                        var form = formImage.getForm();
//                        form.submit({
//                            url: 'php/uploads/uploadVehiculo.php',
//                            success: function(form, action) {
//                                formImage.down('[name=labelImage]').setSrc('img/uploads/vehiculos/' + action.result['img']);
//                                thisObj.setRawValue(action.result['img']);
//
//                            },
//                            failure: function(form, action) {
//                                Ext.Msg.alert('Error', 'No se pudo subir la imagen');
//                            }
//                        });
//                    }
//                }
//            }, {
//                xtype: 'image',
//                name: 'labelImage',
//                src: 'img/uploads/vehiculos/empty.jpg',
//                height: 100,
//                border: 2,
//                margin: '0 0 0 10',
//                style: {
//                    borderColor: '#157fcc',
//                    borderStyle: 'solid'
//                }
//            }]
//    });

    var formPanelGrid = Ext.create('Ext.form.Panel', {
        width: '30%',
        margins: '0 2 0 0',
        region: 'west',
        autoScroll: true,
        title: '<b>Registros de Vehiculos</b>',
        items: [gridRecordsVeh]
    });

    formRecordsVeh = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-veh',
        autoScroll: true,
        region: 'center',
        title: '<b>Ingresar Datos del Vehiculo</b>',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 100,
        margins: '0 0 0 3',
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos de Vehiculo</b>',
                collapsible: true,
                layout: 'hbox',
                //padding: '5 5 10 5',
                defaults: {
                    padding: '0 15 0 0',
                    baseCls: 'x-plain',
                    layout: 'vbox',
                    //defaultType: 'textfield',
                    defaults: {
                        labelWidth: 100
                    }
                },
                items: [{
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Placa</b>',
                                afterLabelTextTpl: required,
                                fieldStyle: 'text-transform: uppercase',
                                blankText: 'Este campo es Obligatorio',
                                
                                vtype: 'placaValida',
                                name: 'placa',
                                id: 'placa_id',
                                allowBlank: false,
                                emptyText: 'LBA1791'
                            }, {
                                xtype: 'combobox',
                                fieldLabel: '<b>Organización</b>',
                                AllowSelection: false,
                                blankText: 'Este campo es Obligatorio',
                                name: 'idEmpresa',
                                store: storeEmpresas,
                                valueField: 'id',
                                displayField: 'text',
                                queryMode: 'local',
                                allowBlank: false,
                                emptyText: 'Escoger Organización...',
                                listConfig: {
                                    minWidth: 160
                                }
                            }
                            , {
                                xtype: 'combobox',
                                fieldLabel: '<b>Propietario</b>',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                name: 'cbxPropietario',
                                store: storePersonas,
                                valueField: 'id',
                                displayField: 'text',
                                queryMode: 'local',
                                allowBlank: false,
                                emptyText: 'Escoger Persona...',
                                listConfig: {
                                    minWidth: 300
                                }
                            },
                            {
                                layout: 'column',
                                baseCls: 'x-plain',
                                items: [{
                                        columnWidth: .1,
                                        baseCls: 'x-plain',
                                        items: [
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: '<b>Equipos Disponibles</b>',
                                                padding: '0 0 10 0',
                                                name: 'idEquipo',
                                                store: store_equipo,
                                                valueField: 'id',
                                                displayField: 'text',
                                                queryMode: 'local',
                                                emptyText: 'Escoger Equipo...',
                                                listeners: {
                                                    select: function(combo, records, eOpts) {
                                                        store_equipo.reload();
                                                        Ext.getCmp('eq1').setValue(records[0].data.text);
                                                    }
                                                }

                                            }
                                        ]
                                    }, {
                                        columnWidth: .1,
                                        baseCls: 'x-plain',
                                        items: [
                                            {
                                                xtype: 'button',
//                                                padding: '0 10 0 0',
                                                iconCls: 'icon-servicios',
                                                tooltip: 'Agregar Nuevo Equipo',
                                                handler: function() {
                                                    showWinAdminDevice();
                                                    store_equipo.reload();
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Equipo</b>',
                                name: 'equipo',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                id: 'eq1',
                                vtype: 'campos',
                                emptyText: 'Equipo...',
                                editable: false
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: '<b>Clase Vehiculo</b>',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                name: 'cbxClaseVehiculo',
                                displayField: 'text',
                                valueField: 'id',
                                store: storeclasseVehiculo,
                                emptyText: 'Escoger Clase Vehiculo...',
                                queryMode: 'local',
                                allowBlank: false,
                                listConfig: {
                                    minWidth: 100
                                }
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Marca</b>',
                                name: 'marca',
                                vtype: 'campos',
                                emptyText: 'Marca del Vehiculo...',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Modelo</b>',
                                name: 'modelo',
                                vtype: 'campos',
                                emptyText: 'Modelo del Vehiculo...',
                            },
                        ]
                    }, {
                        items: [
                            {
                                xtype: 'image',
                                name: 'labelImage',
                                src: 'img/uploads/vehiculos/empty.jpg',
                                height: 100,
                                border: 2,
                                margin: '0 0 15 100',
                                style: {
                                    borderColor: '#157fcc',
                                    borderStyle: 'solid'
                                }
                            },
                            {
                                xtype: 'filefield',
                                name: 'image',
                                emptyText: "Máximo 2MB",
                                fieldLabel: "<b>Fotografía</b>",
                                width: 300,
                                buttonConfig: {
                                    iconCls: 'icon-upload',
                                    text: '',
                                    tooltip: 'Escoger imagen'
                                },
                                listeners: {
                                    change: function(thisObj, value, eOpts) {
                                        var form = this.up('form').getForm();
                                        form.submit({
                                            url: 'php/uploads/uploadVehiculo.php',
                                            success: function(form, action) {
                                                formRecordsVeh.down('[name=labelImage]').setSrc('img/uploads/vehiculos/' + action.result['img']);
//                                formRecordsVeh.down('[name=imageVehicle]').setValue(action.result['img']);
                                                thisObj.setRawValue(action.result['img']);
                                            },
                                            failure: function(form, action) {
                                                Ext.Msg.alert('Error', 'No se pudo subir la imagen');
                                            }
                                        });
                                    }
                                }
                            }
                            , {
                                xtype: 'textfield',
                                fieldLabel: '<b>Alias</b>',
                                afterLabelTextTpl: required,
                                blankText: 'Este campo es Obligatorio',
                                vtype: 'campos',
                                name: 'vehiculo',
                                emptyText: 'Ingresar Vehiculo...',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Num. Motor</b>',
                                name: 'numMotor',
                                vtype: 'campos',
                                emptyText: 'Numero de Motor...'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<b>Num. Chasis</b>',
                                name: 'numChasis',
                                vtype: 'campos',
                                emptyText: 'Numero de Chasis...'
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '<b>Año</b>',
                                name: 'year',
                                emptyText: 'Año del Vehiculo...',
                                
                                value: 1950,
                                minValue: 1950,
                                editable: true,
                                maxValue: Ext.Date.format(new Date(), 'Y')
                            }
                        ]
                    }]
            },
            {
                xtype: 'textarea',
                labelWidth: 80,
                width: '100%',
                //grow : true,
                name: 'obser',
                fieldLabel: '<b>Observación</b>'
            }
        ],
        listeners: {
            create: function(form, data) {
                gridStoreVehiculo.insert(0, data);
                gridStoreVehiculo.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [
                    //{iconCls: 'icon-personal', scope: this, tooltip: 'Ingresar Nueva Persona', handler: ventAddPersonal},
                    '->',
                    {iconCls: 'icon-update', itemId: 'updateVeh', text: '<b>Actualizar</b>', scope: this, tooltip: 'Actualizar Datos', handler: onUpdateVeh},
                    {iconCls: 'icon-car', itemId: 'createVeh', text: '<b>Crear</b>', scope: this, tooltip: 'Crear Vehiculo', handler: onCreateVeh},
//                    {iconCls: 'icon-delete', text: '<b>Eliminar</b>', itemId: 'deleteVeh', scope: this, tooltip: 'Eliminar Vehiculo', handler: onDeleteClickVeh},
                    {iconCls: 'icon-cleans', text: '<b>Limpiar</b>', scope: this, tooltip: 'Limpiar Campos', handler: onResetVeh},
                    {iconCls: 'icon-cancelar', text: '<b>Cancelar</b>', tooltip: 'Cancelar', scope: this, handler: clearWinVeh}
                ]
            }]
    });

    contenedorVeh = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 8,
        items: [
            formPanelGrid,
            formRecordsVeh
        ]
    });
});

function ventanaAddVehiculos() {
    if (!winAddVeh) {
        winAddVeh = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: '<b>Vehiculos</b>',
            iconCls: 'icon-car',
            resizable: false,
            width: 1000,
            height: 510,
            closeAction: 'hide',
            plain: false,
            items: [contenedorVeh]
        });
    }
    onResetVeh();
    contenedorVeh.getForm().reset();
    winAddVeh.show();
    labelTecnico.setText('');
    labelRegistro.setText('');

    formRecordsVeh.down('#updateVeh').disable();/// desabilitar
    formRecordsVeh.down('#createVeh').enable();// habilitar
//    formRecordsVeh.down('#deleteVeh').disable();

    if (gridRecordsVeh.getStore().getCount() === 0) {
        gridRecordsVeh.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElVeh = document.getElementById('panel-datos-veh');

//    var formPanelDropTargetVeh = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElVeh, {
//        ddGroup: 'GridExample',
//        notifyEnter: function(ddSource, e, data) {
//
//            // Añadir un poco de brillo al momento de entrar al contenedor
//            formRecordsVeh.body.stopAnimation();
//            formRecordsVeh.body.highlight();
//        },
//        notifyDrop: function(ddSource, e, data) {
//
//            // Referencia el record (seleccion simple) para facilitar lectura
//            var selectedRecord = ddSource.dragData.records[0];
//
//            setActiveRecordVeh(selectedRecord || null);
//
//            // Carga los registro en el form            
//            formRecordsVeh.getForm().loadRecord(selectedRecord);
////            formImage.down('[name=labelImage]').setSrc('img/uploads/vehiculos/' + selectedRecord.data.labelImage);
////            formImage.down('[name=image]').setRawValue(selectedRecord.data.labelImage);
//            labelTecnico.setText(selectedRecord.data.cbxTecnico);
//            labelRegistro.setText(selectedRecord.data.dateTimeRegistro);
//
//            formRecordsVeh.down('#updateVeh').enable();
//            formRecordsVeh.down('#createVeh').disable();
//            formRecordsVeh.down('#deleteVeh').enable();
//
//            // Elimina el registro desde los registros. No es relamente Requerido
//            //ddSource.view.store.remove(selectedRecord);
//
//            return true;
//        }
//    });
}

function setActiveRecordVeh(record) {
    formRecordsVeh.activeRecord = record;
    if (record) {
        formRecordsVeh.down('#updateVeh').enable();
//        formRecordsVeh.down('#deleteVeh').enable();
        formRecordsVeh.down('#createVeh').disable();
        formRecordsVeh.getForm().loadRecord(record);
    } else {
        formRecordsVeh.down('#updateVeh').disable();
        formRecordsVeh.getForm().reset();
    }
}

function onUpdateVeh() {
    var active = formRecordsVeh.activeRecord,
            form = formRecordsVeh.getForm();
////    active.set({
////        labelImage: formImage.down('[name=image]').getRawValue()
////    });
//    form.setValues({
//     labelImage: 'nada.jpg'
//     });
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetVeh();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onCreateVeh() {
    var form = formRecordsVeh.getForm();
    if (form.isValid()) {
        formRecordsVeh.fireEvent('create', formRecordsVeh, form.getValues());
        formRecordsVeh.getForm().reset();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetVeh() {
    setActiveRecordVeh(null);
//    formRecordsVeh.down('#deleteVeh').disable();
    formRecordsVeh.down('#createVeh').enable();
    formRecordsVeh.getForm().reset();
}

function clearWinVeh() {
//    formRecordsVeh.down('#deleteVeh').disable();
    formRecordsVeh.down('#createVeh').enable();
    winAddVeh.hide();
}

function onDeleteClickVeh() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el vehiculo', function(choice) {
        if (choice === 'yes') {
            var selection = gridRecordsVeh.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridRecordsVeh.store.remove(selection);
//                formRecordsVeh.down('#deleteVeh').disable();
                formRecordsVeh.down('#createVeh').enable();
            }
        }
    });
}
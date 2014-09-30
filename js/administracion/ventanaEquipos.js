var winAdminDevice;
var formAdminDevice;
var gridAdminDevice;


Ext.onReady(function() {
    Ext.define('DataDevice', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idDevice', type: 'int'},
            {name: 'idTypeDevice', type: 'int'},
            {name: 'deviceDevice', type: 'string'},
            {name: 'serieDevice', type: 'string'},
            {name: 'numberChipDevice', type: 'string'},
            {name: 'imeiChipDevice', type: 'string'},
            {name: 'typeDevice', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataDevice',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/device/read.php',
                create: 'php/administracion/device/create.php',
                update: 'php/administracion/device/update.php',
                destroy: 'php/administracion/device/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
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
                    gridStore.reload();
                    store_equipo.reload();
                    if (operation.state) {
                        formAdminDevice.getForm().reset();
                        store_equipo.reload();
                    }
                }
            }
        }
    });

    gridAdminDevice = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "Equipo", width: 100, sortable: true, dataIndex: 'deviceDevice', filter: {type: 'string'}, align: 'center'},
            {header: "Tipo de Equipo", width: 150, sortable: true, dataIndex: 'typeDevice',filter: {type: 'string'}, align: 'center'},
            {header: "Serie", width: 175, sortable: true, dataIndex: 'serieDevice', filter: {type: 'string'}},
            {header: "Numero de Chip", width: 150, sortable: true, dataIndex: 'numberChipDevice', filter: {type: 'string'}},
            {header: "Imei de Chip", width: 150, sortable: true, dataIndex: 'imeiChipDevice', filter: {type: 'string'}}
        ],
        stripeRows: true,
        width: '55%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                        if (gridStore.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            var data_type = 'data:application/vnd.ms-excel';
                            var numFil = gridStore.data.length;
                            var numCol = 5;
                            var tiLetra = 'Calibri';
                            var titulo = ' Equipos';
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

                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Tipo de Equipo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Serie</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Número de Chip</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Imei de Chip</Data></Cell>" +
                                    "</Row>";
                            for (var i = 0; i < numFil; i++) {
                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.typeDevice  + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.deviceDevice + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.serieDevice + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.numberChipDevice + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.imeiChipDevice  + " </Data></Cell > " +
                                        "</Row>";
                            }
                            table_div += "</Table> </Worksheet></Workbook>";
                            var table_xml = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_xml;
                            a.download = 'Equipos' + '.xml';
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: '<center> El servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'Mensaje',
                            msg: 'No hay datos en la Lista a Exportar',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
//                    if (gridStore.getCount() > 0) {
//                        if (getNavigator() === 'img/chrome.png') {
//                        var a = document.createElement('a');
//                        //getting data from our div that contains the HTML table
//                        var data_type = 'data:application/vnd.ms-excel';
//                        //var table_div = document.getElementById('exportar');
//                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
//                        var tiLetra = 'Calibri';
//                        var table_div = "<meta charset='UTF-8'><body>" +
//                                "<font face='" + tiLetra + "'><table>" +
//                                "<tr><th colspan='7'>EQUIPOS" + "</th></tr>" +
//                                "<tr></tr>";
//                        table_div += "<tr>";
//                        table_div += "<th align=left>TIPO DE EQUIPO</th>";
//                        table_div += "<th align=left>EQUIPO </th>";
//                        table_div += "<th align=left>SERIE</th>";
//                        table_div += "<th align=left>NÚMERO DE CHIP</th>";
//                        table_div += "<th align=left>IMEI DE CHIP</th>";
//                        table_div += "</tr>";
//                        for (var i = 0; i < gridStore.data.length; i++) {
//
//
//                            table_div += "<tr>";
//                            table_div += "<td align=lef>" + gridStore.data.items[i].data.typeDevice + "</td>";
//                            table_div += "<td align=lef>" + gridStore.data.items[i].data.deviceDevice + "</td>";
//                            table_div += "<td align=lef>" + gridStore.data.items[i].data.serieDevice + "</td>";
//                            table_div += "<td align=lef>" + gridStore.data.items[i].data.numberChipDevice + "</td>";
//                            table_div += "<td align=lef>" + gridStore.data.items[i].data.imeiChipDevice + "</td>";
//                            table_div += "</tr>";
//                        }
//                        table_div += "</table></font></body>";
//                        var table_html = table_div.replace(/ /g, '%20');
//                        a.href = data_type + ', ' + table_html;
//                        //setting the file name
//                        a.download = 'Equipos' + '.xls';
//                        //triggering the function
//                        a.click();
//                        } else {
//                            Ext.MessageBox.show({
//                                title: 'Error',
//                                msg: 'El Servicio para este navegador no permitido',
//                                buttons: Ext.MessageBox.OK,
//                                icon: Ext.MessageBox.ERROR
//                            });
//
//                        }
//                    } else {
//                        Ext.MessageBox.show({
//                            title: 'Error...',
//                            msg: 'No hay datos en la Lista a Exportar',
//                            buttons: Ext.MessageBox.OK,
//                            icon: Ext.MessageBox.ERROR
//                        });
//                    }
                }
            }],
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecordDevice(selected[0] || null);
            }
        }
    });

    formAdminDevice = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos del Equipo',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        bodyPadding: '10 10 10 10',
        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
                xtype: 'combobox',
                fieldLabel: 'Tipo de Equipo',
                afterLabelTextTpl: required,
                blankText: 'Este campo es Obligatorio',
                name: 'idTypeDevice',
                store: storetipo_equipo_vehiculo,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                editable: false,
                allowBlank: false,
                allowOnlyWhitespace: false,
                emptyText: 'Seleccionar Opción...'
            }, {
                fieldLabel: 'Equipo',
                afterLabelTextTpl: required,
                blankText: 'Este campo es Obligatorio',
                vtype: 'campos',
                name: 'deviceDevice',
                allowBlank: false,
                allowOnlyWhitespace: false,
                emptyText: 'Ingresar nombre de Equipo...',
            }, {
                fieldLabel: 'Serie',
                name: 'serieDevice',
                emptyText: 'Ingresar Serie de Equipo...',
                vtype: 'campos',
            }, {
                fieldLabel: 'Numero de Chip',
                name: 'numberChipDevice',
                vtype: 'campos',
                emptyText: 'Ingresar Numero de Chip...',
            }, {
                fieldLabel: 'Imei de Chip',
                name: 'imeiChipDevice',
                vtype: 'campos',
                emptyText: 'Ingresar Imei de Chip...',
            }],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
                store_equipo.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar',
                        handler: onUpdateDevice
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateDevice
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        scope: this,
                        tooltip: 'Eliminar Usuario',
                        handler: onDeleteDevice
                    }, {
                        iconCls: 'icon-cleans',
                        //text: 'Limpiar',
                        tooltip: 'Limpiar Campos',
                        handler: onResetDevice
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminDevice.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminDevice() {
    if (!winAdminDevice) {
        winAdminDevice = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Equipos',
            iconCls: 'icon-credits',
            resizable: false,
            width: 790,
            height: 360,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminDevice,
                        formAdminDevice
                    ]
                }]
        });
    }
    onResetDevice();
    winAdminDevice.show();
    storetipo_equipo_vehiculo.reload();
    store_equipo.reload();
}

function setActiveRecordDevice(record) {
    formAdminDevice.activeRecord = record;
    if (record) {
        formAdminDevice.down('#update').enable();
        formAdminDevice.down('#delete').enable();
        formAdminDevice.down('#create').disable();
        formAdminDevice.getForm().loadRecord(record);
    } else {
        formAdminDevice.down('#update').disable();
        formAdminDevice.getForm().reset();
    }
}

function onUpdateDevice() {
    var active = formAdminDevice.activeRecord,
            form = formAdminDevice.getForm();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetDevice();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onCreateDevice() {
    var form = formAdminDevice.getForm();
    if (form.isValid()) {
        console.log("creando");
        formAdminDevice.fireEvent('create', formAdminDevice, form.getValues());
        formAdminDevice.down('#update').disable();
        form.reset();
        store_equipo.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetDevice() {
    setActiveRecordDevice(null);
    formAdminDevice.down('#delete').disable();
    formAdminDevice.down('#create').enable();
    formAdminDevice.getForm().reset();
}

function onDeleteDevice() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Equipo', function(choice) {
        if (choice === 'yes') {
            var selection = gridAdminDevice.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminDevice.store.remove(selection);
                formAdminDevice.down('#delete').disable();
                formAdminDevice.down('#create').enable();
            }
        }
    });
}
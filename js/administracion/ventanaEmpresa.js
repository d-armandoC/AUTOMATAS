var winAdminCompany;
var formAdminCompany;
var gridAdminCompany;
Ext.onReady(function() {
    Ext.define('DataCompany', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_empresa', type: 'int'},
            {name: 'acronimo', type: 'string'},
            {name: 'empresa', type: 'string'},
            {name: 'direccion', type: 'string'},
            {name: 'telefono', type: 'string'},
            {name: 'correo', type: 'string'}
        ]
    });
    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataCompany',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/empresa/read.php',
                create: 'php/administracion/empresa/create.php',
                update: 'php/administracion/empresa/update.php',
                destroy: 'php/administracion/empresa/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'empresas',
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
                    if (operation.state) {
                        formAdminCompany.getForm().reset();
                        gridStore.reload();
                    }
                }
            }
        }
    });

    gridAdminCompany = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "<b>Acrónimo</b>", width: 100, align: 'center', sortable: true, dataIndex: 'acronimo', filter: {type: 'string'}},
            {header: "<b>Organización</b>", align: 'center', width: 180, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'string'}},
            {header: "<b>Dirección</b>", width: 130, sortable: true, align: 'center', dataIndex: 'direccion', filter: {type: 'string'}},
            {header: "<b>Celular</b>", width: 350, sortable: true, align: 'center', dataIndex: 'telefono', filter: {type: 'string'}},
            {header: "<b>Correo</b>", width: 200, sortable: true, dataIndex: 'correo', align: 'center', filter: {type: 'string'}},
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        tbar: [
            {
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
                            var titulo = ' Titulo ';
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
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Acronimo</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Dirección</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Telefono</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Correo</Data></Cell>" +
                                    "</Row>";
                            for (var i = 0; i < numFil; i++) {
                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.empresa  + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.acronimo + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.direccion + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.telefono + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + gridStore.data.items[i].data.correo + " </Data></Cell > " +
                                        "</Row>";
                            }
                            table_div += "</Table> </Worksheet></Workbook>";
                            var table_xml = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_xml;
                            a.download = 'Organización' + '.xml';
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
                }
            }],
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecordCompany(selected[0] || null);
            }
        }
    });
    formAdminCompany = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar datos de la empresa ',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
//        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '90%'
        },
        items: [{
                fieldLabel: 'Organización',
                afterLabelTextTpl: required,
                name: 'empresa',
                allowBlank: false,
                labelWidth: 95,
                margins: '0 0 0 50',
                blankText: 'Este campo es obligatorio',
                vtype: 'camposEmpresa',
                allowOnlyWhitespace: false,
                emptyText: 'Ingresar Organización...'
            }, {
                fieldLabel: 'Acrónimo',
                afterLabelTextTpl: required,
                vtype: 'camposAcronimo',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                allowOnlyWhitespace: false,
                labelWidth: 95,
                //anchor: '75%',
                name: 'acronimo',
                emptyText: 'Ingresar Acrónimo...'
            },
            {
                xtype: 'textarea',
                fieldLabel: 'Dirección',
                name: 'direccion',
                labelWidth: 95,
                height: 15,
                vtype: 'campos',
                emptyText: 'Ingresar Dirección...'
            },
            {
                fieldLabel: 'Celular',
                name: 'telefono',
                vtype: 'numeroTelefono',
                //anchor: '75%',
                labelWidth: 95,
                emptyText: '0991540427'
            }, {
                fieldLabel: 'Email',
                name: 'correo',
                vtype: 'emailNuevo',
                labelWidth: 95,
                emptyText: 'kradac@kradac.com'
            }
        ],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
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
                        handler: onUpdateCompany
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateCompany
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Usuario',
                        handler: onDeleteCompany
                    }, {
                        iconCls: 'icon-cleans',
                        tooltip: 'Limpiar Campos',
                        handler: onResetCompany
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminCompany.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminOrganizacion() {
    if (!winAdminCompany) {
        winAdminCompany = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administrar Organización',
            iconCls: 'icon-central',
            resizable: false,
            width: 700,
            height: 360,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminCompany,
                        formAdminCompany
                    ]
                }]
        });
    }
    onResetCompany();
    winAdminCompany.show();
}

function setActiveRecordCompany(record) {
    formAdminCompany.activeRecord = record;
    if (record) {
        formAdminCompany.down('#update').enable();
        formAdminCompany.down('#delete').enable();
        formAdminCompany.down('#create').disable();

        formAdminCompany.getForm().loadRecord(record);
    } else {
        formAdminCompany.down('#update').disable();
        formAdminCompany.getForm().reset();
    }
}

function onUpdateCompany() {
    var active = formAdminCompany.activeRecord,
            form = formAdminCompany.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetCompany();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onCreateCompany() {
    var form = formAdminCompany.getForm();
    if (form.isValid()) {
        formAdminCompany.fireEvent('create', formAdminCompany, form.getValues());
        formAdminCompany.down('#update').disable();
        form.reset();
        storeEmpresas.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetCompany() {
    setActiveRecordCompany(null);
    formAdminCompany.down('#delete').disable();
    formAdminCompany.down('#create').enable();
    formAdminCompany.getForm().reset();
}

function onDeleteCompany() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Empresa', function(choice) {
        if (choice === 'yes') {
            var selection = gridAdminCompany.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                Ext.example.msg("Atención", 'Para hacer esta Operacion Consulte con el Administrador ');
//                gridAdminCompany.store.remove(selection);
//                formAdminUser.down('#delete').disable();
            }
        }
    });
}
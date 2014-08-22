var winAdminCompany;
var formAdminCompany;
var gridAdminCompany;
Ext.onReady(function() {
    Ext.define('DataCompany', {
        extend: 'Ext.data.Model',
        fields: [
             {name: 'id', mapping :'id_empresa', type : 'int'},
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
            {header: "<b>Acronimo</b>", width: 100, align: 'center', sortable: true, dataIndex: 'acronimo'},
            {header: "<b>Empresa</b>", align: 'center', width: 180, sortable: true, dataIndex: 'empresa', renderer: formatCompany},
            {header: "<b>Dirección</b>", width: 130, sortable: true, align: 'center', dataIndex: 'direccion'},
            {header: "<b>Teléfono</b>", width: 350, sortable: true, align: 'center', dataIndex: 'telefono'},
            {header: "<b>Correo</b>", width: 200, sortable: true, dataIndex: 'correo', align: 'center'},
        ],
        stripeRows: true,
        width: '50%',
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
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';

                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>EMPRESAS" + "</th></tr>" +
                                    "<tr></tr>";
                            table_div += "<tr>";
                            table_div += "<th align=left>EMPRESA</th>";
                            table_div += "<th align=left>ACRONIMO </th>";
                            table_div += "<th align=left>DIRECCION </th>";
                            table_div += "<th align=left>TELÉFONO </th>";
                            table_div += "<th align=left>CORREO</th>";
                            table_div += "</tr>";
                            for (var i = 0; i < gridStore.data.length; i++) {
                                                                        
                                table_div += "<tr>";   
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.empresa + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.acronimo + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.direccion + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.telefono + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.correo + "</td>";
                                table_div += "</tr>";
                            }
                            table_div += "</table></font></body>";
                            var table_html = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'Empresas' + '.xls';
                            //triggering the function
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'El Servicio para este navegador no permitido',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });

                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error',
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
        title: 'Ingresar Datos de la Empresa ',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
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
                fieldLabel: 'Empresa',
                afterLabelTextTpl: required,
                name: 'empresa',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                vtype: 'campos',
                allowOnlyWhitespace: false,
                emptyText: 'Ingresar Empresa...'
            }, {
                fieldLabel: 'Acrónimo',
                afterLabelTextTpl: required,
                vtype: 'camposMin',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                allowOnlyWhitespace: false,
                name: 'acronimo',
                emptyText: 'Ingresar Acrónimo...'
            }, {
                fieldLabel: 'Dirección',
                name: 'direccion',
                vtype: 'campos',
                emptyText: 'Ingresar Dirección...'
            }, {
                fieldLabel: 'Celular',
                name: 'telefono',
                vtype: 'numeroTelefono',
                emptyText: '0991540427 (10 dígitos)'
            }, {
                fieldLabel: 'Email',
                name: 'correo',
                vtype: 'emailNuevo',
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
                        disabled:true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Usuario',
                        handler: onDeleteCompany
                    }, {
                        iconCls: 'icon-limpiar',
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
function showWinAdminCompany() {
    if (!winAdminCompany) {
        winAdminCompany = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Empresas',
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
        console.log("creando");
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
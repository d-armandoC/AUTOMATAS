var ventanaAgregarUsuario;
var contenedorUsuario;
var formularioRegistrosUsuario;
var grillaUsarios;
var panelGridUsuario;
Ext.onReady(function() {
    //Fenera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUser', type: 'int'},
            {name: 'cedula'},
            {name: 'idPerson', type: 'int'},
            {name: 'person'},
            {name: 'rol'},
            {name: 'idEmp', type: 'int'},
            {name: 'empresa'},
            {name: 'usuario'},
            {name: 'clave'}
        ]
    });
    // crea los datos del store
    var gridStoreUsuario = Ext.create('Ext.data.Store', {
        autoSync: true,
        model: 'DataObjectUser',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
                destroy: 'php/administracion/usuario/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
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
                    if (operation.state) {
                        formularioRegistrosUsuario.down('#updateUser').disable();
                        formularioRegistrosUsuario.getForm().reset();
                    }
                    gridStoreUsuario.reload();
                }
            }
        }
    });
    // declare the source Grid
    grillaUsarios = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStoreUsuario,
        columns: [
            {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
            {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
            {header: "Usuario", width: 100, sortable: true, dataIndex: 'usuario', filter: {type: 'string'}},
            {header: "Persona", width: 200, sortable: true, dataIndex: 'person', filter: {type: 'string'}},
            {header: "Empresa", width: 100, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
            {header: "Rol", width: 100, sortable: true, dataIndex: 'rol', filter: {type: 'list', store: storeRolUserList}}
        ],
        enableDragDrop: true,
        stripeRows: true,
        height: 270,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {

                    if (gridStoreUsuario.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';
                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>USUARIOS" + "</th></tr>" +
                                    "<tr></tr>";
                            table_div += "<tr>";
                            table_div += "<th align=left>CEDULA</th>";
                            table_div += "<th align=left>PERSONA</th>";
                            table_div += "<th align=left>USUARIO</th>";
                            table_div += "<th align=left>ROL DE USUARIO</th>";
                            table_div += "<th align=left>EMPRESA</th>";
//                            table_div += "<th align=left>ESTADO</th>";
                            table_div += "</tr>";
                            for (var i = 0; i < gridStoreUsuario.data.length; i++) {
                                table_div += "<tr>";
                                table_div += "<td align=lef>" + gridStoreUsuario.data.items[i].data.cedula + "</td>";
                                table_div += "<td align=lef>" + gridStoreUsuario.data.items[i].data.person + "</td>";
                                table_div += "<td align=lef>" + gridStoreUsuario.data.items[i].data.usuario + "</td>";
                                table_div += "<td align=lef>" + gridStoreUsuario.data.items[i].data.rol, +"</td>";
                                table_div += "<td align=lef>" + gridStoreUsuario.data.items[i].data.empresa + "</td>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.activeUser + "</td>";
                                table_div += "</tr>";
                            }                            
                            table_div += "</table></font></body>";
                            var table_html = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'Usuarios' + '.xls';
                            //triggering the function
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: '<center> El Servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'No hay datos en la Lista a Exportar',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                setActiveRecordUser(selected[0] || null);
            }
        }
    });
    panelGridUsuario = Ext.create('Ext.form.Panel', {
        width: '55%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        items: [grillaUsarios]
    });
    var storRoles = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboRoles.php',
            reader: {
                type: 'json',
                root: 'rol_usuario'
            }
        },
        fields: ['id', 'nombre']
    });
    formularioRegistrosUsuario = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-user',
        region: 'center',
        title: '<b>Ingresar Datos del Usuario</b>',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 100,
        margins: '0 0 0 25',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 80
        },
//        defaults: {
//            anchor: '90%'
//        },
        items: [{
                xtype: 'fieldset',
                checkboxToggle: true,
                title: '<b>Datos del Usuario</b>',
                //defaultType: 'textfield',
                collapsed: false,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .9,
                                baseCls: 'x-plain',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '<b>Empresa</b>',
                                        afterLabelTextTpl: required,
                                        blankText: 'Este campo es Obligatorio',
                                        name: 'idEmp',
                                        store: storeEmpresas,
                                        valueField: 'id',
                                        displayField: 'text',
                                        queryMode: 'local',
                                        editable: false,
                                        allowBlank: false,
                                        emptyText: 'Escoja la Empresa...',
                                    }
                                ]
                            }, {
                                columnWidth: .1,
                                baseCls: 'x-plain',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon-central',
                                        tooltip: 'Agregar Nueva Empresa',
                                        handler: function() {
                                            showWinAdminCompany();
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .9,
                                baseCls: 'x-plain',
                                items: [
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: '<b>Persona</b>',
                                        afterLabelTextTpl: required,
                                        blankText: 'Este campo es Obligatorio',
                                        name: 'idPerson',
                                        store: storePersonas,
                                        valueField: 'id',
                                        displayField: 'text',
                                        queryMode: 'local',
                                        editable: false,
                                        allowBlank: false,
                                        emptyText: 'Escoja la Persona...',
                                    }
                                ]
                            }, {
                                columnWidth: .1,
                                baseCls: 'x-plain',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon-personal',
                                        tooltip: 'Agregar Nueva Persona',
                                        handler: function() {
                                            ventAddPersonal();
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                    , {
                        xtype: 'combobox',
                        fieldLabel: '<b>Rol de Usuario</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es Obligatorio',
                        name: 'rol',
                        store: storRoles,
                        valueField: 'id',
                        displayField: 'nombre',
                        queryMode: 'local',
                        editable: false,
                        allowBlank: false,
                        emptyText: 'Elija el Rol de Usuario...',
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '<b>Usuario</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es Obligatorio',
                        name: 'usuario',
                        vtype: 'campos',
                        allowBlank: false,
                        emptyText: 'Ingresar Usuario...',
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '<b>Contraseña</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es Obligatorio',
                        name: 'clave',
                        itemId: 'pass',
                        allowBlank: false,
                        inputType: 'password',
                        emptyText: 'Ingresar Contraseña...',
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '<b>Confirmar Contraseña</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es Obligatorio',
                        name: 'clave',
                        allowBlank: false,
                        inputType: 'password',
                        emptyText: 'Ingresar Contraseña Nuevamente...',
                        vtype: 'password',
                        initialPassField: 'pass'
                    }]
            }],
        listeners: {
            create: function(form, data) {
                gridStoreUsuario.insert(0, data);
                gridStoreUsuario.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [
                    '->',
                    {iconCls: 'icon-update', itemId: 'updateUser', text: '<b>Actualizar</b>', scope: this, tooltip: 'Actualizar Datos', handler: onUpdateUser},
                    {iconCls: 'icon-user-add', itemId: 'createUser', text: '<b>Crear</b>', scope: this, tooltip: 'Crear Usuario', handler: onCreateUser},
                    {iconCls: 'icon-delete', text: '<b>Eliminar</b>', itemId: 'deleteUser', scope: this, tooltip: 'Eliminar Usuario', handler: onDeleteClickUser},
                    {iconCls: 'icon-limpiar', scope: this, tooltip: 'Limpiar Campos', handler: onResetUser},
                    {iconCls: 'icon-cancelar', tooltip: 'Cancelar', scope: this, handler: clearWinUser}
                ]
            }]
    });
});
function ventAddUser() {
    if (!ventanaAgregarUsuario) {
        ventanaAgregarUsuario = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Añadir Usuario',
            iconCls: 'icon-user-add',
            resizable: false,
            width: 800,
            height: 380,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        panelGridUsuario,
                        formularioRegistrosUsuario
                    ]
                }]
        });
    }
    onResetCompany();
    ventanaAgregarUsuario.show();
    formularioRegistrosUsuario.down('#updateUser').disable();
    formularioRegistrosUsuario.down('#createUser').enable();
    formularioRegistrosUsuario.down('#deleteUser').disable();
    if (grillaUsarios.getStore().getCount() == 0) {
        grillaUsarios.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElUser = document.getElementById('panel-datos-user');
    var formPanelDropTargetUser = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElUser, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formularioRegistrosUsuario.body.stopAnimation();
            formularioRegistrosUsuario.body.highlight();
        },
        notifyDrop: function(ddSource, e, data) {

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            setActiveRecordUser(selectedRecord || null);
            // Carga los registro en el form            
            formularioRegistrosUsuario.getForm().loadRecord(selectedRecord);
            formularioRegistrosUsuario.down('#updateUser').enable();
            formularioRegistrosUsuario.down('#createUser').disable();
            formularioRegistrosUsuario.down('#deleteUser').enable();
            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecordUser(record) {
    formularioRegistrosUsuario.activeRecord = record;
    if (record) {
        formularioRegistrosUsuario.down('#updateUser').enable();
        formularioRegistrosUsuario.down('#deleteUser').enable();
        formularioRegistrosUsuario.down('#createUser').disable();
        formularioRegistrosUsuario.getForm().loadRecord(record);
    } else {
        formularioRegistrosUsuario.down('#updateUser').disable();
        formularioRegistrosUsuario.getForm().reset();
    }
}

function onUpdateUser() {
    var active = formularioRegistrosUsuario.activeRecord,
            form = formularioRegistrosUsuario.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetUser();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
    }
}

function onCreateUser() {
    var form = formularioRegistrosUsuario.getForm();
    if (form.isValid()) {
        formularioRegistrosUsuario.fireEvent('create', formularioRegistrosUsuario, form.getValues());
        formularioRegistrosUsuario.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
    }
}

function onResetUser() {
    setActiveRecordUser(null);
    formularioRegistrosUsuario.down('#deleteUser').disable();
    formularioRegistrosUsuario.down('#createUser').enable();
    formularioRegistrosUsuario.getForm().reset();
}

function clearWinUser() {
    formularioRegistrosUsuario.down('#deleteUser').disable();
    formularioRegistrosUsuario.down('#createUser').enable();
    ventanaAgregarUsuario.hide();
}

function onDeleteClickUser() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el usuario', function(choice) {
        if (choice === 'yes') {
            var selection = grillaUsarios.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                grillaUsarios.store.remove(selection);
                formularioRegistrosUsuario.down('#deleteUser').disable();
                formularioRegistrosUsuario.down('#createUser').enable();
            }
        }
    });
}
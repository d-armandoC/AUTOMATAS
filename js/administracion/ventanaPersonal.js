var winAddPesonal;
var gridPersona;
var formPersona;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function() {
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idPerson'},
            {name: 'empresa'},
            {name: 'cedula'},
            {name: 'nombres'},
            {name: 'apellidos'},
            {name: 'email'},
            {name: 'cbxEmpleo'},
            {name: 'fechaNacimiento', type: 'date', dateFormat: 'c'},
            {name: 'direccion', type: 'string'},
            {name: 'celular', type: 'string'}
        ]
    });

    // crea los datos del store
    var gridStorePerson = Ext.create('Ext.data.Store', {
        autoSync: true,
        model: 'DataObject',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/personal/read.php',
                create: 'php/administracion/personal/create.php',
                update: 'php/administracion/personal/update.php',
                destroy: 'php/administracion/personal/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'personas',
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
                    storePersonas.reload();
                    gridStorePerson.reload();
                    formPersona.getForm().reset();
                    if (operation.state) {
                        formPersona.getForm().reset();
                        storePersonas.reload();
                    }
                }
            }
        }
    });

    // declare the source Grid
    gridPersona = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStorePerson,
        columns: [
            {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}, align: 'center'},
            {header: "Apellidos", width: 100, sortable: true, dataIndex: 'apellidos', filter: {type: 'string'}},
            {header: "Nombres", width: 100, sortable: true, dataIndex: 'nombres', filter: {type: 'string'}},
            {header: "Ingresado Por", width: 100, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}}
        ],
        enableDragDrop: true,
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {

                    if (gridStorePerson.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';
                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>PERSONAS" + "</th></tr>" +
                                    "<tr></tr>";
                            table_div += "<tr>";
                            table_div += "<th align=left>CEDULA</th>";
                            table_div += "<th align=left>NOMBRES </th>";
                            table_div += "<th align=left>APELLIDOS</th>";
                            table_div += "<th align=left>FECHA DE NACIMIENTO</th>";
                            table_div += "<th align=left>DIRECCION</th>";
                            table_div += "<th align=left>EMAIL</th>";
                            table_div += "<th align=left>CELULAR</th>";
                            table_div += "</tr>";
                            for (var i = 0; i < gridStorePerson.data.length; i++) {


                                table_div += "<tr>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.cedula + "</td>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.nombres + "</td>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.apellidos + "</td>";
                                table_div += "<td align=lef>" + Ext.Date.format(gridStorePerson.data.items[i].data.fechaNacimiento, 'm/d/Y') + "</td>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.direccion + "</td>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.email + "</td>";
                                table_div += "<td align=lef>" + gridStorePerson.data.items[i].data.celular + "</td>";
                                table_div += "</tr>";
                            }
                            table_div += "</table></font></body>";
                            var table_html = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'Pesonas' + '.xls';
                            //triggering the function
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'El Servicio para este navegador no permitido,use un navegador como Google Chrome',
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
                //console.log(selected[0]);
                setActiveRecords(selected[0] || null);
            }

//            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
//                //console.log('mouse sobre item');
//            }
        }
    });

    var storeEmpleos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboEmpleos.php',
            reader: {
                type: 'json',
                root: 'empleos'
            }
        },
        fields: ['id', 'nombre']
    });

    formPersona = Ext.create('Ext.form.Panel', {
        id: 'panel-datos',
        region: 'center',
        title: '<b>Ingresar Datos de la Persona</b>',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 120,
        margins: '0 0 0 3',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 80
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                checkboxToggle: true,
                title: '<b>Datos Personales</b>',
                defaultType: 'textfield',
                collapsed: false,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        fieldLabel: '<b>Cedula</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'cedula',
                        vtype: 'cedulaValida',
                        allowBlank: false,
                        emptyText: '0123456789 (10 digitos)',
                    }, {
                        fieldLabel: '<b>Nombres</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'nombres',
                        vtype: 'campos',
                        allowBlank: false,
                        emptyText: 'Ingresar Nombres...',
                    }, {
                        fieldLabel: '<b>Apellidos</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'apellidos',
                        vtype: 'campos',
                        allowBlank: false,
                        emptyText: 'Ingresar Apellidos...',
                    }
                    , {
                        fieldLabel: '<b>Fecha de Nacimiento</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        editable: false,
                        maxValue: edadDate,
                        value: edadDate,
                        name: 'fechaNacimiento',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        emptyText: 'Ingresar Fecha...',
                        minValue: '1950-01-01',
//                        maxValue : new Date()
                    }]
            }, {
                xtype: 'fieldset',
                title: '<b>Contacto</b>',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        fieldLabel: '<b>Dirección</b>',
                        name: 'direccion',
                        vtype: 'direccion',
                        emptyText: 'Ingresar Direccion...'
                    }, {
                        fieldLabel: '<b>Email</b>',
                        name: 'email',
                        vtype: 'emailNuevo',
                        emptyText: 'kradac@kradac.com'
                    }, {
                        fieldLabel: '<b>Celular</b>',
                        name: 'celular',
                        vtype: 'numeroTelefono',
                        emptyText: '0991540427 (10 digitos)'
                    }]
            }],
        listeners: {
            create: function(form, data) {
                gridStorePerson.insert(0, data);
                gridStorePerson.reload();
                storeMails.reload();
                storeMailsGeo.reload();
                storePersonas.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updatePerson', text: 'Actualizar', scope: this, tooltip: 'Actualizar Datos', handler: onUpdatePersona},
                    {iconCls: 'icon-user-add', itemId: 'createPerson', text: 'Crear', scope: this, tooltip: 'Crear Persona', handler: onCreatePersona},
                    {iconCls: 'icon-delete', itemId: 'deletePerson', text: 'Eliminar', scope: this, tooltip: 'Eliminar Persona', handler: onDeleteClicket},
                    {iconCls: 'icon-limpiar', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this, handler: onResetPersona},
                    {iconCls: 'icon-cancelar', tooltip: 'Cancelar', scope: this, handler: function() {
                            winAddPesonal.hide();
                        }}
                ]
            }]
    });
});

function ventAddPersonal() {
    if (!winAddPesonal) {
        winAddPesonal = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Añadir Personal',
            iconCls: 'icon-personal',
            resizable: false,
            width: 785,
            height: 440,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridPersona,
                        formPersona
                    ]}]
        });
    }
    onResetPersona();
    winAddPesonal.show();
    storePersonas.reload();
    formPersona.down('#updatePerson').disable();
    formPersona.down('#createPerson').enable();
    formPersona.down('#deletePerson').disable();

    if (gridPersona.getStore().getCount() == 0) {
        gridPersona.getStore().load();
    }
    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetEl = document.getElementById('panel-datos');
    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {
            // Añadir un poco de brillo al momento de entrar al contenedor
            formPersona.body.stopAnimation();
            formPersona.body.highlight();
        },
        notifyDrop: function(ddSource, e, data) {
            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            setActiveRecords(selectedRecord || null);
            // Carga los registro en el form            
            formPersona.getForm().loadRecord(selectedRecord);

            formPersona.down('#updatePerson').enable();
            formPersona.down('#createPerson').disable();
            formPersona.down('#deletePerson').enable();
            return true;
        }
    });
}

function setActiveRecords(record) {
    formPersona.activeRecord = record;
    if (record) {
        formPersona.down('#updatePerson').enable();
        formPersona.down('#createPerson').disable();
        formPersona.down('#deletePerson').enable();
        formPersona.getForm().loadRecord(record);
    } else {
        formPersona.down('#updatePerson').disable();
        formPersona.getForm().reset();
    }
}

function onUpdatePersona() {
    var active = formPersona.activeRecord,
            form = formPersona.getForm();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetPersona();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onCreatePersona() {
    var form = formPersona.getForm();
    if (form.isValid()) {
        formPersona.fireEvent('create', formPersona, form.getValues());
        formPersona.down('#update').enable();
        form.reset();
        storePersonas.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetPersona() {
    setActiveRecords(null);
    formPersona.down('#deletePerson').disable();
    formPersona.down('#createPerson').enable();
    formPersona.getForm().reset();
}

function clearWinPersona() {
    formPersona.down('#deletePerson').disable();
    formPersona.down('#createPerson').enable();
}

function onDeleteClicket() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar a la persona', function(choice) {
        if (choice === 'yes') {
            var selection = gridPersona.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridPersona.store.remove(selection);
                formPersona.down('#deletePerson').disable();
                formPersona.down('#createPerson').enable();
            }
        }
    });
}
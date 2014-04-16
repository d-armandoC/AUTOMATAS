var winAddUser;
var contenedorUser;
var formRecordsUser;
var gridRecordsUser;

Ext.onReady(function(){    
    //Fenera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping : 'idUser', type : 'int'},
            {name: 'cedula'},
            {name: 'idPerson'},
            {name: 'person'},            
            {name: 'rol'},
            {name: 'idEmp'},
            {name: 'empresa'},
            {name: 'usuario'},
            {name: 'clave'}
        ]
        //No combiene mucho utilizar ya que no se guarda
        //en a base si ingreso un valor fuera de los requerimientos
        //Mejor validar con Vtype en cada campo como con email
        /*,
        validations: [
            {type: 'length', field: 'cedula', min: 10, max: 10},            
            {type: 'length', field: 'nombres', min: 3},
            {type: 'length', field: 'apellidos', min: 3},
            {type: 'length', field: 'email', min: 5}            
        ]*/
    });

    // crea los datos del store
    var gridStoreUser = Ext.create('Ext.data.Store', {
        autoSync : true,
        model  : 'DataObjectUser',
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
                destroy: 'php/administracion/usuario/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'usuarios'
            },
            listeners: {
                exception: function(proxy, response, operation){
                    if (operation.action == 'create') {
                        if (operation.success) {                            
                            Ext.example.msg("Mensaje", operation.resultSet.message);
                        } else {                            
                            Ext.MessageBox.show({
                                title: 'ERROR',
                                msg: operation.getError(),
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.Msg.OK
                            });                            
                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'REMOTE EXCEPTION',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                    gridStoreUser.reload();                    
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action == 'destroy') {                    
                    setActiveRecordUser(null);
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    } 
                }

                if (operation.action == 'update' || operation.action == 'create') {
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                        formRecordsUser.down('#updateUser').disable();
                        formRecordsUser.getForm().reset();
                        gridStoreUser.reload();
                    } else {
                        console.log("hoal");
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                        //gridStoreUser.reload();
                    }                    
                }
            }
        }
    });

    // Column Model shortcut array
    var columns = [
        {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
        {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
        {header: "Usuario", width: 100, sortable: true, dataIndex: 'usuario', filter: {type: 'string'}},
        {header: "Persona", width: 200, sortable: true, dataIndex: 'person', filter: {type: 'string'}},
        {header: "Empresa", width: 100, sortable: true, dataIndex: 'empresa', renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {header: "Rol", width: 100, sortable: true, dataIndex: 'rol', filter: {type: 'list', store: storeRolUserList}}
    ];

    // declare the source Grid
    gridRecordsUser = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },        
        store : gridStoreUser,
        columns : columns,
        enableDragDrop : true,
        stripeRows : true,
        height : 270,
        selModel : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
        features: [filters]
        //Para cuando de click a una de las filas se pasen los datos
        /*listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                //console.log(selected[0]);
                setActiveRecordUser(selected[0] || null);
            },

            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
                //console.log('mouse sobre item');
            }
        }*/
    });

    var formPanelGrid = Ext.create('Ext.form.Panel',{
        width : '50%',        
        margins : '0 2 0 0',
        region : 'west',
        title : 'Registros',
        items : [gridRecordsUser]
    });

    var storeRoles = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/combobox/comboRoles.php',
            reader : {
                type : 'json',
                root: 'rol_usuario'
            }
        },
        fields : ['id', 'nombre']
    });

    formRecordsUser = Ext.create('Ext.form.Panel', {
        id : 'panel-datos-user',
        region : 'center',
        title : '<b>Ingresar Datos del Usuario</b>',
        activeRecord: null,
        bodyStyle : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        margins    : '0 0 0 3',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype:'fieldset',
            checkboxToggle:true,
            title: '<b>Datos del Usuario</b>',
            defaultType: 'textfield',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                xtype : 'combobox',
                fieldLabel: '<b>Empresa</b>',
                afterLabelTextTpl: required,
                name: 'idEmp',
                store : storeEmpresas,
                valueField : 'id',
                displayField : 'text',
                queryMode : 'local',
                editable : false,
                allowBlank : false,
                emptyText : 'Escoja la Empresa...',
            },{
                xtype : 'combobox',
                fieldLabel: '<b>Persona</b>',
                afterLabelTextTpl: required,
                name: 'idPerson',
                store : storePersonas,
                valueField : 'id',
                displayField : 'text',                
                queryMode : 'local',                
                allowBlank : false,                
                emptyText : 'Escoja la Persona...',
            },{
                xtype : 'combobox',
                fieldLabel: '<b>Rol de Usuario</b>',
                afterLabelTextTpl: required,
                name: 'rol',
                store : storeRoles,
                valueField : 'id',
                displayField : 'nombre',                
                queryMode : 'local',                
                allowBlank : false,                
                emptyText : 'Elija el Rol de Usuario...',
            },{
                fieldLabel: '<b>Usuario</b>',
                afterLabelTextTpl: required,
                name: 'usuario',                
                allowBlank : false,                
                emptyText : 'Ingresar Usuario...',
            },{                
                fieldLabel: '<b>Contraseña</b>',
                afterLabelTextTpl: required,
                name: 'clave',
                itemId: 'pass',
                allowBlank : false,
                inputType : 'password',
                emptyText : 'Ingresar Contraseña...',
            },{                
                fieldLabel: '<b>Confirmar Contraseña</b>',
                afterLabelTextTpl: required,
                name: 'clave',                
                allowBlank : false,
                inputType : 'password',
                emptyText : 'Ingresar Contraseña Nuevamente...',
                vtype: 'password',
                initialPassField: 'pass'
            }]
        }],
        listeners: {
            create: function(form, data){                
                gridStoreUser.insert(0, data);
                gridStoreUser.reload();                
            }
        },
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [ 
                { iconCls : 'icon-personal', scope : this, tooltip : 'Ingresar Nueva Persona', handler : ventAddPersonal },
                '->',
                { iconCls: 'icon-update', itemId: 'updateUser', text: '<b>Actualizar</b>', scope: this, tooltip : 'Actualizar Datos', handler: onUpdateUser },
                { iconCls : 'icon-user-add', itemId: 'createUser', text: '<b>Crear</b>', scope: this, tooltip : 'Crear Usuario', handler: onCreateUser },
                { iconCls: 'icon-delete', text: '<b>Eliminar</b>', itemId: 'deleteUser', scope: this, tooltip : 'Eliminar Usuario', handler: onDeleteClickUser},
                { iconCls: 'icon-reset', scope: this, tooltip : 'Limpiar Campos', handler: onResetUser },
                { iconCls: 'icon-cancelar', tooltip : 'Cancelar', scope: this, handler: clearWinUser }
            ]
        }]
    });

    contenedorUser = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 5,
        items: [
            formPanelGrid,
            formRecordsUser
        ]
    });    
});

function ventAddUser(){
	if(!winAddUser){
        winAddUser = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Añadir Usuario',
            iconCls : 'icon-user-add',
            resizable : false,
            width : 780,
            height : 370,
            closeAction : 'hide',
            plain : false,
            items : [contenedorUser]
        });
    }
    contenedorUser.getForm().reset();
    winAddUser.show();

    formRecordsUser.down('#updateUser').disable();
    formRecordsUser.down('#createUser').enable();
    formRecordsUser.down('#deleteUser').disable();

    if (gridRecordsUser.getStore().getCount() == 0) {
        gridRecordsUser.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElUser =  document.getElementById('panel-datos-user');

    var formPanelDropTargetUser = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElUser, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsUser.body.stopAnimation();
            formRecordsUser.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            
            setActiveRecordUser(selectedRecord || null);

            // Carga los registro en el form            
            formRecordsUser.getForm().loadRecord(selectedRecord);
            
            formRecordsUser.down('#updateUser').enable();
            formRecordsUser.down('#createUser').disable();
            formRecordsUser.down('#deleteUser').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecordUser(record){
    formRecordsUser.activeRecord = record;
    if (record) {
        formRecordsUser.down('#updateUser').enable();
        formRecordsUser.getForm().loadRecord(record);
    } else {
        formRecordsUser.down('#updateUser').disable();
        formRecordsUser.getForm().reset();
    }
}

function onUpdateUser(){
    var active = formRecordsUser.activeRecord,
    form = formRecordsUser.getForm();
    
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);        
        onResetUser();
    }
}

function onCreateUser(){
    var form = formRecordsUser.getForm();    

    if (form.isValid()) {        
        formRecordsUser.fireEvent('create', formRecordsUser, form.getValues());
    }
}

function onResetUser(){
    setActiveRecordUser(null);
    formRecordsUser.down('#deleteUser').disable();
    formRecordsUser.down('#createUser').enable();
    formRecordsUser.getForm().reset();
}

function clearWinUser(){
    formRecordsUser.down('#deleteUser').disable();
    formRecordsUser.down('#createUser').enable();
    winAddUser.hide();
}

function onDeleteClickUser(){
    var selection = gridRecordsUser.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsUser.store.remove(selection);
        formRecordsUser.down('#deleteUser').disable();
        formRecordsUser.down('#createUser').enable();
    }
}
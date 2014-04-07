var winManten;
var contenedorManten;
var formRecordsManten;
var gridRecordsManten;

Ext.onReady(function() {

    // crea los datos del store
    var storeGridManten = Ext.create('Ext.data.Store', {        
        autoLoad : true,
        autoSync : true,
        fields : [            
            {name: 'id', mapping : 'id_manten'},
            {name: 'manten'},
            {name: 'tiempo'},
            {name: 'odom'},
            {name: 'empresa'}
        ],
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/interface/maintenance/read.php',
                create: 'php/interface/maintenance/create.php',
                update: 'php/interface/maintenance/update.php',
                destroy: 'php/interface/maintenance/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'maintenance',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'maintenance'
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
                    storeGridManten.reload();                    
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action == 'destroy') {                    
                    setActiveRecordManten(null);
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
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }                    
                }

                storeGridManten.reload();                
            }
        }
    });

    // Column Model shortcut array
    var columns = [
        {header: "ID", width: 25, sortable: true, dataIndex: 'id'},
        {header: "Mantenimiento", width: 100, sortable: true, dataIndex: 'manten'},
        {header: "Tiempo", width: 100, sortable: true, dataIndex: 'tiempo'},
        {header: "Kilometraje", width: 100, sortable: true, dataIndex: 'odom'},
        {header: "Ingresado Por", width: 100, sortable: true, dataIndex: 'empresa', renderer : formatCompany, filter: {type: 'list', store: storeEmpresasList}}
    ];

    // declare the source Grid
    gridRecordsManten = Ext.create('Ext.grid.Panel', {        
        store : storeGridManten,
        columns : columns,        
        stripeRows : true,
        width : '50%',
        margins : '0 2 0 0',
        region : 'west',
        title : 'Registros',        
        listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                formRecordsManten.down('#delete').enable();
                setActiveRecordManten(selected[0] || null);
            }            
        }
    });

    formRecordsManten = Ext.create('Ext.form.Panel', {        
        region : 'center',
        title : 'Ingresar Datos del Mantenimiento',
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
            title: 'Datos de Mantenimiento',
            defaultType: 'textfield',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: 'Nombre',
                afterLabelTextTpl: required,
                name: 'manten',                
                allowBlank:false,
                emptyText : 'Nombre del Mantenimiento...',
            },{
                fieldLabel: 'Tiempo',
                afterLabelTextTpl: required,
                name: 'tiempo',
                allowBlank:false,
                emptyText : 'Ingresar Tiempo en dias...',
            },{
                fieldLabel: 'Kilometraje',
                afterLabelTextTpl: required,
                name: 'odom',
                allowBlank:false,
                emptyText : 'Ingresar kilometraje...',
            }]
        }],
        listeners: {
            create: function(form, data){
                storeGridManten.insert(0, data);
                storeGridManten.reload();                
            }
        },
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-save',
                itemId: 'save',
                text: 'Actualizar',
                disabled: true,
                scope: this,
                tooltip : 'Actualizar Datos',
                handler: onSaveManten
            },{
                iconCls: 'icon-user-add',
                text: 'Crear',
                scope: this,
                tooltip : 'Crear Persona',
                handler: onCreateManten
            },{
                iconCls: 'icon-delete',
                text: 'Eliminar',
                disabled: true,
                itemId: 'delete',
                scope: this,
                tooltip : 'Eliminar Persona',
                handler: onDeleteClickManten
            },{
                iconCls: 'icon-reset',
                text: 'Limpiar',
                tooltip : 'Limpiar Campos',
                scope: this,
                handler: onResetManten
            }]
        }]
    });

    contenedorManten = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 5,
        items: [
            gridRecordsManten,
            formRecordsManten
        ]
    });    
});

function ventMantenimiento(){
    if(!winManten){
        winManten = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Añadir Mantenimiento',
            iconCls : 'icon-manten-edit',            
            resizable : false,
            width : 700,
            height : 300,
            closeAction : 'hide',
            plain : false,
            items : [contenedorManten],
            listeners : {
                close : function( panel, eOpts ){
                    onResetManten();
                }
            }
        });        
    }
    contenedorManten.getForm().reset();
    winManten.show();
}

function setActiveRecordManten(record){
    formRecordsManten.activeRecord = record;
    if (record) {
        formRecordsManten.down('#save').enable();
        formRecordsManten.getForm().loadRecord(record);
    } else {
        formRecordsManten.down('#save').disable();
        formRecordsManten.getForm().reset();
    }
}

function onSaveManten(){
    var active = formRecordsManten.activeRecord,
    form = formRecordsManten.getForm();
                    
    if (!active) {
        return;
    }
    if (form.isValid()) {                        
        form.updateRecord(active);
        onResetManten();
    }
}

function onCreateManten(){
    var form = formRecordsManten.getForm();    

    if (form.isValid()) {        
        formRecordsManten.fireEvent('create', formRecordsManten, form.getValues());
        formRecordsManten.down('#save').disable();        
        form.reset();
    }
}

function onResetManten(){
    setActiveRecordManten(null);
    formRecordsManten.down('#delete').disable();
    formRecordsManten.getForm().reset();    
    gridRecordsManten.getStore().reload();
}

function onDeleteClickManten(){
    var selection = gridRecordsManten.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsManten.store.remove(selection);
        formRecordsManten.down('#delete').disable();
    }
}
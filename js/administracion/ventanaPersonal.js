var winAddPesonal;
var formPersonal;
var gridRecords;
var formRecords;

Ext.onReady(function(){
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            //Id importante para hacer updates
            //debe ir con mapping para obtener los valores
            //ya que al pasarlos el id queda predeterminado
            {name: 'id', mapping : 'idPerson'},
            {name: 'empresa'},
            {name: 'cedula'},
            {name: 'nombres'},
            {name: 'apellidos'},
            {name: 'email'},
            {name: 'cbxEmpleo'},
            {name: 'fechaNacimiento'},
            {name: 'direccion'},
            {name: 'celular'}
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
    var gridStorePerson = Ext.create('Ext.data.Store', {
        autoSync : true,
        model  : 'DataObject',
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/administracion/personal/read.php',
                create: 'php/administracion/personal/create.php',
                update: 'php/administracion/personal/update.php',
                destroy: 'php/administracion/personal/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'personas',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'personas'
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
                    storeMails.reload();
                    storeMailsGeo.reload();
                    storePersonas.reload();
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action == 'destroy') {                    
                    setActiveRecord(null);
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                        gridStorePerson.reload();
                        storeMails.reload();
                        storeMailsGeo.reload();
                        storePersonas.reload();
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
                        gridStorePerson.reload();
                        storeMails.reload();
                        storeMailsGeo.reload();
                        storePersonas.reload();
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }                    
                }
            }
        }
    });

    // declare the source Grid
    gridRecords = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },        
        store : gridStorePerson,
        columns : [
            {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
            {header: "Apellidos", width: 100, sortable: true, dataIndex: 'apellidos', filter: {type: 'string'}},
            {header: "Nombres", width: 100, sortable: true, dataIndex: 'nombres', filter: {type: 'string'}},
            {header: "Ingresado Por", width: 100, sortable: true, dataIndex: 'empresa', renderer : formatCompany, filter: {type: 'list', store: storeEmpresasList}}
        ],
        enableDragDrop : true,
        stripeRows : true,
        width : '50%',
        margins : '0 2 0 0',
        region : 'west',
        title : 'Registros',
        selModel : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
        features: [filters]
        //Para cuando de click a una de las filas se pasen los datos
        /*listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                //console.log(selected[0]);
                setActiveRecord(selected[0] || null);
            },

            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
                //console.log('mouse sobre item');
            }
        }*/
    });

    var storeEmpleos = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/combobox/comboEmpleos.php',
            reader : {
                type : 'json',
                root: 'empleos'
            }
        },
        fields : ['id', 'nombre']
    });

    formRecords = Ext.create('Ext.form.Panel', {
        id : 'panel-datos',
        region : 'center',
        title : '<b>Ingresar Datos de la Persona</b>',
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
            title: '<b>Datos Personales</b>',
            defaultType: 'textfield',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: '<b>Cedula</b>',
                afterLabelTextTpl: required,
                name: 'cedula',
                vtype : 'cedulaValida',
                allowBlank:false,
                emptyText : '0123456789 (10 digitos)',
            },{
                fieldLabel: '<b>Nombres</b>',
                afterLabelTextTpl: required,
                name: 'nombres',
                allowBlank:false,
                emptyText : 'Ingresar Nombres...',
            },{
                fieldLabel: '<b>Apellidos</b>',
                afterLabelTextTpl: required,
                name: 'apellidos',
                allowBlank:false,
                emptyText : 'Ingresar Apellidos...',
            },{
                xtype : 'combobox',
                fieldLabel : '<b>Empleo</b>',
                name : 'cbxEmpleo',
                afterLabelTextTpl: required,
                store : storeEmpleos,
                valueField : 'id',
                displayField : 'nombre',
                queryMode : 'local',                
                allowBlank : false,
                emptyText : 'Seleccionar Empleo...'
            }, {
                fieldLabel: '<b>Fecha de Nacimiento</b>',
                name: 'fechaNacimiento',
                xtype: 'datefield',
                format: 'Y-m-d',
                emptyText : 'Ingresar Fecha...',
                minValue : '1950-01-01',
                maxValue : new Date()
            }]
        },{
            xtype:'fieldset',
            title: '<b>Direccion y Telefono</b>',
            collapsible: true,
            defaultType: 'textfield',
            layout: 'anchor',            
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: '<b>Dirección</b>',
                name: 'direccion',
                emptyText : 'Ingresar Direccion...'
            },{
                fieldLabel: '<b>Email</b>',
                name: 'email',
                vtype:'email',
                emptyText : 'kradac@kradac.com'                
            },{
                fieldLabel: '<b>Celular</b>',
                name: 'celular',
                emptyText : '0991540427 (10 digitos)'
            }]
        }],
        listeners: {
            create: function(form, data){
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
                { iconCls: 'icon-update', itemId: 'updatePerson', text: 'Actualizar', scope: this, tooltip : 'Actualizar Datos', handler: onUpdatePerson },
                { iconCls: 'icon-user-add', itemId: 'createPerson', text: 'Crear', scope: this, tooltip : 'Crear Persona', handler: onCreatePerson },
                { iconCls: 'icon-delete', itemId: 'deletePerson', text: 'Eliminar', scope: this, tooltip : 'Eliminar Persona', handler: onDeleteClick },
                { iconCls: 'icon-reset', text: 'Limpiar', tooltip : 'Limpiar Campos', scope: this, handler: onResetPerson },
                { iconCls: 'icon-cancelar', text: 'Cancelar', tooltip : 'Cancelar', scope: this, handler: clearWinPerson }
            ]
        }]
    });

    formPersonal = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 5,
        items: [
            gridRecords,
            formRecords
        ]
    });
});

function ventAddPersonal(){
	if(!winAddPesonal){
        winAddPesonal = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Añadir Personal',
            iconCls : 'icon-personal',
            resizable : false,
            width : 780,
            height : 440,
            closeAction : 'hide',
            plain : false,
            items : [formPersonal]
        });        
    }
    formPersonal.getForm().reset();
    winAddPesonal.show();

    formRecords.down('#updatePerson').disable();
    formRecords.down('#createPerson').enable();
    formRecords.down('#deletePerson').disable();

    if (gridRecords.getStore().getCount() == 0) {
        gridRecords.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetEl =  document.getElementById('panel-datos');

    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecords.body.stopAnimation();
            formRecords.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];            
            
            setActiveRecord(selectedRecord || null);

            // Carga los registro en el form            
            formRecords.getForm().loadRecord(selectedRecord);

            formRecords.down('#updatePerson').enable();
            formRecords.down('#createPerson').disable();
            formRecords.down('#deletePerson').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecord(record){
    formRecords.activeRecord = record;
    if (record) {
        formRecords.down('#updatePerson').enable();
        formRecords.getForm().loadRecord(record);
    } else {
        formRecords.down('#updatePerson').disable();
        formRecords.getForm().reset();
    }
}

function onUpdatePerson(){
    var active = formRecords.activeRecord,
    form = formRecords.getForm();
                    
    if (!active) {
        return;
    }
    if (form.isValid()) {                        
        form.updateRecord(active);
        onResetPerson();
    }
}

function onCreatePerson(){
    var form = formRecords.getForm();    

    if (form.isValid()) {        
        formRecords.fireEvent('create', formRecords, form.getValues());
    }
}

function onResetPerson(){
    setActiveRecord(null);
    formRecords.down('#deletePerson').disable();
    formRecords.down('#createPerson').enable();
    formRecords.getForm().reset();
}

function clearWinPerson(){
    formRecords.down('#deletePerson').disable();
    formRecords.down('#createPerson').enable();
    winAddPesonal.hide();
}

function onDeleteClick(){
    var selection = gridRecords.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecords.store.remove(selection);
        formRecords.down('#deletePerson').disable();
        formRecords.down('#createPerson').enable();
    }
}
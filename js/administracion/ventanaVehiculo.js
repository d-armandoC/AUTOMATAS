var winAddVeh;
var contenedorVeh;
var formRecordsVeh;
var gridRecordsVeh;
var formImage;

var labelTecnico = Ext.create('Ext.form.Label', {
    text : '',
    style: {
        color : 'gray'
    }
});

var labelRegistro = Ext.create('Ext.form.Label', {
    text : '',
    style: {
        color : 'gray'
    }
});

Ext.onReady(function(){

    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectVeh', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping : 'idVeh'},
            {name: 'placa'},
            {name: 'idEquipo'},
            {name: 'idEmpresa'},
            {name: 'vehiculo'},
            {name: 'cbxPropietario', type: 'int'},
            {name: 'regMunicipal'},
            {name: 'year', type : 'int'},
            {name: 'marca'},
            {name: 'modelo'},
            {name: 'numMotor'},
            {name: 'numChasis'},
            {name: 'labelImage'},
            {name: 'empresa'},
            {name: 'persona'},
            {name: 'chip'},
            {name: 'celular'},
            {name: 'imei'},
            {name: 'cbxOperadora', type: 'int'},
            {name: 'cbxTecnico', type: 'string'},
            {name: 'siteInst'},
            {name: 'cbxTaximetro'},
            {name: 'idTaximetro'},
            {name: 'dateInst'},
            {name: 'dateTimeRegistro'},
            {name: 'cbxInterfaz', type: 'int'},
            {name: 'cbxTipoEquipo', type: 'int'},
            {name: 'obser'}
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
    var gridStoreVehiculo = Ext.create('Ext.data.Store', {
        autoSync : true,
        model  : 'DataObjectVeh',
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/administracion/vehiculo/read.php',
                create: 'php/administracion/vehiculo/create.php',
                update: 'php/administracion/vehiculo/update.php',
                destroy: 'php/administracion/vehiculo/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'veh',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'veh'
            },
            listeners: {
                exception: function(proxy, response, operation){
                    if (operation.action === 'create') {
                        if (operation.success) {   
                            Ext.example.msg("Mensaje", "Se ejecuto el evento");
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
                    //gridStoreVehiculo.reload();                    
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action === 'destroy') {                    
                    setActiveRecordVeh(null);
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                        storeTreeVehTaxis.reload();
                        labelTecnico.setText('');
                        labelRegistro.setText('');
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    } 
                }

                if (operation.action === 'update' || operation.action === 'create') {
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                        formRecordsVeh.down('#updateVeh').disable();
                        formRecordsVeh.getForm().reset();
                        storeTreeVehTaxis.reload();
                        gridStoreVehiculo.reload();
                        labelTecnico.setText('');
                        labelRegistro.setText('');
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

    // Column Model shortcut array
    var columns = [
        {header: "Equipo", width: 80, sortable: true, dataIndex: 'idEquipo', filter: {type: 'string'}},
        {header: "Reg. Municipal", width: 100, sortable: true, dataIndex: 'regMunicipal', filter: {type: 'string'}},
        {header: "Empresa", width: 100, sortable: true, dataIndex: 'empresa', renderer : formatCompany, filter: {type: 'list', store: storeEmpresasList}},
        {header: "Vehiculo", width: 100, sortable: true, dataIndex: 'vehiculo', filter: {type: 'string'}},
        {header: "Placa", width: 80, sortable: true, dataIndex: 'placa', filter: {type: 'string'}},
        {header: "Propietario", width: 200, sortable: true, dataIndex: 'persona', filter: {type: 'string'}},
        {header: "Marca de Vehiculo", width: 100, sortable: true, dataIndex: 'marca', filter: {type: 'list', store: storeMarVehList}},
        {header: "Año", width: 50, sortable: true, dataIndex: 'year', filterable: true},
        {header: "N. Motor", width: 120, sortable: true, dataIndex: 'numMotor', filter: {type: 'string'}},
        {header: "N. Chasis", width: 150, sortable: true, dataIndex: 'numChasis', filter: {type: 'string'}}
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
        store : gridStoreVehiculo,
        columns : columns,
        enableDragDrop : true,
        stripeRows : true,
        height : 400,
        selModel : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
        features: [filters],
        //Para cuando de click a una de las filas se pasen los datos
        listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                console.log(selected[0]);
                setActiveRecordVeh(selected[0] || null);
            },

            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
                console.log('mouse sobre item');
            }
        }
    });

    formImage = Ext.create('Ext.form.Panel', {
        baseCls : 'x-plain',
        items : [{
            xtype : 'filefield',
            labelWidth : 80,
            name: 'image',
            emptyText: "Máximo 2MB",
            fieldLabel: "<b>Foto</b>",
            //buttonText: '<img src="img/icon_upload.png"></img>',
            buttonConfig : {
                iconCls: 'icon-upload',
                text : '',
                tooltip : 'Escoger Imagen'
            },
            width : 220,
            listeners : {
                change : function( thisObj, value, eOpts ) {
                    formImage = this.up('form');
                    var form = formImage.getForm();
                    
                    form.submit({
                        url: 'php/uploads/uploadVehiculo.php',
                        success: function(form, action) {
                            formImage.down('[name=labelImage]').setSrc('img/uploads/vehiculos/'+action.result['img']);
                            thisObj.setRawValue(action.result['img']);
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Error', 'No se pudo subir la imagen');
                        }
                    });
                }
            }
        }, {
            xtype : 'image',
            name : 'labelImage',
            src: 'img/uploads/vehiculos/sin_img.jpg',
            height : 100,
            border : 2,
            margin : '0 0 0 10',
            style: {
                borderColor: '#157fcc',
                borderStyle: 'solid'
            }
        }]
    });

    var formPanelGrid = Ext.create('Ext.form.Panel',{
        width : '45%',        
        margins : '0 2 0 0',
        region : 'west',
        autoScroll : true,
        title : '<b>Registros de Vehiculos</b>',
        items : [gridRecordsVeh]
    });

    formRecordsVeh = Ext.create('Ext.form.Panel', {
        id : 'panel-datos-veh',
        autoScroll : true,
        region : 'center',
        title : '<b>Ingresar Datos del Vehiculo</b>',
        activeRecord: null,
        bodyStyle : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        margins    : '0 0 0 3',
        items: [{
            xtype:'fieldset',
            title: '<b>Datos de Vehiculo</b>',
            collapsible: true,
            layout: 'hbox',
            padding : '5 5 10 5',
            defaults : {
                padding : '0 15 0 0',
                baseCls: 'x-plain',
                layout : 'vbox',
                defaultType: 'textfield',
                defaults : {
                    labelWidth : 80
                }
            },
            items : [{
                items : [{
                    fieldLabel: '<b>Placa</b>',
                    afterLabelTextTpl: required,
                    name: 'placa',                
                    allowBlank : false,
                    vtype : 'placaValida',
                    emptyText : 'LBA1701',
                },{
                    xtype : 'combobox',
                    fieldLabel: '<b>Empresa</b>',
                    afterLabelTextTpl: required,
                    name: 'idEmpresa',
                    store : storeEmpresas,
                    valueField : 'id',
                    displayField : 'text',
                    queryMode : 'local',
                    editable : false,
                    allowBlank : false,
                    emptyText : 'Escoger Empresa...',
                    listConfig: {
                        minWidth : 160
                    }
                },{
                    xtype : 'combobox',
                    fieldLabel: '<b>Propietario</b>',
                    afterLabelTextTpl: required,
                    name: 'cbxPropietario',
                    store : storePersonas,
                    valueField : 'id',
                    displayField : 'text',                
                    queryMode : 'local',                
                    allowBlank : false,
                    emptyText : 'Escoger Persona...',
                    listConfig: {
                        minWidth : 300
                    }/*,
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                            '<tpl if="idEmpleo == 3">',
                                '<div class="x-boundlist-item">{text}</div>',
                            '</tpl>',
                        '</tpl>'
                    )*/
                },{
                    fieldLabel: '<b>Marca</b>',
                    name: 'marca',
                    emptyText : 'Marca del Vehiculo...',
                    maxLength : 45
                },{
                    fieldLabel: '<b>Modelo</b>',
                    name: 'modelo',
                    emptyText : 'Modelo del Vehiculo...',
                    maxLength : 45
                },{
                    fieldLabel: '<b>Num. Motor</b>',
                    name: 'numMotor',                
                    emptyText : 'Numero de Motor...'
                },{
                    fieldLabel: '<b>Num. Chasis</b>',
                    name: 'numChasis',                
                    emptyText : 'Numero de Chasis...'
                }, {
                    xtype : 'panel',
                    margin : '30 0 0 0',
                    border : false,
                    layout: 'vbox',
                    bodyStyle: {
                        background: '#ffc'
                    },
                    items: [labelTecnico, labelRegistro]
                }]
            }, {
                items : [{
                    fieldLabel: '<b>Equipo</b>',
                    afterLabelTextTpl: required,
                    name: 'idEquipo',                
                    allowBlank : false,
                    emptyText : 'KRC001'
                },{
                    fieldLabel: '<b>Vehiculo</b>',
                    afterLabelTextTpl: required,
                    name: 'vehiculo',
                    allowBlank : false,
                    emptyText : 'Ingresar Vehiculo...',
                    minLength : 1,
                    maxLength : 45
                },{
                    fieldLabel: '<b>Reg. Municipal</b>',
                    afterLabelTextTpl: required,
                    name: 'regMunicipal',
                    allowBlank: false,
                    emptyText: 'Registro Municipal...',
                    minLength : 4,
                    maxLength : 4
                },{
                    xtype: 'numberfield',
                    fieldLabel: '<b>Año</b>',
                    name: 'year',
                    emptyText : 'Año del Vehiculo...',                
                    minValue: 1950,
                    maxValue: Ext.Date.format(new Date(), 'Y')
                }, formImage]
            }]
        },{
            xtype:'fieldset',
            title: '<b>Registro de Instalación</b>',
            collapsible: true,
            layout: 'vbox',
            items : [{
                layout : 'hbox',
                baseCls: 'x-plain',
                //padding : '5 5 10 5',
                defaults : {
                    padding : '0 9 0 0',
                    baseCls: 'x-plain',
                    layout : 'vbox',
                    defaultType: 'textfield',
                    defaults : {
                        labelWidth : 80
                    }
                },
                items :[{
                    items : [{
                        fieldLabel: '<b># Chip</b>',
                        afterLabelTextTpl: required,
                        name: 'chip',
                        allowBlank: false 
                    },{
                        fieldLabel: '<b>IMEI</b>',
                        afterLabelTextTpl: required,
                        name: 'imei',
                        allowBlank: false
                    },{
                        xtype : 'combobox',
                        fieldLabel : '<b>Taximetro</b>',
                        afterLabelTextTpl: required,
                        name : 'cbxTaximetro',
                        triggerAction: 'all',
                        store: [
                        ['Y','Si'],
                        ['N','No']
                        ],
                        emptyText : 'Escoger Opcion...',
                        allowBlank : false,
                        listeners : {
                            select: function ( combo, records, eOpts ) {
                                if (records[0].data.field1 === 'Y') {
                                    formRecordsVeh.down('[name=idTaximetro]').enable();
                                } else {
                                    formRecordsVeh.down('[name=idTaximetro]').disable();
                                    formRecordsVeh.down('[name=idTaximetro]').setValue('');
                                }
                            }
                        }
                    },{
                        fieldLabel: '<b>Id Taxim</b>',
                        afterLabelTextTpl: required,
                        disabled: true,
                        allowBlank : false,
                        name: 'idTaximetro'
                    },{
                        xtype : 'combobox',
                        fieldLabel : '<b>Interfaz</b>',
                        afterLabelTextTpl: required,
                        name : 'cbxInterfaz',
                        triggerAction: 'all',
                        store: [
                        [1,'Garmin'],
                        [2,'Celular'],
                        [3,'Botonera'],
                        [4,'Ninguna']
                        ],
                        emptyText : 'Escoger Opcion...',
                        allowBlank : false
                    }]
                },{
                    items : [{
                        fieldLabel: '<b># Cel</b>',
                        afterLabelTextTpl: required,
                        name: 'celular',
                        allowBlank: false  
                    },{
                        xtype : 'combobox',
                        fieldLabel : '<b>Operadora</b>',
                        afterLabelTextTpl: required,
                        name : 'cbxOperadora',
                        triggerAction: 'all',
                        store: [
                        [1,'Claro'],
                        [2,'Movistar'],
                        [3,'Fijo/Convencional']
                        ],
                        emptyText : 'Escoger Opcion...',
                        allowBlank : false 
                    },{
                        fieldLabel: '<b>Lug. Inst</b>',
                        afterLabelTextTpl: required,
                        name: 'siteInst',
                        allowBlank: false        
                    }, {
                        xtype : 'datefield',
                        afterLabelTextTpl: required,
                        fieldLabel: '<b>Fecha Inst.</b>',
                        name: 'dateInst',
                        allowBlank: false,
                        format : 'Y-m-d',
                        value: new Date(),
                        maxValue: new Date()
                    },{
                        xtype : 'combobox',
                        fieldLabel : '<b>Tipo de Equipo</b>',
                        afterLabelTextTpl: required,
                        name : 'cbxTipoEquipo',
                        triggerAction: 'all',
                        store: [
                        [1,'SKP'],
                        [2,'SKP+'],
                        [3,'Fastrack'],
                        [4,'Ninguno']
                        ],
                        emptyText : 'Escoger Opcion...',
                        allowBlank : false
                    }]
                }]
            },{
                xtype : 'textarea',
                labelWidth: 80,
                width : '100%',
                //grow : true,
                name : 'obser',
                fieldLabel: '<b>Observación</b>'
            }]
        }],
        listeners: {
            create: function(form, data){                
                gridStoreVehiculo.insert(0, data);
                gridStoreVehiculo.reload();
            }
        },
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [
                { iconCls : 'icon-personal', scope : this, tooltip : 'Ingresar Nueva Persona', handler : ventAddPersonal },
                '->', 
                { iconCls: 'icon-update', itemId: 'updateVeh', text: '<b>Actualizar</b>', scope: this, tooltip : 'Actualizar Datos', handler: onUpdateVeh },
                { iconCls : 'icon-car', itemId: 'createVeh', text: '<b>Crear</b>', scope: this, tooltip : 'Crear Vehiculo', handler: onCreateVeh },
                { iconCls: 'icon-delete', text: '<b>Eliminar</b>', itemId: 'deleteVeh', scope: this, tooltip : 'Eliminar Vehiculo', handler: onDeleteClickVeh },
                { iconCls: 'icon-reset', text: '<b>Limpiar</b>', scope: this, tooltip : 'Limpiar Campos', handler: onResetVeh },
                { iconCls: 'icon-cancelar', text: '<b>Cancelar</b>', tooltip : 'Cancelar', scope: this, handler: clearWinVeh }
            ]
        }]
    });

    contenedorVeh = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 8,
        items: [
            formPanelGrid,
            formRecordsVeh
        ]
    });    
});

function ventAddVehiculo(){
	if(!winAddVeh){
        winAddVeh = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : '<b>Vehiculos</b>',
            iconCls : 'icon-car',
            resizable : false,
            width : 1100,
            height : 510,
            closeAction : 'hide',
            plain : false,
            items : [contenedorVeh]
        });
    }
    contenedorVeh.getForm().reset();
    winAddVeh.show();
    labelTecnico.setText('');
    labelRegistro.setText('');

    formRecordsVeh.down('#updateVeh').disable();
    formRecordsVeh.down('#createVeh').enable();
    formRecordsVeh.down('#deleteVeh').disable();

    if (gridRecordsVeh.getStore().getCount() === 0) {
        gridRecordsVeh.getStore().load();
    }

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElVeh =  document.getElementById('panel-datos-veh');

    var formPanelDropTargetVeh = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElVeh, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsVeh.body.stopAnimation();
            formRecordsVeh.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            
            setActiveRecordVeh(selectedRecord || null);

            // Carga los registro en el form            
            formRecordsVeh.getForm().loadRecord(selectedRecord);
            formImage.down('[name=labelImage]').setSrc('img/uploads/vehiculos/'+selectedRecord.data.labelImage);
            formImage.down('[name=image]').setRawValue(selectedRecord.data.labelImage);
            labelTecnico.setText(selectedRecord.data.cbxTecnico);
            labelRegistro.setText(selectedRecord.data.dateTimeRegistro);
            

            formRecordsVeh.down('#updateVeh').enable();
            formRecordsVeh.down('#createVeh').disable();
            formRecordsVeh.down('#deleteVeh').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecordVeh(record){
    formRecordsVeh.activeRecord = record;
    if (record) {
        formRecordsVeh.down('#updateVeh').enable();
        formRecordsVeh.getForm().loadRecord(record);
    } else {
        formRecordsVeh.down('#updateVeh').disable();
        formRecordsVeh.getForm().reset();
    }
}

function onUpdateVeh(){
    var active = formRecordsVeh.activeRecord,
    form = formRecordsVeh.getForm();
    active.set({
        labelImage: formImage.down('[name=image]').getRawValue()
    });
    /*form.setValues({
        labelImage: 'nada.jpg'
    });*/
                    
    if (!active) {
        return;
    }
    if (form.isValid()) {                        
        form.updateRecord(active);        
        onResetVeh();
    }
}

function onCreateVeh(){
    var form = formRecordsVeh.getForm();    

    if (form.isValid()) {    
        formRecordsVeh.fireEvent('create', formRecordsVeh, form.getValues());
    }
}

function onResetVeh(){
    setActiveRecordVeh(null);
    formRecordsVeh.down('#deleteVeh').disable();
    formRecordsVeh.down('#createVeh').enable();
    formRecordsVeh.getForm().reset();
}

function clearWinVeh(){
    formRecordsVeh.down('#deleteVeh').disable();
    formRecordsVeh.down('#createVeh').enable();
    winAddVeh.hide();
}

function onDeleteClickVeh(){
    var selection = gridRecordsVeh.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsVeh.store.remove(selection);
        formRecordsVeh.down('#deleteVeh').disable();
        formRecordsVeh.down('#createVeh').enable();
    }
}
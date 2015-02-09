
Ext.Loader.setConfig({
    enabled: true
});
var refresh = false;
var timeRefresh = 15;
var bandera = false;
var winReporte;

Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);
var formPersona;
;
Ext.Loader.setConfig({
    enabled: true
});
var panlEste;
var tabPanelReports;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    applicateVTypes();
    Ext.tip.QuickTipManager.init();
    gridFormulario = Ext.create('Ext.form.Panel', {
        id: 'panel-datos',
        region: 'center',
        title: '<b>Ingresar datos de la persona</b>',
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
                        blankText: 'Este campo es obligatorio',
                        name: 'cedula',
                        vtype: 'cedulaValida',
                        allowBlank: false,
                        emptyText: '0123456789 (10 digitos)',
                    }, {
                        fieldLabel: '<b>Nombres</b>',
                        blankText: 'Este campo es obligatorio',
                        name: 'nombres',
                        vtype: 'nombresApe',
                        allowBlank: false,
                        emptyText: 'Ingresar Nombres...',
                    }, {
                        fieldLabel: '<b>Apellidos</b>',
                        blankText: 'Este campo es obligatorio',
                        name: 'apellidos',
                        vtype: 'nombresApe',
                        allowBlank: false,
                        emptyText: 'Ingresar Apellidos...',
                    }, {
                        fieldLabel: '<b>Email</b>',
                        name: 'email',
                        blankText: 'Este campo es obligatorio',
                        vtype: 'emailNuevo',
                        emptyText: 'user@gmai.com'
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Datos Informativos</b>',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        xtype: 'datefield',
                        fieldLabel: '<b>Fecha de Nacimiento</b>',
                        blankText: 'Este campo es obligatorio',
//                        editable: false,
                        value: edadDate,
                        maxValue: edadDate,
                        name: 'fechaNacimiento',
                        format: 'Y-m-d',
                        emptyText: 'Ingresar Fecha...',
                    }, {
                        fieldLabel: '<b>Dirección</b>',
                        name: 'direccion',
                        vtype: 'direccion',
                        emptyText: 'Ingresar Direccion...'
                    }, {
                        fieldLabel: '<b>Celular</b>',
                        name: 'celular',
                        vtype: 'numeroTelefono',
                        emptyText: 'Celular (09) Convencional (07)'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '<b>Placa</b>',
                        fieldStyle: 'text-transform: uppercase',
                        blankText: 'Este campo es Obligatorio',
                        vtype: 'placaValida',
                        name: 'placa',
                        id: 'placa_id',
                        allowBlank: false,
                        emptyText: 'LBA1791'
                    }
                ]
            }],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-update', itemId: 'updatePerson', text: 'Actualizar', scope: this, tooltip: 'Actualizar Datos'},
                    {iconCls: 'icon-user-add', itemId: 'createPerson', text: 'Crear', scope: this, tooltip: 'Crear Persona', handler: function () {
                            var form = gridFormulario.getForm();
                            if (form.isValid()) {
                                gridFormulario.down('#update').enable();
                                form.reset();
                            } else {
                                Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

                            }
                        }},
                    {iconCls: 'icon-cleans', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this},
                    {iconCls: 'icon-cancelar', tooltip: 'Cancelar', scope: this, handler: function () {
                            winAddPesonal.hide();
                        }}
                ]
            }]
    });

    var panelCentral = Ext.create('Ext.tab.Panel', {
        region: 'center',
        deferreRender: false,
        activeTab: 0,
        items: [gridFormulario],
    });
    panlEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        iconCls: 'icon-config',
        name: 'panelEste',
        width: '31%',
        frame: true,
        split: true,
        collapsible: true,
        layout: 'border',
        items: [
            {
                xtype: 'form',
                region: 'north',
                height: '100%',
                width: '100%',
                autoScroll: true,
                bodyPadding: 5,
                title: 'Información',
                iconCls: 'icon-obtener',
                items: [
                    Ext.create('Ext.form.Panel', {
                        region: 'north',
                        deferreRender: false,
                        activeTab: 0,
                        items: [{
                                layout: 'hbox',
                                bodyStyle: {
                                    backgroundImage: 'url(img/unl/logo.JPG)',
                                    backgroundSize: '100% 100%'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        padding: '15 8 8 500',
                                        style: {
                                            color: '#157fcc'
                                        },
                                        html: '<section id="panelNorte">' +
                                                '<center><strong id="titulo">Sistema de Rastreo Vehicular</strong></center>' +
                                                '<strong id="subtitulo">Bienvenid@ al Sistema: ' + 'Diego Cale' + '</strong>' +
                                                '</section>'
                                    }]
                            },
                        ]
                    }),
                    {
                        xtype: 'panel',
                        margin: '5 5 5 5',
                        border: false,
                        layout: 'vbox',
                        bodyStyle: {
                            background: '#ffc',
                            backgroundSize: '100% 100%'
                        },
                        items: [
                            {
                                html: '<TABLE id="tablestados">' +
                                        '<TR class="alt"> ' +
                                        '   <TD> <IMG SRC="img/user.gif"></td>' +
                                        '   <TD align="CENTER ">' + 'Diego Cale</TD> ' +
                                        '</TR> ' +
                                        '<TR class="alt"> ' +
                                        '   <TD> <IMG SRC="img/user.gif"></td>' +
                                        '   <TD align="CENTER ">' + 'Verónica Chimbo</TD> ' +
                                        '</TR> ' +
                                        '<TR class="alt"> ' +
                                        '   <TD> <IMG SRC="img/user.gif"></td>' +
                                        '   <TD align="CENTER ">' + 'Jinsop Campos</TD> ' +
                                        ' </TABLE>'
                            }
                        ]
                    },
                    Ext.create('Ext.form.Panel', {
                        //contenedoresg
                        id: 'contenedoresg',
                        name: 'contenedoresg',
                        items: [
                            {
                                id: 'contenido2',
                                html: "<div style=' margin:auto ;padding:1em '>"
                                        + "<table>"
                                        + "<tr><TD align='CENTER '>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b>EXPRESIONES REGULARES</b>' + "</td></tr><tr></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control del Formato la Cedula' + "</td></tr>"
                                        + "<tr><TD >&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b>/^[0-9]{10}$/</b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control del Tamaño de los Campos' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b> /^[-0-9.A-Z.a-z./áéíóúñÑ%_?¿!\s*]{3,45}$/ </b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control de Correo' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b>  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/ </b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control de la Fecha' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b> /^\d{2}\/\d{2}\/\d{4}$/ </b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control de la Dirección ' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b> /^[-0-9.A-Z.a-z.áéíóúñ()\s*]{2,150}$/ </b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control de Celular y Convencional ' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b> /^[0]{1}[9]{1}[0-9]{8}$/  </b>' + "</td></tr>"
                                        + "<tr><td>&nbsp</td><td><b>" + '<td> </td>' + '<td>' + 'Control de Placa Vehicular ' + "</td></tr>"
                                        + "<tr><TD>&nbsp</td><td>" + '<td> </td>' + '<td>' + '<b>  /^[0-9]{1,45}$/ </b>' + "</td></tr>"
                                        + "</table>"
                                        + "<br/>"
                                        + "</div>"
                            }
                        ]
                    })
//                 
                ]
            }
        ]
    });
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            Ext.create('Ext.form.Panel', {
                region: 'north',
                deferreRender: false,
                activeTab: 0,
                items: [{
                        layout: 'hbox',
                        bodyStyle: {
                             background: '#125066',
                            backgroundSize: '100% 100%'
                        },
                        items: [
                            {
                                xtype: 'label',
                                padding: '15 8 8 330',
                                style: {
                                    color: '#157fcc'
                                },
                                html: '<section id="panelNorte">' +
                                        '<center><strong id="titulo">Validación de Campos de Formularios Mediante Expresiones Regulares</strong></center>' +
                                        '</section>'
                            }]
                    },
                ]
            }), panlEste, panelCentral]
    });
});
























Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.Action',
    'Ext.tab.*',
    'Ext.button.*',
    'Ext.form.*',
    'Ext.layout.container.Card',
    'Ext.layout.container.Border',
    'Ext.ux.PreviewPlugin',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'Ext.ux.CheckColumn',
    'Ext.ux.Spotlight'
]);
var idEstacion;
var panelTabMapaAdmin;

var drawControls;
var required = '<span style="color:red;font-weight:bold" data-qtip="Requerido">*</span>';

var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
var f = new Date();
var label = Ext.create('Ext.form.Label', {
    text: 'hola',
    id: 'tiempo',
    style: {
        color: 'gray'
    }
});

var filters = {
    ftype: 'filters',
    encode: false, // json encode the filter query
    local: true, // defaults to false (remote filtering)
    filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
};

var idEqpMen;

var spot = Ext.create('Ext.ux.Spotlight', {
    easing: 'easeOut',
    duration: 500
});

Ext.onReady(function () {
    var idEqpMen, nameVeh;
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        },
        daterangeText: 'Fecha de inicio debe ser menor que la fecha de finalización',
        placaValida: function (val, field) {
            var partes = val.split("");
            if (partes.length === 7) {
                if (!/^[F]{1}[A]{1}[C]{1}[T]{1}[U]{1}[R]{1}[A]{1}$/.test(val.toUpperCase())) {
                    if (!/^[A-Z]{3}[0-9]{4}$/.test(val.toUpperCase())) {
                        bandera = false;
                    } else {
                        bandera = true;
                    }
                } else {
                    bandera = true;
                }

            } else {
                if (!/^[A-Z]{3}[0-9]{3}$/.test(val.toUpperCase())) {
                    bandera = false;
                } else {
                    bandera = true;
                }

            }
            return bandera;
        },
        placaValidaText: 'Ingrese un numero de placa valido <br>\n\
                           Ej:(LAB3532) 3 letras 4 numeros',
        digitos: function (val, field) {
            if (!/^[0-9]{1,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        digitosnombresApeText: 'Solo carateres numéricos',
        nombresApe: function (val, field) {
            if (!/^[.A-Z.a-z.áéíóúñ()\s*]{1,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        nombresApeText: 'No se permite caracteres númericos.',
        password: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Las Contraseñas no coinciden',
        usuarios: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        usuariosText: 'los usuarios no coinciden',
        cedulaValida: function (val, field) {
            if (val.length !== 10) {
                return false;
            }
            if (val.length === 10) {
                if (check_cedula(val)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        cedulaValidaText: 'Numero de Cedula Invalida',
        numeroTelefono: function (val, field) {
            var partes = val.split("");
            if (partes.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!/^[0]{1}[7]{1}[0-9]{7}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        numeroTelefonoText: 'Ingresar solo caracteres numéricos válidos <br>que empiezen con [09] movil tamaño de (10)dígitos<br> 0 [07] convencional tamaño de (9)dígitos ',
        emailNuevo: function (val, field) {
            if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return false;
            }
            return true;
        },
        emailNuevoText: 'Debe ingresar segun el formato kradac@kradac.com <br>sin caracteres especiales',
        campos: function (val, field) {
            if (!/^[-0-9.A-Z.a-z./áéíóúñÑ\s*]{2,45}$/.test(val)) {
                return false;

            }

            return true;
            Ext.Msg.alert('Error', 'Solo carateres alfa numéricos');
        },
        camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 45 carateres',
        usuario: function (val, field) {
            if (!/^[0-9.A-Z.a-z.áéíóúñÑ\s]{2,45}$/.test(val)) {
                return false;

            }

            return true;
            Ext.Msg.alert('Error', 'Solo carateres alfa numéricos');
        },
        usuarioText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 45 carateres',
        numeroChip: function (val, field) {
            if (!/^[-.0-9]{4,45}$/.test(val)) {
                return false;

            }
            return true;
            Ext.Msg.alert('Error', 'Solo carateres numéricos');
        },
        numeroChipText: 'Solo carateres numéricos<br> Tamaño min de 4 y un máx de 40 carateres',
//para direccion
        direccion: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ()\s*]{2,150}$/.test(val)) {
                return false;
            }
            return true;
        },
        direccionText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 150 carateres',
//Metodo utilizado para controlar caracteres alfanuericos y el tamano del campo "Reg. Municipal"
//del archivo administracion de buses (vehicle.js)
        camposVehicleMax10: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposVehicleMax10Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 10 carateres',
//Metodo utilizado para controlar caracteres alfanuericos y el tamano de los campos
//del archivo administracion de buses (vehicle.js) que requieren un tamano de entre 2 y 45 caracteres
        camposVehicleMax45: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposVehicleMax45Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 45 carateres',
        camposAcronimo: function (val, field) {
            if (!/^[A-Z.a-z]{1}[-0-9.A-Z.a-z.áéíóúñ\s*]{3}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposAcronimoText: 'El primer caracter deberá ser una LETRA <br> Solo caracteres alfanumericas <br>  el tamaño deberá ser de 4 caracteres',
        camposEmpresa: function (val, field) {
            if (!/^[A-Z.a-z]{1}[-0-9.A-Z.a-z.áéíóúñ\s*]{3,30}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposEmpresaText: 'El primer caracter deberá ser una LETRA <br> Solo caracteres alfanumericas <br> tamaño minimo de 4 caracteres ',
        campos1: function (val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,80}$/.test(val)) {
                return false;
            }
            return true;
        },
        campos1Text: 'Solo carateres alfa numéricos<br> Tamaño min de 1 y un máx de 80 carateres',
        camposMin: function (val, field) {
            if (!/^[0-9A-Za-zñ\s*]{2,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposMinText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 10 carateres',
//solo mayus
        mayus: function (val, field) {
            if (!/^[0-9A-Z]{1,5}$/.test(val)) {
                return false;
            }
            return true;
        },
        mayusText: 'Solo carateres Mayusculas',
//Para datos combos vehiculos y personas
        alphanum0: function (val, field) {
            if (!/^[0-9A-Za-záéíóúñ\s*]{3,80}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum0Text: 'Solo carateres alfa numéricos',
        alphanum1: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ\s*]{3,30}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum1Text: 'Solo carateres alfa numéricos',
//para puntos
        puntos: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ/\s*]{2,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        puntosText: 'Solo datos numéricos,mínimo 2 y máximo de 4 numeros',
///para rutas
        alphanum2: function (val, field) {
            if (!/^[0-9\s.A-Z.\sa-záéíóúñ.()-:\s*]{3,100}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum2Text: 'Solo carateres alfa numéricos',
//para geocercas
        geo: function (val, field) {
            if (!/^[0-9]{2,4}$/.test(val)) {
                return false;
            }
            return true;
        },
        geoText: 'Solo carateres numéricos mínimo 2 y máximo 4 numeros',
        num1: function (val, field) {
            if (!/^[0-9]{3,4}$/.test(val)) {
                return false;
            }
            return true;
        },
        num1Texto: 'Solo carateres numéricos',
//para numeros 3-45
        num2: function (val, field) {
            if (!/^[0-9]{3,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        num2Text: 'Solo carateres numéricos mínimo 3 y un máximo de 45',
        camposRegMun: function (val, field) {
            if (!/^[-0-9A-Za-z]{3,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposRegMunText: 'Solo carateres alfa numéricos,y guiones <br> Tamaño min de 5 y un máx de 10 carateres'

    });
////////////
    Ext.tip.QuickTipManager.init();

    menuCoop = Ext.create('Ext.menu.Menu', {
        items: [],
        listeners: {
            click: function (menu, item, e, eOpts) {
                for (var i = 0; i < showCoopMap.length; i++) {
                    if (showCoopMap[i][0] === item.getItemId()) {
                        showCoopMap[i][2] = item.checked;

                        if (!item.checked) {
                            var form = Ext.create('Ext.form.Panel');
                            form.getForm().submit({
                                url: 'php/interface/monitoring/ultimosGPS.php',
                                params: {
                                    listCoop: showCoopMap[i][0]
                                },
                                failure: function (form, action) {
                                    Ext.example.msg('Mensaje', action.result.message);
                                },
                                success: function (form, action) {
                                    if (connectionMap()) {
                                        clearVehicles(action.result.dataGps);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    });


    var administracion = Ext.create('Ext.button.Button', {
        width: 150,
        height: 40,
        padding: '0 0 0 0',
        style: {
            borderStyle: 'none',
            backgroundImage: 'url(img/stv-05.png)',
            backgroundSize: '100% 100%',
        },
        tooltip: 'Administración de Usuarios, Equipos y Vehiculos',
        scope: this,
        menu: [
            {text: 'Organización', iconCls: 'icon-central', handler: function () {
                    showWinAdminOrganizacion();
                }},
            {text: 'Equipos',
                iconCls: 'icon-servicios',
                menu: [
                    {text: 'Adm. Equipos', iconCls: 'icon-credits', handler: function () {
                            showWinAdminDevice();
                        }},
                    {text: 'Enviar CMD', iconCls: 'icon-cmd', handler: function () {
                            ventComands();
                        }},
                    '-',
                    {text: 'Envio Correo', iconCls: 'icon-email', handler: function () {
                            ventanaEnvioMail();
                        }}
                ]
            },
            {text: 'Personal', iconCls: 'icon-personal', handler: function () {
                    ventAddPersonal();

                }},
            {text: 'Usuarios', iconCls: 'icon-user', handler: function () {
                    ventAddUser();
                }},
            {text: 'Vehiculos', iconCls: 'icon-car', handler: function () {
                    ventanaAddVehiculos();
                }},
            {
                text: 'Geocercas',
                iconCls: 'icon-geocerca',
                menu: [
                    {text: 'Administracion', iconCls: 'icon-find-geo', handler: function () {
                            ventanaGeocerca();
                        }},
                    {text: 'Envio Correos', iconCls: 'icon-email', handler: function () {
                            visualizarEnviosGeoCercas();
                        }}
                ]}
        ]
    });

    var herraminetas = Ext.create('Ext.button.Button', {
        scope: this,
        width: 140,
        height: 40,
//        padding: '0 0 0 5',
        x:5,
        y:30,
        style: {
            borderStyle: 'none',
            backgroundImage: 'url(img/stv-03.png)',
            backgroundSize: '100% 100%',
        },
        tooltip: 'Herramintas de Acceso Rapido',
        menu: [
            {text: 'Modificar usuarios', iconCls: 'icon-personal', handler: function () {
                    ventanaModificarUsuario();
                }},
            {text: 'Cambiar contraseña', iconCls: 'icon-key', handler: function () {
                    ventanaCambiarContrasenia();
                }},
            {text: 'Mantenimientos', iconCls: 'icon-mantenimiento', handler: function () {
                    ventAddMantenimientosPost();
                }},
            {text: 'Vehiculos en Lugares', iconCls: 'icon-vehiculos_lugar', handler: function () {
                    ventanaVehLugares();
                }},
            {text: 'Actualizar email', iconCls: 'icon-email', handler: function () {
                    ventanaActualizarEmail();
                }},
            '-',
            {text: 'Videos',
                iconCls: 'icon-video',
                handler: showVideo
            },
            {text: 'Creditos', iconCls: 'icon-credits', handler: function () {
                    credits();
                    spot.show('panel-credit');
                }}
        ]
    });


    var monitoreo = Ext.create('Ext.button.Button', {
        width: 130,
        height: 40,
        padding: '0 0 0 10',
        style: {
            borderStyle: 'none',
            backgroundImage: 'url(img/stv-04.png)',
            backgroundSize: '100% 100%',
        },
        tooltip: 'Estado Actual de los Vehiculos y Equipos',
        handler: function () {
            window.open('monitorTeam.php');
        }

    });

    var salir = Ext.create('Ext.button.Button', {
        id: 'custom',
               scope: this,
        tooltip: 'Salir del Sistema',
        width: 40,
                height: 40,
                padding: '0 0 0 0',
                style: {
                    borderStyle: 'none',
                    backgroundImage: 'url(img/stv-09.png)',
                    backgroundSize: '100% 100%',
                     backgroundColor: '#FAFAFA',
                },
        handler: function () {
            Ext.MessageBox.confirm('SALIR', 'Desea Salir del Sistema ?', function (choice) {
                if (choice === 'yes') {
                    window.location = 'php/login/logout.php';
                }
            });


        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        padding: '0 0 0 0',
        style: {
            backgroundColor: '#FAFAFA',
        },
        items: [{
                xtype: 'button',
                width: 130,
                height: 40,
                padding: '0 0 0 0',
                style: {
                    borderStyle: 'none',
                    backgroundImage: 'url(img/stv-02.png)',
                    backgroundSize: '100% 100%',
                },
                tooltip: 'Reportes Informativos',
                menu: [{
                        text: 'Reportes',
                        iconCls: 'icon-general',
                        menu: [
                            {text: 'Recorridos General', iconCls: 'icon-all-flags', handler: function () {
                                    recorridosGeneral();
                                }},
                            {text: 'Registros de Panico', iconCls: 'icon-reset', handler: function () {
                                    showWinPanicosDaily();
                                }},
                            {text: 'Excesos de Velocidad', iconCls: 'icon-exceso-vel', handler: function () {
                                    ventanaexcesosvelociadadWin();
                                }},
                            {text: 'Mantenimiento Detallado', iconCls: 'icon-servicios', handler: function () {
                                    showWinMantenimientoGeneral();
                                }},
                            {text: 'Perdida de GPS y GSM', iconCls: 'icon-flota', handler: function () {
                                    reporteWinperdidaGpsGsm();
                                }},
                            {text: 'Reporte de Paradas', iconCls: 'icon-unlock', handler: function () {
                                    showWinPradas();
                                }},
                            {text: 'Reporte de Geocercas', iconCls: 'icon-report-geo', handler: function () {
                                    ventanaReporteGeocerca();
                                }},
                            {text: 'CMD Enviados', iconCls: 'icon-cmd-hist', handler: function () {
                                    ventanaCmdHistorial();
                                }},
                            {text: 'Reporte de Encendido y Apagado', iconCls: 'icon-encendido', handler: function () {
                                    showWinencendidoapagado();
                                }},
                            {text: 'Conexión Desconexión del Equipo', iconCls: 'icon-conexcion', handler: function () {
                                    showWinEnergizar();
                                }},
                            {text: 'Reporte de Eventos', iconCls: 'icon-eventos', handler: function () {
                                    ventanaEventos();
                                }}
                        ]
                    }
                ]
            },
            herraminetas,
            monitoreo,
            administracion
                    , '->',
            {
                xtype: 'button',
                width: 40,
                height: 40,
                padding: '0 0 0 0',
                style: {
                    borderStyle: 'none',
                    backgroundImage: 'url(img/stv-08.png)',
                    backgroundSize: '100% 100%',
                     backgroundColor: '#FAFAFA',
                },
                tooltip: 'Limpiar Mapa',
                handler: function () {
                    clearLienzoPointTravel();
                    clearLienzoTravel();
                    var lonlatCenter = new OpenLayers.LonLat(0, 100000000);
                    map.setCenter(lonlatCenter, 7);
                }},
            salir,
            {
                xtype: 'label',
                html: '<section id="panelNorte">' +
                        '<center><strong id="name"><FONT SIZE=3  COLOR="black">' + (diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()]) + '  ' + '</FONT><iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1"  frameborder="0" width="96"  height="15" allowTransparency="true" ></iframe>' + '</strong></center>' +
                        '</section>'
            },
            {
                xtype: 'image',
                src: getNavigator(),
                width: 16,
                height: 16,
                margin: '0 5 0 0'
            }



        ]
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        deferreRender: false,
        activeTab: 0,
        items: [{
                layout: 'hbox',
                bodyStyle: {
                    backgroundImage: 'url(img/stv-01.png)',
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
                                '<strong id="subtitulo">Bienvenid@ al Sistema: ' + personKarview + '</strong>' +
                                '</section>'
                    }]
            },
            barraMenu]
    });

    var winSearchVeh = Ext.create('Ext.window.Window', {
        layout: 'fit',
        title: 'Buscar Vehiculo',
        iconCls: 'icon-car',
        width: 300,
        height: 150,
        closeAction: 'hide',
        plain: false,
        items: [{
                xtype: 'form',
                frame: true,
                items: [{
                        xtype: 'combobox',
                        fieldLabel: 'Organización',
                        name: 'cbxEmpresas',
                        store: storeEmpresas,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        emptyText: 'Seleccionar Organización...',
                        editable: false,
                        allowBlank: false,
                        listConfig: {
                            minWidth: 160
                        },
                        listeners: {
                            select: function (combo, records, eOpts) {
                                this.up('form').down('[name=cbxVeh]').enable();
                                this.up('form').down('[name=cbxVeh]').clearValue();

                                storeVeh.load({
                                    params: {
                                        cbxEmpresas: records[0].data.id
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Vehículo:',
                        name: 'cbxVeh',
                        store: storeVeh,
                        valueField: 'id',
                        displayField: 'text',
                        queryMode: 'local',
                        emptyText: 'Seleccionar Vehículo...',
                        disabled: true,
                        editable: false,
                        allowBlank: false,
                        listConfig: {
                            minWidth: 450
                        }
                    }],
                buttons: [{
                        text: 'Buscar',
                        iconCls: 'icon-search-veh',
                        handler: function () {
                            if (this.up('form').getForm().isValid()) {
                                var capa = this.up('form').down('[name=cbxEmpresas]').getValue();
                                var idEqpCoop = this.up('form').down('[name=cbxVeh]').getValue();
                                buscarEnMapa(capa, idEqpCoop);
                            } else {
                                Ext.example.msg('Error', 'Escoja un Vehiculo');
                            }
                        }
                    }]
            }]
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        id: 'west_panel',
        title: 'Facetas_Karview',
        iconCls: 'icon-facetas',
        frame: true,
        width: 240,
        split: true,
        collapsible: true,
        layout: 'accordion',
        border: false,
        layoutConfig: {
            animate: false
        },
        items: [{
                
                xtype: 'treepanel',
                id: 'veh-taxis-tree',
                rootVisible: false,
                bodyStyle: {
                     backgroundColor: '#f8fdff',
                },
                title: 'Organización',
                autoScroll: true,
                iconCls: 'icon-tree-company',
                store: storeTreeVehTaxis,
                columns: [
                    {xtype: 'treecolumn', text: 'Central', flex: 4, sortable: true, dataIndex: 'text'},
//                     {text: 'Estado', flex: 1, dataIndex: 'estado', sortable: true, renderer: formatState}
                ],
                tools: [{
                        type: 'help',
                        handler: function () {
                            // show help here
                        }
                    }, {
                        type: 'refresh',
                        itemId: 'refresh_taxis',
                        tooltip: 'Recargar Datos',
                        handler: function () {
                            var tree = Ext.getCmp('veh-taxis-tree');
                            tree.body.mask('Loading', 'x-mask-loading');
                            reloadTree(tree, 'Vehiculos', storeTreeVehTaxis);
                            Ext.example.msg('Vehiculos', 'Recargado');
                            tree.body.unmask();
                        }
                    }, {
                        type: 'search',
                        tooltip: 'Buscar Vehiculo',
                        handler: function (event, target, owner, tool) {
                            // do search                    
                            owner.child('#refresh_taxis').show();
                            winSearchVeh.showAt(event.getXY());
                        }
                    }],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function (thisObject, record, item, index, e, eOpts) {
                        if (connectionMap()) {
                            console.log(record);
                            var aux = record.id.split('_');
                            var idEmpresa = parseInt(aux[0]);
                            var idVehicle = 'last' + aux[1];
                            buscarEnMapa(idEmpresa, idVehicle);
                            panelTabMapaAdmin.setActiveTab(0);
//                            };
                        }
                    }
                }
            }]
    });

    var menuContext = Ext.create('Ext.menu.Menu', {
        items: [
            {id: 'optTaxi1', text: 'Hoy', iconCls: 'icon-today'},
            {id: 'optTaxi2', text: 'Ayer', iconCls: 'icon-yesterday'},
            {id: 'optTaxi3', text: 'Carreras', iconCls: 'icon-taximetro'},
            {id: 'optTaxi4', text: 'Recorrido', iconCls: 'icon-all-flags'}
        ],
        listeners: {
            click: function (menu, item, e, eOpts) {
                var coopEqp = idEqpMen.split('_');
                var coop = coopEqp[0];
                var eqp = coopEqp[1];

                if (item.id === 'optTaxi4') {
                    ventanaBanderasClick(coop, eqp);
                } else if (item.id === 'optTaxi3') {
                    //ventanaRecorridosCarr(idEqpMen);
                } else {
                    //fecha actual
                    var nowDate = new Date();
                    if (item.id === 'optTaxi2') {
                        nowDate.setDate(nowDate.getDate() - 1);
                    } else {
                        nowDate.setMinutes(nowDate.getMinutes() + 10);
                    }

                    var año = nowDate.getFullYear();
                    var mes = nowDate.getMonth() + 1;
                    if (mes < 10) {
                        mes = "0" + mes;
                    }
                    var dia = nowDate.getDate();

                    var fi = formatoFecha(nowDate);
                    var hi = '00:01';
                    var ff = formatoFecha(nowDate);
                    var hf = (item.id === 'optTaxi2') ? '23:59' : nowDate.getHours() + ":" + nowDate.getMinutes();

                    panelEste.getForm().submit({
                        url: 'php/interface/report/getDataFlags.php',
                        waitMsg: 'Extrayendo coordenadas...',
                        params: {
                            nameVeh: nameVeh,
                            cbxVeh: eqp,
                            fechaIni: fi,
                            fechaFin: ff,
                            horaIni: hi,
                            horaFin: hf
                        },
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: action.result.message,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function (form, action) {
                            var resultado = action.result;

                            limpiarCapasHistorico();
                            dibujarTrazadoHistorico(resultado.puntos);
                            lienzosRecorridoHistorico(eqp, resultado.puntos);
                        }
                    });
                }
            }
        }
    });

    var toolBarOnMap = Ext.create('Ext.toolbar.Toolbar', {
        region: 'north',
        padding: '2 2 2 2',
        style: {
            backgroundColor: '#f8fdff',
        },
        items: [
//            {
//                xtype: 'combo',
//                width: '86%',
//                padding: '0 0 0 5',
//                store: storeDirecciones,
//                fieldLabel: '<b>Dirección</b>',
//                displayField: 'todo',
//                typeAhead: false,
//                hideTrigger: true,
//                emptyText: 'Ciudad,Barrio,Avenida Principal,Avenida Secundaria',
//                listConfig: {
//                    loadingText: 'Buscando...',
//                    emptyText: 'No ha encontrado resultados parecidos.',
//                    // Custom rendering template for each item
//                    getInnerTpl: function() {
//                        return '<b>{pais} , {ciudad}:</b><br>{barrio} , {avenidaP} , {avenidaS}';
//                    }
//                },
////                listeners: {
////                    select: function(thisObject, record, eOpts) {
////                        var longitud = record[0].data.longitud;
////                        var latitud = record[0].data.latitud;
////                        var zoom = 18;
////                        localizarDireccion(longitud, latitud, zoom);
////                    }
////                },
//                pageSize: 10
//            },
            '->'
                    , {
                        xtype: 'button',
                        iconCls: 'icon-geoloc',
                        tooltip: 'Ubicar mi Posición',
                        handler: function () {
                            clearLienzoPointTravel();
                            getLocation();
                            panelTabMapaAdmin.setActiveTab(0);
                        }
                    }, {
                xtype: 'splitbutton',
                 width: 150,
                height: 30,
                padding: '2 2 2 2',
                style: {
                    borderStyle: 'none',
                    backgroundImage: 'url(img/stv-07.png)',
                    backgroundSize: '100% 100%',
                     backgroundColor: '#f8fdff',
                    
                },
                tooltip: 'Organizaciones Asociadas',
                menu: menuCoop,
                handler: function () {
                    this.showMenu();
                }
            }]
    });

    panelTabMapaAdmin = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [
            {
                title: 'Mapa',
                id: 'panelMapaTab',
                iconCls: 'icon-mapa',
                html: '<div id="map"></div>'
            }
        ]
    });
//
//    storeEventos = Ext.create('Ext.data.JsonStore', {
//        proxy: {
//            type: 'ajax',
//            url: '',
//            reader: {
//                type: 'json',
//                root: 'eventos'
//            }
//        },
//        fields: ['fecha_hora', 'vehiculo', 'evento', {name: 'velocidad', type: 'float'}, 'direccion', 'coordenadas']
//    });

    var gridEventos = Ext.create('Ext.grid.GridPanel', {
        region: 'south',
        title: "Ultimos Reportes de Vehiculos",
        collapsible: true,
        collapsed: true,
        split: true,
        height: 200,
        autoScroll: true,
        frame: true,
        store: storeEventos1,
        features: [filters],
        columns: [
            {header: "Empresa", flex: 75, sortable: true, dataIndex: "empresa", filter: {type: 'string'}},
            {header: "Vehiculo", flex: 75, sortable: true, dataIndex: "vehiculo", filter: {type: 'string'}},
            {header: "Equipo", flex: 75, sortable: true, dataIndex: "equipo", filter: {type: 'string'}},
            {header: "Evento", flex: 125, sortable: true, dataIndex: "sky_evento"},
            {header: "Vel (Km/h)", flex: 50, sortable: true, dataIndex: "vel", filter: {type: 'numeric'}}
        ],
        listeners: {
            itemclick: function (thisObject, record, item, index, e, eOpts) {
                var g = record.data.coordenadas.split(",");
                panelTabMapaAdmin.setActiveTab(0);
                localizarDireccion(g[0], g[1], 15);
            }
        }
    });

    panelCentral = Ext.create('Ext.form.Panel', {
        region: 'center',
        layout: 'border',
        items: [
            toolBarOnMap,
            panelTabMapaAdmin,
            gridEventos,
            panelEste 
        ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelCentral]
    });
    storeEmpresas.load();

    if (connectionMap()) {
        loadMap();
    }

});

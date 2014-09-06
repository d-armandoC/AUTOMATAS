var contenedorWinSof;
var winSof;

var cbxEmpresasBDSof;
var cbxBusesBDSof;
var dateIniSof;
var dateFinSof;
var timeIniSof;
var timeFinSof;

Ext.onReady(function() {

    cbxEmpresasBDSof = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'cbxEmpresasSof',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDSof.enable();
                cbxBusesBDSof.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDSof = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesSof',
        name: 'cbxBusesSof',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 300
        }
    });

    dateIniSof = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniSof',
        value: new Date(),
        maxValue: new Date(),
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinSof',
        emptyText: 'Fecha Inicial...'
    });

    dateFinSof = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinSof',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniSof',
        emptyText: 'Fecha Final...'
    });

    timeIniSof = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinSof = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMSof = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniSof.setValue(formatoFecha(nowDate));
            dateFinSof.setValue(formatoFecha(nowDate));

            timeIniSof.setValue('00:01');
            timeFinSof.setValue('23:59');
        }
    });

    var btn2RecMSof = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var nowDate = new Date();
            var anio = nowDate.getFullYear();
            var mes = nowDate.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            var dia = nowDate.getDate() - 1;
            if (dia < 10) {
                dia = "0" + dia;
            }
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateIniSof.setValue(anio + "-" + mes + "-" + dia);
            dateFinSof.setValue(anio + "-" + mes + "-" + dia);

            timeIniSof.setValue('00:01');
            timeFinSof.setValue('23:59');
        }
    });

    var panelBotonesSof = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMSof]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMSof]
            }]
    });

    contenedorWinSof = Ext.create('Ext.form.Panel', {
        frame: false,
        padding: '5 5 5 5',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width: 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBDSof.getId(),
                            dateIniSof,
                            timeIniSof
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDSof,
                            dateFinSof,
                            timeFinSof
                        ]
                    }]
            },
            panelBotonesSof],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinSof.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinSof.getForm().submit({
                            url: '././php/interface/report/getCarrerasRealizadas.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No hay datos que presentar.');
                            },
                            success: function(form, action) {
                                var resultado = action.result;
                                loadRacesMade(resultado.getCarreras, resultado.nameEmpresa, cbxBusesBDSof.getValue());
                                contenedorWinSof.getForm().reset();
                                winSof.hide();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosSof
            }]
    });
});



function foramtoCampo(val) {
    if (val === "null" || val === '') {
        return '<span style="color:orange;">NO NUMBER</span>';
    } else {
        return '<span style="color:green;">' + val + '</span>';
    }
}



function loadRacesMade(datos, empresa, unidad) {
    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storCarreras = Ext.create('Ext.data.JsonStore', {
        data: datos,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: [{name: 'id_empresa'}, {name: 'user_company'}, {name: 'date_time_company'}, {name: 'date_time_reg'}, {name: 'phone_company'}, {name: 'code_company'}, {name: 'client_company'},
            {name: 'sector_company'}, {name: 'address_company'}, {name: 'vehiculo'}, {name: 'minute'}, {name: 'time_asig'}, {name: 'num_house', type: 'string'}],
        listeners: {///El Load  Obtiene los datos en arreglo 
            load: function(thisObj, records, successful, eOpts) {
                console.log("function");
            }
        }

    });

    var columnsCarreras = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40}),
        {text: '<b>ID_Empresa</b>', flex: 60, dataIndex: 'id_empresa', tooltip: 'Empresa'},
        {text: '<b>Usuario</b>', flex: 65, dataIndex: 'user_company', tooltip: 'Usuario'},
        {text: '<b>Fecha Empresa</b>', flex: 132, dataIndex: 'date_time_company', tooltip: 'Fecha'},
        {text: '<b>Fecha Registro</b>', flex: 132, dataIndex: 'date_time_reg', tooltip: 'Fecha de Registro'},
        {text: '<b>Asignaciòn</b>', flex: 80, dataIndex: 'time_asig', tooltip: 'Asignaciòn'},
        {text: '<b>Telefono</b>', flex: 80, dataIndex: 'phone_company', tooltip: 'Telèfono'},
        {text: '<b>Codigo</b>', flex: 55, dataIndex: 'code_company', tooltip: 'Codigo'},
        {text: '<b>Cliente Empresa</b>', flex: 112, dataIndex: 'client_company', tooltip: 'Cliente '},
        {text: '<b>Sector Empresa</b>', flex: 115, dataIndex: 'sector_company', tooltip: 'Sector'},
        {text: '<b>Direccion</b>', flex: 135, dataIndex: 'address_company', tooltip: 'Direcciòn'},
        {text: '<b>Vehiculo</b>', flex: 53, dataIndex: 'vehiculo', tooltip: 'Vehiculo'},
        {text: '<b>Minutos</b>', flex: 52, dataIndex: 'minute', tooltip: 'Minutos'},
        {text: '<b>Num Casa</b>', flex: 90, dataIndex: 'num_house', renderer: foramtoCampo, tooltip: 'Nùmero de casa'}
    ];
    var gridCarreras = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center><b>Empresa </b> :' + empresa + '       ' + ' ' + '     <b>Vehiculo:</b>: ' + unidad,
        store: storCarreras,
        columnLines: true,
        autoScroll: true,
        height: 485,
        width: 1100,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnsCarreras,
        listeners: {
            columnhide: function(ct, column, eOpts) {
                var v = parseInt(column.id);

                for (var i = 0; i < arrayColumn.length; i++) {
                    if (i == v) {
                        arrayColumn[i] = 0;
                    }
                }
            },
            columnshow: function(ct, column, eOpts) {
                var v = parseInt(column.id);
                for (var i = 0; i < arrayColumn.length; i++) {
                    if (i == v) {
                        arrayColumn[i] = 1;
                    }
                }
            }
        }
    });


    var barCarrera = Ext.create('Ext.Container', {
        title: 'Reporte Careras ',
        fullscreen: true,
        layout: 'hbox',
        closable: true,
        items: [gridCarreras

        ]
    });
    panelMapa.add(barCarrera);
    panelMapa.setActiveTab(barCarrera);
}





function limpiar_datosSof() {
    contenedorWinSof.getForm().reset();
    cbxBusesBDSof.disable();
    if (winSof) {
        winSof.hide();
    }
}

function carerrasRealizadas() {
    if (!winSof) {
        winSof = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Carreras Realizadas',
            iconCls: 'icon-informe',
            resizable: false,
            width: 550,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinSof]
        });
    }
    contenedorWinSof.getForm().reset();
    winSof.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDSof.getValue();
    var unidad = cbxBusesBDSof.getValue();
    var fi = formatoFecha(dateIniSof.getValue());
    var ff = formatoFecha(dateFinSof.getValue());
    var hi = formatoHora(timeIniSof.getValue());
    var hf = formatoHora(timeFinSof.getValue());

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/getDatosHistoricos.php?cbxEmpresas=' + empresa +
                    '&cbxBuses=' + unidad +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['latitud', 'longitud', 'fecha_hora', 'velocidad', 'bateria', 'gsm', 'gps2', 'ign'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                var columnRecorridos = [
                    {text: '<b>Latitud</b>', flex: 50, dataIndex: 'latitud'},
                    {text: '<b>Longitud</b>', flex: 50, dataIndex: 'longitud'},
                    {text: '<b>Fecha</b>', xtype: 'datecolumn', format: 'Y-m-d', flex: 35, dataIndex: 'fecha_hora'},
                    {text: '<b>Hora</b>', xtype: 'datecolumn', format: 'H:i:s', flex: 35, dataIndex: 'fecha_hora'},
                    {text: '<b>Velocidad</b>', dataIndex: 'velocidad', align: 'right', flex: 15, cls: 'listview-filesize'},
                    {text: '<b>Bateria</b>', flex: 15, dataIndex: 'bateria', align: 'center'},
                    {text: '<b>GSM</b>', flex: 15, dataIndex: 'gsm', align: 'center'},
                    {text: '<b>GPS2</b>', flex: 15, dataIndex: 'gps2', align: 'center'},
                    {text: '<b>IGN</b>', flex: 15, dataIndex: 'ign', align: 'center'}
                ]

                var gridHistorico = Ext.create('Ext.grid.Panel', {
                    width: '100%',
                    height: 435,
                    collapsible: true,
                    title: '<center>Recorridos Historico ' + unidad + '</center>',
                    store: store,
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: columnRecorridos
                });

                var tab = Ext.create('Ext.form.Panel', {
                    title: 'Reporte de Datos Históricos...',
                    closable: true,
                    iconCls: 'app-icon',
                    items: gridHistorico
                });

                panelMapa.add(tab);
            }
        }
    });
}
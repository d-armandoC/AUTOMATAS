var contenedorWinBan;
var winBan;
var tabpanelContain;
var empresaRecorrido;
var placaRecorrido;
var banderaRecorrido;
 var cbxVehBD;


Ext.onReady(function () {
    if (idCompanyKarview == 1) {
        banderaRecorrido = 1;
    } else {
        banderaRecorrido = storeEmpresas.data.items[0].data.id;
    }
    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaRecorrido,
        listeners: {
            select: function (combo, records, eOpts) {
                empresaRecorrido = cbxEmpresasBD.getRawValue();
                cbxVehBD.enable();
                cbxVehBD.clearValue();
                console.log('hola');
                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
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
        },
        listeners: {
            select: function (combo, records, eOpts) {
                placaRecorrido = records[0].data.placa;
            }
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniBan',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinBan',
        emptyText: 'Fecha Inicial...',
        listConfig: {
            minWidth: 300
        }
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinBan',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniBan',
        emptyText: 'Fecha Final...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });
    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });
    var yesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });


    var panelBotones = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [today]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterday]
            }]
    });

    contenedorWinBan = Ext.create('Ext.form.Panel', {
        frame: false,
        padding: '5 5 5 5',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width: 240
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBD,
                            dateIni,
                            timeIni
                        ]
                    }, {
                        baseCls: 'x-plain',
                        items: [
                            cbxVehBD,
                            dateFin,
                            timeFin
                        ]
                    }]
            },
            panelBotones, {
                xtype: 'fieldset',
                title: 'Opciones de Reporte',
                collapsible: true,
                layout: 'anchor',
                margin: '10 20 0 0',
                defaults: {
                    anchor: '90%'
                },
                items: [{
                        xtype: 'checkboxgroup',
                        items: [{
                                checked: true,
                                boxLabel: 'Trazar Ruta',
                                name: 'trazar_ruta',
                                inputValue: 'trazar'
                            }, {
                                boxLabel: 'Reporte Ruta',
                                name: 'reporte_ruta',
                                inputValue: 'reporte'
                            }]
                    }]
            }],
        buttons: [{
                text: 'Simbologia',
                iconCls: 'icon-edit',
                tooltip: 'Simbologia',
                handler: ventanaSimbologia
            }, '->',
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    if (contenedorWinBan.getForm().isValid()) {
                        var trazar_ruta = this.up('form').down('[name=trazar_ruta]').getValue();
                        var reporte_ruta = this.up('form').down('[name=reporte_ruta]').getValue();
                        var fechaInicial = this.up('form').down('[name=fechaIni]').getValue();
                        var fechaFinal = this.up('form').down('[name=fechaFin]').getValue();
                        var empresaCombo = cbxEmpresasBD.getRawValue();
                        if (trazar_ruta || reporte_ruta) {
                            contenedorWinBan.getForm().submit({
                                url: 'php/interface/report/getDataFlags.php',
                                method: 'POST',
                                waitMsg: 'Comprobando Datos...',
                                params: {
                                    nameVeh: cbxVehBD.getRawValue()
                                },
                                failure: function (form, action) {
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            Ext.Msg.alert('Error', 'Los campos no se pueden enviar con valores invalidos.');
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            Ext.Msg.alert('Error', 'No hay datos a mostrar en su Petición');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            Ext.Msg.alert('Error', action.result.message);
                                            break;
                                    }
                                },
                                success: function (form, action) {
                                    var resultado = action.result;
                                    if (trazar_ruta) {
                                        clearLienzoTravel();
                                        clearLienzoPointTravel();
                                        console.log(resultado.puntos);
                                        drawPointsRoute(resultado.puntos, "Puntos");
                                        drawRutaMapa(resultado.puntos);

                                        var galones = obtenerGalones(resultado.puntos);
                                        var litros = obtenerLitros(resultado.puntos);
                                        var kilometraje = kilometrajeRecorrido(resultado.puntos);

                                        var velMaxima = velocidadmaxima(resultado.puntos);
                                        var velMinima = velocidadMinimo(resultado.puntos);
                                        var velMedia = velociadadMedia(resultado.puntos);

                                        var mayor60 = velociadadMayor60(resultado.puntos);
                                        var mayor90 = velociadadMayor90(resultado.puntos);

                                        tabpanelContain = Ext.create('Ext.form.Panel', {
                                            closable: true,
                                            title: '<b>Informe Tecnico</b>',
                                            autoScroll: true,
                                            id: 'contenedor',
                                            iconCls: 'icon-car',
                                            name: 'contenedoresg',
                                            padding: '5 5 5 15',
                                            defaults: {
                                                anchor: '100%',
                                            },
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Datos del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA DE NICIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaInicial) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>FECHA FIN:</b></td>' +
                                                                            '   <TD align="CENTER ">' + formatoFecha(fechaFinal) + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>DISTANCIA RECORRIDA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + kilometraje + 'KM' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>CONSUMO DE COMBUSTIBLE:</b></td>' +
                                                                            '   <TD align="CENTER ">' + litros + 'LT' + ' | ' + galones + 'GL' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]},
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Velocidades del Recorido:</b>',
                                                            padding: '5 5 5 15',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            },
                                                            items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAXIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMaxima + ' KM/H' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MINIMA:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMinima + ' KM/hH' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>PROMEDIO:</b></td>' +
                                                                            '   <TD align="CENTER ">' + velMedia + ' KM/H' + '</TD> ' +
                                                                            ' </TABLE>'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    autoHeight: true,
                                                    border: false,
                                                    disable: true,
                                                    layout: 'hbox',
                                                    padding: '5 5 5 15',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            flex: 2,
                                                            title: '<b>Excesos de Velocidad del Recorrido</b>',
                                                            padding: '5 5 5 5',
                                                            border: false,
                                                            layout: 'anchor',
                                                            defaults: {
                                                                anchor: '100%',
                                                                hideEmptyLabel: false
                                                            }, items: [
                                                                {
                                                                    html: '<TABLE id="tablestados">' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 60 KM/h:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor60 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            '<TR class="alt"> ' +
                                                                            '   <TD> <IMG SRC="img/inicio.png"> <b>MAYOR A 90 KM/H:</b></td>' +
                                                                            '   <TD align="CENTER "> ' + mayor90 + ' ' + '</TD> ' +
                                                                            '</TR> ' +
                                                                            ' </TABLE>'
                                                                }]}
                                                    ]
                                                }
                                            ]
                                        });
                                    }

                                    if (reporte_ruta) {
                                        loadGridFlags(
                                                resultado.puntos,
                                                cbxEmpresasBD.getValue(),
                                                cbxVehBD.getValue(),
                                                formatoFecha(dateIni.getValue()),
                                                formatoFecha(dateFin.getValue()),
                                                timeIni.getRawValue(),
                                                timeFin.getRawValue(),
                                                cbxVehBD.getRawValue()
                                                );
                                    }

                                    winBan.hide();
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title: 'Atención',
                                msg: 'Escoga una de las Opciones de Reporte...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.infor
                            });
                        }
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winBan.hide();
                }
            }]
    });
});

function recorridosGeneral() {
    if (!winBan) {
        winBan = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Recorridos General',
            iconCls: 'icon-all-flags',
            resizable: false,
            width: 500,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinBan]
        });
    }
    contenedorWinBan.getForm().reset();
//    contenedorWinBan.down('[name=cbxVeh]').disable();
    var nowDate = new Date();
    contenedorWinBan.down('[name=fechaIni]').setValue(formatoFecha(nowDate));
    contenedorWinBan.down('[name=fechaFin]').setValue(formatoFecha(nowDate));
    contenedorWinBan.down('[name=horaIni]').setValue('00:00');
    contenedorWinBan.down('[name=horaFin]').setValue('23:59');
    winBan.show();
    cbxVehBD.enable();
    cbxVehBD.clearValue();
    storeVeh.load({
        params: {
            cbxEmpresas: banderaRecorrido
        }
    });
}

function ventanaBanderasClick(coop, eqp) {
    ventanaBanderas();
    storeEmpresas.load({
        params: {
            idEmpresa: coop,
            menuClick: 1
        }
    });
    contenedorWinBan.down('[name=cbxEmpresas]').setValue(coop);
//    contenedorWinBan.down('[name=cbxVeh]').enable();
    storeVeh.load({
        params: {
            cbxEmpresas: coop
        }
    });
    contenedorWinBan.down('[name=cbxVeh]').setValue(eqp);
}
;

function loadGridFlags(records, idEmp, idEqp, fi, ff, hi, hf, vehiculo) {
    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storeFlags = Ext.create('Ext.data.JsonStore', {
        data: records,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['latitud', 'longitud', {name: 'fecha_hora', type: 'date', dateFormat: 'c'}, {name: 'fecha_hora_reg', type: 'date', dateFormat: 'c'}, 'velocidad', 'bateria',
            'gsm', 'gps2', 'ign', 'direccion', 'color', 'evento', 'idEvento', 'g1', 'g2', 'salida']
    });
    var columnFlags = [];
    columnFlags = [
        {text: '<b>Trama</b>', width: 65, dataIndex: 'idData', align: 'center'},
        {text: '<b>Evento</b>', width: 180, dataIndex: 'evento', align: 'center'},
        {text: '<b>Fecha y Hora <br> de Equipo</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 160, dataIndex: 'fecha_hora', align: 'center'},
        {text: '<b>Fecha y Hora <br> Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 170, dataIndex: 'fecha_hora_reg', align: 'center'},
        {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 100, cls: 'listview-filesize', renderer: formatSpeed},
        {text: '<b>Bateria</b>', width: 120, dataIndex: 'bateria', align: 'center', renderer: formatBat},
        {text: '<b>Estado Vehiculo <br> IGN</b>', width: 175, dataIndex: 'ign', align: 'center', renderer: estadoVehiculo},
        {text: '<b>GSM</b>', width: 110, dataIndex: 'gsm', align: 'center', renderer: estadoGsm},
        {text: '<b>GPS</b>', width: 100, dataIndex: 'gps2', align: 'center', renderer: estadoGps},
//        {text: '<b>G1</b>', width: 100, dataIndex: 'g1', align: 'center', renderer: formatStateTaxy},
//        {text: '<b>G2</b>', width: 100, dataIndex: 'g2', align: 'center', renderer: formatPanic},
        {text: '<b>Id Evento</b>', width: 80, dataIndex: 'idEvento', align: 'center'}
    ];
    var gridFlags = Ext.create('Ext.grid.Panel', {
        title: '<center>Informe Detallado</center>',
        region: 'center',
        iconCls: 'icon-general',
        store: storeFlags,
        columnLines: true,
        autoScroll: true,
        height: 425,
        width: 800,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnFlags,
        listeners: {
            itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                            text: 'Ver Ubicación en el Mapa',
                            disabled: false,
                            handler: function (widget, event) {
                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
                            }
                        })
                    ]
                }).showAt(e.getXY());
                return false;
            }
        }
    });

    panelGrid = Ext.create('Ext.tab.Panel', {
        title: '<center>Recorridos Historico: ' + vehiculo + '<br>Desde: ' + fi + ' ' + hi + ' | Hasta: ' + ff + ' ' + hf + '</center>',
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [gridFlags, tabpanelContain

        ]
    });

    var tab = Ext.create('Ext.container.Container', {
        title: '<div id="titulosForm">Reporte de Recorrido General: ' + " " + empresaRecorrido + ":" + placaRecorrido + '</div>',
        closable: true,
        iconCls: 'icon-all-flags',
        layout: 'border',
        items: panelGrid
    });

    panelTabMapaAdmin.add(tab);
    panelTabMapaAdmin.setActiveTab(tab);


}
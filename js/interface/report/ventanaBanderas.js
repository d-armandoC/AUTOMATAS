var contenedorWinBan;
var winBan;
var tabpanelContain;

Ext.onReady(function() {

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa:',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxVehBD.enable();
                cbxVehBD.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
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
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniBan',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
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
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIni.setValue(formatoFecha(nowDate));
            dateFin.setValue(formatoFecha(nowDate));

            timeIni.setValue('00:01');
            timeFin.setValue('23:59');
        }
    });

    var yesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var nowDate = new Date();
            var año = nowDate.getFullYear();
            var mes = nowDate.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            var dia = nowDate.getDate() - 1;
            if (dia < 10) {
                dia = "0" + dia;
            }
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateIni.setValue(año + "-" + mes + "-" + dia);
            dateFin.setValue(año + "-" + mes + "-" + dia);

            timeIni.setValue('00:01');
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
            width: 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBD,
                            dateIni,
                            timeIni
                        ]
                    }, {
                        columnWidth: .5,
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
                margin: '10 0 0 0',
                defaults: {
                    anchor: '100%'
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
                handler: function() {
                    if (contenedorWinBan.getForm().isValid()) {
                        var trazar_ruta = this.up('form').down('[name=trazar_ruta]').getValue();
                        var reporte_ruta = this.up('form').down('[name=reporte_ruta]').getValue();
                        var fechaInicial = this.up('form').down('[name=fechaIni]').getValue();
                        var fechaFinal = this.up('form').down('[name=fechaFin]').getValue();


                        if (trazar_ruta || reporte_ruta) {

                            contenedorWinBan.getForm().submit({
                                url: 'php/interface/report/getDataFlags.php',
                                method: 'POST',
                                waitMsg: 'Comprobando Datos...',
                                params: {
                                    nameVeh: cbxVehBD.getRawValue()
                                },
                                failure: function(form, action) {
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
                                success: function(form, action) {
                                    var resultado = action.result;
                                    if (trazar_ruta) {
                                        clearLienzoTravel();
                                        clearLienzoPointTravel();
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
                                                formatoHora(timeIni.getValue()),
                                                formatoHora(timeFin.getValue()),
                                                cbxVehBD.getRawValue()
                                                );
                                    }

                                    winBan.hide();
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: 'Escoga una de las Opciones de Reporte...',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function() {
                    winBan.hide();
                }
            }]
    });
});

function ventanaBanderas() {
    if (!winBan) {
        winBan = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Todas las Banderas',
            iconCls: 'icon-all-flags',
            resizable: false,
            width: 560,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinBan]
        });
    }
    contenedorWinBan.getForm().reset();
    contenedorWinBan.down('[name=cbxVeh]').disable();

    var nowDate = new Date();
    contenedorWinBan.down('[name=fechaIni]').setValue(formatoFecha(nowDate));
    contenedorWinBan.down('[name=fechaFin]').setValue(formatoFecha(nowDate));
    contenedorWinBan.down('[name=horaIni]').setValue('00:01');
    contenedorWinBan.down('[name=horaFin]').setValue('23:59');

    winBan.show();
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
    contenedorWinBan.down('[name=cbxVeh]').enable();

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
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
        {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
        {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
        {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 95, cls: 'listview-filesize', renderer: formatSpeed},
        {text: '<b>Bateria</b>', width: 80, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>IGN</b>', width: 70, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GSM</b>', width: 70, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>GPS</b>', width: 70, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
        {text: '<b>G1</b>', width: 90, dataIndex: 'g1', align: 'center', renderer: formatStateTaxy, },
        {text: '<b>G2</b>', width: 70, dataIndex: 'g2', align: 'center', renderer: formatPanic},
        {text: '<b>Salida</b>', width: 70, dataIndex: 'salida', align: 'center'},
        {text: '<b>Evento</b>', width: 280, dataIndex: 'evento', align: 'center'},
        {text: '<b>Id Evento</b>', width: 80, dataIndex: 'idEvento', align: 'center'},
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
            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                            text: 'Ver Ubicación en el Mapa',
                            disabled: false,
                            handler: function(widget, event) {
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
        title: 'Reporte de Recorrido General  ',
        closable: true,
        iconCls: 'icon-all-flags',
        layout: 'border',
        items: panelGrid
    });

    panelTabMapaAdmin.add(tab);
    panelTabMapaAdmin.setActiveTab(tab);


}
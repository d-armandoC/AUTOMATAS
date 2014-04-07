var contenedorWinBan;
var winBan;

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
        frame: true,
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
            }, {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinBan.getForm().isValid()) {
                        var trazar_ruta = this.up('form').down('[name=trazar_ruta]').getValue();
                        var reporte_ruta = this.up('form').down('[name=reporte_ruta]').getValue();
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
                                            Ext.Msg.alert('Error', 'Escoja un Rango de Fechas y Horas Menor.');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            Ext.Msg.alert('Error', action.result.message);
                                            break;
                                    }
                                },
                                success: function(form, action) {
                                    var resultado = action.result;

                                    if (trazar_ruta) {
                                        limpiarCapasHistorico();
                                        dibujarTrazadoHistorico(resultado.puntos);
                                        lienzosRecorridoHistorico(cbxVehBD.getValue(), resultado.puntos);
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
            height: 275,
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
        fields: ['vehiculo', 'latitud', 'longitud', {name: 'fecha_hora', type: 'date', dateFormat:'c'}, {name: 'fecha_hora_reg', type: 'date', dateFormat:'c'}, 'velocidad', 'bateria', 
            'gsm', 'gps2', 'ign', 'direccion', 'color', 'evento', 'idEvento', 'parametro', 'g1', 'g2', 'salida']
    });
    var columnFlags = [];

    if (records[0].bateria === -1) {
        columnFlags = [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
            {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
            {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
            {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 75, cls: 'listview-filesize', renderer: formatSpeed},
            {text: '<b>Evento</b>', width: 130, dataIndex: 'evento', align: 'center'},
            {text: '<b>Est. Unid.</b>', width: 130, dataIndex: 'ign', align: 'center'},
            {text: '<b>Id Est. Unid.</b>', width: 50, dataIndex: 'gsm', align: 'center'},
            {text: '<b>Est. Mec.</b>', width: 130, dataIndex: 'gps2', align: 'center'}
        ];
    } else {
        columnFlags = [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
            {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
            {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
            {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 75, cls: 'listview-filesize', renderer: formatSpeed},
            {text: '<b>Bateria</b>', width: 60, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2},
            {text: '<b>IGN</b>', width: 50, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
            {text: '<b>GSM</b>', width: 50, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
            {text: '<b>GPS2</b>', width: 50, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
            {text: '<b>Taximetro</b>', width: 90, dataIndex: 'g2', align: 'center', renderer: formatStateTaxy,},
            {text: '<b>Panico</b>', width: 60, dataIndex: 'g1', align: 'center', renderer: formatPanic},
            {text: '<b>Salida</b>', width: 60, dataIndex: 'salida', align: 'center'},
            {text: '<b>Evento</b>', width: 200, dataIndex: 'evento', align: 'center'},
            {text: '<b>Id Evento</b>', width: 75, dataIndex: 'idEvento', align: 'center'},
            {text: '<b>Parametro</b>', width: 75, dataIndex: 'parametro', align: 'center'}
        ];
    }

    var gridFlags = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Recorridos Historico: ' + vehiculo + '<br>Desde: '+fi+' '+hi+' | Hasta: '+ff+' '+hf+'</center>',
        store: storeFlags,
        columnLines: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnFlags,
        listeners: {
            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                panelMapa.setActiveTab('panelMapaTab');
                localizarDireccion(record.data.longitud, record.data.latitud, 17);
            }
        }
    });

    var tab = Ext.create('Ext.container.Container', {
        title: 'Reporte General '+idEmp+'-'+idEqp,
        closable: true,
        iconCls: 'icon-all-flags',
        layout: 'border',
        items: gridFlags
    });

    panelMapa.add(tab);
    panelMapa.setActiveTab(tab);
}
var contenedorwinAsi;
var winAsi;

var cbxEmpresasBDAsi;
var cbxBusesBDAsi;
var dateIniAsi;
var dateFinAsi;
var timeIniAsi;
var timeFinAsi;

Ext.onReady(function() {

    cbxEmpresasBDAsi = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresasAsi',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDAsi.enable();
                cbxBusesBDAsi.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDAsi = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo',        
        name: 'cbxBusesAsi',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth : 300
        }
    });

    dateIniAsi = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniAsi',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinAsi',
        emptyText: 'Fecha Inicial...'
    });

    dateFinAsi = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinAsi',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniAsi',
        emptyText: 'Fecha Final...'
    });

    timeIniAsi = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinAsi = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMAsi = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls : 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniAsi.setValue(formatoFecha(nowDate));
            dateFinAsi.setValue(formatoFecha(nowDate));

            timeIniAsi.setValue('00:01');
            timeFinAsi.setValue('23:59');
        }
    });

    var btn2RecMAsi = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls : 'icon-yesterday',
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

            dateIniAsi.setValue(año + "-" + mes + "-" + dia);
            dateFinAsi.setValue(año + "-" + mes + "-" + dia);

            timeIniAsi.setValue('00:01');
            timeFinAsi.setValue('23:59');
        }
    });

    var panelBotonesGenAsi = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMAsi]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMAsi]
            }]
    });

    contenedorwinAsi = Ext.create('Ext.form.Panel', {
        frame: true,
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width : 260
        },
        items: [{
            layout: 'column',
            baseCls: 'x-plain',
            items: [{
                columnWidth: .5,
                baseCls: 'x-plain',
                items: [
                    cbxEmpresasBDAsi,
                    dateIniAsi,
                    timeIniAsi
                ]
            }, {
                columnWidth: .5,
                baseCls: 'x-plain',
                items: [
                    cbxBusesBDAsi,
                    dateFinAsi,
                    timeFinAsi
                ]
            }]
        },
        panelBotonesGenAsi],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinAsi.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorwinAsi.getForm().submit({
                            url: 'php/interface/getDatosGraficosHistoricos.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.MessageBox.hide();
                                Ext.MessageBox.show({
                                    title: 'Error...',
                                    msg: 'No hay un trazo posible en estas fechas y horas...',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            },
                            success: function(form, action) {
                                Ext.MessageBox.hide();
                                var resultado = Ext.JSON.decode(action.response.responseText);

                                limpiarCapasHistorico();
                                dibujarTrazadoHistorico(resultado.datos.coordenadas);
                                lienzosRecorridoHistorico(cbxBusesBDAsi.getValue(), resultado.datos.coordenadas);
                                cargarTablaHistorico();

                                limpiar_datosAsi();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosAsi
            }]
    });
});

function limpiar_datosAsi() {
    contenedorwinAsi.getForm().reset();
    cbxBusesBDAsi.disable();
    if (winAsi) {
        winAsi.hide();
    }
}

function ventanaAsignacion() {
    if (!winAsi) {
        winAsi = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Asignación general',
            iconCls: 'icon-asignacion',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinAsi]
        });
    }
    contenedorwinAsi.getForm().reset();
    winAsi.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDAsi.getValue();
    var unidad = cbxBusesBDAsi.getValue();
    var fi = formatoFecha(dateIniAsi.getValue());
    var ff = formatoFecha(dateFinAsi.getValue());
    var hi = formatoHora(timeIniAsi.getValue());
    var hf = formatoHora(timeFinAsi.getValue());

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
                    {text: 'Latitud', flex: 50, dataIndex: 'latitud'},
                    {text: 'Longitud', flex: 50, dataIndex: 'longitud'},
                    {text: 'Fecha', xtype: 'datecolumn', format: 'Y-m-d', flex: 35, dataIndex: 'fecha_hora'},
                    {text: 'Hora', xtype: 'datecolumn', format: 'H:i:s', flex: 35, dataIndex: 'fecha_hora'},
                    {text: 'Velocidad', dataIndex: 'velocidad', align: 'right', flex: 15, cls: 'listview-filesize'},
                    {text: 'Bateria', flex: 15, dataIndex: 'bateria', align: 'center'},
                    {text: 'GSM', flex: 15, dataIndex: 'gsm', align: 'center'},
                    {text: 'GPS2', flex: 15, dataIndex: 'gps2', align: 'center'},
                    {text: 'IGN', flex: 15, dataIndex: 'ign', align: 'center'}
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
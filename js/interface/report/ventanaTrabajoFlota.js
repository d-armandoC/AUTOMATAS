var contenedorWinFlo;
var winFlo;

var cbxEmpresasBDFlo;
var cbxBusesBDFlo;
var dateIniFlo;
var dateFinFlo;
var timeIniFlo;
var timeFinFlo;

Ext.onReady(function() {

    cbxEmpresasBDFlo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',        
        name: 'cbxEmpresasFlo',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDFlo.enable();
                cbxBusesBDFlo.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDFlo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesFlo',
        name: 'cbxBusesFlo',
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

    dateIniFlo = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniFlo',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinFlo',
        emptyText: 'Fecha Inicial...'
    });

    dateFinFlo = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinFlo',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniFlo',
        emptyText: 'Fecha Final...'
    });

    timeIniFlo = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    timeFinFlo = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var btn1RecMFlo = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls : 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIniFlo.setValue(formatoFecha(nowDate));
            dateFinFlo.setValue(formatoFecha(nowDate));

            timeIniFlo.setValue('00:01');
            timeFinFlo.setValue('23:59');
        }
    });

    var btn2RecMFlo = Ext.create('Ext.button.Button', {
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

            dateIniFlo.setValue(año + "-" + mes + "-" + dia);
            dateFinFlo.setValue(año + "-" + mes + "-" + dia);

            timeIniFlo.setValue('00:01');
            timeFinFlo.setValue('23:59');
        }
    });

    var panelBotonesFlo = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecMFlo]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecMFlo]
            }]
    });

    contenedorWinFlo = Ext.create('Ext.form.Panel', {
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
                            cbxEmpresasBDFlo,
                            dateIniFlo,
                            timeIniFlo
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDFlo,
                            dateFinFlo,
                            timeFinFlo
                        ]
                    }]
            },
            panelBotonesFlo],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorWinFlo.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Buscando puntos...',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinFlo.getForm().submit({
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
                                lienzosRecorridoHistorico(cbxBusesBDFlo.getValue(), resultado.datos.coordenadas);
                                cargarTablaHistorico();

                                limpiar_datosFlo();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosFlo
            }]
    });
});

function limpiar_datosFlo() {
    contenedorWinFlo.getForm().reset();
    cbxBusesBDFlo.disable();
    if (winFlo) {
        winFlo.hide();
    }
}

function ventanaTrabajoPorFlota() {
    if (!winFlo) {
        winFlo = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Trabajo por flota',
            iconCls: 'icon-trab-flota',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinFlo]
        });
    }
    contenedorWinFlo.getForm().reset();
    winFlo.show();
}


function cargarTablaHistorico() {
    var empresa = cbxEmpresasBDFlo.getValue();
    var unidad = cbxBusesBDFlo.getValue();
    var fi = formatoFecha(dateIniFlo.getValue());
    var ff = formatoFecha(dateFinFlo.getValue());
    var hi = formatoHora(timeIniFlo.getValue());
    var hf = formatoHora(timeFinFlo.getValue());

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
var formularioParadas;
var Ventanaparadas;
var banderaParadas = 0;
var storeViewParadas;
var fechaInicio;
var fechaFin;
var personaParadas;
var gridViewDataParadas;
var storeViewExcesosParadas;
var storeDataParada;
var idEmpresa = 1;
var cbxEmpresasParada;
var modal;
Ext.onReady(function() {
    storeViewParadas = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportParadasDetallados.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['empresa', 'vehiculo', 'placa', 'latitud','longitud','fecha','hora','velocidad','bateria','gsm','gps','ign','sky_evento']
    });

    cbxEmpresasParada = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'idCompanyExcesos',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Empresa...',
        editable: false,
        allowBlank: false,
        value: 1,
        listeners: {
            select: function(combo, records, eOpts) {
                idEmpresa = records[0].data.id;
            }
        }
    });
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniExcesos',
        name: 'fechaIniExcesos',
        value: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinExcesos',
        name: 'fechaFinExcesos',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniExcesos',
        emptyText: 'Fecha Final...'
    });
    var btnToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
        }
    });
    var panelButtons = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnToday, btnYesterday]
    });
    formularioParadas = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [{
                        xtype: 'radiogroup',
// fieldLabel: ' ',
// Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'General ', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Por Empresa', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        idEmpresa = 0;
                                        cbxEmpresasParada.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasParada.enable();
                                        idEmpresa = cbxEmpresasParada.getValue();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasParada,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    panelButtons,
                ]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    fechaInicio = dateIni.getRawValue();
                    fechaFin = dateFin.getRawValue();
                    var form = formularioParadas.getForm();
                    if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/getReportParadasCantidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idEmpresas:idEmpresa
                                },
                                success: function(form, action) {
                                    console.log(action.result.countByParadas);
                                    personaParadas;
                                    gridViewDataParadas;
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.countByParadas,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['id_empresa','id_vehiculo','empresa','vehiculo','equipo','placa', 'totalEventos']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '48%',
                                        title: '<center>Mantenimientos Totales: ' + '<br>Desde: ' + fechaInicio + ' | Hasta: ' + fechaFin + '</center>',
                                        store: storeDataReporteDetallado,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Empresa', width: 150, dataIndex: 'empresa', align: 'center'},
                                            {text: 'Vehiculo', width: 100, dataIndex: 'vehiculo', align: 'center'},
                                            {text: 'Equipo', width: 100, dataIndex: 'equipo', align: 'center'},
                                            {text: 'Placa', width: 100, dataIndex: 'placa', align: 'center'},
                                            {text: 'Cantidad Eventos', width: 100, dataIndex: 'totalEventos', align: 'center'}
                                        ],
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function() {
                                                    var h0, h1, h2, h3, h4, h5, h6, h7;
                                                    h0 = h1 = h2 = h3 = h4 = h5 = h6 = h7 = true;
                                                    if (storeDataReporteDetallado.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                            var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                            var tiLetra = 'Calibri';
                                                            var table_div = "<meta charset='UTF-8'><body>" +
                                                                    "<font face='" + tiLetra + "'><table>" +
                                                                    "<tr><th colspan='7'>Mantenimientos Totales" + "</th></tr>" +
                                                                    "<tr><th colspan='7'>Desde " + fechaInicio + " hasta " + fechaFin + "</th></tr>" +
                                                                    "<tr></tr>";
                                                            table_div += "<tr>";
                                                            if (h1)
                                                                table_div += "<th align=left>Empresa</th>";
                                                            if (h1)
                                                                table_div += "<th align=left>Vehículo</th>";
                                                            if (h3)
                                                                table_div += "<th align=left>Total</th>";


                                                            table_div += "</tr>";
                                                            for (var i = 0; i < storeDataReporteDetallado.data.length; i++) {
                                                                table_div += "<tr>";
                                                                if (h0)
                                                                    table_div += "<td align=lef>" + storeDataReporteDetallado.data.items[i].data.empresa + "</td>";
                                                                if (h1)
                                                                    table_div += "<td align=lef>" + storeDataReporteDetallado.data.items[i].data.vehiculo + "</td>";
                                                                if (h3)
                                                                    table_div += "<td align=lef>" + storeDataReporteDetallado.data.items[i].data.total + "</td>";

                                                                table_div += "</tr>";
                                                            }
                                                            ;
                                                            table_div += "</table></font></body>";
                                                            var table_html = table_div.replace(/ /g, '%20');
                                                            a.href = data_type + ', ' + table_html;
//setting the file name
                                                            a.download = 'Mantenimiento Total' + fechaInicio + '_' + fechaFin + '.xls';
//triggering the function
                                                            a.click();
                                                        } else {
                                                            Ext.MessageBox.show({
                                                                title: 'Error',
                                                                msg: 'El Servicio para este navegador no permitido,<br> use un navegador como Google Chrome ',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR
                                                            });

                                                        }
                                                    } else {
                                                        Ext.MessageBox.show({
                                                            title: 'Error...',
                                                            msg: 'No hay datos en la Lista a Exportar',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.ERROR
                                                        });
                                                    }
                                                }
                                            }], listeners: {
                                            itemclick: function(thisObj, record, item, index, e, eOpts) {
//Id del despacho que se esta realizando 
                                                var reg = record.get('empresa');
                                                var id_vehiculo = record.get('id_vehiculo');
                                                banderaParadas = 1;
                                                gridViewDataParadas.setTitle('<center>Lista de Mnatenimientos por Vehicuculo <br>Empresa: ' + reg + ' Desde: ' + fechaInicio + ' Hasta:' + fechaFin + '</center>');
                                                storeViewParadas.load({
                                                    params: {
                                                        idVehiculo: id_vehiculo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataParadas = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '52%',
                                        title: '<center>Servicios Mantenimientos Detallado: ',
                                        store: storeViewParadas,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            //fields: ['empresa', 'vehiculo', 'placa', 'latitud','longitud','fecha','hora','velocidad','bateria','gsm','gps','ign','sky_evento']
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Empresa', width: 130, dataIndex: 'empresa', align: 'center'},
                                            {text: 'Vehiculo', width: 200, dataIndex: 'vehiculo', align: 'center'},
                                            {text: 'Placa', width: 200, dataIndex: 'placa', align: 'center'},
                                            {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                                            {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'},
                                            {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center'},
                                            {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center'},
                                            {text: 'Velocidad', width: 200, dataIndex: 'velocidad', align: 'center'},
                                            {text: 'Bateria', width: 200, dataIndex: 'bateria', align: 'center'},
                                            {text: 'GSM', width: 200, dataIndex: 'gsm', align: 'center'},
                                            {text: 'GPS', width: 200, dataIndex: 'gps', align: 'center'},
                                            {text: 'IGN', width: 200, dataIndex: 'ign', align: 'center'},
                                            {text: 'Evento', width: 200, dataIndex: 'sky_evento', align: 'center'}
                                        ],
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function() {
                                                    if (banderaParadas === 1) {
                                                        if (storeViewParadas.getCount() > 0) {
                                                             if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                            var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                            var tiLetra = 'Calibri';
                                                            var table_div = "<meta charset='UTF-8'><body>" +
                                                                    "<font face='" + tiLetra + "'><table>" +
                                                                    "<tr><th colspan='7'>MANTENIMIENTO POR VEHÍCULO: " + personaParadas + "</th></tr>" +
                                                                    "<tr><th colspan='7'>DESDE" + fechaInicio + "HASTA" + fechaFin + "</th></tr>" +
                                                                    "<tr></tr>";
                                                            table_div += "<tr>";
                                                            table_div += "<th align=left>PLACA</th>";
                                                            table_div += "<th align=left>MARCA </th>";
                                                            table_div += "<th align=left>ESTANDAR</th>";
                                                            table_div += "<th align=left>TIPO SERVICIO </th>";
                                                            table_div += "</tr>";
                                                            for (var i = 0; i < storeViewParadas.data.length; i++) {
                                                                table_div += "<tr>";
                                                                table_div += "<td align=lef>" + storeViewParadas.data.items[i].data.placa + "</td>";
                                                                table_div += "<td align=lef>" + storeViewParadas.data.items[i].data.marca + "</td>";
                                                                table_div += "<td align=lef>" + storeViewParadas.data.items[i].data.estandar + "</td>";
                                                                table_div += "<td align=lef>" + storeViewParadas.data.items[i].data.idTipoServicio + "</td>";
                                                                table_div += "</tr>";
                                                            }
                                                            table_div += "</table></font></body>";
                                                            var table_html = table_div.replace(/ /g, '%20');
                                                            a.href = data_type + ', ' + table_html;
//setting the file name
                                                            a.download = 'Mantenimiento por vehiculo' + fechaInicio + '_' + fechaFin + '.xls';
//triggering the function
                                                              a.click();
                                                            } else {
                                                            Ext.MessageBox.show({
                                                                title: 'Error',
                                                                msg: 'El Servicio para este navegador no permitido,<br> use un navegador como Google Chrome ',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR
                                                            });

                                                        }
                                                        }
                                                    } else {
                                                        Ext.MessageBox.show({
                                                            title: 'Error...',
                                                            msg: 'No hay datos en la Lista a Exportar',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.ERROR
                                                        });
                                                    }
                                                }
                                            }]
                                    });
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: 'Mantenimientos Detallados',
                                        closable: true,
                                        iconCls: 'icon-unlock',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataParadas]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    Ventanaparadas.hide();
                                },
                                failure: function(form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Información',
                                        msg: action.result.message,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                            });
                    }
//                    else {
//                        Ext.MessageBox.show({
//                            title: 'Información',
//                            msg: '<center>No existen datos de Excesos de Velocidad<br> en estas fechas<center>',
//                            buttons: Ext.MessageBox.OK,
//                            icon: Ext.MessageBox.INFO
//                        });
//                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    Ventanaparadas.hide();
                }
            }]
    });
});
function showWinPradas() {
    if (!Ventanaparadas) {
        Ventanaparadas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Paradas',
            iconCls: 'icon-unlock',
            resizable: false,
            width: 350,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: formularioParadas
        });
    }
    formularioParadas.getForm().reset();
    cbxEmpresasParada.disable();
    Ventanaparadas.show();
}


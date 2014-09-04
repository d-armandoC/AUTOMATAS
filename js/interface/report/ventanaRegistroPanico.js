var formPanico;
var winPanico;
var bandera = 0;
var storeViewPanico;
var dateStart;
var dateFinish;
var persona;
var gridViewDataPanico;
var gridViewDataPanicoTotal;
var gridViewDataPanicoGeneral;
var storeViewPanicoTotal;
var storeDataPanicoD;
var empresa = 1;
var empresaNom = 'KRADAC';

var cbxEmpresasBDPanico;
Ext.onReady(function() {
    storeViewPanico = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/panicos/getViewPanicos.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fecha', 'hora', 'evento', 'latitud', 'longitud', 'velocidad']
    });

    cbxEmpresasBDPanico = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'idCompanyPanico',
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
                empresa = records[0].data.id;
            }
        }
    });
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniPanico',
        name: 'fechaIni',
        value: new Date(),
        allowBlank: false,
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinPanico',
        name: 'fechaFin',
        vtype: 'daterange',
        value: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniPanico',
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
    formPanico = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Por Cooperativa', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        empresa = 1;
                                        cbxEmpresasBDPanico.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasBDPanico.enable();
                                        empresa = cbxEmpresasBDPanico.getValue();
                                        empresaNom = cbxEmpresasBDPanico.getRawValue()
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDPanico,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    panelButtons,
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    dateStart = dateIni.getRawValue();
                    dateFinish = dateFin.getRawValue();
                    var form = formPanico.getForm();

                    form.submit({
                        url: 'php/interface/report/panicos/getPanicos.php',
                        waitTitle: 'Procesando...',
                        waitMsg: 'Obteniendo Información',
                        params: {
                            idCompany: empresa,
                        },
                        success: function(form, action) {
                            persona;
                            gridViewDataPanico;
                            var storeDataExcesos = Ext.create('Ext.data.JsonStore', {
                                data: action.result.data,
                                proxy: {
                                    type: 'ajax',
                                    reader: 'array'
                                },
                                fields: ['empresaPanicos', 'personaPanicos', 'idEquipoPanicos', 'placaPanicos', 'cantidadPanicos']
                            });
                            var gridDataExcesos = Ext.create('Ext.grid.Panel', {
                                region: 'west',
                                frame: true,
                                width: '40%',
                                title: '<center>Panicos Totales: ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                store: storeDataExcesos,
                                features: [filters],
                                multiSelect: true,
                                viewConfig: {
                                    emptyText: 'No hay datos que Mostrar'
                                },
                                columns: [
                                    Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                    {text: 'Empresa', width: 150, dataIndex: 'empresaPanicos', align: 'center'},
                                    {text: 'Placa', width: 100, dataIndex: 'placaPanicos', align: 'center'},
                                    {text: 'Cantidad', width: 100, dataIndex: 'cantidadPanicos', align: 'center'},
                                ],
                                tbar: [{
                                        xtype: 'button',
                                        iconCls: 'icon-excel',
                                        text: 'Exportar a Excel',
                                        handler: function() {
                                            var h0, h1, h2, h3, h4, h5, h6, h7;
                                            h0 = h1 = h2 = h3 = h4 = h5 = h6 = h7 = true;
                                            if (storeDataExcesos.getCount() > 0) {
                                                var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                var tiLetra = 'Calibri';
                                                var table_div = "<meta charset='UTF-8'><body>" +
                                                        "<font face='" + tiLetra + "'><table>" +
                                                        "<tr><th colspan='7'>Panicos de Equipos" + "</th></tr>" +
                                                        "<tr><th colspan='7'>Desde " + dateStart + " hasta " + dateFinish + "</th></tr>" +
                                                        "<tr></tr>";
                                                table_div += "<tr>";
                                                if (h1)
                                                    table_div += "<th align=left>Empresa</th>";
                                                if (h1)
                                                    table_div += "<th align=left>Persona</th>";
                                                if (h3)
                                                    table_div += "<th align=left>Placa</th>";
                                                if (h5)
                                                    table_div += "<th align=left>Cantidad</th>";

                                                table_div += "</tr>";
                                                for (var i = 0; i < storeDataExcesos.data.length; i++) {
                                                    table_div += "<tr>";
                                                    if (h0)
                                                        table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.empresaPanicos + "</td>";
                                                    if (h1)
                                                        table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.personaPanicos + "</td>";
                                                    if (h3)
                                                        table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.placaPanicos + "</td>";
                                                    if (h5)
                                                        table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.cantidadPanicos + "</td>";
                                                    table_div += "</tr>";
                                                }
                                                ;
                                                table_div += "</table></font></body>";
                                                var table_html = table_div.replace(/ /g, '%20');
                                                a.href = data_type + ', ' + table_html;
//setting the file name
                                                a.download = 'Panicos' + dateStart + '_' + dateFinish + '.xls';
//triggering the function
                                                a.click();
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
                                        var reg = record.get('idEquipoPanicos');
                                        persona = record.get('personaPanicos');
                                        bandera = 1;
                                        gridViewDataPanico.setTitle('<center>Vista de Panicos: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                        storeViewPanico.load({
                                            params: {
                                                idEquipo: reg,
                                                fechaIni: dateStart,
                                                fechaFin: dateFinish
                                            }
                                        });
                                    }
                                }
                            });
                            gridViewDataPanico = Ext.create('Ext.grid.Panel', {
                                region: 'center',
                                frame: true,
                                width: '60%',
                                title: '<center>Panicos Totales: ',
                                store: storeViewPanico,
                                features: [filters],
                                multiSelect: true,
                                viewConfig: {
                                    emptyText: 'No hay datos que Mostrar'
                                },
                                columns: [
                                    Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                    {text: 'Velocidad', width: 130, dataIndex: 'velocidad', align: 'center', xtype: 'numbercolumn',
                                        format: '0.00'},
                                    {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center'},
                                    {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center'},
                                    {text: 'Evento', width: 250, dataIndex: 'evento', align: 'center'},
                                    {text: 'Latitud', width: 250, dataIndex: 'latitud', align: 'center'},
                                    {text: 'Longitud', width: 250, dataIndex: 'longitud', align: 'center'},
                                ],
                                tbar: [{
                                        xtype: 'button',
                                        iconCls: 'icon-excel',
                                        text: 'Exportar a Excel',
                                        handler: function() {
                                            if (bandera === 1) {
                                                if (storeViewPanico.getCount() > 0) {
                                                    var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                    var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                    var tiLetra = 'Calibri';
                                                    var table_div = "<meta charset='UTF-4'><body>" +
                                                            "<font face='" + tiLetra + "'><table>" +
                                                            "<tr><th colspan='7'>PANICOS DE : " + persona + "</th></tr>" +
                                                            "<tr><th colspan='7'>DESDE" + dateStart + "HASTA" + dateFinish + "</th></tr>" +
                                                            "<tr></tr>";
                                                    table_div += "<tr>";
                                                    table_div += "<th align=left>EMPRESA</th>";
                                                    table_div += "<th align=left>FECHA </th>";
                                                    table_div += "<th align=left>HORA</th>";
                                                    table_div += "<th align=left>EVENTO </th>";
                                                    table_div += "<th align=left>VELOCIDAD</th>";
                                                    table_div += "<th align=left>LONGITUD</th>";
                                                    table_div += "<th align=left>LATITUD</th>";
                                                    table_div += "</tr>";
                                                    for (var i = 0; i < storeViewPanico.data.length; i++) {
                                                        table_div += "<tr>";
                                                        table_div += "<td align=lef>" + empresaNom + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.fecha + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.hora + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.evento + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.velocidad + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.longitud + "</td>";
                                                        table_div += "<td align=lef>" + storeViewPanico.data.items[i].data.latitud + "</td>";
                                                        table_div += "</tr>";
                                                    }
                                                    table_div += "</table></font></body>";
                                                    var table_html = table_div.replace(/ /g, '%20');
                                                    a.href = data_type + ', ' + table_html;
//setting the file name
                                                    a.download = 'Excesos de Velocidad' + '.xls';
//triggering the function
                                                    a.click();
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
                            var tabExcesos = Ext.create('Ext.container.Container', {
                                title: 'Panicos Detallados',
                                closable: true,
                                iconCls: 'icon-reset',
                                layout: 'border',
                                fullscreen: true,
                                height: 485,
                                width: 2000,
                                region: 'center',
                                items: [gridDataExcesos, gridViewDataPanico]
                            });
                            panelTabMapaAdmin.add(tabExcesos);
                            panelTabMapaAdmin.setActiveTab(tabExcesos);
                            winPanico.hide();
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
            }

            , {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    winPanico.hide();
                }
            }]
    });
});
function showWinPanicosDaily() {
    if (!winPanico) {
        winPanico = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Panicos Totales',
            iconCls: 'icon-reset',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formPanico
        });
    }
    formPanico.getForm().reset();
    cbxEmpresasBDPanico.disable();
    winPanico.show();
}
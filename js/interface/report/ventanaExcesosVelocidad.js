var formExcesosVelocidad;
var winExcesosVelocidad;
var bandera = 0;
var storeViewExcesosVelocidad;
var dateStart;
var dateFinish;
var persona;
var gridViewDataExcesos;
var gridViewDataExcesosTotal;
var gridViewDataExcesosGeneral;
var storeViewExcesosVelocidadTotal;
var storeDataExcesosD;
var empresa = 1;
var cbxEmpresasBDExcesos;
Ext.onReady(function() {
    storeViewExcesosVelocidad = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getViewExcesosVelocidad.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fecha', 'hora', 'evento', 'latitud', 'longitud', 'velocidad']
    });

    cbxEmpresasBDExcesos = Ext.create('Ext.form.ComboBox', {
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
                empresa = records[0].data.id;
            }
        }
    });
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniExcesos',
        name: 'fechaIniExcesos',
        value: new Date(),
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
    formExcesosVelocidad = Ext.create('Ext.form.Panel', {
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
                                        cbxEmpresasBDExcesos.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasBDExcesos.enable();
                                        empresa = cbxEmpresasBDExcesos.getValue();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDExcesos,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    panelButtons,
                ]
            }, 
            {
                xtype: 'fieldset',
                title: 'Opciones de Reporte',
                width: '100%',
                layout: 'anchor',
                margin: '10 0 0 0',
                defaults: {
                    anchor: '100%',
                    padding: '0 0 0 50'
                },
                items: [{
                        xtype: 'checkboxgroup',
                        items: [{
                                checked: true,
                                boxLabel: 'Detallado',
                                name: 'isDetallado'
                            }, {
                                boxLabel: ' General',
                                name: 'isGeneral'
                            }]
                    }]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    var isDetallado = this.up('form').down('[name=isDetallado]').getValue();
                    var isGeneral = this.up('form').down('[name=isGeneral]').getValue();
                    dateStart = dateIni.getRawValue();
                    dateFinish = dateFin.getRawValue();
                    var form = formExcesosVelocidad.getForm();
                    if (form.isValid()) {
                        if (isDetallado) {
                            form.submit({
                                url: 'php/interface/report/getExcesosVelocidad.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    idCompanyExcesos: empresa,
                                },
                                success: function(form, action) {
                                    console.log(action.result.data);
                                    persona;
                                    gridViewDataExcesos;
                                    var storeDataExcesos = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['empresaExceso', 'personaExceso', 'idEquipoExceso', 'placaExceso', 'cantidadExceso']
                                    });
                                    var gridDataExcesos = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Excesos de Velocidad Totales: ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                        store: storeDataExcesos,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Empresa', width: 150, dataIndex: 'empresaExceso', align: 'center'},
                                            {text: 'Placa', width: 100, dataIndex: 'placaExceso', align: 'center'},
                                            {text: 'Cantidad', width: 100, dataIndex: 'cantidadExceso', align: 'center'},
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
                                                                "<tr><th colspan='7'>Excesos de Velocidad" + "</th></tr>" +
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
                                                                table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.empresaExceso + "</td>";
                                                            if (h1)
                                                                table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.personaExceso + "</td>";
                                                            if (h3)
                                                                table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.placaExceso + "</td>";
                                                            if (h5)
                                                                table_div += "<td align=lef>" + storeDataExcesos.data.items[i].data.cantidadExceso + "</td>";
                                                            table_div += "</tr>";
                                                        }
                                                        ;
                                                        table_div += "</table></font></body>";
                                                        var table_html = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_html;
//setting the file name
                                                        a.download = 'Excesos Velocidad' + dateStart + '_' + dateFinish + '.xls';
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
                                                var reg = record.get('idEquipoExceso');
                                                var persona = record.get('personaExceso');
                                                bandera = 1;
                                                gridViewDataExcesos.setTitle('<center>Vista de Excesos de Velocidad: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                                storeViewExcesosVelocidad.load({
                                                    params: {
                                                        idEquipo: reg,
                                                        fechaIni: dateStart,
                                                        fechaFin: dateFinish
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataExcesos = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Excesos de Velocidad Totales: ',
                                        store: storeViewExcesosVelocidad,
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
                                                        if (storeViewExcesosVelocidad.getCount() > 0) {
                                                            var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                            var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                            var tiLetra = 'Calibri';
                                                            var table_div = "<meta charset='UTF-4'><body>" +
                                                                    "<font face='" + tiLetra + "'><table>" +
                                                                    "<tr><th colspan='7'>EXCESOS DE VELOCIDAD DE: " + persona + "</th></tr>" +
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
                                                            for (var i = 0; i < storeViewExcesosVelocidad.data.length; i++) {
                                                                table_div += "<tr>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.empresa + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.fecha + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.hora + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.evento + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.velocidad + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.longitud + "</td>";
                                                                table_div += "<td align=lef>" + storeViewExcesosVelocidad.data.items[i].data.latitud + "</td>";
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
                                        title: 'Excesos de Velocidad Detallados',
                                        closable: true,
                                        iconCls: 'icon-exceso-vel',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataExcesos, gridViewDataExcesos]
                                    });
                                    panelTabMapaAdmin.add(tabExcesos);
                                    panelTabMapaAdmin.setActiveTab(tabExcesos);
                                    winExcesosVelocidad.hide();
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
                    if (isGeneral) {
                        form.submit({
                            url: 'php/interface/report/getReporteGeneralVelocidad.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompanyExcesosDT: empresa,
                                fechaIniExcesos: dateIni,
                                fechaFinExcesos: dateFin
                            },
                            success: function(form, action) {
                                storeViewExcesosVelocidadTotal = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['vehiculo',
                                        'persona',
                                        'empresa',
                                        'placa:',
                                        'totalCant',
                                        'totalVel', 'promedio']
                                });
                                bandera = 1;
                                gridViewDataExcesosGeneral = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Reporte Excesos de Velocidad Totales: ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                    store: storeViewExcesosVelocidadTotal,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Empresa', width: 250, dataIndex: 'empresa', align: 'center'},
                                        {text: 'Persona', width: 300, dataIndex: 'persona', align: 'center'},
                                        {text: 'Placa', width: 150, dataIndex: 'placa', align: 'center'},
                                        {text: 'Cantidad Excesos', width: 150, dataIndex: 'totalCant', align: 'center'},
                                        {text: 'Total Velocidad', width: 150, dataIndex: 'totalVel', align: 'center'},
                                        {text: 'Velocidad Promedio', width: 150, dataIndex: 'promedio', align: 'center'}

                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function() {
                                                if (bandera === 1) {
                                                    if (storeViewExcesosVelocidadTotal.getCount() > 0) {
                                                        var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                        var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                        var tiLetra = 'Calibri';
                                                        var table_div = "<meta charset='UTF-4'><body>" +
                                                                "<font face='" + tiLetra + "'><table>" +
                                                                "<tr><th colspan='7'>EXCESOS DE VELOCIDAD GENERALES" + "</th></tr>" +
                                                                "<tr><th colspan='7'>DESDE " + dateStart + " HASTA " + dateFinish + "</th></tr>" +
                                                                "<tr></tr>";
                                                        table_div += "<tr>";
                                                        table_div += "<th align=left>EMPRESA</th>";
                                                        table_div += "<th align=left>PERSONA </th>";
                                                        table_div += "<th align=left>PLACA</th>";
                                                        table_div += "<th align=left>CANTIDAD DE EXCESOS VELOCIDADES</th>";
                                                        table_div += "<th align=left>CANTIDAD DE VELOCIDADES</th>";
                                                        table_div += "<th align=left>VELOCIDAD PROMEDIO</th>";
                                                        table_div += "</tr>";
                                                        for (var i = 0; i < storeViewExcesosVelocidadTotal.data.length; i++) {
                                                            table_div += "<tr>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.empresa + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.persona + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.placa + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.totalCant + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.totalVel + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.promedio + "</td>";

                                                            table_div += "</tr>";
                                                        }
                                                        table_div += "</table></font></body>";
                                                        var table_html = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_html;
//setting the file name
                                                        a.download = 'Excesos de Velocidad General' + '.xls';
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
                                var tabExcesos1 = Ext.create('Ext.container.Container', {
                                    title: 'Excesos de Velocidad Generales',
                                    closable: true,
                                    iconCls: 'icon-exceso-vel',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridViewDataExcesosGeneral]
                                });
                                panelTabMapaAdmin.add(tabExcesos1);
                                panelTabMapaAdmin.setActiveTab(tabExcesos1);
                                winExcesosVelocidad.hide();
                            }, failure: function(form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: action.result.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }});
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
                    winExcesosVelocidad.hide();
                }
            }]
    });
});
function showWinExcesosDaily() {
    if (!winExcesosVelocidad) {
        winExcesosVelocidad = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Excesos de Velocidad Totales',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formExcesosVelocidad
        });
    }
    formExcesosVelocidad.getForm().reset();
    cbxEmpresasBDExcesos.disable();
    winExcesosVelocidad.show();
}
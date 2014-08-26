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
var limiteIni;
var limiteFin;
var timeIni1;
var timeFin1;
var reporteporlimite;
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
//        value: 1,
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
        blankText: 'Este campo es Obligatorio',
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: '   Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinExcesos',
        name: 'fechaFinExcesos',
        vtype: 'daterange',
        value: new Date(),
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        startDateField: 'fechaIniExcesos',
        emptyText: 'Fecha Final...'
    });
    timeIni1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        value: '00:01',
        minValue: 'horaFin',
        maxValue: 'horaFin',
        endDateField: 'horaFin',
        invalidText: 'Hora inválida',
        editable: false,
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'Hora Inicial...'
    });
    timeFin1 = Ext.create('Ext.form.field.Time', {
        fieldLabel: '   Hasta las',
        name: 'horaFin',
        format: 'H:i',
        editable: false,
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        value: '23:59',
        emptyText: 'Hora Final...'
    });
    limiteIni = Ext.create('Ext.form.field.Number', {
        fieldLabel: 'Limite Inicial',
        name: 'limiIni',
        minValue: 0,
        minText: 'El valor no puede ser negativo',
        maxValue: 'limiFin',
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'limite Inicial...'
    });
    limiteFin = Ext.create('Ext.form.field.Number', {
        fieldLabel: 'Limite Final',
        name: 'limiFin',
        id: 'limiFin',
        minValue: 0,
        minText: 'El valor no puede ser negativo',
        maxValue: 120,
        maxText: 'El maximo valor es de 120',
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'limite Final...'
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
                items: [
                    cbxEmpresasBDExcesos
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [{layout: 'hbox', items: [dateIni, dateFin]
                    }, {layout: 'hbox', items: [timeIni1, timeFin1]
                    }, panelButtons]
            }, {
                xtype: 'fieldset',
                title: 'Opciones de Reporte',
                width: '100%',
                layout: 'anchor',
                margin: '10 0 0 0',
                defaults: {
                    anchor: '100%',
                    padding: '0 0 0 0'
                },
                items: [{
                        xtype: 'checkboxgroup',
                        items: [{boxLabel: 'POR LIMITES', name: 'porlimite', inputValue: '1'}],
                        listeners: {
                            change: function(field, newValue) {
                                if (parseInt(newValue['porlimite']) === 1) {
                                    reporteporlimite = 1;
                                    limiteIni.enable();
                                    limiteFin.enable();
                                } else {
                                    reporteporlimite = 0;
                                    limiteIni.disable();
                                    limiteFin.disable();
                                }
                            }
                        }
                    }, {layout: 'hbox', margin: '10 10 20 0', width: '100%', items: [limiteIni, limiteFin]
                    }]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    if (formExcesosVelocidad.getForm().isValid()) {
                        dateStart = dateIni.getRawValue();
                        dateFinish = dateFin.getRawValue();
                        obtenerExcesoVelocidad();
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
                    }
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
            width: 630,
            height: 380,
            closeAction: 'hide',
            plain: false,
            items: formExcesosVelocidad
        });
    }
    formExcesosVelocidad.getForm().reset();
//    cbxEmpresasBDExcesos
    limiteIni.disable();
    limiteFin.disable();
    winExcesosVelocidad.show();
}
function obtenerExcesoVelocidad() {
    var form = formExcesosVelocidad.getForm();
    if (reporteporlimite === 1) {
        form.submit({
            url: 'php/interface/report/getExcesosVelocidad.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                idCompanyExcesos: empresa,
                fechaIni: dateStart,
                fechaFin: dateFinish,
                horaIni: timeIni1,
                horaFin: timeFin1,
                limiIni: limiteIni,
                limiFin: limiteFin
            },
            failure: function(form, action) {
                Ext.MessageBox.show({
                    title: 'Información',
                    msg: action.result.message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
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
                    fields: ['personaExceso', 'placaExceso', 'idEquipoExceso', 'equipoExceso', 'total']
                });
                var gridDataExcesos = Ext.create('Ext.grid.Panel', {
                    region: 'west',
                    frame: true,
                    width: '40%',
                    title: '<center>Reporte de velocidades ' + '<br>Por limites: entre ( ' + limiteIni.getRawValue() + ' - ' + limiteFin.getRawValue() + ') km</center>',
                    store: storeDataExcesos,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                        {text: 'Persona', width: 250, dataIndex: 'personaExceso', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
                        {text: 'Placa', width: 130, dataIndex: 'placaExceso', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoExceso', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'total', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
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
//                panelMapaAdmin.add(tabExcesos);
//                panelMapaAdmin.setActiveTab(tabExcesos);
                winExcesosVelocidad.hide();
            }

        });
    }
//    if (isGeneral) {
//        form.submit({
//            url: 'php/interface/report/getReporteGeneralVelocidad.php',
//            waitTitle: 'Procesando...',
//            waitMsg: 'Obteniendo Información',
//            params: {
//                idCompanyExcesosDT: empresa,
//                fechaIniExcesos: dateIni,
//                fechaFinExcesos: dateFin
//            },
//            success: function(form, action) {
//                storeViewExcesosVelocidadTotal = Ext.create('Ext.data.JsonStore', {
//                    data: action.result.data,
//                    proxy: {
//                        type: 'ajax',
//                        reader: 'array'
//                    },
//                    fields: ['vehiculo',
//                        'persona',
//                        'empresa',
//                        'placa:',
//                        'totalCant',
//                        'totalVel', 'promedio']
//                });
//                bandera = 1;
//                gridViewDataExcesosGeneral = Ext.create('Ext.grid.Panel', {
//                    region: 'center',
//                    frame: true,
//                    width: '100%',
//                    title: '<center>Reporte Excesos de Velocidad Totales: ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
//                    store: storeViewExcesosVelocidadTotal,
//                    features: [filters],
//                    multiSelect: true,
//                    viewConfig: {
//                        emptyText: 'No hay datos que Mostrar'
//                    },
//                    columns: [
//                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
//                        {text: 'Empresa', width: 250, dataIndex: 'empresa', align: 'center'},
//                        {text: 'Persona', width: 300, dataIndex: 'persona', align: 'center'},
//                        {text: 'Placa', width: 150, dataIndex: 'placa', align: 'center'},
//                        {text: 'Cantidad Excesos', width: 150, dataIndex: 'totalCant', align: 'center'},
//                        {text: 'Total Velocidad', width: 150, dataIndex: 'totalVel', align: 'center'},
//                        {text: 'Velocidad Promedio', width: 150, dataIndex: 'promedio', align: 'center'}
//
//                    ],
//                    tbar: [{
//                            xtype: 'button',
//                            iconCls: 'icon-excel',
//                            text: 'Exportar a Excel',
//                            handler: function() {
//                                if (bandera === 1) {
//                                    if (storeViewExcesosVelocidadTotal.getCount() > 0) {
//                                        var a = document.createElement('a');
////getting data from our div that contains the HTML table
//                                        var data_type = 'data:application/vnd.ms-excel';
////var table_div = document.getElementById('exportar');
////var table_html = table_div.outerHTML.replace(/ /g, '%20');
//                                        var tiLetra = 'Calibri';
//                                        var table_div = "<meta charset='UTF-4'><body>" +
//                                                "<font face='" + tiLetra + "'><table>" +
//                                                "<tr><th colspan='7'>EXCESOS DE VELOCIDAD GENERALES" + "</th></tr>" +
//                                                "<tr><th colspan='7'>DESDE " + dateStart + " HASTA " + dateFinish + "</th></tr>" +
//                                                "<tr></tr>";
//                                        table_div += "<tr>";
//                                        table_div += "<th align=left>EMPRESA</th>";
//                                        table_div += "<th align=left>PERSONA </th>";
//                                        table_div += "<th align=left>PLACA</th>";
//                                        table_div += "<th align=left>CANTIDAD DE EXCESOS VELOCIDADES</th>";
//                                        table_div += "<th align=left>CANTIDAD DE VELOCIDADES</th>";
//                                        table_div += "<th align=left>VELOCIDAD PROMEDIO</th>";
//                                        table_div += "</tr>";
//                                        for (var i = 0; i < storeViewExcesosVelocidadTotal.data.length; i++) {
//                                            table_div += "<tr>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.empresa + "</td>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.persona + "</td>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.placa + "</td>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.totalCant + "</td>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.totalVel + "</td>";
//                                            table_div += "<td align=lef>" + storeViewExcesosVelocidadTotal.data.items[i].data.promedio + "</td>";
//
//                                            table_div += "</tr>";
//                                        }
//                                        table_div += "</table></font></body>";
//                                        var table_html = table_div.replace(/ /g, '%20');
//                                        a.href = data_type + ', ' + table_html;
////setting the file name
//                                        a.download = 'Excesos de Velocidad General' + '.xls';
////triggering the function
//                                        a.click();
//                                    }
//                                } else {
//                                    Ext.MessageBox.show({
//                                        title: 'Error...',
//                                        msg: 'No hay datos en la Lista a Exportar',
//                                        buttons: Ext.MessageBox.OK,
//                                        icon: Ext.MessageBox.ERROR
//                                    });
//                                }
//                            }
//                        }]
//                });
//                var tabExcesos1 = Ext.create('Ext.container.Container', {
//                    title: 'Excesos de Velocidad Generales',
//                    closable: true,
//                    iconCls: 'icon-exceso-vel',
//                    layout: 'border',
//                    fullscreen: true,
//                    height: 485,
//                    width: 2000,
//                    region: 'center',
//                    items: [gridViewDataExcesosGeneral]
//                });
//                panelMapaAdmin.add(tabExcesos1);
//                panelMapaAdmin.setActiveTab(tabExcesos1);
//                winExcesosVelocidad.hide();
//            }, failure: function(form, action) {
//                Ext.MessageBox.show({
//                    title: 'Información',
//                    msg: action.result.message,
//                    buttons: Ext.MessageBox.OK,
//                    icon: Ext.MessageBox.INFO
//                });
//            }});
//    }
////                    else {
////                        Ext.MessageBox.show({
////                            title: 'Información',
////                            msg: '<center>No existen datos de Excesos de Velocidad<br> en estas fechas<center>',
////                            buttons: Ext.MessageBox.OK,
////                            icon: Ext.MessageBox.INFO
////                        });
////                    }

}

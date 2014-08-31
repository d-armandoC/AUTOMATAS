
var formularioMantenimientoDetallado;
var VentanaMantenimiento;
var banderaMantenimiento = 0;
var storeViewMantenimiento;
var fechaInicio;
var fechaFinal;
var personaMantenimiento;
var gridViewDataMantenimiento;
var storeViewExcesosMantenimiento;
var storeDataMantenimiento;
var empresaMantenimiento = 1;
var cbxEmpresasMantenimiento;
Ext.onReady(function() {
    storeViewMantenimiento = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getREporteMantenimientoDetallado.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['placa', 
            'marca', 
            'estendar', 
            'idTipoServicio']
    });

    cbxEmpresasMantenimiento = Ext.create('Ext.form.ComboBox', {
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
                empresaMantenimiento = records[0].data.id;
            }
        }
    });
    
    var fechaIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaInimanten',
        name: 'fechaInimanten',
        value: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var fechaFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinManten',
        name: 'fechaFinManten',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaInimanten',
        emptyText: 'Fecha Final...'
    });
    var btn_Hoy = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            fechaIni.setValue(nowDate);
            fechaFin.setValue(nowDate);
        }
    });
    var bt_Hayer = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIni.setValue(yestDate);
            fechaFin.setValue(yestDate);
        }
    });
    var panel_Botones = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btn_Hoy, bt_Hayer]
    });
    formularioMantenimientoDetallado = Ext.create('Ext.form.Panel', {
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
                                        empresaMantenimiento = 1;
                                        cbxEmpresasMantenimiento.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasMantenimiento.enable();
                                        empresaMantenimiento = cbxEmpresasMantenimiento.getValue();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasMantenimiento,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIni,
                    fechaFin,
                    panel_Botones
                ]
            }, {
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
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    var isDetallado = this.up('form').down('[name=isDetallado]').getValue();
                    var isGeneral = this.up('form').down('[name=isGeneral]').getValue();
                    fechaInicio = fechaIni.getRawValue();
                    fechaFinal = fechaFin.getRawValue();
                    var form = formularioMantenimientoDetallado.getForm();
                    if (form.isValid()) {
                        if (isDetallado) {
                            console.log('Detallado');
                            form.submit({
                                url: 'php/interface/report/getObtenerReportGeneralDetallado.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
//                                params: {
//                                    idCompanyExcesos: empresaMantenimiento,
//                                },
                                success: function(form, action) {
                                    console.log(action.result.countByMantenimiento);
                                    personaMantenimiento;
                                    gridViewDataMantenimiento;
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.countByMantenimiento,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                fields: ['id_vehiculo', 'empresa', 'vehiculo', 'total','descripSoat' ,'fechaSoatVenc','descripMatricula','fechaMatriculaVenc','descripSeguro','fechaSeguroVenc']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Mantenimientos Totales: ' + '<br>Desde: ' + fechaIni + ' | Hasta: ' + fechaFin + '</center>',
                                        store: storeDataReporteDetallado,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
          //'descripSoat' ,'fechaSoatVenc','descripMatricula','fechaMatriculaVenc','descripSeguro','fechaSeguroVenc'                                            
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Empresa', width: 150, dataIndex: 'empresa', align: 'center'},
                                            {text: 'Vehiculo', width: 100, dataIndex: 'vehiculo', align: 'center'},
                                            {text: 'Cant Mantenimientos', width: 100, dataIndex: 'total', align: 'center'},
                                            {text: 'SOAT Fecha venc.', width: 150, dataIndex: 'fechaSoatVenc', align: 'center', renderer: formatTipoSeguro},
                                            {text: 'MATRICULA Fecha venc.', width: 170, dataIndex: 'fechaMatriculaVenc', align: 'center', renderer: formatTipoSeguro},
                                            {text: 'SEGURO Fecha venc.', width: 160, dataIndex: 'fechaSeguroVenc', align: 'center', renderer: formatTipoSeguro}
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
                                                                    "<tr><th colspan='7'>Desde " + fechaIni + " hasta " + fechaFin + "</th></tr>" +
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
                                                            a.download = 'Mantenimiento Total' + fechaIni + '_' + fechaFin + '.xls';
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
                                                banderaMantenimiento = 1;
                                                gridViewDataMantenimiento.setTitle('<center>Lista de Mnatenimientos por Vehicuculo <br>Empresa: ' + reg + ' Desde: ' + fechaIni + ' Hasta:' + fechaFin + '</center>');
                                                storeViewMantenimiento.load({
                                                    params: {
                                                        idVehiculo: id_vehiculo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Servicios Mantenimientos Detallado: ',
                                        store: storeViewMantenimiento,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Placa', width: 130, dataIndex: 'placa', align: 'center'},
                                            {text: 'Marca', width: 200, dataIndex: 'marca', align: 'center'},
                                            {text: 'Estandar', width: 200, dataIndex: 'estandar', align: 'center'},
                                            {text: 'Tipo Servicio', width: 200, dataIndex: 'idTipoServicio', align: 'center', renderer: formatTipoServicio}
                                        ],
                                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function() {
                                                    if (banderaMantenimiento === 1) {
                                                        if (storeViewMantenimiento.getCount() > 0) {
                                                             if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                            var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                            var tiLetra = 'Calibri';
                                                            var table_div = "<meta charset='UTF-8'><body>" +
                                                                    "<font face='" + tiLetra + "'><table>" +
                                                                    "<tr><th colspan='7'>MANTENIMIENTO POR VEHÍCULO: " + personaMantenimiento + "</th></tr>" +
                                                                    "<tr><th colspan='7'>DESDE" + fechaIni + "HASTA" + fechaFin + "</th></tr>" +
                                                                    "<tr></tr>";
                                                            table_div += "<tr>";
                                                            table_div += "<th align=left>PLACA</th>";
                                                            table_div += "<th align=left>MARCA </th>";
                                                            table_div += "<th align=left>ESTANDAR</th>";
                                                            table_div += "<th align=left>TIPO SERVICIO </th>";
                                                            table_div += "</tr>";
                                                            for (var i = 0; i < storeViewMantenimiento.data.length; i++) {
                                                                table_div += "<tr>";
                                                                table_div += "<td align=lef>" + storeViewMantenimiento.data.items[i].data.placa + "</td>";
                                                                table_div += "<td align=lef>" + storeViewMantenimiento.data.items[i].data.marca + "</td>";
                                                                table_div += "<td align=lef>" + storeViewMantenimiento.data.items[i].data.estandar + "</td>";
                                                                table_div += "<td align=lef>" + storeViewMantenimiento.data.items[i].data.idTipoServicio + "</td>";
                                                                table_div += "</tr>";
                                                            }
                                                            table_div += "</table></font></body>";
                                                            var table_html = table_div.replace(/ /g, '%20');
                                                            a.href = data_type + ', ' + table_html;
//setting the file name
                                                            a.download = 'Mantenimiento por vehiculo' + fechaIni + '_' + fechaFin + '.xls';
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
                                        iconCls: 'icon-servicios',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataMantenimiento]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    VentanaMantenimiento.hide();
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
                                idCompanyExcesosDT: empresaMantenimiento,
                                fechaIniExcesos: fechaIni,
                                fechaFinExcesos: fechaFin
                            },
                            success: function(form, action) {
                                storeViewExcesosMantenimiento = Ext.create('Ext.data.JsonStore', {
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
                                banderaMantenimiento = 1;
                                gridViewDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Reporte Excesos de Velocidad Totales: ' + '<br>Desde: ' + fechaIni + ' | Hasta: ' + fechaFin + '</center>',
                                    store: storeViewExcesosMantenimiento,
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
                                            text: 'Exportaraaaaaaaaaaaaaa a Excel',
                                            handler: function() {
                                                if (banderaMantenimiento === 1) {
                                                    if (storeViewExcesosMantenimiento.getCount() > 0) {
                                                        var a = document.createElement('a');
//getting data from our div that contains the HTML table
                                                        var data_type = 'data:application/vnd.ms-excel';
//var table_div = document.getElementById('exportar');
//var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                                        var tiLetra = 'Calibri';
                                                        var table_div = "<meta charset='UTF-4'><body>" +
                                                                "<font face='" + tiLetra + "'><table>" +
                                                                "<tr><th colspan='7'>EXCESOS DE VELOCIDAD GENERALES" + "</th></tr>" +
                                                                "<tr><th colspan='7'>DESDE " + fechaIni + " HASTA " + fechaFin + "</th></tr>" +
                                                                "<tr></tr>";
                                                        table_div += "<tr>";
                                                        table_div += "<th align=left>EMPRESA</th>";
                                                        table_div += "<th align=left>PERSONA </th>";
                                                        table_div += "<th align=left>PLACA</th>";
                                                        table_div += "<th align=left>CANTIDAD DE EXCESOS VELOCIDADES</th>";
                                                        table_div += "<th align=left>CANTIDAD DE VELOCIDADES</th>";
                                                        table_div += "<th align=left>VELOCIDAD PROMEDIO</th>";
                                                        table_div += "</tr>";
                                                        for (var i = 0; i < storeViewExcesosMantenimiento.data.length; i++) {
                                                            table_div += "<tr>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.empresa + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.persona + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.placa + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.totalCant + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.totalVel + "</td>";
                                                            table_div += "<td align=lef>" + storeViewExcesosMantenimiento.data.items[i].data.promedio + "</td>";

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
                                    iconCls: 'icon-servicios',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridViewDataMantenimiento]
                                });
                                panelMapaAdmin.add(tabExcesos1);
                                panelMapaAdmin.setActiveTab(tabExcesos1);
                                VentanaMantenimiento.hide();
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
                    VentanaMantenimiento.hide();
                }
            }]
    });
});
function showWinMantenimientoGeneral() {
    if (!VentanaMantenimiento) {
        VentanaMantenimiento = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Mantenimiento Detallado',
            iconCls: 'icon-servicios',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formularioMantenimientoDetallado
        });
    }
    formularioMantenimientoDetallado.getForm().reset();
    cbxEmpresasMantenimiento.disable();
    VentanaMantenimiento.show();
}
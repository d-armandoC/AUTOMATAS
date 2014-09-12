var contenedorwinEnerg;
var cbxEmpreEnergDese;
var storeDataDetalladoEnegDes;
var gridViewDataEnegDesDetallado;
var winEnerg;
//VARIABLE PARA REALIZAR EL TIPO DE REPORTE
var tipoReportEneg;
//VARIABLE PARA REALIZAR LAS CONSULTAS
var dateIniEnerDes;
var dateFinEnerDes;
var horaIniEnerDes;
var horaFinEnerDes;
Ext.onReady(function() {
    storeDataDetalladoEnegDes = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/energizaDesenegizar/getReportEnergizacionDes.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fechaED', 'horaED', 'eventoED', 'velocidadED', 'latitudED', 'longitudED', 'bateriaED', 'gsmED', 'gpsED', 'direccionED']
    });
    cbxEmpreEnergDese = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresaED',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
    });
    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniED',
        name: 'fechaIni',
        // vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        endDateField: 'fechaFinEnc',
        emptyText: 'Fecha Inicial...'
    });
    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinED',
        name: 'fechaFin',
        //vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniEnc',
        emptyText: 'Fecha Final...'
    });
    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniED',
        format: 'H:i',
        value: '00:01',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });
    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEnc',
        format: 'H:i',
        value: '23:59',
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
    contenedorwinEnerg = Ext.create('Ext.form.Panel', {
        frame: true,
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
            width: 220
        },
        items: [{
                margin: '10 0 0 0',
                xtype: 'fieldset',
                title: '<b>Tipo Reporte</b>',
                width: 480,
                height: 80,
                items: [{
                        xtype: 'radiogroup',
// fieldLabel: ' ',
// Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'General ', name: 'tipoRepED', inputValue: '1'},
                            {boxLabel: 'Por Organización', name: 'tipoRepED', inputValue: '2', checked: true},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['tipoRepED'])) {
                                    case 1:
                                        tipoReportEneg = 1;
                                        cbxEmpreEnergDese.disable();
                                        break;
                                    case 2:
                                        tipoReportEneg = 2;
                                        cbxEmpreEnergDese.enable();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpreEnergDese,
                ]
            }, {
                margin: '20 0 0 10',
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateIni,
                            timeIni
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateFin,
                            timeFin
                        ]
                    }]
            },
            panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinEnerg.getForm().isValid()) {
                        dateIniEnerDes = dateIni.getRawValue();
                        dateFinEnerDes = dateFin.getRawValue();
                        horaIniEnerDes = timeIni.getRawValue();
                        horaFinEnerDes = timeFin.getRawValue();
                        empresEnerD = cbxEmpreEnergDese.getRawValue();
                        obtenerRepEnergDes();
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEnerg
            }]
    });
});
function limpiar_datosEnerg() {
    contenedorwinEnerg.getForm().reset();
    if (winEnerg) {
        winEnerg.hide();
    }
}

function ventanaEnegizacion() {
    if (!winEnerg) {
        winEnerg = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Energizacion y desenegizacion',
//            iconCls: 'icon-on-off',
            resizable: false,
            width: 510,
            height: 320,
            closeAction: 'hide',
            plain: false,
            items: contenedorwinEnerg,
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosEnerg();
                }
            }
        });
    }
    contenedorwinEnerg.getForm().reset();
    winEnerg.show();
}

function obtenerRepEnergDes() {
    var form = contenedorwinEnerg.getForm();
    if (tipoReportEneg === 1) {//reporte de tipo general
        form.submit({
            url: 'php/interface/report/energizaDesenegizar/getReportGeneralEnergDes.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                fechaIniED: dateIniEnerDes, fechaFinED: dateFinEnerDes,
                horaIniED: horaIniEnerDes, horaFinED: horaFinEnerDes
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

                var storeDataGeneralEnergia = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['empresaEneDes', 'personaEneDes', 'placaEneDes', 'idEquipoEneDes', 'equipoEneDes', 'totalEneDes']
                });
                var gridGeneralEneDes = Ext.create('Ext.grid.Panel', {
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte General de encendido y apagado ' + '<br>Fechas:' + dateIniEnerDes + ' / ' + dateFinEnerDes +
                            '<br>Horas:' + horaIniEnerDes + ' / ' + horaFinEnerDes + '</center>',
                    store: storeDataGeneralEnergia,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Empresa', width: 290, dataIndex: 'empresaEneDes', align: 'center'},
                        {text: 'Persona', width: 290, dataIndex: 'personaEneDes', align: 'center'},
                        {text: 'Placa', width: 130, dataIndex: 'placaEneDes', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoEneDes', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'totalEneDes', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4;
                                h0, h1 = h2 = h3 = h4 = true;
                                if (storeDataGeneralEnergia.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>ReporteGeneral de Conexion y desconexion de Energia : </th></tr>" +
                                                "<tr><th colspan='7' Fecha" + dateIniEncApag + " / " + dateFinEncApag + " Horas: " + horaIniEncApag + " / " + horaFinEncApag + ") km</th></tr>" +
                                                "<tr></tr>";
                                        table_div += "<tr>";
                                        if (h0)
                                            table_div += "<th align=left>Empresa</th>";
                                        if (h1)
                                            table_div += "<th align=left>Persona</th>";
                                        if (h2)
                                            table_div += "<th align=left>Placa</th>";
                                        if (h3)
                                            table_div += "<th align=left>Equipo</th>";
                                        if (h4)
                                            table_div += "<th align=left>Cantidad</th>";
                                        table_div += "</tr>";

                                        for (var i = 0; i < storeDataGeneralEnergia.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataGeneralEnergia.data.items[i].data.empresaEneDes + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataGeneralEnergia.data.items[i].data.personaEneDes + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataGeneralEnergia.data.items[i].data.placaEneDes + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataGeneralEnergia.data.items[i].data.equipoEneDes + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataGeneralEnergia.data.items[i].data.totalEneDes + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEnegiaGeneral.xls';
                                        //triggering the function
                                        a.click();

                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: '<center>El Servicio para este navegador no esta disponible<br>Usar un navegador como Google Chrome<center>',
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
                        }],
                    listeners: {
                        itemclick: function(thisObj, record, item, index, e, eOpts) {
                            var reg = record.get('idEquipoEneDes');
                            var persona = record.get('personaEneDes');
                            var estado = 1;
                            gridViewDataEnegDesDetallado.setTitle('<center>Vista detallada Conexion y desconexion de Enegía: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateIniEnerDes + ' Hasta:' + dateFinEnerDes + '</center>');
                            storeDataDetalladoEnegDes.load({
                                params: {
                                    idEquipoEnDe: reg,
                                    fechaIniEnDe: dateIniEnerDes, fechaFinEnDe: dateFinEnerDes,
                                    horaIniEnDe: horaIniEnerDes, horaFinEnDe: horaFinEnerDes
                                }
                            });

                        }
                    }
                });
                gridViewDataEnegDesDetallado = Ext.create('Ext.grid.Panel', {
                    title: '<center>Vista detallada Conexion y desconexion de Enegía:</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDataDetalladoEnegDes,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Fecha', width: 150, dataIndex: 'fechaED', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'horaED', align: 'center'},
                        {text: 'evento', width: 150, dataIndex: 'eventoED', align: 'center'},
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadED', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitudED', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitudED', align: 'center'},
                        {text: 'Bateria', width: 200, dataIndex: 'bateriaED', align: 'center'},
                        {text: 'GSM', width: 200, dataIndex: 'gsmED', align: 'center'},
                        {text: 'GPS', width: 200, dataIndex: 'gpsED', align: 'center'},
                        {text: 'Direccion', width: 200, dataIndex: 'direccionED', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4, h5, h6, h7, h8, h9;
                                h0, h1 = h2 = h3 = h4 = h5 = h6 = h7 = h8 = h9 = true;
                                if (storeDataDetalladoEnegDes.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte Detallado de conexion y desconexion de energia </th></tr>" +
                                                "<tr><th colspan='7' Fecha" + dateIniEncApag + " / " + dateFinEncApag + " Horas: " + horaIniEncApag + " / " + horaFinEncApag + ") km</th></tr>" +
                                                "<tr></tr>";
                                        table_div += "<tr>";

                                        if (h0)
                                            table_div += "<th align=left>Fecha</th>";
                                        if (h1)
                                            table_div += "<th align=left>Hora</th>";
                                        if (h2)
                                            table_div += "<th align=left>evento</th>";
                                        if (h3)
                                            table_div += "<th align=left>Velocidad</th>";
                                        if (h4)
                                            table_div += "<th align=left>Latitud</th>";
                                        if (h5)
                                            table_div += "<th align=left>Longitud</th>";
                                        if (h6)
                                            table_div += "<th align=left>Bateria</th>";
                                        if (h7)
                                            table_div += "<th align=left>GSM</th>";
                                        if (h8)
                                            table_div += "<th align=left>GPS</th>";
                                        if (h9)
                                            table_div += "<th align=left>Direccion</th>";

                                        table_div += "</tr>";

                                        for (var i = 0; i < storeDataDetalladoEnegDes.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.fechaED + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.horaED + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.eventoED + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.velocidadED + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.latitudED + "</td>";
                                            if (h5)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.longitudED + "</td>";
                                            if (h6)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.bateriaED + "</td>";
                                            if (h7)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.gsmED + "</td>";
                                            if (h8)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.gpsED + "</td>";
                                            if (h9)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.direccionED + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;
                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEnergiaDesDetallado.xls';
                                        //triggering the function
                                        a.click();

                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: '<center>El Servicio para este navegador no esta disponible<br>Usar un navegador como Google Chrome<center>',
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
                        }]
                });
                var tabEnergizarDes = Ext.create('Ext.container.Container', {
                    title: 'Conexion y desconexion de Energia',
                    closable: true,
//                    iconCls: 'icon-on-off',
                    layout: 'border',
                    fullscreen: true,
                    height: 485,
                    width: 2000,
                    region: 'center',
                    items: [gridGeneralEneDes, gridViewDataEnegDesDetallado]
                });
                panelTabMapaAdmin.add(tabEnergizarDes);
                panelTabMapaAdmin.setActiveTab(tabEnergizarDes);
                winEnerg.hide();
            }

        });
    } else { //reporte por cooperativa
        form.submit({
            url: 'php/interface/report/energizaDesenegizar/getReportCooperativaEnerDes.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                empED: empresEnerD,
                fechaIniED: dateIniEnerDes, fechaFinED: dateFinEnerDes,
                horaIniED: horaIniEnerDes, horaFinED: horaFinEnerDes
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
                var storeDataPOrCooperativaEnegia = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['personaED', 'placaED', 'idEquipoED', 'equipoED', 'totalED']
                });
                var gridGeneralEneDes = Ext.create('Ext.grid.Panel', {
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte de encendido y apagado,de la cooperativa:' + empresEnerD + '<br>Fechas:' + dateIniEnerDes + ' / ' + dateFinEnerDes +
                            '<br>Horas:' + horaIniEnerDes + ' / ' + horaFinEnerDes + '</center>',
                    store: storeDataPOrCooperativaEnegia,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Persona', width: 290, dataIndex: 'personaED', align: 'center'},
                        {text: 'Placa', width: 130, dataIndex: 'placaED', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoED', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'totalED', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4;
                                h0, h1 = h2 = h3 = h4 = true;
                                if (storeDataPOrCooperativaEnegia.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte de Encendido y Apagado de la Cooperativa: " + empresEncApag + "</th></tr>" +
                                                "<tr><th colspan='7' Fecha" + dateIniEncApag + " / " + dateFinEncApag + " Horas: " + horaIniEncApag + " / " + horaFinEncApag + ") km</th></tr>" +
                                                "<tr></tr>";
                                        table_div += "<tr>";
                                        if (h1)
                                            table_div += "<th align=left>Persona</th>";
                                        if (h2)
                                            table_div += "<th align=left>Placa</th>";
                                        if (h3)
                                            table_div += "<th align=left>Equipo</th>";
                                        if (h4)
                                            table_div += "<th align=left>Cantidad</th>";
                                        table_div += "</tr>";

                                        for (var i = 0; i < storeDataPOrCooperativaEnegia.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEnegia.data.items[i].data.personaEA + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEnegia.data.items[i].data.placaEA + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEnegia.data.items[i].data.equipoEA + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEnegia.data.items[i].data.totalEA + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEnegiaPorCooperativa.xls';
                                        //triggering the function
                                        a.click();

                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: '<center>El Servicio para este navegador no esta disponible<br>Usar un navegador como Google Chrome<center>',
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
                        }],
                    listeners: {
                        itemclick: function(thisObj, record, item, index, e, eOpts) {
                            var reg = record.get('idEquipoED');
                            var persona = record.get('personaED');
                            var estado = 1;
                            gridViewDataEnegDesDetallado.setTitle('<center>Vista detallada Conexion y desconexion de Enegía: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateIniEnerDes + ' Hasta:' + dateFinEnerDes + '</center>');
                            storeDataDetalladoEnegDes.load({
                                params: {
                                    idEquipoEnDe: reg,
                                    fechaIniEnDe: dateIniEnerDes, fechaFinEnDe: dateFinEnerDes,
                                    horaIniEnDe: horaIniEnerDes, horaFinEnDe: horaFinEnerDes
                                }
                            });

                        }
                    }
                });
                gridViewDataEnegDesDetallado = Ext.create('Ext.grid.Panel', {
                    title: '<center>Velocidades detalladas:</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDataDetalladoEnegDes,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Fecha', width: 150, dataIndex: 'fechaED', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'horaED', align: 'center'},
                        {text: 'evento', width: 150, dataIndex: 'eventoED', align: 'center'},
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadED', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitudED', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitudED', align: 'center'},
                        {text: 'Bateria', width: 200, dataIndex: 'bateriaED', align: 'center'},
                        {text: 'GSM', width: 200, dataIndex: 'gsmED', align: 'center'},
                        {text: 'GPS', width: 200, dataIndex: 'gpsED', align: 'center'},
                        {text: 'Direccion', width: 200, dataIndex: 'direccionED', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4, h5, h6, h7, h8, h9;
                                h0, h1 = h2 = h3 = h4 = h5 = h6 = h7 = h8 = h9 = true;
                                if (storeDataDetalladoEnegDes.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte Detallado de conexion y desconexion de energia </th></tr>" +
                                                "<tr><th colspan='7' Fecha" + dateIniEncApag + " / " + dateFinEncApag + " Horas: " + horaIniEncApag + " / " + horaFinEncApag + ") km</th></tr>" +
                                                "<tr></tr>";
                                        table_div += "<tr>";

                                        if (h0)
                                            table_div += "<th align=left>Fecha</th>";
                                        if (h1)
                                            table_div += "<th align=left>Hora</th>";
                                        if (h2)
                                            table_div += "<th align=left>evento</th>";
                                        if (h3)
                                            table_div += "<th align=left>Velocidad</th>";
                                        if (h4)
                                            table_div += "<th align=left>Latitud</th>";
                                        if (h5)
                                            table_div += "<th align=left>Longitud</th>";
                                        if (h6)
                                            table_div += "<th align=left>Bateria</th>";
                                        if (h7)
                                            table_div += "<th align=left>GSM</th>";
                                        if (h8)
                                            table_div += "<th align=left>GPS</th>";
                                        if (h9)
                                            table_div += "<th align=left>Direccion</th>";

                                        table_div += "</tr>";

                                        for (var i = 0; i < storeDataDetalladoEnegDes.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.fechaED + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.horaED + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.eventoED + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.velocidadED + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.latitudED + "</td>";
                                            if (h5)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.longitudED + "</td>";
                                            if (h6)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.bateriaED + "</td>";
                                            if (h7)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.gsmED + "</td>";
                                            if (h8)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.gpsED + "</td>";
                                            if (h9)
                                                table_div += "<td align=lef>" + storeDataDetalladoEnegDes.data.items[i].data.direccionED + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;
                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEnergiaDesDetallado.xls';
                                        //triggering the function
                                        a.click();

                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: '<center>El Servicio para este navegador no esta disponible<br>Usar un navegador como Google Chrome<center>',
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
                        }]
                });
                var tabExcesos = Ext.create('Ext.container.Container', {
                    title: 'Conexion y desconexion de Energia',
                    closable: true,
                    iconCls: 'icon-on-off',
                    layout: 'border',
                    fullscreen: true,
                    height: 485,
                    width: 2000,
//                    region: 'center',
                    items: [gridGeneralEneDes, gridViewDataEnegDesDetallado]
                });
                panelTabMapaAdmin.add(tabExcesos);
                panelTabMapaAdmin.setActiveTab(tabExcesos);
                winEnerg.hide();
            }

        });
    }

}


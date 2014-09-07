var contenedorwinEA;
var storeDataDetalladoOnOff;
var gridViewDataEncApagDetallado;
var cbxEmpresaEA;
var winEnc;
//VARIABLE PARA REALIZAR EL TIPO DE REPORTE
var tipoReportEnc;
//VARIABLE PARA REALIZAR LAS CONSULTAS
var dateIniEncApag;
var dateFinEncApag;
var horaIniEncApag;
var horaFinEncApag;


Ext.onReady(function() {

    storeDataDetalladoOnOff = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/encendidoApagado/getReportEncApag.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fechaEA', 'horaEA', 'eventoEA', 'velocidadEA', 'latitudEA', 'longitudEA', 'bateriaEA', 'gsmEA', 'gpsEA', 'direccionEA']
    });


    cbxEmpresaEA = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'cbxEmpresaEnc',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false
    });
    var dateInicialEA = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEnc',
        name: 'fechaIni',
//        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        endDateField: 'fechaFinEnc',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinalEA = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEnc',
        name: 'fechaFin',
//        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniEnc',
        emptyText: 'Fecha Final...'
    });
    var timeIniEA = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniEnc',
        format: 'H:i',
        value: '00:01',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });
    var timeFinEA = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEnc',
        format: 'H:i',
        value: '23:59',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });
    var todayEA = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateInicialEA.setValue(formatoFecha(nowDate));
            dateFinalEA.setValue(formatoFecha(nowDate));
            timeIniEA.setValue('00:01');
            timeFinEA.setValue('23:59');
        }
    });
    var yesterdayEA = Ext.create('Ext.button.Button', {
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
            dateInicialEA.setValue(año + "-" + mes + "-" + dia);
            dateFinalEA.setValue(año + "-" + mes + "-" + dia);
            timeIniEA.setValue('00:01');
            timeFinEA.setValue('23:59');
        }
    });
    var panelBotonesEA = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [todayEA]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterdayEA]
            }]
    });
    contenedorwinEA = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'General ', name: 'tipoRepEA', inputValue: '1'},
                            {boxLabel: 'Por Cooperativa', name: 'tipoRepEA', inputValue: '2', checked: true},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['tipoRepEA'])) {
                                    case 1:
                                        tipoReportEnc = 1;
                                        cbxEmpresaEA.disable();
                                        break;
                                    case 2:
                                        tipoReportEnc = 2;
                                        cbxEmpresaEA.enable();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresaEA,
                ]
            }, {
                margin: '20 0 0 10',
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateInicialEA,
                            timeIniEA
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateFinalEA,
                            timeFinEA
                        ]
                    }]
            },
            panelBotonesEA],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinEA.getForm().isValid()) {
                        dateIniEncApag = dateInicialEA.getRawValue();
                        dateFinEncApag = dateFinalEA.getRawValue();
                        horaIniEncApag = timeIniEA.getRawValue();
                        horaFinEncApag = timeFinEA.getRawValue();
                        empresEncApag = cbxEmpreEnergDese.getRawValue();
                        obtenerRepEncApag();
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosEnc
            }]
    });
});
function limpiar_datosEnc() {
    contenedorwinEA.getForm().reset();
    if (winEnc) {
        winEnc.hide();
    }
}

function ventanaEncendidoApagado() {
    if (!winEnc) {
        winEnc = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Encendido y Apagado',
            iconCls: 'icon-on-off',
            resizable: false,
            width: 510,
            height: 320,
            closeAction: 'hide',
            plain: false,
            items: contenedorwinEA,
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosEnc();
                }
            }
        });
    }
    contenedorwinEA.getForm().reset();
    winEnc.show();
}

function obtenerRepEncApag() {
    var form = contenedorwinEA.getForm();
    //reporte por limites
    if (tipoReportEnc === 1) {//reporte de tipo general
        form.submit({
            url: 'php/interface/report/encendidoApagado/getReportGeneralEncApag.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                fechaIni: dateIniEncApag, fechaFin: dateFinEncApag,
                horaIni: horaIniEncApag, horaFin: horaFinEncApag
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
                var storeDataGeneralEncApag = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['empresaEncApag', 'personaEncApag', 'placaEncApag', 'idEquipoEncApag', 'equipoEncApag', 'totalEncApag']
                });
                var gridGeneralApagEnc = Ext.create('Ext.grid.Panel', {
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte General de encendido y apagado ' + '<br>Fechas:' + dateIniEncApag + ' / ' + dateFinEncApag +
                            '<br>Horas:' + horaIniEncApag + ' / ' + horaFinEncApag + '</center>',
                    store: storeDataGeneralEncApag,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Empresa', width: 290, dataIndex: 'empresaEncApag', align: 'center'},
                        {text: 'Persona', width: 290, dataIndex: 'personaEncApag', align: 'center'},
                        {text: 'Placa', width: 130, dataIndex: 'placaEncApag', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoEncApag', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'totalEncApag', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {

                                var h0, h1, h2, h3, h4;
                                h0, h1 = h2 = h3 = h4 = true;
                                if (storeDataGeneralEncApag.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte General de Encendido y Apagado  : </th></tr>" +
                                                "<tr><th colspan='7' Fecha" + dateIniEncApag + ' / ' + dateFinEncApag + ' Horas: ' + horaIniEncApag + ' / ' + horaFinEncApag + ") km</th></tr>" +
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

                                        for (var i = 0; i < storeDataGeneralEncApag.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataGeneralEncApag.data.items[i].data.empresaEncApag + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataGeneralEncApag.data.items[i].data.personaEncApag + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataGeneralEncApag.data.items[i].data.placaEncApag + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataGeneralEncApag.data.items[i].data.equipoEncApag + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataGeneralEncApag.data.items[i].data.totalEncApag + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEncendidoApagadoGeneral.xls';
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
                            var reg = record.get('idEquipoEncApag');
                            var persona = record.get('personaEncApag');
                            var estado = 1;
                            gridViewDataEncApagDetallado.setTitle('<center>Vista detallada de encendido y apagado ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateIniEncApag + ' Hasta:' + dateFinEncApag + '</center>');
                            storeDataDetalladoOnOff.load({
                                params: {
                                    idEquipoEA: reg,
                                    fechaIniEA: dateIniEncApag, fechaFinEA: dateFinEncApag,
                                    horaIniEA: horaIniEncApag, horaFinEA: horaFinEncApag
                                }
                            });

                        }
                    }
                });
                gridViewDataEncApagDetallado = Ext.create('Ext.grid.Panel', {
                    title: '<center>Vista detallada de encendido y apagado :</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDataDetalladoOnOff,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Fecha', width: 150, dataIndex: 'fechaEA', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'horaEA', align: 'center'},
                        {text: 'evento', width: 150, dataIndex: 'eventoEA', align: 'center'},
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadEA', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitudEA', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitudEA', align: 'center'},
                        {text: 'Bateria', width: 200, dataIndex: 'bateriaEA', align: 'center'},
                        {text: 'GSM', width: 200, dataIndex: 'gsmEA', align: 'center'},
                        {text: 'GPS', width: 200, dataIndex: 'gpsEA', align: 'center'},
                        {text: 'Direccion', width: 200, dataIndex: 'direccionEA', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {

                                var h0, h1, h2, h3, h4, h5, h6, h7, h8, h9;
                                h0, h1 = h2 = h3 = h4 = h5 = h6 = h7 = h8 = h9 = true;
                                if (storeDataDetalladoOnOff.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte de Encendido y Apagado Detallado</th></tr>" +
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

                                        for (var i = 0; i < storeDataDetalladoOnOff.data.length; i++) {
                                            table_div += "<tr>";

                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.fechaEA + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.horaEA + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.eventoEA + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.velocidadEA + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.latitudEA + "</td>";
                                            if (h5)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.longitudEA + "</td>";
                                            if (h6)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.bateriaEA + "</td>";
                                            if (h7)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.gsmEA + "</td>";
                                            if (h8)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.gpsEA + "</td>";
                                            if (h9)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.direccionEA + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;
                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEncendidoApagadoDetallado.xls';
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
                    title: 'Reporte de Encendido y Apagado',
                    closable: true,
                    iconCls: 'icon-on-off',
                    layout: 'border',
                    fullscreen: true,
                    height: 485,
                    width: 2000,
                    region: 'center',
                    items: [gridGeneralApagEnc, gridViewDataEncApagDetallado]
                });
                panelTabMapaAdmin.add(tabExcesos);
                panelTabMapaAdmin.setActiveTab(tabExcesos);
                winEnc.hide();
            }

        });
    } else { //reporte por cooperativa
        form.submit({
            url: 'php/interface/report/encendidoApagado/getReportCooperativaEncApag.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                empEA: empresEncApag,
                fechaIni: dateIniEncApag, fechaFin: dateFinEncApag,
                horaIni: horaIniEncApag, horaFin: horaFinEncApag
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
                var storeDataPOrCooperativaEncendidoApg = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['personaEA', 'placaEA', 'idEquipoEA', 'equipoEA', 'totalEA']
                });
                var gridGeneralApagEnc = Ext.create('Ext.grid.Panel', {
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte de encendido y apagado,de la cooperativa:' + empresEncApag + '<br>Fechas:' + dateIniEncApag + ' / ' + dateFinEncApag +
                            '<br>Horas:' + horaIniEncApag + ' / ' + horaFinEncApag + '</center>',
                    store: storeDataPOrCooperativaEncendidoApg,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Persona', width: 290, dataIndex: 'personaEA', align: 'center'},
                        {text: 'Placa', width: 130, dataIndex: 'placaEA', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoEA', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'totalEA', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4;
                                h0, h1 = h2 = h3 = h4 = true;
                                if (storeDataPOrCooperativaEncendidoApg.getCount() > 0) {
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

                                        for (var i = 0; i < storeDataPOrCooperativaEncendidoApg.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEncendidoApg.data.items[i].data.personaEA + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEncendidoApg.data.items[i].data.placaEA + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEncendidoApg.data.items[i].data.equipoEA + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataPOrCooperativaEncendidoApg.data.items[i].data.totalEA + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEncendidoApagadoPorCooperativa.xls';
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
                            var reg = record.get('idEquipoEA');
                            var persona = record.get('personaEA');
                            var estado = 2;
                            gridViewDataEncApagDetallado.setTitle('<center>Vista detallado de encendido y apagado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateIniEncApag + ' Hasta:' + dateFinEncApag + '</center>');
                            storeDataDetalladoOnOff.load({
                                params: {
                                    idEquipoEA: reg,
                                    fechaIniEA: dateIniEncApag, fechaFinEA: dateFinEncApag,
                                    horaIniEA: horaIniEncApag, horaFinEA: horaFinEncApag
                                }
                            });

                        }
                    }
                });
                gridViewDataEncApagDetallado = Ext.create('Ext.grid.Panel', {
                    title: '<center>Vista detallado de encendido y apagado:</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDataDetalladoOnOff,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Fecha', width: 150, dataIndex: 'fechaEA', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'horaEA', align: 'center'},
                        {text: 'evento', width: 150, dataIndex: 'eventoEA', align: 'center'},
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadEA', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitudEA', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitudEA', align: 'center'},
                        {text: 'Bateria', width: 200, dataIndex: 'bateriaEA', align: 'center'},
                        {text: 'GSM', width: 200, dataIndex: 'gsmEA', align: 'center'},
                        {text: 'GPS', width: 200, dataIndex: 'gpsEA', align: 'center'},
                        {text: 'Direccion', width: 200, dataIndex: 'direccionEA', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h0, h1, h2, h3, h4, h5, h6, h7, h8, h9;
                                h0, h1 = h2 = h3 = h4 = h5 = h6 = h7 = h8 = h9 = true;
                                if (storeDataDetalladoOnOff.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>Reporte de Encendido y Apagado Detallado</th></tr>" +
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

                                        for (var i = 0; i < storeDataDetalladoOnOff.data.length; i++) {
                                            table_div += "<tr>";

                                            if (h0)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.fechaEA + "</td>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.horaEA + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.eventoEA + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.velocidadEA + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.latitudEA + "</td>";
                                            if (h5)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.longitudEA + "</td>";
                                            if (h6)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.bateriaEA + "</td>";
                                            if (h7)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.gsmEA + "</td>";
                                            if (h8)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.gpsEA + "</td>";
                                            if (h9)
                                                table_div += "<td align=lef>" + storeDataDetalladoOnOff.data.items[i].data.direccionEA + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;
                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'ReporteEncendidoApagadoDetallado.xls';
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
                    title: 'Reporte de Encendido y Apagado',
                    closable: true,
                    iconCls: 'icon-on-off',
                    layout: 'border',
                    fullscreen: true,
                    height: 485,
                    width: 2000,
                    region: 'center',
                    items: [gridGeneralApagEnc, gridViewDataEncApagDetallado]
                });
                panelTabMapaAdmin.add(tabExcesos);
                panelTabMapaAdmin.setActiveTab(tabExcesos);
                winEnc.hide();
            }

        });
    }

}

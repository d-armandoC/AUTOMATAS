var formExcesosVelocidad;
var winExcesosVelocidad;
var bandera = 0;
var storeDetalladoVelocidad;
var dateStart;
var dateFinish;
var gridViewDataExcesos;
var gridViewDataExcesosTotal;
var gridViewDataExcesosGeneral;
var storeDataVelocidad60a90;
var storeDataExcesosD;
var empresa = 1;
var cbxEmpresasBDExcesos;
var limiteIni;
var limiteFin;
var timeIni1;
var timeFin1;
//variable para los reportes
var reporteporlimite;
var gridVelocidad60a90;
var gridVelocidad90a120;
//variable para fija los valores para las consultas
var horaStart;
var horafinish;
var limiStart;
var limifinish;
//VARIABLE PARA REORTE DETALLADO
var persona;
Ext.onReady(function() {
    storeDetalladoVelocidad = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getViewVelocidadDetallado.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['fecha', 'hora', 'velocidad', 'latitud', 'longitud']
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
        name: 'limiInifd',
        minValue: 0,
        minText: 'El valor no puede ser negativo',
        maxValue: 'limiFin',
        allowBlank: false,
        blankText: 'Este campo es Obligatorio',
        emptyText: 'limite Inicial...'
    });
    limiteFin = Ext.create('Ext.form.field.Number', {
        fieldLabel: 'Limite Final',
        name: 'limiFinfd',
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
                        horaStart = timeIni1.getRawValue();
                        horafinish = timeFin1.getRawValue();
                        limiStart = limiteIni.getRawValue();
                        limifinish = limiteFin.getRawValue();
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
    //reporte por limites
    if (reporteporlimite === 1) {
        form.submit({
            url: 'php/interface/report/excesoVelocidades/getExcesosVelocidadPorLimite.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            params: {
                idCompanyExcesos: empresa,
                fechaIni: dateStart, fechaFin: dateFinish,
                horaIni: timeIni1, horaFin: timeFin1,
                limiST: limiStart, limiFI: limifinish
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
//                console.log(action.result.data);
                var storeDataVelocidadPorLimite = Ext.create('Ext.data.JsonStore', {
                    data: action.result.data,
                    proxy: {
                        type: 'ajax',
                        reader: 'array'
                    },
                    fields: ['personaExceso', 'placaExceso', 'idEquipoExceso', 'equipoExceso', 'total']
                });
                var gridVelocidadPorLimite = Ext.create('Ext.grid.Panel', {
//                    region: 'north',
                    frame: true,
                    width: '100%',
                    height: 230,
                    title: '<center>Reporte de velocidades ' + '<br>Por limites: entre ( ' + limiteIni.getRawValue() + ' - ' + limiteFin.getRawValue() + ') km</center>',
                    store: storeDataVelocidadPorLimite,
                    features: [filters],
                    multiSelect: true,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Persona', width: 290, dataIndex: 'personaExceso', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
                        {text: 'Placa', width: 130, dataIndex: 'placaExceso', align: 'center'},
                        {text: 'Equipo', width: 130, dataIndex: 'equipoExceso', align: 'center'},
                        {text: 'Cantidad', width: 130, dataIndex: 'total', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h1, h2, h3, h4;
                                h1 = h2 = h3 = h4 = true;
                                if (storeDataVelocidadPorLimite.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>REORTE DE VELOCIDAD : </th></tr>" +
                                                "<tr><th colspan='7'POR LIMITE: Entre" + limiteIni.getRawValue() + " - " + limiteFin.getRawValue() + ") km</th></tr>" +
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

                                        for (var i = 0; i < storeDataVelocidadPorLimite.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDataVelocidadPorLimite.data.items[i].data.personaExceso + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDataVelocidadPorLimite.data.items[i].data.placaExceso + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDataVelocidadPorLimite.data.items[i].data.equipoExceso + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDataVelocidadPorLimite.data.items[i].data.total + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'VelocidadPorLImite.xls';
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
                            var reg = record.get('idEquipoExceso');
                            persona = record.get('personaExceso');
                            var estado = 1;
                            gridViewDataExcesos.setTitle('<center>Vista de velocidad detallado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                            storeDetalladoVelocidad.load({
                                params: {
                                    estadoR: estado,
                                    idEquipo: reg,
                                    fechaIni: dateStart, fechaFin: dateFinish,
                                    horaST: horaStart, horaFI: horafinish,
                                    limiST: limiStart, limiFI: limifinish
                                }
                            });
                        }
                    }
                });


                velocidad60a90();//llama a la funcion para realizar la consulta entre velocidades de 60 a 90 km
                velocidad90a120();//llama a la funcion para realizar la consulta entre velocidades de 90 a 120 km
                var gridDataExcesos = Ext.create('Ext.container.Container', {
                    title: 'Excesos de Velocidad ',
                    closable: true,
                    iconCls: 'icon-exceso-vel',
                    layout: 'vbox',
                    fullscreen: true,
                    height: '100%',
                    width: '45%',
                    region: 'west',
                    items: [gridVelocidadPorLimite, gridVelocidad60a90, gridVelocidad90a120]
                });
                gridViewDataExcesos = Ext.create('Ext.grid.Panel', {
                    title: '<center>Velocidades detalladas:</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDetalladoVelocidad,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidad', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Fecha', width: 150, dataIndex: 'fecha', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'hora', align: 'center'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'},
                    ],
                    tbar: [{
                            xtype: 'button',
                            iconCls: 'icon-excel',
                            text: 'Exportar a Excel',
                            handler: function() {
                                var h1, h2, h3, h4, h5;
                                h1 = h2 = h3 = h4 = h5 = true;
                                if (storeDetalladoVelocidad.getCount() > 0) {
                                    if (getNavigator() === 'img/chrome.png') {
                                        var a = document.createElement('a');
                                        //getting data from our div that contains the HTML table
                                        var data_type = 'data:application/vnd.ms-excel';
                                        //var table_div = document.getElementById('exportar');
                                        //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                                        var tiLetra = 'Calibri';

                                        var table_div = "<meta charset='UTF-8'><body>" +
                                                "<font face='" + tiLetra + "'><table>" +
                                                "<tr><th colspan='7'>REPORTE DE VELOCIDAD DETALLADA : " + persona + "</th></tr>" +
                                                "<tr><th colspan='7'POR LIMITE: Entre" + limiteIni.getRawValue() + " - " + limiteFin.getRawValue() + ") km</th></tr>" +
                                                "<tr></tr>";
                                        table_div += "<tr>";
                                        if (h1)
                                            table_div += "<th align=left>Velocidad</th>";
                                        if (h2)
                                            table_div += "<th align=left>Fecha</th>";
                                        if (h3)
                                            table_div += "<th align=left>Hora</th>";
                                        if (h4)
                                            table_div += "<th align=left>Latitud</th>";
                                        if (h5)
                                            table_div += "<th align=left>Longitud</th>";
                                        table_div += "</tr>";

                                        for (var i = 0; i < storeDetalladoVelocidad.data.length; i++) {
                                            table_div += "<tr>";
                                            if (h1)
                                                table_div += "<td align=lef>" + storeDetalladoVelocidad.data.items[i].data.velocidad + "</td>";
                                            if (h2)
                                                table_div += "<td align=lef>" + storeDetalladoVelocidad.data.items[i].data.fecha + "</td>";
                                            if (h3)
                                                table_div += "<td align=lef>" + storeDetalladoVelocidad.data.items[i].data.hora + "</td>";
                                            if (h4)
                                                table_div += "<td align=lef>" + storeDetalladoVelocidad.data.items[i].data.latitud + "</td>";
                                            if (h5)
                                                table_div += "<td align=lef>" + storeDetalladoVelocidad.data.items[i].data.longitud + "</td>";
                                            table_div += "</tr>";
                                        }
                                        ;

                                        table_div += "</table></font></body>";

                                        var table_html = table_div.replace(/ /g, '%20');

                                        a.href = data_type + ', ' + table_html;
                                        //setting the file name
                                        a.download = 'VelocidadesDetalladas.xls';
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
            }

        });
    } else { //reporte general
        form.submit({
            url: 'php/interface/report/excesoVelocidades/getExcesoVelocidad60a90.php',
            waitTitle: 'Procesando...',
            waitMsg: 'Obteniendo Información',
            failure: function(form, action) {
                Ext.MessageBox.show({
                    title: 'Información',
                    msg: 'No se pudo obtener la informacion',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            },
            success: function(form, action) {
                velocidad60a90();//llama a la funcion para realizar la consulta entre velocidades de 60 a 90 km
                velocidad90a120();//llama a la funcion para realizar la consulta entre velocidades de 90 a 120 km
                var gridDataExcesos = Ext.create('Ext.container.Container', {
                    title: 'Excesos de Velocidad ',
                    closable: true,
                    iconCls: 'icon-exceso-vel',
                    layout: 'vbox',
                    fullscreen: true,
                    height: '100%',
                    width: '45%',
                    region: 'west',
                    items: [gridVelocidad60a90, gridVelocidad90a120]
                });
                gridViewDataExcesos = Ext.create('Ext.grid.Panel', {
                    title: '<center>Velocidades detalladas:</center>',
                    region: 'center',
                    columnLines: true,
                    autoScroll: true,
                    height: 485,
                    width: '55%',
                    store: storeDetalladoVelocidad,
                    viewConfig: {
                        emptyText: 'No hay datos que Mostrar'
                    },
                    columns: [
                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                        {text: 'Velocidad', width: 150, dataIndex: 'velocidad', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                        {text: 'Fecha', width: 150, dataIndex: 'fecha', align: 'center'},
                        {text: 'Hora', width: 150, dataIndex: 'hora', align: 'center'},
                        {text: 'Latitud', width: 200, dataIndex: 'latitud', align: 'center'},
                        {text: 'Longitud', width: 200, dataIndex: 'longitud', align: 'center'},
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
                winExcesosVelocidad.hide();
            }

        });
    }

}
function velocidad60a90() {
    storeDataVelocidad60a90 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getExcesoVelocidad60a90.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['personaExc', 'placaExc', 'idEquipoExc', 'equipoExc', 'totalExc']
    });
    storeDataVelocidad60a90.load({
        params: {
            idCompanyExcesos: empresa,
            fechaIni: dateStart, fechaFin: dateFinish,
            horaST: horaStart, horaFI: horafinish,
        }
    });
    gridVelocidad60a90 = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '100%',
        height: 280,
        title: '<center>Reporte de velocidades: ' + '<br>Entre ( 60 - 90) km</center>',
        store: storeDataVelocidad60a90,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: 'Persona', width: 290, dataIndex: 'personaExc', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
            {text: 'Placa', width: 130, dataIndex: 'placaExc', align: 'center'},
            {text: 'Equipo', width: 130, dataIndex: 'equipoExc', align: 'center'},
            {text: 'Cantidad', width: 130, dataIndex: 'totalExc', align: 'center'},
        ],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                    var h1, h2, h3, h4;
                    h1 = h2 = h3 = h4 = true;
                    if (storeDataVelocidad60a90.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';

                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>REPORTE DE VELOCIDAD ENTRE (60 - 90) km,  FECHA:" + dateStart + " / " + dateFinish + "</th></tr>" +
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

                            for (var i = 0; i < storeDataVelocidad60a90.data.length; i++) {
                                table_div += "<tr>";
                                if (h1)
                                    table_div += "<td align=lef>" + storeDataVelocidad60a90.data.items[i].data.personaExc + "</td>";
                                if (h2)
                                    table_div += "<td align=lef>" + storeDataVelocidad60a90.data.items[i].data.placaExc + "</td>";
                                if (h3)
                                    table_div += "<td align=lef>" + storeDataVelocidad60a90.data.items[i].data.equipoExc + "</td>";
                                if (h4)
                                    table_div += "<td align=lef>" + storeDataVelocidad60a90.data.items[i].data.totalExc + "</td>";
                                table_div += "</tr>";
                            }
                            ;

                            table_div += "</table></font></body>";

                            var table_html = table_div.replace(/ /g, '%20');

                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'VelocidadesEntre60a90.xls';
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
                var reg = record.get('idEquipoExc');
                persona = record.get('personaExceso');
                var estado = 2;
                gridViewDataExcesos.setTitle('<center>Vista de velocidad detallado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                storeDetalladoVelocidad.load({
                    params: {
                        estadoR: estado,
                        idEquipo: reg,
                        fechaIni: dateStart, fechaFin: dateFinish,
                        horaST: horaStart, horaFI: horafinish,
                    }
                });
            }
        }
    });

}
function velocidad90a120() {
    storeDataVelocidad90a120 = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/excesoVelocidades/getExcesoVelocidad90a120.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['personaE', 'placaE', 'idEquipoE', 'equipoE', 'totalE']
    });
    storeDataVelocidad90a120.load({
        params: {
            idCompanyExcesos: empresa,
            fechaIni: dateStart, fechaFin: dateFinish,
            horaST: horaStart, horaFI: horafinish,
        }
    });
    gridVelocidad90a120 = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '100%',
        height: 280,
        title: '<center>Reporte de velocidades: ' + '<br>Entre ( 90 - 120) km</center>',
        store: storeDataVelocidad90a120,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
            {text: 'Persona', width: 290, dataIndex: 'personaE', align: 'center'}, ///agrege esta linea para ver el persona q realizo el exceso de velocidad
            {text: 'Placa', width: 130, dataIndex: 'placaE', align: 'center'},
            {text: 'Equipo', width: 130, dataIndex: 'equipoE', align: 'center'},
            {text: 'Cantidad', width: 130, dataIndex: 'totalE', align: 'center'},
        ],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {
                    var h1, h2, h3, h4;
                    h1 = h2 = h3 = h4 = true;
                    if (storeDataVelocidad90a120.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';

                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>REPORTE DE VELOCIDAD ENTRE (90 - 120) km,  FECHA:" + dateStart + " / " + dateFinish + "</th></tr>" +
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

                            for (var i = 0; i < storeDataVelocidad90a120.data.length; i++) {
                                table_div += "<tr>";
                                if (h1)
                                    table_div += "<td align=lef>" + storeDataVelocidad90a120.data.items[i].data.personaE + "</td>";
                                if (h2)
                                    table_div += "<td align=lef>" + storeDataVelocidad90a120.data.items[i].data.placaE + "</td>";
                                if (h3)
                                    table_div += "<td align=lef>" + storeDataVelocidad90a120.data.items[i].data.equipoE + "</td>";
                                if (h4)
                                    table_div += "<td align=lef>" + storeDataVelocidad90a120.data.items[i].data.totalE + "</td>";
                                table_div += "</tr>";
                            }
                            ;

                            table_div += "</table></font></body>";

                            var table_html = table_div.replace(/ /g, '%20');

                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'VelocidadesEntre90a120.xls';
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
                var reg = record.get('idEquipoE');
                persona = record.get('personaExceso');
                var estado = 3;
                gridViewDataExcesos.setTitle('<center>Vista de velocidad detallado: ' + persona + ' <br> Equipo: ' + reg + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                storeDetalladoVelocidad.load({
                    params: {
                        estadoR: estado,
                        idEquipo: reg,
                        fechaIni: dateStart, fechaFin: dateFinish,
                        horaST: horaStart, horaFI: horafinish,
                    }
                });
            }
        }
    });

}

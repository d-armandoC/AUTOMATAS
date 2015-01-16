var contenedorwinEvt;
var winEvt;
var banderaEventos;
var storeVehiculos;
var empresaEventos = 'KRADAC';
var placaEventos = "";

Ext.onReady(function () {
    if (idCompanyKarview == 1) {
        banderaEventos = 1;
    } else {
        empresaEventos = 'COOPMEGO';
        banderaEventos = storeEmpresaPanicos.data.items[0].data.id;
    }

    storeVehiculos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboVeh.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, 'text']
    });

    var storeEventos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboEventos.php',
            reader: {
                type: 'json',
                root: 'eventos'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, {name: 'text', mapping: 'nombre'}]
    });

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresasEvent',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaEventos,
        listeners: {
            select: function (combo, records, eOpts) {
                empresaEventos = cbxEmpresasBDPanico.getRawValue();
                placaEventos = " ";
                var listSelected = contenedorwinEvt.down('[name=listVehEvent]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();
                storeVehiculos.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo:',
        name: 'cbxVehEvent',
        store: storeVehiculos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 300
        },
        listeners: {
            select: function (combo, records, eOpts) {
                placaEventos = records[0].data.placa;
            }
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEvent',
        name: 'fechaIniEvent',
        value: new Date(),
        maxValue: new Date(),
        //vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEvent',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEvent',
        name: 'fechaFinEvent',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEvent',
        emptyText: 'Fecha Final...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniEvent',
        format: 'H:i',
        value: '00:00',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEvent',
        format: 'H:i',
        value: '23:59',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIni.setValue(formatoFecha(nowDate));
            dateFin.setValue(formatoFecha(nowDate));
            timeIni.setValue('00:00');
            timeFin.setValue('23:59');
        }
    });

    var yesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
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

            timeIni.setValue('00:00');
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

    contenedorwinEvt = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        frame: false,
        autoScroll: true,
        padding: '5 5 5 5',
        items: [{
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    cbxEmpresasBD,
                                ]
                            }]
                    }]
            }, {
                xtype: 'form',
                bodyStyle: 'padding: 10px 0 10px 0',
                width: 570,
                baseCls: 'x-plain',
                items: [{
                        xtype: 'itemselector',
                        name: 'listVehEvent',
                        anchor: '97%',
                        height: 150,
                        store: storeVehiculos,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Vehiculos',
                        toTitle: 'Seleccionados'
                    }, {
                        xtype: 'itemselector',
                        name: 'listEvt',
                        anchor: '97%',
                        height: 150,
                        store: storeEventos,
                        displayField: 'text',
                        valueField: 'value',
                        allowBlank: false,
                        msgTarget: 'side',
                        fromTitle: 'Eventos',
                        toTitle: 'Seleccionados'
                    }]
            }, {
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
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
                    }]
            }, panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    if (contenedorwinEvt.getForm().isValid()) {
                        loadGridEvents();
                    } else {
                        Ext.MessageBox.show({
                            title: 'Atencion',
                            msg: 'LLene los espacios vacios',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winEvt.hide();
                }
            }]
    });
});

function limpiar_datosEvt() {
    contenedorwinEvt.getForm().reset();
    if (winEvt) {
        winEvt.hide();
    }
}

function ventanaEventos() {
    if (!winEvt) {
        winEvt = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Eventos',
            iconCls: 'icon-eventos',
            resizable: false,
            width: 600,
            height: 555,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinEvt],
            listeners: {
                close: function (panel, eOpts) {
                    limpiar_datosEvt();
                }
            }
        });
    }
    contenedorwinEvt.getForm().reset();
    winEvt.show();
    storeVehiculos.load({
        params: {
            cbxEmpresas: banderaEventos
        }

    });
}


function loadGridEvents() {

    var empresa = contenedorwinEvt.down('[name=cbxEmpresasEvent]').getValue();
    var listVeh = contenedorwinEvt.down('[name=listVehEvent]').getValue();
    var listEvt = contenedorwinEvt.down('[name=listEvt]').getValue();
    var fi = formatoFecha(contenedorwinEvt.down('[name=fechaIniEvent]').getValue());
    var ff = formatoFecha(contenedorwinEvt.down('[name=fechaFinEvent]').getValue());
    var hi = formatoHora(contenedorwinEvt.down('[name=horaIniEvent]').getValue());
    var hf = formatoHora(contenedorwinEvt.down('[name=horaFinEvent]').getValue());
    var nameEmp = contenedorwinEvt.down('[name=cbxEmpresasEvent]').getRawValue();

    Ext.MessageBox.show({
        title: "Cargando....",
        msg: "Procesando Datos",
        progressText: "Obteniendo...",
        wait: true,
        waitConfig: {
            interval: 150
        }
    });
    function formato(val) {
        if (val === '1') {
            return '<span style="color:green;">SI</span>';
        } else {
            return '<span style="color:red;">NO</span>';
        }
    }
    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportEvent.php?cbxEmpresas=' + empresa +
                    '&listVeh=' + listVeh +
                    '&listEvt=' + listEvt +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['vehiculor', 'latitudr', 'longitudr', 'fecha_horar', 'velocidadr', 'bateriar', 'gsmr', 'gps2r', 'ignr', 'evtr', 'direccionr'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records !== null && records.length > 0) {
                    var columnEvets = [
                        Ext.create('Ext.grid.RowNumberer', {text: 'N°', width: 48}),
                        {text: '<b>Vehiculos</b>', width: 200, dataIndex: 'vehiculor', filter: {type: 'string'}},
                        {text: '<b>Fechas</b>', width: 100, dataIndex: 'fecha_horar', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                        {text: '<b>Hora</b>', format: 'H:i:s', width: 100, dataIndex: 'fecha_horar', align: 'center'},
                        {text: '<b>Vel. (Km/h)</b>', dataIndex: 'velocidadr', align: 'center', width: 105, cls: 'listview-filesize', renderer: formatSpeed, filterable: true, filter: {type: 'numeric'}},
                        {text: 'Batería', width: 140, dataIndex: 'bateriar', align: 'center', renderer: formatBat, filter: {
                                type: 'list',
                                options: [[1, 'Bat. del Equipo'], [0, 'Bat. del Vehiculo']]
                            }},
                        {text: 'GSM', width: 105, dataIndex: 'gsmr', align: 'center', renderer: estadoGsm, filter: {
                                type: 'list',
                                options: [[1, 'Con covertura'], [0, 'Sin covertura']]
                            }},
                        {text: 'GPS', width: 105, dataIndex: 'gps2r', align: 'center', renderer: estadoGps, filter: {
                                type: 'list',
                                options: [[1, 'Con GPS'], [0, 'Sin GPS']]
                            }},
                        {text: 'Vehículo(IGN)', width: 130, dataIndex: 'ignr', align: 'center', renderer: formatBatIgn, filter: {
                                type: 'list',
                                options: [[1, 'Encendido'], [0, 'Apagado']]
                            }},
                        {text: '<b>Evento</b>', width: 250, dataIndex: 'evtr', tooltip: 'Evento', filter: {type: 'string'}},
                        {text: '<b>Direccion</b>', width: 300, dataIndex: 'direccionr', tooltip: 'Direccion', filter: {type: 'string'}},
                        {text: '<b>Latitud</b>', width: 150, dataIndex: 'latitudr', tooltip: 'Latitud'},
                        {text: '<b>Longitud</b>', width: 150, dataIndex: 'longitudr', tooltip: 'Longitud'}
                    ]


                    var gridEvents = Ext.create('Ext.grid.Panel', {
                        region: 'center',
                        frame: true,
                        width: '60%',
                        store: store,
                        height: 377,
                        features: [filters],
                        multiSelect: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnEvets,
                        tbar: [{
                                xtype: 'button',
                                iconCls: 'icon-excel',
                                text: 'Exportar a Excel',
                                handler: function () {
                                    if (store.getCount() > 0) {
                                        if (getNavigator() === 'img/chrome.png') {
                                            var a = document.createElement('a');
                                            var data_type = 'data:application/vnd.ms-excel';
                                            var numFil = store.data.length;
                                            var numCol = 11;
                                            var tiLetra = 'Calibri';
                                            var titulo = 'Cantidad de Equipos de Registro de Conectado y Desconectado'
                                            var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                                            table_div += "</DocumentProperties> " +
                                                    "<Styles> " +
                                                    "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                                    "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                    "<Style ss:ID='datos'><NumberFormat ss:Format='@'/></Style> " +
                                                    "</Styles>";
                                            //Definir el numero de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
                                            table_div += "<Worksheet ss:Name='Datos'>";//Nombre de la hoja
                                            table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='60' ss:DefaultRowHeight='15'>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Bateria</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GSM</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GPS</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>IGN</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Dirección</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>latitud</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>longitud</Data></Cell>" +
                                                    "</Row>";
                                            for (var i = 0; i < numFil; i++) {
                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.vehiculor + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.fecha_horar + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.velocidadr + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatBat(store.data.items[i].data.bateriar) + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + estadoGsm(store.data.items[i].data.gsmr) + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + estadoGps(store.data.items[i].data.gps2r) + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatBatIgn(store.data.items[i].data.ignr) + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.evtr + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.direccionr + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.latitudr + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.longitudr + " </Data></Cell > " +
                                                        "</Row>";
                                            }
                                            table_div += "</Table> </Worksheet></Workbook>";
                                            var table_xml = table_div.replace(/ /g, '%20');
                                            a.href = data_type + ', ' + table_xml;
                                            a.download = 'Ventana Eventos' + '.xml';
                                            a.click();
                                        } else {
                                            Ext.MessageBox.show({
                                                title: 'Error',
                                                msg: '<center> El servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.ERROR
                                            });
                                        }
                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Mensaje',
                                            msg: 'No hay datos en la Lista a Exportar',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                }
                            }],
                        listeners: {
                                 itemcontextmenu: function (thisObj, record, item, index, e, eOpts) {
                                            e.stopEvent();
                                            Ext.create('Ext.menu.Menu', {
                                                items: [
                                                    Ext.create('Ext.Action', {
                                                        iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                        text: 'Ver Ubicación en el Mapa',
                                                        disabled: false,
                                                        handler: function (widget, event) {
                                                            panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                            clearLienzoPointTravel();
                                                            clearLienzoTravel();
                                                            drawPointEncendidoApagado(record.data);
                                                            localizarDireccion(record.data.longitudEA, record.data.latitudEA, 17);
                                                        }
                                                    })
                                                ]
                                            }).showAt(e.getXY());
                                            return false;
                                        }
                        }
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: '<div id="titulosForm"> Reporte de Eventos ' + empresaEventos + '</div>',
                        closable: true,
                        iconCls: 'icon-eventos',
                        items: gridEvents
                    });

                    panelTabMapaAdmin.add(tab);
                    panelTabMapaAdmin.setActiveTab(tab);
                    winEvt.hide();

                    limpiar_datosEvt();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No hay datos a mostrar en su Petición',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                }

            }
        }
    });
}
var formularioEnerg;
var VentanaEnerg;
var bandera = 0;
var dateStart;
var dateFinish;
var timeStart;
var timeFinish;
var persona;
var idEquipoEnergD;
var gridDataExcesos;
var empresa = 1;
var empresaNom = 'KRADAC';
var cbxEmpresasBDEnergD;
var cbxVehBDEnergD;
var porEquipo = false;
var hayDatos = false;

Ext.onReady(function () {
    storeViewEnerg = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/energizaDesenegizar/getReportEnergizacionDes.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['idData', 'fechaED', 'horaED', 'eventoED', 'velocidadED', 'latitudED', 'longitudED', 'bateriaED', 'gsmED', 'gpsED', 'direccionED']
    });
    cbxEmpresasBDEnergD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyEnergD',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: 1,
        listeners: {
            select: function (combo, records, eOpts) {
                if (porEquipo) {
                    cbxVehBDEnergD.clearValue();
                    cbxVehBDEnergD.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                }
            }
        }
    });



    cbxVehBDEnergD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVehED',
        store: storeVeh,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 450
        }
    });


    var dateIniEnergD = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEnergD',
        name: 'fechaIniED',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinEnergD',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinEnergD = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEnergD',
        name: 'fechaFinED',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniEnergD',
        emptyText: 'Fecha Final...'
    });

    var timeIniEnergD = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniED',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinEnergD = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinED',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btnToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniEnergD.setValue(nowDate);
            dateFinEnergD.setValue(nowDate);
            timeIniEnergD.setValue('00:00');
            timeFinEnergD.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniEnergD.setValue(yestDate);
            dateFinEnergD.setValue(yestDate);
            timeIniEnergD.setValue('00:00');
            timeFinEnergD.setValue('23:59');
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

    formularioEnerg = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rbEnergD', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehiculo', name: 'rbEnergD', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rbEnergD'])) {
                                    case 1:
                                        empresa = 1;
                                        cbxEmpresasBDEnergD.enable();
                                        cbxVehBDEnergD.clearValue();
                                        cbxVehBDEnergD.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        porEquipo = true;
                                        empresa = cbxEmpresasBDEnergD.getValue();
                                        empresaNom = cbxEmpresasBDEnergD.getRawValue();
                                        if (porEquipo) {
                                            cbxVehBDEnergD.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioEnerg.down('[name=idCompanyEnergD]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDEnergD,
                    cbxVehBDEnergD
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniEnergD,
                    dateFinEnergD,
                    timeIniEnergD,
                    timeFinEnergD,
                    panelButtons
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    dateStart = dateIniEnergD.getRawValue();
                    dateFinish = dateFinEnergD.getRawValue();
                    var formulario = formularioEnerg.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/energizaDesenegizar/getReportGeneralEnergDes.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: empresa
                            },
                            success: function (form, action) {
                                var storeDataEnergD = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['empresaEneDes', 'personaEneDes', 'placaEneDes', 'idEquipoEneDes', 'equipoEneDes', 'totalEneDes']
                                });
                                var gridViewDataEnergD = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '60%',
                                    title: '<center>Detalle: ',
                                    store: storeViewEnerg,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
//                                        {text: 'Trama', width: 150, dataIndex: 'idData', align: 'center'},
                                        {text: 'Fecha', width: 150, dataIndex: 'fechaED', align: 'center', format: 'Y-m-d H:i:s', filter: {type: 'date'}, filterable: true},
                                        {text: 'Hora', width: 150, dataIndex: 'horaED', align: 'center', filter: {type: 'string'}},
                                        {text: 'Evento', width: 150, dataIndex: 'eventoED', align: 'center', filter: {type: 'string'}},
                                        {text: 'Velocidad', width: 150, dataIndex: 'velocidadED', align: 'center', xtype: 'numbercolumn', format: '0.00'},
                                        {text: 'Latitud', width: 200, dataIndex: 'latitudED', align: 'center'},
                                        {text: 'Longitud', width: 200, dataIndex: 'longitudED', align: 'center'},
                                        {text: 'Batería', width: 140, dataIndex: 'bateriaED', align: 'center', renderer: formatBat, filter: {
                                                type: 'list',
                                                options: [[1, 'Bat. del Equipo'], [0, 'Bat. del Vehiculo']]
                                            }},
                                        {text: 'GSM', width: 105, dataIndex: 'gsmED', align: 'center', renderer: estadoGsm, filter: {
                                                type: 'list',
                                                options: [[1, 'Con covertura'], [0, 'Sin covertura']]
                                            }},
                                        {text: 'GPS', width: 105, dataIndex: 'gpsED', align: 'center', renderer: estadoGps, filter: {
                                                type: 'list',
                                                options: [[1, 'Con GPS'], [0, 'Sin GPS']]
                                            }},
                                        {text: 'Direccion', width: 200, dataIndex: 'direccionED', align: 'center', filter: {type: 'string'}}
                                    ],
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
                                                            drawPointsEnergDeserg(record.data);
                                                            localizarDireccion(record.data.longitudED, record.data.latitudED, 17);
                                                        }
                                                    })
                                                ]
                                            }).showAt(e.getXY());
                                            return false;
                                        }
                                    },
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeViewEnerg.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeViewEnerg.data.length;
                                                        var numCol = 10;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Conexión y Desconexión';
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

                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Hora</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Latitud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Longtud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Bateria</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GSM</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GPS</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Dirección</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.fechaED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.horaED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.eventoED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.velocidadED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.latitudED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.longitudED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.bateriaED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.gsmED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.gpsED + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEnerg.data.items[i].data.direccionED + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Registro de Conexión y Desconexión' + '.xml';
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
                                        }]
                                });
                                gridViewDataEnergD.setTitle('<center>Vista de energización y desenergización ' + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                var gridDataEnergizacionD = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '40%',
                                    title: '<center>Energización y desenergizacións Totales ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                    store: storeDataEnergD,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 40, align: 'center'}),
                                        {text: 'Organización', width: 120, dataIndex: 'empresaEneDes', align: 'center',renderer: formatCompany, filter: {type: 'list', store: storeEmpresasList}, align: 'center'},
                                        {text: 'Persona', width: 220, dataIndex: 'personaEneDes', align: 'center',filter: {type: 'string'}},
                                        {text: 'Placa', width: 100, dataIndex: 'placaEneDes', align: 'center',filter: {type: 'string'}},
                                        {text: 'Equipo', width: 100, dataIndex: 'equipoEneDes', align: 'center',filter: {type: 'string'}},
                                        {text: 'Cantidad', width: 100, dataIndex: 'totalEneDes', align: 'center',filter: {type: 'numeric'}}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {


                                                if (storeDataEnergD.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataEnergD.data.length;
                                                        var numCol = 5;
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
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='80'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Organización</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Persona</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Evento</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEnergD.data.items[i].data.personaEneDes + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEnergD.data.items[i].data.empresaEneDes + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEnergD.data.items[i].data.placaEneDes + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEnergD.data.items[i].data.equipoEneDes + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEnergD.data.items[i].data.totalEneDes + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Evento Conectado y Desconectado' + '.xml';
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
                                        itemclick: function (thisObj, record, item, index, e, eOpts) {
                                            idEquipoEnergD = record.get('idEquipoEneDes');
                                            persona = record.get('personaEneDes');
                                            bandera = 1;
                                            hayDatos = true;
                                            gridViewDataEnergD.setTitle('<center>Vista de energización y desenergización: ' + persona + ' <br> Equipo: ' + idEquipoEnergD + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                            storeViewEnerg.load(
                                                    {
                                                        params: {
                                                            idEquipoED: idEquipoEnergD,
                                                            fechaIniED: dateIniEnergD.getRawValue(),
                                                            fechaFinED: dateFinEnergD.getRawValue(),
                                                            horaIniED: timeIniEnergD.getRawValue(),
                                                            horaFinED: timeFinEnergD.getRawValue(),
                                                        }
                                                    });

                                        }
                                    }
                                });
                                var tabExcesos = Ext.create('Ext.container.Container', {
                                    title: 'Energización y Desenergización Detallados',
                                    closable: true,
                                    iconCls: 'icon-conexcion',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridViewDataEnergD, gridDataEnergizacionD]
                                });
                                panelTabMapaAdmin.add(tabExcesos);
                                panelTabMapaAdmin.setActiveTab(tabExcesos);
                                VentanaEnerg.hide();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: 'No se existen datos disponibles',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        });
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    VentanaEnerg.hide();
                }
            }]
    });
});
function showWinEnergizar() {
    if (!VentanaEnerg) {
        VentanaEnerg = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Conexión Desconexión del Equipo',
            iconCls: 'icon-conexcion',
            resizable: false,
            width: 350,
            height: 375,
            closeAction: 'hide',
            plain: false,
            items: formularioEnerg
        });
    }
    VentanaEnerg.show();
    formularioEnerg.getForm().reset();
}

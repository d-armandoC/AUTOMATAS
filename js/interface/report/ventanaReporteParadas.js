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
var reg_empresa;
var id_vehiculo_paradas;
var empresaNom = 'KRADAC';
var porEquipoParadas;
var cbxVehBDParadas;
var placaReporteParadas;
var empresaParadas;


Ext.onReady(function () {
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
        fields: ['idData','empresa', 'vehiculo', 'placa', 'latitud', 'longitud', 'fecha', 'hora', 'velocidad', 'bateria', 'gsm', 'gps', 'ign', 'sky_evento']
    });

    cbxEmpresasParada = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización Parada',
        name: 'idempresaparada',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: 1,
        listeners: {
            select: function (combo, records, eOpts) {
                empresaParadas = cbxEmpresasParada.getRawValue();
                placaReporteParadas = " ";
                if (porEquipoParadas) {
                    cbxVehBDParadas.clearValue();
                    cbxVehBDParadas.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                }
            }
        }
    });


    cbxVehBDParadas = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVeh',
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
        },
        listeners: {
            select: function (combo, records, eOpts) {
                placaReporteParadas = records[0].data.placa;
                console.log(placaReporteParadas);
            }
        }
    });


    var dateIniparadas = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        value: new Date(),
        maxValue: new Date(),
        id: 'fechaIniPradas',
        name: 'fechaIniParadas',
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinParadas',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinParadas = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinParadas',
        name: 'fechaFinParadas',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniParadas',
        emptyText: 'Fecha Final...'
    });

    var btnTodayparadas = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniparadas.setValue(nowDate);
            dateFinParadas.setValue(nowDate);
        }
    });

    var timeInipanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniParadas',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinpanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinParadas',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });

    var btnYesterdayparadas = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniparadas.setValue(yestDate);
            dateFinParadas.setValue(yestDate);
        }
    });
    var panelButtonsparadas = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnTodayparadas, btnYesterdayparadas]
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
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'Por Organización', name: 'rb5', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehiculo', name: 'rb5', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb5'])) {
                                    case 1:
                                        idEmpresa = 1;
                                        cbxEmpresasParada.enable();
                                        cbxVehBDParadas.clearValue();
                                        cbxVehBDParadas.disable();
                                        porEquipoParadas = false;
                                        break;
                                    case 2:
                                        porEquipoParadas = true;
                                        idEmpresa = cbxEmpresasParada.getValue();
                                        if (porEquipoParadas) {
                                            cbxVehBDParadas.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioParadas.down('[name=idempresaparada]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasParada,
                    cbxVehBDParadas
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniparadas,
                    dateFinParadas,
                    timeInipanico,
                    timeFinpanico,
                    panelButtonsparadas
                ]
            }
        ],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    fechaInicio = dateIniparadas.getRawValue();
                    fechaFin = dateFinParadas.getRawValue();
                    var form = formularioParadas.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/getReportParadasCantidad.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idEmpresas: idEmpresa,
                            },
                            success: function (form, action) {
                                personaParadas;
                                gridViewDataParadas;
                                var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.countByParadas,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_empresa', 'id_vehiculo', 'empresa', 'vehiculo', 'equipo', 'placa', 'totalEventos']
                                });
                                var gridDataMantenimientoparadas = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '48%',
                                    title: '<center>Reporte de Paradas de los Equipos: ' + '<br>Desde: ' + fechaInicio + ' | Hasta: ' + fechaFin + '</center>',
                                    store: storeDataReporteDetallado,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 150, dataIndex: 'empresa', align: 'center'},
                                        {text: 'Vehículo', width: 100, dataIndex: 'vehiculo', align: 'center'},
                                        {text: 'Equipo', width: 100, dataIndex: 'equipo', align: 'center'},
                                        {text: 'Placa', width: 100, dataIndex: 'placa', align: 'center'},
                                        {text: 'Cantidad Eventos', width: 150, dataIndex: 'totalEventos', align: 'center'}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeDataReporteDetallado.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataReporteDetallado.data.length;
                                                        var numCol = 5;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Paradas'
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
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Eventos</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.empresa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.vehiculo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.equipo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.placa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.totalEventos + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Registro de Paradas' + '.xml';
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
                                    , listeners: {
                                        itemclick: function (thisObj, record, item, index, e, eOpts) {
                                            reg_empresa = record.get('empresa');
                                            id_vehiculo_paradas = record.get('id_vehiculo');
                                            banderaParadas = 1;
                                            storeViewParadas.load({
                                                params: {
                                                    idVehiculo: id_vehiculo_paradas,
                                                    fechainiParadas: fechaInicio,
                                                    fechafinParadas: fechaFin
                                                }
                                            });
                                            gridViewDataParadas.setTitle('<center>Lista de Equipos que Reportan Evento de Parada : <br>Empresa: ' + reg_empresa + ' Desde: ' + fechaInicio + ' Hasta:' + fechaFin + '</center>');
                                        }
                                    }
                                });
                                gridViewDataParadas = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '52%',
                                    title: '<center>Reporte de Paradas: ',
                                    store: storeViewParadas,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        //fields: ['empresa', 'vehiculo', 'placa', 'latitud','longitud','fecha','hora','velocidad','bateria','gsm','gps','ign','sky_evento']
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 130, dataIndex: 'empresa', align: 'center'},
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
                                                            clearLienzoPointTravel();
                                                            clearLienzoTravel();
                                                            panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                                            drawPointsParadas(record.data);
                                                            localizarDireccion(record.data.longitud, record.data.latitud, 17);

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
                                                if (storeViewParadas.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeViewParadas.data.length;
                                                        var numCol = 13;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Paradas'
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
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Latitud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Longitud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Hora</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Bateria</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'></Data>GSM</Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GPS</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>IGN</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.empresa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.vehiculo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.placa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.latitud + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.longitud + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.fecha + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.hora + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.velocidad + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.bateria + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.gsm + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.gps + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.ign + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewParadas.data.items[i].data.sky_evento + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Registro de Paradas' + '.xml';
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
                                var tabExces = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm">Reporte de Paradas -' + empresaParadas + " : " + placaReporteParadas + '</div>',
                                    closable: true,
                                    iconCls: 'icon-unlock',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridDataMantenimientoparadas, gridViewDataParadas]
                                });
                                panelTabMapaAdmin.add(tabExces);
                                panelTabMapaAdmin.setActiveTab(tabExces);
                                Ventanaparadas.hide();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: 'No se encuentran datos!!!',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        });
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
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
            height: 375,
            closeAction: 'hide',
            plain: false,
            items: formularioParadas
        });
    }
    formularioParadas.getForm().reset();
    Ventanaparadas.show();
}


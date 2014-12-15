var formEncendidoApag;
var VentanaEA;
var bandera = 0;
//var storeViewPanico;
var dateStart;
var dateFinish;
var timeStart;
var timeFinish;
var persona;
var idEquipoEA;
//var gridViewDataPanicoTotal;
//var gridViewDataPanicoGeneral;
var gridDataExcesos;
//var storeViewPanicoTotal;
//var storeDataPanicoD;
var empresa = 1;
var empresaNom = 'KRADAC';
var cbxEmpresasBDEncendidoApag;
var cbxVehBDEncendidoApag;
var porEquipo = false;
//var tabExcesos;
var hayDatos = false;
//var storeEmpresaPanicos;
var gridViewDataPanico;




Ext.onReady(function() {

    cbxEmpresasBDEncendidoApag = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyEncApag',
        store: storeEmpresaPanicos,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: 1,
        listeners: {
            select: function(combo, records, eOpts) {
                if (porEquipo) {
                    cbxVehBDEncendidoApag.clearValue();
                    cbxVehBDEncendidoApag.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                }
            }
        }
    });

    cbxVehBDEncendidoApag = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        name: 'cbxVehEncApag',
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


    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEncApag',
        name: 'fechaIniEA',
        value: new Date(),
        maxValue: new Date(),
                
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinEncApag',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEncApag',
        name: 'fechaFinEA',
        value: new Date(),
        maxValue: new Date(),
        vtype:'daterange',
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniEncApag',
        emptyText: 'Fecha Final...'
    });
    var timeIniEncendidoApag = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniEncApag',
        value: '00:01',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinEncendidoApag = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinEncApag',
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
        handler: function() {
            var nowDate = new Date();
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeIniEncendidoApag.setValue('00:01');
            timeFinEncendidoApag.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeIniEncendidoApag.setValue('00:01');
            timeFinEncendidoApag.setValue('23:59');
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

    formEncendidoApag = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Organización', name: 'rbEA', inputValue: '1', checked: true},
                            {boxLabel: 'Por Equipo', name: 'rbEA', inputValue: '2'}

                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rbEA'])) {
                                    case 1:
                                        empresa = 1;
                                        cbxEmpresasBDEncendidoApag.enable();
                                        cbxVehBDEncendidoApag.clearValue();
                                        cbxVehBDEncendidoApag.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        porEquipo = true;
                                        empresa = cbxEmpresasBDEncendidoApag.getValue();
                                        empresaNom = cbxEmpresasBDEncendidoApag.getRawValue();
                                        if (porEquipo) {
                                            cbxVehBDEncendidoApag.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formEncendidoApag.down('[name=idCompanyEncApag]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDEncendidoApag,
                    cbxVehBDEncendidoApag

                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    timeIniEncendidoApag,
                    timeFinEncendidoApag,
                    panelButtons
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    dateStart = dateIni.getRawValue();
                    dateFinish = dateFin.getRawValue();
                    var formulario = formEncendidoApag.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/encendidoApagado/getReportGeneralEncApag.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
//                            params: {
//                                idCompany: empresa
//                            },
                            success: function(form, action) {
                                var storeDataEncApag = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['empresaEncApag', 'personaEncApag', 'placaEncApag', 'idEquipoEncApag', 'equipoEncApag', 'totalEncApag'],
                                });
//                                console.log(storeViewPanico);
//                                storeViewPanico.load(
//                                        {
//                                            params: {
//                                                idEquipo: storeDataExcesos.data.items[0].data.idEquipoPanicos,
//                                                fechaIni: dateIni.getRawValue(),
//                                                fechaFin: dateFin.getRawValue(),
//                                                horaIniP: timeInipanico.getRawValue(),
//                                                horaFinP: timeFinpanico.getRawValue(),
//                                            }
//                                        });
//                                        
                                var gridViewDataEncApag = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '60%',
                                    title: '<center>Detalle: ',
                                    store: storeViewEncendidoApag,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Fecha', width: 130, dataIndex: 'fechaEA', align: 'center'},
                                        {text: 'Hora', width: 200, dataIndex: 'horaEA', align: 'center'},
                                        {text: 'Evento', width: 250, dataIndex: 'eventoEA', align: 'center'},
                                        {text: 'Veloccidad', width: 200, dataIndex: 'velocidadEA', align: 'center'},
                                        {text: 'Latitud', width: 200, dataIndex: 'latitudEA', align: 'center'},
                                        {text: 'Longitud', width: 200, dataIndex: 'longitudEA', align: 'center'},
                                        {text: 'Bateria', width: 200, dataIndex: 'bateriaEA', align: 'center'},
                                        {text: 'GSM', width: 200, dataIndex: 'gsmEA', align: 'center'},
                                        {text: 'GPS', width: 200, dataIndex: 'gpsEA', align: 'center'},
                                        {text: 'Dirección', width: 200, dataIndex: 'direccionEA', align: 'center'}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function() {
                                                if (storeViewEncendidoApag.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeViewEncendidoApag.data.length;
                                                        var numCol = 10;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Encendido y Apagado';
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
                                                                //fields: ['fechaEA', 'horaEA', 'eventoEA', 'velocidadEA', 'latitudEA', 'longitudEA', 'bateriaEA', 'gsmEA', 'gpsEA', 'direccionEA']
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
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.fechaEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.horaEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.eventoEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.velocidadEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.latitudEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.longitudEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.bateriaEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.gsmEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.gpsEA + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEncendidoApag.data.items[i].data.direccionEA + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Registro de Encenedido y Apagado' + '.xml';
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
//                                gridViewDataEncApag.setTitle('<center>Vista de Encendido y apagado de vehículo: ' + storeDataEncApag.data.items[0].data.personaEncApag + '<br> Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                gridViewDataEncApag.setTitle('<center>Vista de Encendido y apagado de vehículo: ' + '<br> Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                var gridDataExcesos = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '40%',
                                    title: '<center>Encendido y apagado Totales ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                    store: storeDataEncApag,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 120, dataIndex: 'empresaEncApag', align: 'center'},
                                        {text: 'Persona', width: 210, dataIndex: 'personaEncApag', align: 'center'},
                                        {text: 'Placa', width: 100, dataIndex: 'placaEncApag', align: 'center'},
                                        {text: 'Equipo', width: 100, dataIndex: 'equipoEncApag', align: 'center'},
                                        {text: 'Cantidad', width: 100, dataIndex: 'totalEncApag', align: 'center'},
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function() {
                                                if (storeDataEncApag.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataEncApag.data.length;
                                                        var numCol = 6;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Cantidad de Equipos de Registro de Encendido y Apagados'
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
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Organización</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Persona</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
//                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Id Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Encendido-Apagado</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.empresaEncApag + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.personaEncApag + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.placaEncApag + " </Data></Cell > " +
//                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.idEquipoEncApag + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.equipoEncApag + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataEncApag.data.items[i].data.totalEncApag + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Evento Encendido y Apagado' + '.xml';
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
                                        itemclick: function(thisObj, record, item, index, e, eOpts) {
                                            idEquipoEA = record.get('idEquipoEncApag');
                                            persona = record.get('personaEncApag');
                                            bandera = 1;
                                            hayDatos = true;
                                            gridViewDataEncApag.setTitle('<center>Vista de Encendido y apagado de vehículo: ' + persona + ' <br> Equipo: ' + idEquipoEA + ' <br>Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                            storeViewEncendidoApag.load(
                                                    {
                                                        params: {
                                                            idEquipoEA: idEquipoEA,
                                                            fechaIniEA: dateIni.getRawValue(),
                                                            fechaFinEA: dateFin.getRawValue(),
                                                            horaIniEA: timeIniEncendidoApag.getRawValue(),
                                                            horaFinEA: timeFinEncendidoApag.getRawValue(),
                                                        }
                                                    });

                                        }
                                    }
                                });
                                var tabExcesos = Ext.create('Ext.container.Container', {
                                    title: 'Encendido y apagado Detallados',
                                    closable: true,
                                    iconCls: 'icon-encendido',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridViewDataEncApag, gridDataExcesos]
                                });
                                panelTabMapaAdmin.add(tabExcesos);
                                panelTabMapaAdmin.setActiveTab(tabExcesos);
                                VentanaEA.hide();
                            },
                            failure: function(form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: "No se existen datos para mostrar",
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        });
                    }else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function() {
                    VentanaEA.hide();
                }
            }]
    });
});
function showWinencendidoapagado() {
    if (!VentanaEA) {
        VentanaEA = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Reporte de Encendido y Apagado',
            iconCls: 'icon-encendido',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formEncendidoApag
        });
    }
    VentanaEA.show();
    formEncendidoApag.getForm().reset();
}

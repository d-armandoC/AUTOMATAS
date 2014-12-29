var formGeocercasReport;
var winGeocercasReport;
var bandera = 0;
var fechaIniGeocercasReport;
var dateFinGeocercasReport;
var horaIniGeocercaReport;
var horaFinGeocercaReport;
var personaGeocercasReport;
var idEquipoGeocercaReport;
var gridViewDatageocercaTotalReport;
var gridViewDataGeocercaGeneralReport;
var gridDataGeocercaReport;
var storeDataGeocercaReport;
var empresaGeocercaReport = 1;
var empresaNomGeocercaReport = 'KRADAC';
var cbxEmpresasBDGeocercaReport;
var cbxVehBDGeocercaReport;
var porEquipogeocercaReport = false;
var hayDatosgeocercaReport = false;
var gridViewDataGeocercaReport;




Ext.onReady(function () {

    cbxEmpresasBDGeocercaReport = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyParadas',
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
                cbxVehBDGeocercaReport.clearValue();
                cbxVehBDGeocercaReport.enable();
                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxGeocerca = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Geocerca:',
        name: 'cbxGeo',
        store: storeGeo,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Geocerca...',
        disabled: false,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 325
        }
    });



    cbxVehBDGeocercaReport = Ext.create('Ext.form.ComboBox', {
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
        }
    });


    var dateIniGeocerca = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniParada',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinGeocerca = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinParada',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });

    var timeIniGeocerca = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniParada',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinGeocerca = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinParada',
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
            dateIniGeocerca.setValue(nowDate);
            dateFinGeocerca.setValue(nowDate);
            timeIniGeocerca.setValue('00:00');
            timeFinGeocerca.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniGeocerca.setValue(yestDate);
            dateFinGeocerca.setValue(yestDate);
            timeIniGeocerca.setValue('00:00');
            timeFinGeocerca.setValue('23:59');
        }
    });
    var panelButtonsGeocercs = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnToday, btnYesterday]
    });

    formGeocercasReport = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    cbxEmpresasBDGeocercaReport,
                    cbxGeocerca,
                    cbxVehBDGeocercaReport
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniGeocerca,
                    dateFinGeocerca,
                    timeIniGeocerca,
                    timeFinGeocerca,
                    panelButtonsGeocercs
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    fechaIniGeocercasReport = dateIniGeocerca.getRawValue();
                    dateFinGeocercasReport = dateFinGeocerca.getRawValue();
                    var formulario = formGeocercasReport.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/getReportGeo.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: empresaGeocercaReport
                            },
                            success: function (form, action) {
                                var storeDataGeocercas = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_geocerca', 'geocerca', 'placa', 'estado', 'fecha_hora']
                                });
                                   var gridDataGeocercas = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '70%',
                                    title: '<center>Reporte de Geocercas' + '<br>Desde: ' + fechaIniGeocercasReport + ' | Hasta: ' + dateFinGeocercasReport + '</center>',
                                    store: storeDataGeocercas,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Geocerca', width: 150, dataIndex: 'geocerca', align: 'center'},
                                        {text: 'Placa', width: 100, dataIndex: 'placa', align: 'center'},
                                        {text: 'Estado', width: 100, dataIndex: 'estado', align: 'center'},
                                        {text: 'Fecha', width: 100, dataIndex: 'fecha_hora', align: 'center'}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeDataGeocercas.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataGeocercas.data.length;
                                                        var numCol = 4;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Geocercas';
                                                        var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                                                        table_div += "</DocumentProperties> " +
                                                                "<Styles> " +
                                                                "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                                "<Style ss:ID='datos'><NumberFormat ss:Format='@'/></Style> " +
                                                                "</Styles>";
                                                        //Definir el numero de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
                                                        table_div += "<Worksheet ss:Name='Geocercas'>"; //Nombre de la hoja
                                                        table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='60' ss:DefaultRowHeight='15'>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Geocerca</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Estado</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataGeocercas.data.items[i].data.geocerca + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataGeocercas.data.items[i].data.placa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataGeocercas.data.items[i].data.estado + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataGeocercas.data.items[i].data.fecha_hora + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Registro de Geocercas' + '.xml';
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
                                
                                var tabGeocercas = Ext.create('Ext.container.Container', {
                                    title: 'Geocercas',
                                    closable: true,
                                    iconCls: 'icon-reset',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridDataGeocercas]
                                });
                                panelTabMapaAdmin.add(tabGeocercas);
                                panelTabMapaAdmin.setActiveTab(tabGeocercas);
                                winGeocercasReport.hide();
                            },
                            failure: function (form, action) {
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
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winGeocercasReport.hide();
                }
            }]
    });
});
function ventanaReporteGeocerca() {
    if (!winGeocercasReport) {
        winGeocercasReport = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Geocercas',
            iconCls: 'icon-report-geo',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formGeocercasReport
        });
    }
    winGeocercasReport.show();
    formGeocercasReport.getForm().reset();
    cbxVehBDGeocercaReport.clearValue();
    cbxVehBDGeocercaReport.enable();
    storeVeh.load({
        params: {
            cbxEmpresas: formGeocercasReport.down('[name=idCompanyParadas]').getValue()
        }
    });
}
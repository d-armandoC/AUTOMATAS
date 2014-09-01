
var formularioGSM;
var VentanaGSM;
var banderaGSM = 0;
var storeViewGSM;
var fechaIni;
var fechaFin;
var personaGSM;
var gridViewDataGSM;
var storeViewExcesosGSM;
var storeDataGSM;
var empresaGSM = 1;
var id_empresagsms = 1;
var cbxEmpresasGSM;
var fechaInigsm;
var fechaFingsm;
var timeInigsm;
var timeFingsm;
var btn_Hoy;
var bt_Hayer;
var fechaIn;
var fechaFn;
Ext.onReady(function() {

    storeViewGSM = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getInfPerdidaGPS.php',
            reader: {
                type: 'json',
                root: 'countByGSM'
            }
        },
        fields: ['id_equipo',
            'equipo',
            'latitud',
            'longitud',
            'fecha_hora_reg',
            'fecha_hora',
            'velocidad',
            'bat',
            'gsm',
            'gps',
            'ign',
            'direccion',
            'evento',
            'parametro',
            'g1',
            'g2',
            'sal'
        ]
    });

    cbxEmpresasGSM = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'idempresagsm',
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
                id_empresagsms = records[0].data.id;
            }
        }
    });

    fechaInigsm = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniAsi',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinAsi',
        emptyText: 'Fecha Inicial...'
    });

    fechaFingsm = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinAsi',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniAsi',
        emptyText: 'Fecha Final...'
    });

    btn_Hoy = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            fechaInigsm.setValue(nowDate);
            fechaFingsm.setValue(nowDate);
            timeInigsm.setValue('00:01');
            timeFingsm.setValue('23:59');

        }
    });
    bt_Hayer = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaInigsm.setValue(yestDate);
            fechaFingsm.setValue(yestDate);
            timeInigsm.setValue('00:01');
            timeFingsm.setValue('23:59');
        }
    });

    timeInigsm = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    timeFingsm = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });


    var panel_Botonesgsm = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [
            {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn_Hoy
                ]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [bt_Hayer]
            }

        ]
    });
    formularioGSM = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        id: 'for_gsm',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos GSM</b>',
                items: [{
                        xtype: 'radiogroup',
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'General ', name: 'rb1', inputValue: '1', checked: true},
                            {boxLabel: 'Por Cooperativa', name: 'rb1', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb1'])) {
                                    case 1:
                                        empresaGSM = 1;
                                        cbxEmpresasGSM.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasGSM.enable();
                                        empresaGSM = cbxEmpresasGSM.getValue();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasGSM,
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaInigsm,
                    fechaFingsm,
                    timeInigsm,
                    , timeFingsm,
                    panel_Botonesgsm
                ]
            }],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {

                    fechaIn = fechaInigsm.getRawValue();
                    fechaFn = fechaFingsm.getRawValue();
                    horaIni = timeInigsm.getRawValue();
                    horaFin = timeFingsm.getRawValue();
                    var form = formularioGSM.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/getReportCountPerdidaGSM.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                cbxEmpresasPan: id_empresagsms,
                                fechaIni: fechaIn,
                                fechaFin: fechaFn,
                                horaIni: horaIni,
                                horaFin: horaFin
                            },
                            success: function(form, action) {
                                personaGSM;
                                gridViewDataGSM;
                                var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.countBygsm,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_equipo', 'total']
                                });



                                var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '40%',
                                    title: '<center>GPS Totales: ' + '<br>Desde: ' + fechaIn + ' | Hasta: ' + fechaFn + '</center>',
                                    store: storeDataReporteDetallado,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Equipo', width: 150, dataIndex: 'id_equipo', align: 'center'},
                                        {text: 'Total Perdida GSM', width: 150, dataIndex: 'total', align: 'center'}
                                    ],
                                    stripeRows: true,
                                    margins: '0 2 0 0',
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function() {
                                                if (storeDataReporteDetallado.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataReporteDetallado.data.length;
                                                        var numCol = 2;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Equipos con perdidad de GPS';
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
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='89.25'/>";
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total</Data></Cell>" +
                                                                "</Row>";

                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.id_equipo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.total + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Perdidas de GPS' + '.xml';
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
                                        itemclick: function(thisObj, record, item, index, e, eOpts) {
                                            var id_equipo = record.get('id_equipo');
                                            banderaGSM = 1;
                                            gridViewDataGSM.setTitle('<center>Lista de Datos Perdida GPS  <br>Empresa: ' + 'fechaInigsm' + ' Desde: ' + fechaIn + ' Hasta:' + fechaFn + '</center>');
                                            storeViewGSM.load({
                                                params: {
                                                    cbxEmpresasPan: id_empresagsms,
                                                    fechaIni: fechaIn,
                                                    fechaFin: fechaFn,
                                                    horaIni: horaIni,
                                                    horaFin: horaFin,
                                                    id_equipo: id_equipo
                                                }
                                            });
                                        }
                                    }
                                });
                                gridViewDataGSM = Ext.create('Ext.grid.Panel', {
                                    region: 'center',
                                    frame: true,
                                    width: '60%',
                                    title: '<center>Servicios GPS: ',
                                    store: storeViewGSM,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Equipo', width: 130, dataIndex: 'id_equipo', align: 'center'},
                                        {text: 'Latitud', width: 150, dataIndex: 'latitud', align: 'center'},
                                        {text: 'Longitud', width: 150, dataIndex: 'longitud', align: 'center'},
                                        {text: 'Fecha Hora Registro', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
                                        {text: 'Fecha', width: 200, dataIndex: 'fecha_hora', align: 'center'},
                                        {text: 'Velocidad', width: 170, dataIndex: 'velocidad', align: 'center'},
                                        {text: 'Bateria', width: 150, dataIndex: 'bat', align: 'center'},
                                        {text: 'GSM', width: 100, dataIndex: 'gsm', align: 'center'},
                                        {text: 'Gps', width: 100, dataIndex: 'gps', align: 'center'},
                                        {text: 'IGN', width: 100, dataIndex: 'ign', align: 'center'},
                                        {text: 'Dirección', width: 100, dataIndex: 'direccion', align: 'center'},
                                        {text: 'Evento', width: 200, dataIndex: 'evento', align: 'center'},
                                        {text: 'Parametro', width: 120, dataIndex: 'parametro', align: 'center'},
                                        {text: 'G1', width: 100, dataIndex: 'g1', align: 'center'},
                                        {text: 'G2', width: 100, dataIndex: 'g2', align: 'center'},
                                        {text: 'Sal', width: 100, dataIndex: 'sal', align: 'center'}
                                    ],
                                    stripeRows: true,
                                    margins: '0 2 0 0',
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function() {
                                                if (storeViewGSM.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeViewGSM.data.length;
                                                        var numCol = 16;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Equipos con perdidad de GPS Detallado';
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
                                                        table_div += "<Column ss:AutoFitWidth='0' ss:Width='89.25'/>";
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Latitud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Longitud</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha Hora Reg</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Bateria</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GSM</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>GPS</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>IGN</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Direccion</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Parametro</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>G1</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>G2</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>SAL</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.id_equipo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.latitud + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.longitud + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.fecha_hora_reg + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.fecha_hora + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.velocidad + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.bat + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.gsm + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.gps + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.ign + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.direccion + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.evento + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.parametro + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.g1 + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.g2 + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewGSM.data.items[i].data.sal + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Perdidas de GPS' + '.xml';
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
                                    title: 'Perdida GPS',
                                    closable: true,
                                    iconCls: 'icon-servicios',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 2000,
                                    region: 'center',
                                    items: [gridDataMantenimiento, gridViewDataGSM]
                                });
                                panelTabMapaAdmin.add(tabExces);
                                panelTabMapaAdmin.setActiveTab(tabExces);
                                VentanaGSM.hide();
                            },
                            failure: function(form, action) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    msg: action.result.msg,
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
                iconCls: 'icon-cancel',
                handler: function() {
                    VentanaGSM.hide();
                }
            }]
    });
});
function ReporteWinperdidaGSM() {
    if (!VentanaGSM) {
        VentanaGSM = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Perdida GSM',
            iconCls: 'icon-servicios',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formularioGSM
        });
    }
    formularioGSM.getForm().reset();
    cbxEmpresasGSM.disable();
    VentanaGSM.show();
}



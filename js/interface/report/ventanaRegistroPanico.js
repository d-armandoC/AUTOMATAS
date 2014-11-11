var formPanico;
var winPanico;
var bandera = 0;
//var storeViewPanico;
var dateStart;
var dateFinish;
var timeStart;
var timeFinish;
var persona;
var idEquipoPanico;
var gridViewDataPanicoTotal;
var gridViewDataPanicoGeneral;
var gridDataExcesos;
 var gridViewDataPanico;
var storeDataPanicoD;
var empresa = 1;
var empresaNom = 'KRADAC';
var cbxEmpresasBDPanico;
var cbxVehBDPanico;
var porEquipo = false;
var tabExcesos;
var hayDatos = false;
//var storeEmpresaPanicos;




Ext.onReady(function () {

    cbxEmpresasBDPanico = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyPanico',
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
                    cbxVehBDPanico.clearValue();
                    cbxVehBDPanico.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                }
            }
        }
    });

    cbxVehBDPanico = Ext.create('Ext.form.ComboBox', {
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


    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniPanico',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinPanico',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeInipanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniPanico',
        value: '00:01',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinpanico = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinPanico',
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
            dateIni.setValue(nowDate);
            dateFin.setValue(nowDate);
            timeInipanico.setValue('00:01');
            timeFinpanico.setValue('23:59');
        }
    });
    var btnYesterday = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIni.setValue(yestDate);
            dateFin.setValue(yestDate);
            timeInipanico.setValue('00:01');
            timeFinpanico.setValue('23:59');
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

    gridViewDataPanico = Ext.create('Ext.grid.Panel', {
        region: 'center',
        frame: true,
        width: '60%',
        title: '<center>Detalle: ',
        store: storeViewPanico,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {text: 'Velocidad', width: 130, dataIndex: 'velocidad', align: 'center', xtype: 'numbercolumn', format: '0.00'},
            {text: 'Fecha', width: 200, dataIndex: 'fecha', align: 'center'},
            {text: 'Hora', width: 200, dataIndex: 'hora', align: 'center'},
            {text: 'Evento', width: 250, dataIndex: 'evento', align: 'center'},
            {text: 'Latitud', width: 250, dataIndex: 'latitud', align: 'center'},
            {text: 'Longitud', width: 250, dataIndex: 'longitud', align: 'center'}
        ],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function () {
                    if (storeViewPanico.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            var data_type = 'data:application/vnd.ms-excel';
                            var numFil = storeViewPanico.data.length;
                            var numCol = 6;
                            var tiLetra = 'Calibri';
                            var titulo = 'Registro de Panico en la Fecha:' + storeViewPanico.data.items[0].data.fecha;
                            var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                            table_div += "</DocumentProperties> " +
                                    "<Styles> " +
                                    "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                    "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                    "<Style ss:ID='datos'><NumberFormat ss:Format='@'/></Style> " +
                                    "</Styles>";
                            //Definir el numero de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
                            table_div += "<Worksheet ss:Name='Datos'>"; //Nombre de la hoja
                            table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='60' ss:DefaultRowHeight='15'>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Hora</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Latitutd</Data></Cell>" +
                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Longitud</Data></Cell>" +
                                    "</Row>";
                            for (var i = 0; i < numFil; i++) {
                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.velocidad + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.fecha + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.hora + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.evento + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.latitud + " </Data></Cell > " +
                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewPanico.data.items[i].data.longitud + " </Data></Cell > " +
                                        "</Row>";
                            }
                            table_div += "</Table> </Worksheet></Workbook>";
                            var table_xml = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_xml;
                            a.download = 'Registro Panicos' + '.xml';
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

    formPanico = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Organización', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Por Equipo', name: 'rb', inputValue: '2'}

                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        empresa = 1;
                                        cbxEmpresasBDPanico.enable();
                                        cbxVehBDPanico.clearValue();
                                        cbxVehBDPanico.disable();
                                        porEquipo = false;
                                        break;
                                    case 2:
                                        porEquipo = true;
                                        empresa = cbxEmpresasBDPanico.getValue();
                                        empresaNom = cbxEmpresasBDPanico.getRawValue();
                                        if (porEquipo) {
                                            cbxVehBDPanico.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formPanico.down('[name=idCompanyPanico]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDPanico,
                    cbxVehBDPanico

                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIni,
                    dateFin,
                    timeInipanico,
                    timeFinpanico,
                    panelButtons
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    dateStart = dateIni.getRawValue();
                    dateFinish = dateFin.getRawValue();
                    var formulario = formPanico.getForm();
                    formulario.submit({
                        url: 'php/interface/report/panicos/getPanicos.php',
                        waitTitle: 'Procesando...',
                        waitMsg: 'Obteniendo Información',
                        params: {
                            idCompany: empresa
                        },
                        ///////////////////
                        success: function (form, action) {
                            var storeDataExcesos = Ext.create('Ext.data.JsonStore', {
                                data: action.result.data,
                                proxy: {
                                    type: 'ajax',
                                    reader: 'array'
                                },
                                fields: ['empresaPanicos', 'personaPanicos', 'idEquipoPanicos', 'placaPanicos', 'cantidadPanicos']
                            });
                            storeViewPanico.load(
                                    {
                                        params: {
                                            idEquipo: storeDataExcesos.data.items[0].data.idEquipoPanicos,
                                            fechaIni: dateIni.getRawValue(),
                                            fechaFin: dateFin.getRawValue(),
                                            horaIniP: timeInipanico.getRawValue(),
                                            horaFinP: timeFinpanico.getRawValue(),
                                        }
                                    });
                            gridViewDataPanico.setTitle('<center>Vista de Panicos: ' + storeDataExcesos.data.items[0].data.personaPanicos + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                            gridDataExcesos = Ext.create('Ext.grid.Panel', {
                                region: 'west',
                                frame: true,
                                width: '40%',
                                title: '<center>Panicos Totales ' + '<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + '</center>',
                                store: storeDataExcesos,
                                features: [filters],
                                multiSelect: true,
                                viewConfig: {
                                    emptyText: 'No hay datos que Mostrar'
                                },
                                columns: [
                                    Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                    {text: 'Empresa', width: 150, dataIndex: 'empresaPanicos', align: 'center'},
                                    {text: 'Placa', width: 100, dataIndex: 'placaPanicos', align: 'center'},
                                    {text: 'Cantidad', width: 100, dataIndex: 'cantidadPanicos', align: 'center'},
                                ],
                                tbar: [{
                                        xtype: 'button',
                                        iconCls: 'icon-excel',
                                        text: 'Exportar a Excel',
                                        handler: function () {
                                            if (storeDataExcesos.getCount() > 0) {
                                                if (getNavigator() === 'img/chrome.png') {
                                                    var a = document.createElement('a');
                                                    var data_type = 'data:application/vnd.ms-excel';
                                                    var numFil = storeDataExcesos.data.length;
                                                    var numCol = 3;
                                                    var tiLetra = 'Calibri';
                                                    var titulo = 'Registro de Panico';
                                                    var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                                                    table_div += "</DocumentProperties> " +
                                                            "<Styles> " +
                                                            "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                                            "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                            "<Style ss:ID='datos'><NumberFormat ss:Format='@'/></Style> " +
                                                            "</Styles>";
                                                    //Definir el numero de columnas y cantidad de filas de la hoja de calculo (numFil + 2))
                                                    table_div += "<Worksheet ss:Name='Datos'>"; //Nombre de la hoja
                                                    table_div += "<Table ss:ExpandedColumnCount='" + numCol + "' ss:ExpandedRowCount='" + (numFil + 2) + "' x:FullColumns='1' x:FullRows='1' ss:DefaultColumnWidth='60' ss:DefaultRowHeight='15'>";
                                                    table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                                                    table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                    table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                    table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                    table_div += "<Row ss:AutoFitHeight='0'>" +
                                                            "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                            "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                            "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Cantidad de Panicos</Data></Cell>" +
                                                            "</Row>";
                                                    for (var i = 0; i < numFil; i++) {
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataExcesos.data.items[i].data.empresaPanicos + " </Data></Cell > " +
                                                                "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataExcesos.data.items[i].data.placaPanicos + " </Data></Cell > " +
                                                                "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataExcesos.data.items[i].data.cantidadPanicos + " </Data></Cell > " +
                                                                "</Row>";
                                                    }
                                                    table_div += "</Table> </Worksheet></Workbook>";
                                                    var table_xml = table_div.replace(/ /g, '%20');
                                                    a.href = data_type + ', ' + table_xml;
                                                    a.download = 'Registro Panicos' + '.xml';
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
                                        idEquipoPanico = record.get('idEquipoPanicos');
                                        persona = record.get('personaPanicos');
                                        bandera = 1;
                                        hayDatos = true;
                                        gridViewDataPanico.setTitle('<center>Vista de Panicos: ' + persona + ' <br> Equipo: ' + idEquipoPanico + ' Desde: ' + dateStart + ' Hasta:' + dateFinish + '</center>');
                                        storeViewPanico.load(
                                                {
                                                    params: {
                                                        idEquipo: idEquipoPanico,
                                                        fechaIni: dateIni.getRawValue(),
                                                        fechaFin: dateFin.getRawValue(),
                                                        horaIniP: timeInipanico.getRawValue(),
                                                        horaFinP: timeFinpanico.getRawValue(),
                                                    }
                                                });
                                    }
                                }
                            });
//                           

                            tabExcesos = Ext.create('Ext.container.Container', {
                                title: 'Panicos Detallados',
                                closable: true,
                                iconCls: 'icon-reset',
                                layout: 'border',
                                fullscreen: true,
                                height: 485,
                                width: 2000,
                                region: 'center',
                                items: [gridDataExcesos, gridViewDataPanico]
//                                items: [gridDataExcesos]
                            });

                            panelTabMapaAdmin.add(tabExcesos);
                            panelTabMapaAdmin.setActiveTab(tabExcesos);
                            winPanico.hide();
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
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winPanico.hide();
                }
            }]
    });
});
function showWinPanicosDaily() {
    if (!winPanico) {
        winPanico = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Panicos Totales',
            iconCls: 'icon-reset',
            resizable: false,
            width: 350,
            height: 370,
            closeAction: 'hide',
            plain: false,
            items: formPanico
        });
    }
    winPanico.show();
    formPanico.getForm().reset();

    ////////////////////////
}

var formularioEnerg;
var VentanaEnerg;
var banderaEnerg = 0;
var storeViewEnerg;
var fechaInicioEnerg;
var fechaFinalEnerg;
var personaEnerg;
var gridViewDataEnerg;
var storeViewExcesosEnerg;
var storeDataEnerg;
var empresaEnerg = 1;
var cbxEmpresasEnerg;
var vistaVistaRegistrosEnerg;
var modalEleccionBusqEnerg = 1;
var id_vehiculoEnerg;
var vehiculoEnerg;
var id_empresaEnergiz;

Ext.onReady(function() {


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
        fields: ['fechaED', 'horaED', 'eventoED', 'velocidadED', 'latitudED', 'longitudED', 'bateriaED', 'gsmED', 'gpsED', 'direccionED']
    });

    cbxEmpresasEnerg = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'idCompanyExcesos',
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
                id_empresaEnergiz = records[0].data.id;
            }
        }
    });

    var fechaIniEnerg = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaInimanten',
        name: 'fechaInimanten',
        value: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinExcesos',
        emptyText: 'Fecha Inicial...'
    });
    var fechaFinEnerg = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinManten',
        name: 'fechaFinManten',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaInimanten',
        emptyText: 'Fecha Final...'
    });
    var btn_HoyEnerg = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            fechaIniEnerg.setValue(nowDate);
            fechaFinEnerg.setValue(nowDate);
        }
    });
    var bt_HayerEnerg = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIniEnerg.setValue(yestDate);
            fechaFinEnerg.setValue(yestDate);
        }
    });
    var panel_BotonesEnerg = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btn_HoyEnerg, bt_HayerEnerg]
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
                items: [{
                        xtype: 'radiogroup',
// fieldLabel: ' ',
// Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: 'General ', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Por Cooperativa', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        modalEleccionBusqEnerg = 1;
                                        cbxEmpresasEnerg.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasEnerg.enable();
                                        modalEleccionBusqEnerg = 2;
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasEnerg
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIniEnerg,
                    fechaFinEnerg,
                    panel_BotonesEnerg
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    var id_valor = this.up('form').down('[name=rb]').getValue();
                    fechaInicioEnerg = fechaIniEnerg.getRawValue();
                    fechaFinalEnerg = fechaFinEnerg.getRawValue();
                    var form = formularioEnerg.getForm();
                    if (modalEleccionBusqEnerg === 1) {
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/energizaDesenegizar/getReportGeneralEnergDes.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                success: function(form, action) {
                                    personaEnerg;
                                    gridViewDataEnerg;
                                    fechaIn = fechaInigsm.getRawValue();
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['empresaEneDes', 'personaEneDes', 'placaEneDes', 'idEquipoEneDes', 'equipoEneDes', 'totalEneDes']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Registro de Eventos de Encendido y Apagado ' + '<br>Desde: ' + fechaInicioEnerg + ' | Hasta: ' + fechaFinalEnerg + '</center>',
                                        store: storeDataReporteDetallado,
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
                                                    if (storeDataReporteDetallado.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
                                                            var data_type = 'data:application/vnd.ms-excel';
                                                            var numFil = storeDataReporteDetallado.data.length;
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
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Persona</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Evento</Data></Cell>" +
                                                                    "</Row>";
                                                            for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.mpresaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.personaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.placaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.equipoEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.totalEneDes + " </Data></Cell > " +
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
                                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Detalles',
                                                            disabled: false,
                                                            handler: function(widget, event) {
//                                                                if (vistaVistaRegistrosEnerg) {
//                                                                    vistaVistaRegistrosEnerg.hide();
//                                                                }
//                                                                metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
//                                                                vistaVistaRegistrosEnerg.show();
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            },
                                            itemclick: function(thisObj, record, item, index, e, eOpts) {
                                                modalEleccionBusqEnerg = record.get('mpresaEneDes');
                                                vehiculoEnerg = record.get('vehiculo');
                                                var equipo = record.get('idEquipoEneDes');
                                                banderaEnerg = 1;

                                                gridViewDataEnerg.setTitle('<center>Lista de Equipos con Evento de Encendido y Apagado <br>Empresa: ' + modalEleccionBusqEnerg + ' Desde: ' + fechaInicioEnerg + ' Hasta:' + fechaFinalEnerg + '</center>');
                                                storeViewEnerg.load({
                                                    params: {
                                                        dateIniEncApag: fechaIniEnerg.getRawValue(),
                                                        dateFinEncApag: fechaFinEnerg.getRawValue(),
                                                        idEquipo: equipo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataEnerg = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Evento de Encendido y Apagado: ',
                                        store: storeViewEnerg,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
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
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: 'Encenddos y Apagados',
                                        closable: true,
                                        iconCls: 'icon-servicios',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataEnerg]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    VentanaEnerg.hide();
                                },
                                failure: function(form, action) {
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
                if (modalEleccionBusqEnerg === 2) {
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/energizaDesenegizar/getReportCooperativaEnerDes.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                success: function(form, action) {
                                    personaEnerg;
                                    gridViewDataEnerg;
                                    fechaIn = fechaInigsm.getRawValue();
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['empresaEneDes', 'personaEneDes', 'placaEneDes', 'idEquipoEneDes', 'equipoEneDes', 'totalEneDes']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Registro de Eventos de Encendido y Apagado ' + '<br>Desde: ' + fechaInicioEnerg + ' | Hasta: ' + fechaFinalEnerg + '</center>',
                                        store: storeDataReporteDetallado,
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
                                                    if (storeDataReporteDetallado.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
                                                            var data_type = 'data:application/vnd.ms-excel';
                                                            var numFil = storeDataReporteDetallado.data.length;
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
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='121.5'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Column ss:AutoFitWidth='0' ss:Width='100'/>";
                                                            table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Persona</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Evento</Data></Cell>" +
                                                                    "</Row>";
                                                            for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.mpresaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.personaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.placaEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.equipoEneDes + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.totalEneDes + " </Data></Cell > " +
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
                                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Detalles',
                                                            disabled: false,
                                                            handler: function(widget, event) {
//                                                                if (vistaVistaRegistrosEnerg) {
//                                                                    vistaVistaRegistrosEnerg.hide();
//                                                                }
//                                                                metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
//                                                                vistaVistaRegistrosEnerg.show();
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            },
                                            itemclick: function(thisObj, record, item, index, e, eOpts) {
                                                modalEleccionBusqEnerg = record.get('mpresaEneDes');
                                                vehiculoEnerg = record.get('vehiculo');
                                                var equipo = record.get('idEquipoEneDes');
                                                banderaEnerg = 1;

                                                gridViewDataEnerg.setTitle('<center>Lista de Equipos con Evento de Encendido y Apagado <br>Empresa: ' + modalEleccionBusqEnerg + ' Desde: ' + fechaInicioEnerg + ' Hasta:' + fechaFinalEnerg + '</center>');
                                                storeViewEnerg.load({
                                                    params: {
                                                        dateIniEncApag: fechaIniEnerg.getRawValue(),
                                                        dateFinEncApag: fechaFinEnerg.getRawValue(),
                                                        idEquipo: equipo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataEnerg = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Evento de Encendido y Apagado: ',
                                        store: storeViewEnerg,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
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
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: 'Encenddos y Apagados',
                                        closable: true,
                                        iconCls: 'icon-servicios',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataEnerg]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    VentanaEnerg.hide();
                                },
                                failure: function(form, action) {
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
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    VentanaEnerg.hide();
                }
            }]
    });
});


//function limpiarPanelG() {
//    if (vistaVistaRegistrosEnerg) {
//        vistaVistaRegistrosEnerg.hide();
//    }
//
//}

//
//function metodoRegistros(empresa, vehiculo, total, fechaSoatReg, fechaSoatVenc, descripSoat, fechaMatriculaReg,
//        fechaMatriculaVenc, descripMatricula, fechaSeguroReg, fechaSeguroVenc, descripSeguro) {
//    vistaVistaRegistrosEnerg = Ext.create('Ext.window.Window', {
//        layout: 'fit',
//        title: 'Estado de Equipos',
//        iconCls: 'icon-company',
//        resizable: true,
//        width: 400,
//        height: 300,
//        closeAction: 'hide',
//        plain: true,
//        items: [{
//                xtype: 'form',
////                id: 'contenedoresg',
////                name: 'contenedoresg',
//                autoScroll: true,
//                width: 300,
//                height: 390,
//                items: [
//                    {html: '<TABLE id="tablestados">' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon_empresa.png"> <b>EMPRESA:</b></td>' +
//                                '   <TD align="CENTER ">' + empresa + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon_car.png"> <b>VEHICULO:</b></td>' +
//                                '   <TD align="CENTER ">' + vehiculo + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de SOAT:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaSoatReg + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de SOAT:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaSoatReg + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Matricula:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaMatriculaReg + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Matricula:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaMatriculaVenc + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Seguro:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaSeguroReg + '</TD> ' +
//                                '</TR> ' +
//                                '<TR class="alt"> ' +
//                                '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Seguro:</b></td>' +
//                                '   <TD align="CENTER ">' + fechaSeguroVenc + '</TD> ' +
//                                '</TR> ' +
//                                ' </TABLE>'
//                    }
//                ]
//                ,
//                buttons: [
//                    {
//                        text: 'Cerrar',
//                        tooltip: 'Cerrar',
//                        handler: limpiarPanelG
//                    }
//                ]}
//
//        ]
//    });
//}



function showWinEnergizcion() {
    if (!VentanaEnerg) {
        VentanaEnerg = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: ' Evento de Energización',
            iconCls: 'icon-on-off',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formularioEnerg
        });
    }
    formularioEnerg.getForm().reset();
    cbxEmpresasEnerg.disable();
    VentanaEnerg.show();
}




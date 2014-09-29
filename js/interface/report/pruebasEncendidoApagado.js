
var formularioEA;
var VentanaEA;
var banderaEA = 0;
var storeViewEA;
var fechaInicioEA;
var fechaFinalEA;
var personaEA;
var gridViewDataEA;
var storeViewExcesosEA;
var storeDataea;
var empresaEA = 1;
var cbxEmpresasEA;
var modalEleccionBusqueda = 1;
var id_vehiculoEA;
var vehiculoEA;
var id_empresa;

Ext.onReady(function() {


    storeViewEA = Ext.create('Ext.data.JsonStore', {
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

    cbxEmpresasEA = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyEncApg',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: 1,
        listeners: {
            select: function(combo, records, eOpts) {
                id_empresa = records[0].data.id;
            }
        }
    });

    var fechaIniEA = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEncApg',
        name: 'fechaInimanten',
        value: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        endDateField: 'fechaFinEncApg',
        emptyText: 'Fecha Inicial...'
    });
    var fechaFinEA = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinEncApg',
        name: 'fechaFinManten',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniEncApg',
        emptyText: 'Fecha Final...'
    });
    var btn_HoyEApagado = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDates = new Date();
            fechaIniEA.setValue(nowDates);
            fechaFinEA.setValue(nowDates);
        }
    });
    var bt_HayerEApagado = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var yestDates = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIniEA.setValue(yestDates);
            fechaFinEA.setValue(yestDates);
        }
    });
    var panel_BotonEA = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btn_HoyEApagado, bt_HayerEApagado]
    });
    formularioEA = Ext.create('Ext.form.Panel', {
        xtype:'form',
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
                            {boxLabel: 'General ', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Por Organización', name: 'rb', inputValue: '2'},
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        modalEleccionBusqueda=1;
                                        cbxEmpresasEA.disable();
                                        break;
                                    case 2:
                                        cbxEmpresasEA.enable();
                                        modalEleccionBusqueda = 2;
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasEA
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIniEA,
                    fechaFinEA,
                    panel_BotonEA
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    var id_valor = this.up('form').down('[name=rb]').getValue();
                    fechaInicioEA = fechaIniEA.getRawValue();
                    fechaFinalEA = fechaFinEA.getRawValue();
                    var form = formularioEA.getForm();
                    if (modalEleccionBusqueda === 1) {
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/encendidoApagado/getReportGeneralEncApag.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                success: function(form, action) {
                                    personaEA;
                                    gridViewDataEA;
                                    fechaIn = fechaInigsm.getRawValue();
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['empresaEncApag', 'personaEncApag', 'placaEncApag', 'idEquipoEncApag', 'equipoEncApag', 'totalEncApag']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Registro de Eventos de Encendido y Apagado ' + '<br>Desde: ' + fechaInicioEA + ' | Hasta: ' + fechaFinalEA + '</center>',
                                        store: storeDataReporteDetallado,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Organización', width: 150, dataIndex: 'empresaEncApag', align: 'center'},
                                            {text: 'Persona', width: 150, dataIndex: 'personaEncApag', align: 'center'},
                                            {text: 'placa', width: 130, dataIndex: 'placaEncApag', align: 'center'},
                                            {text: 'Id Equipo', width: 165, dataIndex: 'idEquipoEncApag', align: 'center'},
                                            {text: 'Eqquipo Enc. Apaga.', width: 150, dataIndex: 'equipoEncApag', align: 'center'},
                                            {text: 'Total Ec. Apag.', width: 170, dataIndex: 'totalEncApag', align: 'center'}
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
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Id Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Encendido y Apagado</Data></Cell>" +
                                                                    "</Row>";
                                                            for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.empresaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.personaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.placaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.idEquipoEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.equipoEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.totalEncApag + " </Data></Cell > " +
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
                                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Detalles',
                                                            disabled: false,
                                                            handler: function(widget, event) {
//                                                                if (vistaVistaRegistrosEA) {
//                                                                    vistaVistaRegistrosEA.hide();
//                                                                }
                                                            //metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
                                                                //vistaVistaRegistrosEA.show();
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            },
                                            itemclick: function(thisObj, record, item, index, e, eOpts) {
                                               var empresa = record.get('empresaEncApag');
                                                id_vehiculoEA = record.get('id_vehiculo');
                                                vehiculoEA = record.get('vehiculo');
                                                var equipo = record.get('idEquipoEncApag');
                                                banderaEA = 1;

                                                gridViewDataEA.setTitle('<center>Lista de Equipos con Evento de Encendido y Apagado <br>Empresa: ' + empresa + ' Desde: ' + fechaInicioEA + ' Hasta:' + fechaFinalEA + '</center>');
                                                storeViewEA.load({
                                                    params: {
                                                        dateIniEncApag: fechaIniEA.getRawValue(),
                                                        dateFinEncApag: fechaFinEA.getRawValue(),
                                                        idEquipo: equipo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataEA = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Evento de Encendido y Apagado: ',
                                        store: storeViewEA,
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
                                                    if (storeViewEA.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
                                                            var data_type = 'data:application/vnd.ms-excel';
                                                            var numFil = storeViewEA.data.length;
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
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.fechaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.horaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.eventoEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.velocidadEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.latitudEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.longitudEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.bateriaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.gsmEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.gpsEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.direccionEA + " </Data></Cell > " +
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
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: 'Encendido y Apagado',
                                        closable: true,
                                        iconCls: 'icon-servicios',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataEA]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    VentanaEA.hide();
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
                    if (modalEleccionBusqueda === 2) {
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/interface/report/encendidoApagado/getReportCooperativaEncApag.php',
                                waitTitle: 'Procesando...',
                                waitMsg: 'Obteniendo Información',
                                params: {
                                    cbxEmpresasPan: id_empresa,
                                },
                                success: function(form, action) {
                                    personaEA;
                                    gridViewDataEA;
                                    fechaIn = fechaInigsm.getRawValue();
                                    var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                        data: action.result.data,
                                        proxy: {
                                            type: 'ajax',
                                            reader: 'array'
                                        },
                                        fields: ['empresaEncApag', 'personaEncApag', 'placaEncApag', 'idEquipoEncApag', 'equipoEncApag', 'totalEncApag']
                                    });
                                    var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                        region: 'west',
                                        frame: true,
                                        width: '40%',
                                        title: '<center>Registro de Eventos de Encendido y Apagado ' + '<br>Desde: ' + fechaInicioEA + ' | Hasta: ' + fechaFinalEA + '</center>',
                                        store: storeDataReporteDetallado,
                                        features: [filters],
                                        multiSelect: true,
                                        viewConfig: {
                                            emptyText: 'No hay datos que Mostrar'
                                        },
                                        columns: [
                                            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                            {text: 'Empresa', width: 150, dataIndex: 'empresaEncApag', align: 'center'},
                                            {text: 'Persona', width: 150, dataIndex: 'personaEncApag', align: 'center'},
                                            {text: 'placa', width: 130, dataIndex: 'placaEncApag', align: 'center'},
                                            {text: 'Id Equipo', width: 165, dataIndex: 'idEquipoEncApag', align: 'center'},
                                            {text: 'Eqquipo Enc. Apaga.', width: 150, dataIndex: 'equipoEncApag', align: 'center'},
                                            {text: 'Total Ec. Apag.', width: 170, dataIndex: 'totalEncApag', align: 'center'}
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
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Persona</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Id Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Encendido y Apagado</Data></Cell>" +
                                                                    "</Row>";
                                                            for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.empresaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.personaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.placaEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.idEquipoEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.equipoEncApag + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.totalEncApag + " </Data></Cell > " +
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
                                            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                                                e.stopEvent();
                                                Ext.create('Ext.menu.Menu', {
                                                    items: [
                                                        Ext.create('Ext.Action', {
                                                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                                                            text: 'Ver Detalles',
                                                            disabled: false,
                                                            handler: function(widget, event) {
                                                                if (vistaVistaRegistrosEA) {
                                                                    vistaVistaRegistrosEA.hide();
                                                                }
                                                                //metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
//                                                                vistaVistaRegistrosEA.show();
                                                            }
                                                        })
                                                    ]
                                                }).showAt(e.getXY());
                                                return false;
                                            },
                                            itemclick: function(thisObj, record, item, index, e, eOpts) {
                                                var empresa = record.get('empresaEncApag');
                                                id_vehiculoEA = record.get('id_vehiculo');
                                                vehiculoEA = record.get('vehiculo');
                                                var equipo = record.get('idEquipoEncApag');
                                                banderaEA = 1;

                                                gridViewDataEA.setTitle('<center>Lista de Equipos con Evento de Encendido y Apagado <br>Empresa: ' + empresa + ' Desde: ' + fechaInicioEA + ' Hasta:' + fechaFinalEA + '</center>');
                                                storeViewEA.load({
                                                    params: {
                                                        dateIniEncApag: fechaIniEA.getRawValue(),
                                                        dateFinEncApag: fechaFinEA.getRawValue(),
                                                        idEquipo: equipo
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    gridViewDataEA = Ext.create('Ext.grid.Panel', {
                                        region: 'center',
                                        frame: true,
                                        width: '60%',
                                        title: '<center>Evento de Encendido y Apagado: ',
                                        store: storeViewEA,
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
                                                    if (storeViewEA.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
                                                            var data_type = 'data:application/vnd.ms-excel';
                                                            var numFil = storeViewEA.data.length;
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
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.fechaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.horaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.eventoEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.velocidadEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.latitudEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.longitudEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.bateriaEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.gsmEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.gpsEA + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewEA.data.items[i].data.direccionEA + " </Data></Cell > " +
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
                                    var tabExces = Ext.create('Ext.container.Container', {
                                        title: 'Encendido y Apagados',
                                        closable: true,
                                        iconCls: 'icon-servicios',
                                        layout: 'border',
                                        fullscreen: true,
                                        height: 485,
                                        width: 2000,
                                        region: 'center',
                                        items: [gridDataMantenimiento, gridViewDataEA]
                                    });
                                    panelTabMapaAdmin.add(tabExces);
                                    panelTabMapaAdmin.setActiveTab(tabExces);
                                    VentanaEA.hide();
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
            title: ' Evento de Encendido y Apagado',
            iconCls: 'icon-encendido',
            resizable: false,
            width: 350,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: formularioEA
        });
    }
    formularioEA.getForm().reset();
    cbxEmpresasEA.disable();
    VentanaEA.show();
}



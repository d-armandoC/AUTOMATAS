
var formularioMantenimientoDetallado;
        var VentanaMantenimiento;
        var storeViewMantenimiento;
        var fechaInicio;
        var fechaFinal;
        var horaInicio;
        var horaFinal;
        var personaMantenimiento;
        var gridViewDataMantenimiento;
        var storeViewExcesosMantenimiento;
        var storeDataMantenimiento;
        var empresaMantenimiento = 1;
        var cbxEmpresasMantenimiento;
        var vistaVistaRegistrosMantenimiento;
        var id_vehiculo;
        var vehiculo;
        var porEquipoManten;
        var cbxVehBDManten;
        var timeIniMantenimiento;
        var timeFinMantenimiento;
        var placa;
        var empresa;
        var banderaMantenimiento;
        Ext.onReady(function () {
        if (idCompanyKarview == 1) {
        banderaMantenimiento = 1;
        } else {
        banderaMantenimiento = storeEmpresas.data.items[0].data.id;
        }

        cbxEmpresasMantenimiento = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
                name: 'idCompanyMantenimiento',
                store: storeEmpresas,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                emptyText: 'Seleccionar Organización...',
                editable: false,
                allowBlank: false,
                value: banderaMantenimiento,
                listeners: {
                select: function (combo, records, eOpts) {
                if (porEquipoManten) {
                cbxVehBDManten.clearValue();
                        cbxVehBDManten.enable();
                        storeVeh.load({
                        params: {
                        cbxEmpresas: records[0].data.id
                        }
                        });
                }
                }
                }
        });
                storeViewMantenimiento = Ext.create('Ext.data.JsonStore', {
                autoDestroy: true,
                        proxy: {
                        type: 'ajax',
                                url: 'php/interface/report/getREporteMantenimientoDetallado.php',
                                reader: {
                                type: 'json',
                                        root: 'data'
                                }
                        },
                        fields: ['vehiculo', 'placa',
                                'marca',
                                'estendar',
                                'idTipoServicio', 'responsable']
                });
                cbxVehBDManten = Ext.create('Ext.form.ComboBox', {
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
                var fechaIniMantenimiento = Ext.create('Ext.form.field.Date', {
                fieldLabel: 'Desde el',
                        format: 'Y-m-d',
                        id: 'fechaInimanten',
                        name: 'fechaInimanten',
                        value: new Date(),
                        maxValue: new Date(),
                        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
                        allowBlank: false,
                        endDateField: 'fechaFinExcesos',
                        emptyText: 'Fecha Inicial...'
                });
                var fechaFinMantenimiento = Ext.create('Ext.form.field.Date', {
                fieldLabel: 'Hasta el',
                        format: 'Y-m-d',
                        id: 'fechaFinManten',
                        value: new Date(),
                        maxValue: new Date(),
                        name: 'fechaFinManten',
                        vtype: 'daterange',
                        allowBlank: false,
                        startDateField: 'fechaInimanten',
                        emptyText: 'Fecha Final...'
                });
                timeIniMantenimiento = Ext.create('Ext.form.field.Time', {
                fieldLabel: 'Desde las',
                        name: 'horaInManten',
                        value: '00:00',
                        format: 'H:i',
                        allowBlank: false,
                        emptyText: 'Hora Inicial...',
                        listConfig: {
                        minWidth: 300
                        }
                });
                timeFinMantenimiento = Ext.create('Ext.form.field.Time', {
                fieldLabel: 'Hasta las',
                        name: 'horaFinManten',
                        value: '23:59',
                        format: 'H:i',
                        allowBlank: false,
                        emptyText: 'Hora final...',
                        listConfig: {
                        minWidth: 450
                        }
                });
                var btn_HoyMnatenimiento = Ext.create('Ext.button.Button', {
                text: 'Hoy',
                        iconCls: 'icon-today',
                        handler: function () {
                        var nowDate = new Date();
                                fechaIniMantenimiento.setValue(nowDate);
                                fechaFinMantenimiento.setValue(nowDate);
                        }
                });
                var bt_HayerMantenimiento = Ext.create('Ext.button.Button', {
                text: 'Ayer',
                        iconCls: 'icon-yesterday',
                        handler: function () {
                        var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
                                fechaIniMantenimiento.setValue(yestDate);
                                fechaFinMantenimiento.setValue(yestDate);
                        }
                });
                var panel_BotonesMantenimiento = Ext.create('Ext.panel.Panel', {
                layout: 'hbox',
                        padding: '0 0 5 0',
                        defaults: {
                        margin: '0 5 0 0'
                        },
                        items: [btn_HoyMnatenimiento, bt_HayerMantenimiento]
                });
                formularioMantenimientoDetallado = Ext.create('Ext.form.Panel', {
                bodyPadding: '10 10 0 10',
                        fieldDefaults: {
                        labelAlign: 'left',
                                anchor: '100%'
                        },
                        items: [
                        {
                        xtype: 'fieldset',
                                title: '<b>Datos</b>',
                                items: [
                                {
                                xtype: 'radiogroup',
                                        columns: 2,
                                        vertical: true,
                                        items: [
                                        {boxLabel: 'Por Organización', name: 'rb3', inputValue: '1', checked: true},
                                        {boxLabel: 'Por Vehiculo', name: 'rb3', inputValue: '2'}
                                        ],
                                        listeners: {
                                        change: function (field, newValue, oldValue) {
                                        switch (parseInt(newValue['rb3'])) {
                                        case 1:
                                                empresaMantenimiento = 1;
                                                cbxEmpresasMantenimiento.enable();
                                                cbxVehBDManten.clearValue();
                                                cbxVehBDManten.disable();
                                                porEquipoManten = false;
                                                break;
                                                case 2:
                                                porEquipoManten = true;
                                                empresaMantenimiento = cbxEmpresasMantenimiento.getValue();
                                                if (porEquipoManten) {
                                        cbxVehBDManten.enable();
                                                storeVeh.load({
                                                params: {
                                                cbxEmpresas: formularioMantenimientoDetallado.down('[name=idCompanyMantenimiento]').getValue()
                                                }
                                                });
                                        }
                                        break;
                                        }
                                        }
                                        }
                                },
                                        cbxEmpresasMantenimiento,
                                        cbxVehBDManten
                                ]
                        },
                        {
                        xtype: 'fieldset',
                                title: '<b>Fechas</b>',
                                items: [
                                        fechaIniMantenimiento,
                                        fechaFinMantenimiento,
                                        timeIniMantenimiento,
                                        timeFinMantenimiento,
                                        panel_BotonesMantenimiento
                                ]
                        }

                        ],
                        buttons: [
                        {
                        text: 'Obtener',
                                iconCls: 'icon-consultas',
                                handler: function () {
                                fechaInicio = fechaIniMantenimiento.getRawValue();
                                        fechaFinal = fechaFinMantenimiento.getRawValue();
                                        horaInicio = timeIniMantenimiento.getRawValue();
                                        horaFinal = timeFinMantenimiento.getRawValue();
                                        var form = formularioMantenimientoDetallado.getForm();
                                        if (form.isValid()) {
                                form.submit({
                                url: 'php/interface/report/getObtenerReportGeneralDetallado.php',
                                        waitTitle: 'Procesando...',
                                        waitMsg: 'Obteniendo Información',
                                        success: function (form, action) {
                                        personaMantenimiento;
                                                gridViewDataMantenimiento;
//                                                fechaIn = fechaInigsm.getRawValue();
                                                var storeDataReporteDetallado = Ext.create('Ext.data.JsonStore', {
                                                data: action.result.countByMantenimiento,
                                                        proxy: {
                                                        type: 'ajax',
                                                                reader: 'array'
                                                        },
                                                        fields: ['id_vehiculo', 'empresa', 'vehiculo', 'total', 'descripSoat', 'fechaSoatVenc', 'descripMatricula', 'fechaMatriculaVenc', 'descripSeguro', 'fechaSeguroVenc']
                                                });
                                                var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                                region: 'west',
                                                        frame: true,
                                                        width: '40%',
                                                        title: '<center>Mantenimientos Totales: ' + '<br>Desde: ' + fechaInicio + ' | Hasta: ' + fechaFinal + '</center>',
                                                        store: storeDataReporteDetallado,
                                                        features: [filters],
                                                        multiSelect: true,
                                                        viewConfig: {
                                                        emptyText: 'No hay datos que Mostrar'
                                                        },
                                                        columns: [
                                                                Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                                        {text: 'Organización', width: 150, dataIndex: 'empresa', align: 'center'},
                                                        {text: 'Vehiculo', width: 160, dataIndex: 'vehiculo', align: 'center'},
                                                        {text: 'Total Mantenimientos', width: 165, dataIndex: 'total', align: 'center'},
                                                        {text: 'SOAT ', width: 150, dataIndex: 'fechaSoatVenc', align: 'center', renderer: formatTipoRegistro},
                                                        {text: 'MATRICULA ', width: 170, dataIndex: 'fechaMatriculaVenc', align: 'center', renderer: formatTipoRegistro},
                                                        {text: 'SEGURO', width: 160, dataIndex: 'fechaSeguroVenc', align: 'center', renderer: formatTipoRegistro}
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
                                                                        var numCol = 6;
                                                                        var tiLetra = 'Calibri';
                                                                        var titulo = 'Registro de Mantenimientos de Vehiculos:'
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
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Organización</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Total Matenimientos</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>SOAT</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Matricula</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Seguro</Data></Cell>" +
                                                                        "</Row>";
                                                                        for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.empresa + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.vehiculo + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataReporteDetallado.data.items[i].data.total + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataReporteDetallado.data.items[i].data.fechaSoatVenc) + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataReporteDetallado.data.items[i].data.fechaMatriculaVenc) + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataReporteDetallado.data.items[i].data.fechaSeguroVenc) + " </Data></Cell > " +
                                                                        "</Row>";
                                                                }
                                                                table_div += "</Table> </Worksheet></Workbook>";
                                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                                        a.href = data_type + ', ' + table_xml;
                                                                        a.download = 'Registro de Mantenimientos Totales' + '.xml';
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
                                                                                text: 'Ver Detalles',
                                                                                disabled: false,
                                                                                handler: function (widget, event) {
                                                                                if (vistaVistaRegistrosMantenimiento) {
                                                                                vistaVistaRegistrosMantenimiento.hide();
                                                                                }
                                                                                metodoRegistros(record.data.empresa, record.data.vehiculo, record.data.total, record.data.fechaSoatReg, record.data.fechaSoatVenc, record.data.descripSoat, record.data.fechaMatriculaReg, record.data.fechaMatriculaVenc, record.data.descripMatricula, record.data.fechaSeguroReg, record.data.fechaSeguroVenc, record.data.descripSeguro);
                                                                                        vistaVistaRegistrosMantenimiento.show();
                                                                                }
                                                                        })
                                                                ]
                                                                }).showAt(e.getXY());
                                                                return false;
                                                        },
                                                                itemclick: function (thisObj, record, item, index, e, eOpts) {
                                                                empresa = record.get('empresa');
                                                                        id_vehiculo = record.get('id_vehiculo');
                                                                        vehiculo = record.get('vehiculo');
                                                                        banderaMantenimiento = 1;
                                                                        gridViewDataMantenimiento.setTitle('<center>Lista de Mantenimientos por Vehiculo <br>Organización: ' + empresa + ' Desde: ' + fechaInicio + ' Hasta:' + fechaFinal + '</center>');
                                                                        storeViewMantenimiento.load({
                                                                        params: {
                                                                                idVehiculo: id_vehiculo,
                                                                                fechaInicio: fechaInicio,
                                                                                fechaFin: fechaFinal,
                                                                                horaInicio:horaInicio,
                                                                                horaFinal:horaFinal
                                                                        }
                                                                        });
                                                                }
                                                        }
                                                });
                                                gridViewDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                                region: 'center',
                                                        frame: true,
                                                        width: '60%',
                                                        title: '<center>Servicios Mantenimientos Detallado: ',
                                                        store: storeViewMantenimiento,
                                                        features: [filters],
                                                        multiSelect: true,
                                                        viewConfig: {
                                                        emptyText: 'No hay datos que Mostrar'
                                                        },
                                                        columns: [
                                                                Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                                        {text: 'Placa', width: 130, dataIndex: 'placa', align: 'center'},
                                                        {text: 'Marca', width: 200, dataIndex: 'marca', align: 'center'},
                                                        {text: 'Estandar', width: 200, dataIndex: 'estandar', align: 'center'},
                                                        {text: 'Tipo Servicio', width: 200, dataIndex: 'idTipoServicio', align: 'center', renderer: formatTipoServicio},
                                                        {text: 'Responsable', width: 200, dataIndex: 'responsable', align: 'center'}
                                                        ],
                                                        tbar: [{
                                                        xtype: 'button',
                                                                iconCls: 'icon-excel',
                                                                text: 'Exportar a Excel',
                                                                handler: function () {
                                                                if (storeViewMantenimiento.getCount() > 0) {
                                                                if (getNavigator() === 'img/chrome.png') {
                                                                var a = document.createElement('a');
                                                                        var data_type = 'data:application/vnd.ms-excel';
                                                                        var numFil = storeViewMantenimiento.data.length;
                                                                        var numCol = 5;
                                                                        var tiLetra = 'Calibri';
                                                                        var titulo = 'Registro de Mantenimientos del Vehiculo:' + storeViewMantenimiento.data.items[0].data.placa;
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
                                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Marca</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Estandar</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Tipo Servicio</Data></Cell>" +
                                                                        "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Responsable</Data></Cell>" +
                                                                        "</Row>";
                                                                        for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewMantenimiento.data.items[i].data.placa + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewMantenimiento.data.items[i].data.marca + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewMantenimiento.data.items[i].data.estandar + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoServicio(storeViewMantenimiento.data.items[i].data.idTipoServicio) + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeViewMantenimiento.data.items[i].data.responsable + " </Data></Cell > " +
                                                                        "</Row>";
                                                                }
                                                                table_div += "</Table> </Worksheet></Workbook>";
                                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                                        a.href = data_type + ', ' + table_xml;
                                                                        a.download = 'Registro de Mantenimientos Totales' + '.xml';
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
                                                title: 'Mantenimientos Detallados',
                                                        closable: true,
                                                        iconCls: 'icon-servicios',
                                                        layout: 'border',
                                                        fullscreen: true,
                                                        height: 490,
                                                        width: 2000,
                                                        region: 'center',
                                                        items: [gridDataMantenimiento, gridViewDataMantenimiento]
                                                });
                                                panelTabMapaAdmin.add(tabExces);
                                                panelTabMapaAdmin.setActiveTab(tabExces);
                                                VentanaMantenimiento.hide();
                                        },
                                        failure: function (form, action) {
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
                                iconCls: 'icon-cancelar',
                                handler: function () {
                                VentanaMantenimiento.hide();
                                }
                        }]
                });
                });
        function limpiarPanelG() {
        if (vistaVistaRegistrosMantenimiento) {
        vistaVistaRegistrosMantenimiento.hide();
        }

        }


function metodoRegistros(empresa, vehiculo, total, fechaSoatReg, fechaSoatVenc, descripSoat, fechaMatriculaReg,
        fechaMatriculaVenc, descripMatricula, fechaSeguroReg, fechaSeguroVenc, descripSeguro) {
//            console.log(fechaSoatReg);
//            console.log(fechaSoatVenc);
//            console.log(fechaMatriculaReg);
//            console.log(fechaSeguroReg);
vistaVistaRegistrosMantenimiento = Ext.create('Ext.window.Window', {
layout: 'fit',
        title: 'Estado de Equipos',
        iconCls:'icon-company',
        resizable: true,
        width: 400,
        height: 300,
        closeAction: 'hide',
        plain: true,
        items: [{
        xtype: 'form',
//                id: 'contenedoresg',
//                name: 'contenedoresg',
                autoScroll: true,
                width: 300,
                height: 390,
                items: [
                {html: '<TABLE id="tablestados">' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon_empresa.png"> <b>EMPRESA:</b></td>' +
                        '   <TD align="CENTER ">' + empresa + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon_car.png"> <b>VEHICULO:</b></td>' +
                        '   <TD align="CENTER ">' + vehiculo + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de SOAT:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaSoatReg) + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de SOAT:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaSoatReg) + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Matricula:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaMatriculaReg) + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Matricula:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaMatriculaVenc) + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Registro de Seguro:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaSeguroReg) + '</TD> ' +
                        '</TR> ' +
                        '<TR class="alt"> ' +
                        '   <TD> <IMG SRC="img/icon-accept.png"> <b>Vencimiento de Seguro:</b></td>' +
                        '   <TD align="CENTER ">' + formatVistaRegistro(fechaSeguroVenc) + '</TD> ' +
                        '</TR> ' +
                        ' </TABLE>'
                }
                ]
                ,
                buttons: [
                {
                text: 'Cerrar',
                        tooltip: 'Cerrar',
                        iconCls: 'icon-cancelar',
                        handler: limpiarPanelG
                }
                ]}
        ]
});
        }

function showWinMantenimientoGeneral() {
if (!VentanaMantenimiento) {
VentanaMantenimiento = Ext.create('Ext.window.Window', {
layout: 'fit',
        title: 'Mantenimiento Vehicular',
        iconCls: 'icon-servicios',
        resizable: false,
        width: 360,
        height: 370,
        closeAction: 'hide',
        plain: false,
        items: formularioMantenimientoDetallado
});
}
formularioMantenimientoDetallado.getForm().reset();
        VentanaMantenimiento.show();
        }
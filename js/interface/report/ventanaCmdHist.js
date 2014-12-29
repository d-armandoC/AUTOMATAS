var formComandos;
var winComandos;
var banderaComan = 0;
var dateStartComan;
var dateFinishComan;
var timeStartComan;
var timeFinishComan;
var personaComan;
var idEquipoComandos;
var gridViewDataCpomandosTotal;
var gridViewDataComandosGeneral;
var gridDataComandos;
var storeDataComandos;
var empresaComanodos = 1;
var empresaNomComandos = 'KRADAC';
var cbxEmpresasBDComandos;
var cbxVehBDComanodos;
var porEquipoComan = false;
var hayDatosComandos = false;
var gridViewDataComandos;
var placacomandos="";
var empresaComandos='KRADAC';
var banderaComandos;
Ext.onReady(function () {
    if (idCompanyKarview == 1) {
        banderaComandos = 1;
    } else {
        empresaComandos='COOPMEGO';
        banderaComandos = storeEmpresas.data.items[0].data.id;
    }
    
    
    cbxEmpresasBDComandos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idCompanyComando',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaComandos,
        listeners: {
            select: function (combo, records, eOpts) {
                empresaComandos = cbxEmpresasBDComandos.getRawValue();
                placacomandos = " ";
                if (porEquipoComan) {
                    cbxVehBDComanodos.clearValue();
                    cbxVehBDComanodos.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                }
            }
        }
    });
    cbxVehBDComanodos = Ext.create('Ext.form.ComboBox', {
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
                placacomandos = records[0].data.placa;
            }
        }
    });
    var dateIniComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniComando',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        maxText: 'La fecha debe ser igual o anterior a <br> {0}',
        allowBlank: false,
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        endDateField: 'fechaFinPanico',
        emptyText: 'Fecha Inicial...'
    });
    var dateFinComandos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinComando',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        invalidText: '{0} No es una fecha validad- Debe estar en formato {1}"',
        allowBlank: false,
        startDateField: 'fechaIniPanico',
        emptyText: 'Fecha Final...'
    });
    var timeIniComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniComando',
        value: '00:00',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinComandos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinComando',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btnTodayComandos = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniComandos.setValue(nowDate);
            dateFinComandos.setValue(nowDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var btnYesterdayComandos = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniComandos.setValue(yestDate);
            dateFinComandos.setValue(yestDate);
            timeIniComandos.setValue('00:00');
            timeFinComandos.setValue('23:59');
        }
    });
    var panelButtonsComandos = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [btnTodayComandos, btnYesterdayComandos]
    });
    formComandos = Ext.create('Ext.form.Panel', {
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
                            {boxLabel: 'Por Organización', name: 'rb6', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehiculo', name: 'rb6', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb6'])) {
                                    case 1:
                                        empresaComanodos = 1;
                                        cbxEmpresasBDComandos.enable();
                                        cbxVehBDComanodos.clearValue();
                                        cbxVehBDComanodos.disable();
                                        porEquipoComan = false;
                                        break;
                                    case 2:
                                        porEquipoComan = true;
                                        empresaComanodos = cbxEmpresasBDComandos.getValue();
                                        empresaNomComandos = cbxEmpresasBDComandos.getRawValue();
                                        if (porEquipoComan) {
                                            cbxVehBDComanodos.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formComandos.down('[name=idCompanyComando]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDComandos,
                    cbxVehBDComanodos
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    dateIniComandos,
                    dateFinComandos,
                    timeIniComandos,
                    timeFinComandos,
                    panelButtonsComandos
                ]
            }],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    dateStartComan = dateIniComandos.getRawValue();
                    dateFinishComan = dateFinComandos.getRawValue();
                    var formulario = formComandos.getForm();
                    if (formulario.isValid()) {
                        formulario.submit({
                            url: 'php/interface/report/cmd/getReportCmd.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                idCompany: empresaComanodos
                            },
                            success: function (form, action) {
                                var storeDataComandos = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.data,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['usuario', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado']
                                });
                                var gridDataComandos = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Lista de Comandos ' + '<br>Desde: ' + dateStartComan + ' | Hasta: ' + dateFinishComan + '</center>',
                                    store: storeDataComandos,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Usuario', width: 130, dataIndex: 'usuario', align: 'center'},
                                        {text: 'Comando', width: 200, dataIndex: 'comando', align: 'center'},
                                        {text: 'Respuesta', width: 200, dataIndex: 'respuesta', align: 'center'},
                                        {text: 'Fecha Creación', width: 250, dataIndex: 'fecha_creacion', align: 'center'},
                                        {text: 'Fecha Envio', width: 250, dataIndex: 'fecha_envio', align: 'center'},
                                        {text: 'Estado', width: 250, dataIndex: 'estado', align: 'center'}
                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeDataComandos.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataComandos.data.length;
                                                        var numCol = 6;
                                                        var tiLetra = 'Calibri';
                                                        var titulo = 'Registro de Panico';
                                                        var table_div = "<?xml version='1.0'?><?mso-application progid='Excel.Sheet'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><DocumentProperties xmlns='urn:schemas-microsoft-com:office:office'><Author>KRADAC SOLUCIONES TECNOLÃ“GICAS</Author><LastAuthor>KRADAC SOLUCIONES TECNOLÃ“GICAS</LastAuthor><Created>2014-08-20T15:33:48Z</Created><Company>KRADAC</Company><Version>15.00</Version>";
                                                        table_div += "</DocumentProperties> " +
                                                                "<Styles> " +
                                                                "<Style ss:ID='Default' ss:Name='Normal'>   <Alignment ss:Vertical='Bottom'/>   <Borders/>   <Font ss:FontName='" + tiLetra + "' x:Family='Swiss' ss:Size='11' ss:Color='#000000'/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
                                                                "<Style ss:ID='encabezados'><Alignment ss:Horizontal='Center' ss:Vertical='Bottom'/>   <Font ss:FontName='Calibri' x:Family='Swiss' ss:Size='11' ss:Color='#000000' ss:Bold='1'/>  </Style>  " +
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
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Usuario</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Comando</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Respuesta</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha de Creación</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha de Envio</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Estado</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
//                                                                                                              fields: ['usuario', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado']
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.usuario + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.comando + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.respuesta + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.fecha_creacion + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.fecha_envio + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataComandos.data.items[i].data.estado + " </Data></Cell > " +
                                                                    "</Row>";
                                                        }
                                                        table_div += "</Table> </Worksheet></Workbook>";
                                                        var table_xml = table_div.replace(/ /g, '%20');
                                                        a.href = data_type + ', ' + table_xml;
                                                        a.download = 'Envio Comandos' + '.xml';
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
                                            idEquipoComandos = record.get('idEquipoPanicos');
                                            personaComan = record.get('personaPanicos');
                                            banderaComan = 1;
                                            hayDatosComandos = true;
                                            gridViewDataComando.setTitle('<center>Vista de Comandos: ' + personaComan + ' <br> Equipo: ' + idEquipoComandos + ' Desde: ' + dateStartComan + ' Hasta:' + dateFinishComan + '</center>');
                                            storeDataComandos.load(
                                                    {
                                                        params: {
                                                            idEquipo: idEquipoComandos,
                                                            fechaIni: dateIniComandos.getRawValue(),
                                                            fechaFin: dateFinComandos.getRawValue(),
                                                            horaIniP: timeIniComandos.getRawValue(),
                                                            horaFinP: timeFinComandos.getRawValue(),
                                                        }
                                                    });
                                        }
                                    }
                                });
                                var tabComandos = Ext.create('Ext.container.Container', {
                                    title: '<div id="titulosForm">CMD Enviados' + empresaComandos + " : " + placacomandos + '</div>',
                                    closable: true,
                                    iconCls: 'icon-cmd-hist',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 485,
                                    width: 8000,
                                    region: 'center',
                                    items: [gridDataComandos]
                                });
                                panelTabMapaAdmin.add(tabComandos);
                                panelTabMapaAdmin.setActiveTab(tabComandos);
                                winComandos.hide();
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
                    winComandos.hide();
                }
            }]
    });
});
function  ventanaCmdHistorial() {
    if (!winComandos) {
        winComandos = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'CMD Enviados',
            iconCls: 'icon-cmd-hist',
            resizable: false,
            width: 350,
            height: 375,
            closeAction: 'hide',
            plain: false,
            items: formComandos
        });
    }
    winComandos.show();
    formComandos.getForm().reset();
}
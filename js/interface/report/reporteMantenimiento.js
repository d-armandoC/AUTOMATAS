var contenedorReporteMant;
var winReportMante;
var banderaReportMantenimiento;
var storeVehiculosREportMante;
var empresaReporteMantenimiento = 'KRADAC';
var placaReporteMante = "";

Ext.onReady(function () {
    if (idCompanyKarview == 1) {
        banderaReportMantenimiento = 1;
    } else {
        empresaReporteMantenimiento = 'COOPMEGO';
        banderaReportMantenimiento = storeEmpresaPanicos.data.items[0].data.id;
    }

    storeVehiculosREportMante = Ext.create('Ext.data.JsonStore', {
        autoLoad: true,
        autoDestroy: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboVeh.php',
            reader: {
                type: 'json',
                root: 'veh'
            }
        },
        fields: [{name: 'value', mapping: 'id'}, 'text']
    });

    var cbxEmpresasBDMant = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'cbxEmpresasMant',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        value: banderaReportMantenimiento,
        listeners: {
            select: function (combo, records, eOpts) {
                empresaReporteMantenimiento = cbxEmpresasBDPanico.getRawValue();
                placaReporteMante = " ";
                var listSelected = contenedorReporteMant.down('[name=listVehiculos]');
                listSelected.clearValue();
                listSelected.fromField.store.removeAll();
                storeVehiculosREportMante.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

//    var cbxVehBDMant = Ext.create('Ext.form.ComboBox', {
//        fieldLabel: 'Vehículo:',
//        name: 'cbxVehMant',
//        store: storeVehiculosREportMante,
//        valueField: 'id',
//        displayField: 'text',
//        queryMode: 'local',
//        emptyText: 'Seleccionar Vehículo...',
//        disabled: true,
//        editable: false,
//        allowBlank: false,
//        listConfig: {
//            minWidth: 300
//        },
//        listeners: {
//            select: function (combo, records, eOpts) {
//                placaReporteMante = records[0].data.placa;
//            }
//        }
//    });

    var dateIniMant = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniMant',
        name: 'fechaIniMant',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinMat',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinMant = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinMat',
        name: 'fechaFinMat',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniMant',
        emptyText: 'Fecha Final...'
    });

    var timeIniMant = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniMant',
        format: 'H:i',
        value: '00:00',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFinMant = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinMant',
        format: 'H:i',
        value: '23:59',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });
    var botonesToday = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            dateIniMant.setValue(nowDate);
            dateFinMant.setValue(nowDate);
        }
    });

    var yesterdayMant = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            dateIniMant.setValue(yestDate);
            dateFinMant.setValue(yestDate);
        }
    });
    var panelBotonesMant = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [botonesToday]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterdayMant]
            }]
    });

    contenedorReporteMant = Ext.create('Ext.form.Panel', {
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        baseCls: 'x-plain',
        frame: false,
        autoScroll: true,
        padding: '5 5 5 5',
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
                            {boxLabel: 'Por Vehiculo', name: 'opcion', inputValue: '1', checked: true},
                            {boxLabel: 'Por Organización', name: 'opcion', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['opcion'])) {
                                    case 1:
                                        Ext.getCmp('vehiculos').enable();
                                        break;
                                    case 2:
                                        Ext.getCmp('vehiculos').disable();
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasBDMant,
                    {
                        xtype: 'form',
                        bodyStyle: 'padding: 10px 0 10px 0',
                        width: 570,
                        baseCls: 'x-plain',
                        items: [{
                                xtype: 'itemselector',
                                name: 'listVehiculos',
                                anchor: '97%',
                                id: 'vehiculos',
                                height: 150,
                                store: storeVehiculosREportMante,
                                displayField: 'text',
                                valueField: 'value',
                                allowBlank: false,
                                msgTarget: 'side',
                                fromTitle: 'Vehiculos',
                                toTitle: 'Seleccionados'
                            }, {
                                xtype: 'itemselector',
                                name: 'listServicios',
                                anchor: '97%',
                                height: 150,
                                store: storeVehiculosservicios,
                                displayField: 'text',
                                valueField: 'id',
                                allowBlank: false,
                                msgTarget: 'side',
                                fromTitle: 'Servicios',
                                toTitle: 'Seleccionados'
                            }]
                    }
                ]
            },
            {
                xtype: 'form',
                baseCls: 'x-plain',
                fieldDefaults: {
                    labelAlign: 'left',
                    labelWidth: 70,
                    width: 260
                },
                items: [{
                        layout: 'column',
                        baseCls: 'x-plain',
                        items: [{
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateIniMant,
                                    timeIniMant
                                ]
                            }, {
                                columnWidth: .5,
                                baseCls: 'x-plain',
                                items: [
                                    dateFinMant,
                                    timeFinMant
                                ]
                            }]
                    }]
            }, panelBotonesMant],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {
                    if (contenedorReporteMant.getForm().isValid()) {
                        contenedorReporteMant.submit({
                            url: 'php/interface/report/getReporteMantenimiento.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            success: function (form, action) {
                                var storeDataMantenimiento = Ext.create('Ext.data.JsonStore', {
                                    data: action.result.mantenimiento,
                                    proxy: {
                                        type: 'ajax',
                                        reader: 'array'
                                    },
                                    fields: ['id_vehiculo', 'empresa', 'vehiculo', 'fechaSoatVenc',
                                        , 'fechaMatriculaVenc', 'fechaSeguroVenc', 'estandar', 'responsable', 'idTipoServicio']
                                });
                                var gridDataMantenimiento = Ext.create('Ext.grid.Panel', {
                                    region: 'west',
                                    frame: true,
                                    width: '100%',
                                    title: '<center>Mantenimientos : ' + '<br>Desde: ' + dateIniMant.getRawValue() + ' | Hasta: ' + dateFinMant.getRawValue() + '</center>',
                                    store: storeDataMantenimiento,
                                    features: [filters],
                                    multiSelect: true,
                                    viewConfig: {
                                        emptyText: 'No hay datos que Mostrar'
                                    },
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
                                        {text: 'Organización', width: 150, dataIndex: 'empresa', align: 'center'},
                                        {text: 'Vehiculo', width: 170, dataIndex: 'vehiculo', align: 'center'},
                                        {text: 'Servicio', width: 300, dataIndex: 'estandar', align: 'center'},
                                        {text: 'Tipo Servicio', width: 300, dataIndex: 'idTipoServicio', align: 'center', renderer: formatTipoServicio},
                                        {text: 'SOAT ', width: 150, dataIndex: 'fechaSoatVenc', align: 'center', renderer: formatTipoRegistro},
                                        {text: 'MATRICULA ', width: 170, dataIndex: 'fechaMatriculaVenc', align: 'center', renderer: formatTipoRegistro},
                                        {text: 'SEGURO', width: 160, dataIndex: 'fechaSeguroVenc', align: 'center', renderer: formatTipoRegistro},
                                        {text: 'Responsable', width: 160, dataIndex: 'responsable', align: 'center'}

                                    ],
                                    tbar: [{
                                            xtype: 'button',
                                            iconCls: 'icon-excel',
                                            text: 'Exportar a Excel',
                                            handler: function () {
                                                if (storeDataMantenimiento.getCount() > 0) {
                                                    if (getNavigator() === 'img/chrome.png') {
                                                        var a = document.createElement('a');
                                                        var data_type = 'data:application/vnd.ms-excel';
                                                        var numFil = storeDataMantenimiento.data.length;
                                                        var numCol = 8;
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
                                                        table_div += "<Row ss:AutoFitHeight='0'><Cell ss:MergeAcross='" + (numCol - 1) + "' ss:StyleID='encabezados'><Data ss:Type='String'>" + titulo + "</Data></Cell>   </Row>";
                                                        table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Organización</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehículo</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Servicio </Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Tipo de Servicio</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>SOAT</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>MATRICULA</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>SEGURO</Data></Cell>" +
                                                                "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Responsable</Data></Cell>" +
                                                                "</Row>";
                                                        for (var i = 0; i < numFil; i++) {
                                                            table_div += "<Row ss:AutoFitHeight='0'>" +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataMantenimiento.data.items[i].data.empresa + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataMantenimiento.data.items[i].data.vehiculo + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataMantenimiento.data.items[i].data.estandar + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoServicio(storeDataMantenimiento.data.items[i].data.idTipoServicio) + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataMantenimiento.data.items[i].data.fechaSoatVenc) + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataMantenimiento.data.items[i].data.fechaMatriculaVenc) + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoRegistro(storeDataMantenimiento.data.items[i].data.fechaSeguroVenc) + " </Data></Cell > " +
                                                                    "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + storeDataMantenimiento.data.items[i].data.responsable + " </Data></Cell > " +
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

                                var tab = Ext.create('Ext.form.Panel', {
                                    title: '<div id="titulosForm"> Mantenimiento  ' + empresaReporteMantenimiento + '</div>',
                                    closable: true,
                                    iconCls: 'icon-servicios',
                                    layout: 'border',
                                    fullscreen: true,
                                    height: 490,
                                    width: 2000,
                                    items: gridDataMantenimiento
                                });
                                panelTabMapaAdmin.add(tab);
                                panelTabMapaAdmin.setActiveTab(tab);
                                limpiar_datosEvt();
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
                    } else {
                        Ext.MessageBox.show({
                            title: 'Atencion',
                            msg: 'LLene los espacios vacios',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winReportMante.hide();
                }
            }]
    });
});

function limpiar_datosEvt() {
    contenedorReporteMant.getForm().reset();
    if (winReportMante) {
        winReportMante.hide();
    }
}

function ventanaReporteMantenimiento() {
    if (!winReportMante) {
        winReportMante = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Manatenimiento General',
            iconCls: 'icon-mantenimiento',
            resizable: false,
            width: 630,
            height: 555,
            closeAction: 'hide',
            plain: false,
            items: [contenedorReporteMant],
            listeners: {
                close: function (panel, eOpts) {
                    limpiar_datosEvt();
                }
            }
        });
    }
    contenedorReporteMant.getForm().reset();
    winReportMante.show();
    storeVehiculosREportMante.load({
        params: {
            cbxEmpresas: banderaReportMantenimiento
        }

    });
}

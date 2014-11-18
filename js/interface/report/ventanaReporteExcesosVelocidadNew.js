var winExcesos;
var formularioExcesos;
var VentanaExcesos;
var banderaExcesos = 0;
var storeViewExcesos;
var fechaFinperdExcesos;
var personaExcesos;
var gridViewDataExcesos;
var storeViewExcesosExcesos;
var storeDataExcesos;
var empresaExcesos = 1;
var id_empresaExcesos = 1;
var cbxEmpresasExcesos;
var fechaIniExcesos;
var fechaFinExcesos;
var timeIniExcesos;
var timeFinExcesos;
var btn_HoyExcesos;
var bt_HayerExcesos;
var fechaInExcesos;
var fechaFnExcesos;
var porEquipoEx = false;
var cbxVehExceso;
var empresaNom = 'KRADAC';
Ext.onReady(function () {

    cbxEmpresasExcesos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'idempresasExcesos',
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
                if (porEquipoEx) {
                    cbxVehExceso.clearValue();
                    cbxVehExceso.enable();
                    storeVeh.load({
                        params: {
                            cbxEmpresas: records[0].data.id
                        }
                    });
                    id_empresaExcesos = records[0].data.id;
                }
            }
        }
    });

    cbxVehExceso = Ext.create('Ext.form.ComboBox', {
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
    fechaIniExcesos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniEx',
        name: 'fechaIniEx',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinEx',
        emptyText: 'Fecha Inicial...'
    });

    fechaFinExcesos = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinEx',
        name: 'fechaFinEx',
        value: new Date(),
        maxValue: new Date(),
//        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniEx',
        emptyText: 'Fecha Final...'
    });

    btn_HoyExcesos = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function () {
            var nowDate = new Date();
            fechaIniExcesos.setValue(nowDate);
            fechaFinExcesos.setValue(nowDate);
            timeIniExcesos.setValue('00:01');
            timeFinExcesos.setValue('23:59');

        }
    });
    bt_HayerExcesos = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function () {
            var yestDate = Ext.Date.subtract(new Date(), Ext.Date.DAY, 1);
            fechaIniExcesos.setValue(yestDate);
            fechaFinExcesos.setValue(yestDate);
            timeIniExcesos.setValue('00:01');
            timeFinExcesos.setValue('23:59');
        }
    });

    timeIniExcesos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniExcesos',
        value: '00:01',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    timeFinExcesos = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinExcesos',
        value: '23:59',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora final...',
        listConfig: {
            minWidth: 450
        }
    });


    var panel_BotonesExceso = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        padding: '0 0 5 0',
        defaults: {
            margin: '0 5 0 0'
        },
        items: [
            {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn_HoyExcesos
                ]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [bt_HayerExcesos]
            }

        ]
    });

    formularioExcesos = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        id: 'for_excesos',
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
                            {boxLabel: 'Por Organización', name: 'rb1', inputValue: '1', checked: true},
                            {boxLabel: 'Por Vehiculo', name: 'rb1', inputValue: '2'}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (parseInt(newValue['rb1'])) {
                                    case 1:
                                        empresaExcesos = 1;
                                        cbxEmpresasExcesos.enable();
                                        cbxVehExceso.clearValue();
                                        cbxVehExceso.disable();
                                        porEquipoEx = false;
                                        break;
                                    case 2:
                                         porEquipoEx = true;
                                        empresaExcesos = cbxEmpresasExcesos.getValue();
                                        empresaNom = cbxEmpresasExcesos.getRawValue();
                                        if (porEquipoEx) {
                                            cbxVehExceso.enable();
                                            storeVeh.load({
                                                params: {
                                                    cbxEmpresas: formularioExcesos.down('[name=idempresasExcesos]').getValue()
                                                }
                                            });
                                        }
                                        break;
                                }
                            }
                        }
                    },
                    cbxEmpresasExcesos,
                    cbxVehExceso
                ]
            }, {
                xtype: 'fieldset',
                title: '<b>Fechas</b>',
                items: [
                    fechaIniExcesos,
                    fechaFinExcesos,
                    timeIniExcesos,
                    , timeFinExcesos,
                    panel_BotonesExceso
                ]
            }],
        buttons: [
            {
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function () {

                    fechaInExcesos = fechaIniExcesos.getRawValue();
                    fechaFnExcesos = fechaFinExcesos.getRawValue();
                    horaIni = timeIniExcesos.getRawValue();
                    horaFin = timeFinExcesos.getRawValue();
                    var form = formularioExcesos.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/getdataExcesVelocidad.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            params: {
                                cbxEmpresasExcesos: id_empresaExcesos,
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.hide();
                                Ext.MessageBox.show({
                                    title: 'Info',
                                    msg: 'No se encuentran datos!!!',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            },
                            success: function (form, action) {
                                if (winExcesos) {
                                    winExcesos.hide();
                                }
                                Ext.MessageBox.hide();
                                var resultado = action.result;
                                var datos = Ext.JSON.decode(resultado.string).data;
                                cargardatosalGrid(datos);
                            }
                        });
                    } else {
                        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo correctamente ');
                    }
                }
            }

            , {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function () {
                    winExcesos.hide();
                }
            }]
    });
});


function cargardatosalGrid(datos) {

    Ext.define('Registros', {
        extend: 'Ext.data.Model',
        fields: ['acronimo', 'equipo', 'empresa', 'placa', 'velocidad', 'fecha', 'evento']
    });

    console.log("Data para cargar en el panel" + datos);
    var storeRecaudo = Ext.create('Ext.data.JsonStore', {
        data: datos,
        storeId: 'recaudoId',
        model: 'Registros',
        sorters: ['acronimo', 'equipo', 'empresa', 'placa','evento'],
        groupField: 'acronimo',
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['acronimo', 'equipo', 'empresa','evento']
    });

    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        id: 'group',
        groupHeaderTpl: 'Registro de : {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
    });

    var columnExcesosVelocidad = [
        Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
        {text: 'Organización', flex: 80, dataIndex: 'empresa', filter: {type: 'string'}},
        {text: 'Placa', flex: 80, dataIndex: 'placa', filter: {type: 'string'}},
        {text: 'Velocidad', flex: 80, dataIndex: 'velocidad', filter: {type: 'string'}},
        {text: 'Registrado', flex: 80, dataIndex: 'fecha', filter: {type: 'string'}},
        {text: 'Evento', flex: 80, dataIndex: 'evento', filter: {type: 'string'}}
    ];
    var dateStart = fechaIniExcesos.getRawValue();
    var dateFinish = fechaFinExcesos.getRawValue();
    var timeStart = timeIniExcesos.getRawValue();
    var timeFinish = timeFinExcesos.getRawValue();
    var gridExcesosVelocidad = Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        region: 'center',
        title: '<center> Registros del  Sistema<br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + ' Desde las: ' + timeStart + ' | Hasta las: ' + timeFinish + '</center>',
        store: storeRecaudo,
        multiSelect: true,
        width: '100%',
        features: [groupingFeature, filters],
        viewConfig: {
            emptyText: 'No hay datos que Mostrar',
            enableTextSelection: true
        },
        dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                items: [{xtype: 'button', text: 'Imprimir', icon: 'img/excel.png', handler: function () {
                            generarExcelRecorrido(datos);
                        }},
                    {xtype: 'button', id: 'btng', text: 'Lista', iconCls: 'icon-servicios', handler: function () {
                            if (bandera) {
                                groupingFeature.disable();
                                Ext.getCmp('btng').setIconCls("icon-cancelar");
                                bandera = false;
                            } else {
                                groupingFeature.enable();
                                Ext.getCmp('btng').setIconCls("icon-servicios");
                                bandera = true;
                            }
                        }}]
            }],
        columns: columnExcesosVelocidad
    });

    var tabExcesosVelocidad = Ext.create('Ext.container.Container', {
        title: 'Reporte de Excesos de velocidad',
        closable: true,
        iconCls: 'icon-exceso-vel',
        layout: 'border',
        items: [{
                layout: 'border',
                xtype: 'panel',
                items: gridExcesosVelocidad,
                region: 'center',
                autoScroll: true,
                columnLines: true,
                frame: true
            }
        ]
    });

    panelTabMapaAdmin.add(tabExcesosVelocidad);
    panelTabMapaAdmin.setActiveTab(tabExcesosVelocidad);
}

function ventanaexcesosvelociadadWin() {
    if (!winExcesos) {
        winExcesos = Ext.create('Ext.window.Window', {
            //layout : 'fit',
            title: 'Excesos de Velocidad',
            iconCls: 'icon-exceso-vel',
            resizable: false,
            width: 350,
            height: 375,
            autoHeight: true,
            closeAction: 'hide',
            plain: false,
            items: [formularioExcesos]
        });
    }
    formularioExcesos.getForm().reset();
    winExcesos.show();
}


function generarExcelRecorrido(store) {
    console.log(store);
    if (store.length > 0) {
        if (getNavigator() === 'img/chrome.png') {
            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            var numFil = store.length;
            var numCol = 5;
            var tiLetra = 'Calibri';
            var titulo = 'Cantidad de Excesos de Velocidad';
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
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Organización</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Registrado</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Evento</Data></Cell>" +
                    "</Row>";
            for (var i = 0; i < numFil; i++) {
                table_div += "<Row ss:AutoFitHeight='0'>" +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].empresa + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].placa + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].velocidad + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].fecha + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].acronimo + " </Data></Cell > " +
                        "</Row>";
            }
            table_div += "</Table> </Worksheet></Workbook>";
            var table_xml = table_div.replace(/ /g, '%20');
            a.href = data_type + ', ' + table_xml;
            a.download = 'Exesos de Velocidad' + '.xml';
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





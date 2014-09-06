
var formularioGSM;
var VentanaGSM;
var banderaGSM = 0;
var storeViewGSM;
var fechaIni;
var fechaFinperdgsm;
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
var btn_Hoygsm;
var bt_Hayergsm;
var fechaInperdgsm;
var fechaFngsm;
Ext.onReady(function() {

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
        value: new Date(),
        maxValue: new Date(),
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
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniAsi',
        emptyText: 'Fecha Final...'
    });

    btn_Hoygsm = Ext.create('Ext.button.Button', {
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
    bt_Hayergsm = Ext.create('Ext.button.Button', {
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
                items: [btn_Hoygsm
                ]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [bt_Hayergsm]
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
                iconCls: 'icon-consultas',
                handler: function() {

                    fechaInperdgsm = fechaInigsm.getRawValue();
                    fechaFngsm = fechaFingsm.getRawValue();
                    horaIni = timeInigsm.getRawValue();
                    horaFin = timeFingsm.getRawValue();
                    var form = formularioGSM.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/interface/report/getReporDetallePerdidaGSM.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            params: {
                                cbxEmpresasPan: id_empresagsms,
                            },
                            failure: function(form, action) {
                                Ext.MessageBox.hide();
                                Ext.MessageBox.show({
                                    title: 'Info',
                                    msg: 'No se encuentran datos!!!',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            },
                            success: function(form, action) {
                                if (VentanaGSM) {
                                    VentanaGSM.hide();
                                }
                                Ext.MessageBox.hide();
                                var resultado = action.result;
                                var datos = Ext.JSON.decode(resultado.string).data;
                                cargardatosalGridGpsGsm(datos);
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
                handler: function() {
                    VentanaGSM.hide();
                }
            }]
    });
});


function cargardatosalGridGpsGsm(datos) {
    Ext.define('Registros', {
        extend: 'Ext.data.Model',
        fields: ['empresa', 'equipo', 'placa', 'latitud', 'longitud', 'fecha', 'velocidad', 'gsm', 'tipo_respuesta']
    });
    var storeRecaudo = Ext.create('Ext.data.JsonStore', {
        data: datos,
        storeId: 'recaudoId',
        model: 'Registros',
        sorters: ['empresa', 'equipo', 'placa', 'gsm'],
        groupField: 'tipo_respuesta',
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['empresa', 'equipo', 'placa']
    });

    var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        id: 'group',
        groupHeaderTpl: 'Registro de : {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
    });

    var columnGsmGps = [
        {text: 'Empresa', flex: 80, dataIndex: 'empresa', filter: {type: 'string'}},
        {text: 'Equipo', flex: 80, dataIndex: 'equipo', filter: {type: 'string'}},
        {text: 'Placa', flex: 80, dataIndex: 'placa', filter: {type: 'string'}},
        {text: 'Señal', flex: 80, dataIndex: 'tipo_respuesta', filter: {type: 'string'}, renderer: sinGSM},
        {text: 'Latitud', flex: 80, dataIndex: 'latitud', filter: {type: 'string'}},
        {text: 'Longitu', flex: 80, dataIndex: 'longitud', filter: {type: 'string'}},
        {text: 'Fecha', flex: 80, dataIndex: 'fecha', filter: {type: 'string'}},
        {text: 'Velocidad', flex: 80, dataIndex: 'velocidad', filter: {type: 'string'}}
    ];
    var dateStart = fechaInigsm.getRawValue();
    var dateFinish = fechaFingsm.getRawValue();
    var timeStart = timeInigsm.getRawValue();
    var timeFinish = timeFingsm.getRawValue();

    var gridGsmGps = Ext.create('Ext.grid.Panel', {
        layout: 'fit',
        region: 'center',
        title: '<center> Registros <br>Desde: ' + dateStart + ' | Hasta: ' + dateFinish + ' Desde las: ' + timeStart + ' | Hasta las: ' + timeFinish + '</center>',
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
                items: [{xtype: 'button', text: 'Imprimir', icon: 'img/excel.png', handler: function() {
                            generarExcelGSM(datos);
                        }},
                    {xtype: 'button', id: 'btn', text: 'Lista', iconCls: 'icon-servicios', handler: function() {
                            if (bandera) {
                                groupingFeature.disable();
                                Ext.getCmp('btn').setIconCls("icon-cancelar");
                                bandera = false;
                            } else {
                                groupingFeature.enable();
                                Ext.getCmp('btn').setIconCls("icon-servicios");
                                bandera = true;
                            }
                        }}]
            }],
        columns: columnGsmGps
    });

    var tabGpsGsm = Ext.create('Ext.container.Container', {
        title: 'Perdida de GPS y GSM',
        closable: true,
        iconCls: 'icon-flota',
        layout: 'border',
        items: [{
                layout: 'border',
                xtype: 'panel',
                items: gridGsmGps,
                region: 'center',
                autoScroll: true,
                columnLines: true,
                frame: true
            }
        ]
    });

    panelTabMapaAdmin.add(tabGpsGsm);
    panelTabMapaAdmin.setActiveTab(tabGpsGsm);
}
function reporteWinperdidaGSM() {
    if (!VentanaGSM) {
        VentanaGSM = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Perdida GPS Y GSM',
            iconCls: 'icon-flota',
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

function generarExcelGSM(store) {
    if (store.length > 0) {
        if (getNavigator() === 'img/chrome.png') {
            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            var numFil = store.length;
            var numCol = 8;
            var tiLetra = 'Calibri';
            var titulo = 'Perdida de GPS Y GSM';
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
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Empresa</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Equipo</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Señal</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Latitud</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Longitud</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha</Data></Cell>" +
                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Velocidad</Data></Cell>" +
                    "</Row>";
            for (var i = 0; i < numFil; i++) {
                table_div += "<Row ss:AutoFitHeight='0'>" +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].empresa + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].equipo + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].placa + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + sinGSM(store[i].tipo_respuesta) + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].latitud + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].longitud + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].fecha + " </Data></Cell > " +
                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store[i].velocidad + " </Data></Cell > " +
                        "</Row>";
            }
            table_div += "</Table> </Worksheet></Workbook>";
            var table_xml = table_div.replace(/ /g, '%20');
            a.href = data_type + ', ' + table_xml;
            a.download = 'Perdidad de GPS Y GSM' + '.xml';
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


function sinGSM(value) {
    if (value === 'GSM') {
        return "<span style='color:RED'>" + 'SIN GSM' + "</span>";
    } else {
        return "<span style='color:RED'>" + 'SIN GPS' + "</span>";
    }

}



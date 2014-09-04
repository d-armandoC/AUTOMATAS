var contenedorwinRepGeocercas;
var winRepGeocerca;

Ext.onReady(function() {

    var cbxEmpresas = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Cooperativa',
        name: 'cbxEmpresas',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Cooperativa...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxVehiculos.enable();
                cbxVehiculos.clearValue();
                cbxGeocerca.clearValue();
                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
                storeGeo.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehiculos = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo:',
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
            minWidth: 300
        },
        listeners: {
            select: function(combo, records, eOpts) {
                cbxGeocerca.enable();
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

    var dateInicio = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniGeo',
        name: 'fechaIni',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinGeo',
        emptyText: 'Fecha Inicial...'
    });

    var dateFinal = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinGeo',
        name: 'fechaFin',
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniGeo',
        emptyText: 'Fecha Final...'
    });

    var timeInicio = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFinal = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var hoy = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateInicio.setValue(formatoFecha(nowDate));
            dateFinal.setValue(formatoFecha(nowDate));

            timeInicio.setValue('00:01');
            timeFinal.setValue('23:59');
        }
    });

    var hayer = Ext.create('Ext.button.Button', {
        text: 'Ayer',
        iconCls: 'icon-yesterday',
        handler: function() {
            var nowDate = new Date();
            var año = nowDate.getFullYear();
            var mes = nowDate.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            var dia = nowDate.getDate() - 1;
            if (dia < 10) {
                dia = "0" + dia;
            }
            nowDate.setMinutes(nowDate.getMinutes() + 10);

            dateInicio.setValue(año + "-" + mes + "-" + dia);
            dateFinal.setValue(año + "-" + mes + "-" + dia);

            timeInicio.setValue('00:01');
            timeFinal.setValue('23:59');
        }
    });

    var panelBoton = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [hoy]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [hayer]
            }]
    });

    contenedorwinRepGeocercas = Ext.create('Ext.form.Panel', {
        frame: true,
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
                            cbxEmpresas,
                            cbxGeocerca
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxVehiculos
                        ]
                    }]
            }, {
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateInicio,
                            timeInicio
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            dateFinal,
                            timeFinal
                        ]
                    }]
            },
            panelBoton],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinRepGeocercas.getForm().isValid()) {
                        loadGridGeo();
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosGeocercas
            }]
    });
});

function limpiar_datosGeocercas() {
    contenedorwinRepGeocercas.getForm().reset();
    contenedorwinRepGeocercas.down('[name=cbxVeh]').disable();
    contenedorwinRepGeocercas.down('[name=cbxGeo]').disable();

    if (winRepGeocerca) {
        winRepGeocerca.hide();
    }
}

function ventanaReporteGeocerca() {
    if (!winRepGeocerca) {
        winRepGeocerca = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Reporte de Geocercas',
            iconCls: 'icon-report-geo',
            resizable: false,
            width: 560,
            height: 250,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinRepGeocercas],
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosGeocercas();
                }
            }
        });
    }
    contenedorwinRepGeocercas.getForm().reset();
    winRepGeocerca.show();
}


function loadGridGeo() {
    var empresa = contenedorwinRepGeocercas.down('[name=cbxEmpresas]').getRawValue();
    var idEqp = contenedorwinRepGeocercas.down('[name=cbxVeh]').getValue();
    var idGeo = contenedorwinRepGeocercas.down('[name=cbxGeo]').getValue();
    var fi = formatoFecha(contenedorwinRepGeocercas.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinRepGeocercas.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinRepGeocercas.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinRepGeocercas.down('[name=horaFin]').getValue());

    var vehiculo = contenedorwinRepGeocercas.down('[name=cbxVeh]').getRawValue();

    Ext.MessageBox.show({
        title: "Obteniendo Datos",
        msg: "Reportes",
        progressText: "Obteniendo...",
        wait: true,
        waitConfig: {
            interval: 200
        }
    });

    var store = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/report/getReportGeo.php?cbxEmpresas=' + empresa +
                    '&cbxVeh=' + idEqp +
                    '&cbxGeo=' + idGeo +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'datos'
            }
        },
        fields: ['id_geocerca', 'geocerca', 'placa', 'vehiculo', 'estado', 'fecha_hora'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {
                Ext.MessageBox.hide();
                if (records.length > 0) {
                    var columnGeo = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Geocerca', flex: 20, dataIndex: 'geocerca'},
                        {text: 'Vehiculo', flex: 20, dataIndex: 'vehiculo'},
                        {text: 'Placa', flex: 15, dataIndex: 'placa'},
                        {text: 'Estado', flex: 10, dataIndex: 'estado', renderer: formatTipoEstado},
                        {text: 'Fecha', flex: 15, dataIndex: 'fecha_hora'}
                    ]

                    var gridGeocerca = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 435,
                        collapsible: true,
                        //title: '<center>Reporte de Geocercas: ' + vehiculo + '</center>',
                        title:'<center><span style="color:#000000">Empresa: ' +'<span style="color:#FFFF00">'+ empresa + '</center>\
                                    <center><span style="color:#000000">Vehiculo: '+'<span style="color:#FFFF00">'+ vehiculo+' </center>\n\
                                  <center><span style="color:#000000">Desde: '+'<span style="color:#FFFF00">' + fi + ' |<span style="color:#000000"> Hasta: '+'<span style="color:#FFFF00">' + ff + '</center> ',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnGeo,
                        tbar: [{
                                                xtype: 'button',
                                                iconCls: 'icon-excel',
                                                text: 'Exportar a Excel',
                                                handler: function() {
                                                    if (store.getCount() > 0) {
                                                        if (getNavigator() === 'img/chrome.png') {
                                                            var a = document.createElement('a');
                                                            var data_type = 'data:application/vnd.ms-excel';
                                                            var numFil = store.data.length;
                                                            var numCol = 5;
                                                            var tiLetra = 'Calibri';
                                                            var titulo = 'Registro de Geocercas'
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
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Geocerca</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Vehiculo</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Placa</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Estado</Data></Cell>" +
                                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha Registro</Data></Cell>" +
                                                                    "</Row>";
                                                            for (var i = 0; i < numFil; i++) {
                                                                table_div += "<Row ss:AutoFitHeight='0'>" +  
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.geocerca + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.vehiculo + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.placa + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + formatTipoEstado(store.data.items[i].data.estado) + " </Data></Cell > " +
                                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.fecha_hora + " </Data></Cell > " +
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

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Geocercas',
                        closable: true,
                        iconCls: 'icon-report-geo',
                        items: gridGeocerca
                    });
                    limpiar_datosGeocercas();
                    panelTabMapaAdmin.add(tab);
                    panelTabMapaAdmin.setActiveTab(tab);
                } else {
                    Ext.MessageBox.show({
                        title: 'Error...',
                        msg: 'No hay Datos en estas fechas y horas...',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }

            }
        }
    });
}
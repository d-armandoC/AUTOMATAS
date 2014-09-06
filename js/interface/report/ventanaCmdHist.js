var contenedorwinCmdHist;
var winCmdHist;

Ext.onReady(function() {

    var cbxEmpresasBD = Ext.create('Ext.form.ComboBox', {
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
                cbxVehBD.enable();
                cbxVehBD.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    var cbxVehBD = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículo:',
        name: 'cbxVeh',
        store: storeVeh,
        valueField: 'id',
        value: new Date(),
        maxValue: new Date(),
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Vehículo...',
        disabled: true,
        editable: false,
        allowBlank: false,
        listConfig: {
            minWidth: 300
        }
    });

    var dateIni = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniCmdHist',
        name: 'fechaIni',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinCmdHist',
        emptyText: 'Fecha Inicial...'
    });

    var dateFin = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d',
        id: 'fechaFinCmdHist',
        name: 'fechaFin',
        value: new Date(),
        maxValue: new Date(),
        vtype: 'daterange',
        allowBlank: false,
        startDateField: 'fechaIniCmdHist',
        emptyText: 'Fecha Final...'
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIni',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...'
    });

    var timeFin = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFin',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...'
    });

    var today = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();

            dateIni.setValue(formatoFecha(nowDate));
            dateFin.setValue(formatoFecha(nowDate));

            timeIni.setValue('00:01');
            timeFin.setValue('23:59');
        }
    });

    var yesterdey = Ext.create('Ext.button.Button', {
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

            dateIni.setValue(año + "-" + mes + "-" + dia);
            dateFin.setValue(año + "-" + mes + "-" + dia);

            timeIni.setValue('00:01');
            timeFin.setValue('23:59');
        }
    });

    var panelBotones = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [today]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [yesterdey]
            }]
    });

    contenedorwinCmdHist = Ext.create('Ext.form.Panel', {
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
                            cbxEmpresasBD,
                            dateIni,
                            timeIni
                        ]
                    }, {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxVehBD,
                            dateFin,
                            timeFin
                        ]
                    }]
            },
            panelBotones],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {
                    if (contenedorwinCmdHist.getForm().isValid()) {
                        loadGridCmdHist();
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: limpiar_datosCmdHist
            }]
    });
});

function limpiar_datosCmdHist() {
    contenedorwinCmdHist.getForm().reset();
    contenedorwinCmdHist.down('[name=cbxVeh]').disable();

    if (winCmdHist) {
        winCmdHist.hide();
    }
}

function ventanaCmdHistorial() {
    if (!winCmdHist) {
        winCmdHist = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Cmd enviados',
            iconCls: 'icon-cmd-hist',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorwinCmdHist],
            listeners: {
                close: function(panel, eOpts) {
                    limpiar_datosCmdHist();
                }
            }
        });
    }
    contenedorwinCmdHist.getForm().reset();
    winCmdHist.show();
}


function loadGridCmdHist() {
    var empresa = contenedorwinCmdHist.down('[name=cbxEmpresas]').getRawValue();
    var idEqp = contenedorwinCmdHist.down('[name=cbxVeh]').getValue();
    var vehiculo = contenedorwinCmdHist.down('[name=cbxVeh]').getRawValue();
    var fi = formatoFecha(contenedorwinCmdHist.down('[name=fechaIni]').getValue());
    var ff = formatoFecha(contenedorwinCmdHist.down('[name=fechaFin]').getValue());
    var hi = formatoHora(contenedorwinCmdHist.down('[name=horaIni]').getValue());
    var hf = formatoHora(contenedorwinCmdHist.down('[name=horaFin]').getValue());

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
            url: 'php/interface/report/cmd/getReportCmd.php?cbxEmpresas=' + empresa +
                    '&cbxVeh=' + idEqp +
                    '&fechaIni=' + fi +
                    '&fechaFin=' + ff +
                    '&horaIni=' + hi +
                    '&horaFin=' + hf,
            reader: {
                type: 'json',
                root: 'cmd_hist'
            }
        },
//         "usuario:'" . utf8_encode($myrow["usuario"]) . "',"
//                . "comando:'" . utf8_encode($myrow["comando"]) . "',"
//                . "respuesta:'" . utf8_encode($myrow["respuesta"]) . "',"
//                . "fecha_creacion:'" . $myrow["fecha_hora_registro"] . "',"
//                . "fecha_envio:'" .$myrow["fecha_hora_envio"] . "',"
//                . "estado:'" . $myrow["estado"] . "'"




        fields: ['usuario', 'comando', 'respuesta', 'fecha_creacion', 'fecha_envio', 'estado'],
        listeners: {
            load: function(thisObject, records, successful, eOpts) {

                Ext.MessageBox.hide();

                if (records.length > 0) {
                    var columnCmdHist = [
                        Ext.create('Ext.grid.RowNumberer'),
                        {text: 'Usuario', width: 150, dataIndex: 'usuario'},
                        {text: 'Comando', flex: 150, dataIndex: 'comando'},
                        {text: 'Respuesta', dataIndex: 'respuesta', flex: 100},
                        {text: 'Fecha Creacion', width: 150, dataIndex: 'fecha_creacion'},
                        {text: 'Fecha Envio', width: 150, dataIndex: 'fecha_envio'},
                        {text: 'Estado', width: 100, dataIndex: 'estado'}
                    ]

                    var gridCmdHist = Ext.create('Ext.grid.Panel', {
                        width: '100%',
                        height: 435,
                        collapsible: true,
                        title: '<center><span style="color:#000000">Empresa: ' + '<span style="color:#FFFF00">' + empresa + '</center>\
                                    <center><span style="color:#000000">Vehiculo: ' + '<span style="color:#FFFF00">' + vehiculo + ' </center>\n\
                                  <center><span style="color:#000000">Desde: ' + '<span style="color:#FFFF00">' + fi + ' |<span style="color:#000000"> Hasta: ' + '<span style="color:#FFFF00">' + ff + '</center> ',
                        store: store,
                        multiSelect: true,
                        columnLines: true,
                        viewConfig: {
                            emptyText: 'No hay datos que Mostrar'
                        },
                        columns: columnCmdHist,
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
                                            var numCol = 6;
                                            var tiLetra = 'Calibri';
                                            var titulo = 'Registro de Comandos Enviados'
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
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Usuario</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Comando</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Respuesta</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha de Creación</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Fecha de Envio</Data></Cell>" +
                                                    "<Cell ss:StyleID='encabezados'><Data ss:Type='String'>Estado</Data></Cell>" +
                                                    "</Row>";
                                            for (var i = 0; i < numFil; i++) {
                                                table_div += "<Row ss:AutoFitHeight='0'>" +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.usuario + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.comando + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.respuesta + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.fecha_creacion + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.fecha_envio + " </Data></Cell > " +
                                                        "<Cell ss:StyleID ='datos'><Data ss:Type = 'String' > " + store.data.items[i].data.estado + " </Data></Cell > " +
                                                        "</Row>";
                                            }
                                            table_div += "</Table> </Worksheet></Workbook>";
                                            var table_xml = table_div.replace(/ /g, '%20');
                                            a.href = data_type + ', ' + table_xml;
                                            a.download = 'Registro de Comandos Enviados' + '.xml';
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
                    });

                    var tab = Ext.create('Ext.form.Panel', {
                        title: 'Reporte de Comandos',
                        closable: true,
                        iconCls: 'icon-cmd-hist',
                        items: gridCmdHist
                    });
                    panelTabMapaAdmin.add(tab);
                    panelTabMapaAdmin.setActiveTab(tab);
                    winCmdHist.hide();
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
var contenedorWinTax;
var winTax;
var cbxequipoTax;
var empresa;
var gridInfTax;

Ext.onReady(function() {



    cbxEmpresasBDTax = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Organización',
        name: 'empresaTax',
        store: storeEmpresas,
        valueField: 'id',
        displayField: 'text',
        queryMode: 'local',
        emptyText: 'Seleccionar Organización...',
        editable: false,
        allowBlank: false,
        listeners: {
            select: function(combo, records, eOpts) {
                cbxBusesBDTax.enable();
                cbxBusesBDTax.clearValue();

                storeVeh.load({
                    params: {
                        cbxEmpresas: records[0].data.id
                    }
                });
            }
        }
    });

    cbxBusesBDTax = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Vehículos',
        id: 'cbxBusesTax',
        name: 'cbxBusesTax',
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
        }
    });

    var dateIniTax = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Desde el',
        format: 'Y-m-d',
        id: 'fechaIniTax',
        value: new Date(),
        maxValue: new Date(),
        name: 'fechaIniTax',
        vtype: 'daterange',
        allowBlank: false,
        endDateField: 'fechaFinTax',
        emptyText: 'Fecha Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var dateFinTax = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Hasta el',
        format: 'Y-m-d', //YYYY-MMM-DD
        id: 'fechaFinTax',
        name: 'fechaFinTax',
        vtype: 'daterange',
        value: new Date(),
        maxValue: new Date(),
        allowBlank: false,
        startDateField: 'fechaIniTax',
        emptyText: 'Fecha Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var timeIniTax = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Desde las',
        name: 'horaIniTax',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Inicial...',
        listConfig: {
            minWidth: 300
        }
    });
    var timeFinTax = Ext.create('Ext.form.field.Time', {
        fieldLabel: 'Hasta las',
        name: 'horaFinTax',
        format: 'H:i',
        allowBlank: false,
        emptyText: 'Hora Final...',
        listConfig: {
            minWidth: 450
        }
    });
    var btn1RecPanico = Ext.create('Ext.button.Button', {
        text: 'Hoy',
        iconCls: 'icon-today',
        handler: function() {
            var nowDate = new Date();
            dateIniTax.setValue(formatoFecha(nowDate));
            dateFinTax.setValue(formatoFecha(nowDate));
            timeIniTax.setValue('00:01');
            timeFinTax.setValue('23:59');
        }
    });
    var btn2RecTax = Ext.create('Ext.button.Button', {
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

            dateIniTax.setValue(año + "-" + mes + "-" + dia);
            dateFinTax.setValue(año + "-" + mes + "-" + dia);
            timeIniTax.setValue('00:01');
            timeFinTax.setValue('23:59');
        }
    });
    var panelBotonesGenTax = Ext.create('Ext.form.Panel', {
        layout: 'column',
        baseCls: 'x-plain',
        items: [{
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn1RecPanico]
            }, {
                baseCls: 'x-plain',
                bodyStyle: 'padding:0 5px 0 0',
                items: [btn2RecTax]
            }]
    });
    contenedorWinTax = Ext.create('Ext.form.Panel', {
        frame: false,
        padding: '5 5 5 5',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 70,
//            labelHeight: 100,
            width: 260
        },
        items: [{
                layout: 'column',
                baseCls: 'x-plain',
                items: [{
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxEmpresasBDTax,
                            dateIniTax,
                            dateFinTax,
                        ]
                    },
                    {
                        columnWidth: .5,
                        baseCls: 'x-plain',
                        items: [
                            cbxBusesBDTax,
                            timeIniTax,
                            timeFinTax

                        ]
                    },
                ]
            },
            panelBotonesGenTax],
        buttons: [{
                text: 'Obtener',
                iconCls: 'icon-consultas',
                handler: function() {

                    if (contenedorWinTax.getForm().isValid()) {
                        Ext.MessageBox.show({
                            title: 'Cargando',
                            msg: 'Generando Datos....',
                            progressText: 'Iniciando...',
                            width: 300,
                            progress: true,
                            closable: false
                        });

                        contenedorWinTax.getForm().submit({
                            url: 'php/interface/report/getReportTaximetro.php',
                            method: 'POST',
                            waitMsg: 'Comprobando Datos...',
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No existen datos que Mostrar.');
                            },
                            success: function(form, action) {
//                               
                                var resultado = action.result;
//                                
                                loadGridInfTax(resultado.datos,
                                        cbxEmpresasBDTax.getValue(),
                                        cbxBusesBDTax.getValue(),
                                        formatoFecha(dateIniTax.getValue()),
                                        formatoFecha(dateFinTax.getValue()),
                                        formatoHora(timeIniTax.getValue()),
                                        formatoHora(timeFinTax.getValue())
                                        );
                                panelTax();
                                contenedorWinTax.getForm().reset();
                                winTax.hide();





                            }

                        });




                    }

                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: function limpiar_datosPan() {
                    contenedorWinTax.getForm().reset();
                    // cbxBusesBDPan.disable();
                    if (winTax) {
                        winTax.hide();
                    }
                }

            }]
    });
});




function ventanaTaximetro() {
    if (!winTax) {
        winTax = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Registro Taximetro',
            iconCls: 'icon-taximetro',
            resizable: false,
            width: 560,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: [contenedorWinTax]
        });
    }
    contenedorWinTax.getForm().reset();
    winTax.show();
}



function loadGridInfTax(records1, empresa, equipo, fi, ff, hi, hf) {

    var arrayColumn = new Array();
    for (var i = 0; i <= 9; i++) {
        arrayColumn[i] = 1;
    }

    var storeInfTax = Ext.create('Ext.data.JsonStore', {
        data: records1,
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['id_equipo', 'ciudad', 'fecha', 'id_empresa', 'serial', 'tiquete', 'hora_inicial', 'hora_final',
            'distancia', 'costo', 'paga', {name: 'hora_registro_servidor', type: 'date', dateFormat: 'c'}, 'valido', 'tarifa', 'banderaso', 'tiempo_seg']
    });

    var columnInfTax = [
        Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
        {text: '<b>Id Empresa</b>', width: 80, dataIndex: 'id_empresa', align: 'center'},
        {text: '<b>Serial</b>', width: 60, dataIndex: 'serial', align: 'center'},
        {text: '<b>Ciudad</b>', width: 75, dataIndex: 'ciudad', align: 'center'},
        {text: '<b>Tiquete</b>', width: 60, dataIndex: 'tiquete', align: 'center'},
        {text: '<b>Id equipo</b>', width: 75, dataIndex: 'id_equipo', align: 'center'},
        {text: '<b>Fecha</b>', xtype: 'datecolumn', format: 'd-m-Y', width: 150, dataIndex: 'fecha', align: 'center'},
        {text: '<b>Hora Inicial</b>', width: 80, dataIndex: 'hora_inicial', align: 'center'},
        {text: '<b>Hora Final</b>', width: 80, dataIndex: 'hora_final', align: 'center'},
        {text: '<b>Distancia</b>', width: 80, dataIndex: 'distancia', align: 'center'},
        {text: '<b>Costo</b>', width: 75, dataIndex: 'costo', align: 'center'},
        {text: '<b>Paga</b>', width: 75, dataIndex: 'paga', align: 'center'},
        {text: '<b>Hora_registro_servidor</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'hora_registro_servidor', align: 'center'},
        {text: '<b>Valido</b>', width: 60, dataIndex: 'valido', align: 'center'},
        {text: '<b>Tarifa</b>', width: 60, dataIndex: 'tarifa', align: 'center'},
        {text: '<b>Banderaso</b>', width: 75, dataIndex: 'banderaso', align: 'center'},
        {text: '<b>Tiempo Segundos</b>', width: 90, dataIndex: 'tiempo_seg', align: 'center'},
    ];
    gridInfTax = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Empresa :' + " " + empresa + " " + " " + 'Equipo ' + " " + equipo + "<br>" + 'Desde ' + fi + " " + hi + ' Hasta ' + ff + " " + hf + '</center>',
        store: storeInfTax,
        columnLines: true,
        height: 400,
        width: 1100,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: columnInfTax,
//      
    });


}

function panelTax() {
    var tabTax = Ext.create('Ext.Container', {
        title: 'Reporte Taximetro',
        closable: true,
        iconCls: 'icon-taximetro',
        layout: 'border',
        items: gridInfTax

    });


    panelMapa.add(tabTax);
    panelMapa.setActiveTab(tabTax);
}
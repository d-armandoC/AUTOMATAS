//var contenedorVentanaConsCombus;
//var VentanaCombustibles;
//
//Ext.onReady(function() {
//
//    var cbxEmpresasCombustibles = Ext.create('Ext.form.ComboBox', {
//        fieldLabel: 'Cooperativa:',
//        name: 'cbxEmpresas',
//        store: storeEmpresas,
//        valueField: 'id',
//        displayField: 'text',
//        queryMode: 'local',
//        emptyText: 'Seleccionar Cooperativa...',
//        editable: false,
//        allowBlank: false,
//        listeners: {
//            select: function(combo, records, eOpts) {
//                cbxVehuclosCombustibles.enable();
//                cbxVehuclosCombustibles.clearValue();
//
//                storeVeh.load({
//                    params: {
//                        cbxEmpresas: records[0].data.id
//                    }
//                });
//            }
//        }
//    });
//
//    var cbxVehuclosCombustibles = Ext.create('Ext.form.ComboBox', {
//        fieldLabel: 'Vehículos',
//        name: 'cbxVeh',
//        store: storeVeh,
//        valueField: 'id',
//        displayField: 'text',
//        queryMode: 'local',
//        emptyText: 'Seleccionar Vehículo...',
//        disabled: true,
//        editable: false,
//        allowBlank: false,
//        listConfig: {
//            minWidth: 450
//        }
//    });
//
//    var fechaInicioCombst = Ext.create('Ext.form.field.Date', {
//        fieldLabel: 'Desde el',
//        format: 'Y-m-d',
//        id: 'fechaIniBan',
//        name: 'fechaIni',
//        vtype: 'daterange',
//        allowBlank: false,
//        endDateField: 'fechaFinBan',
//        emptyText: 'Fecha Inicial...',
//        listConfig: {
//            minWidth: 300
//        }
//    });
//
//    var fechaFinCombust = Ext.create('Ext.form.field.Date', {
//        fieldLabel: 'Hasta el',
//        format: 'Y-m-d',
//        id: 'fechaFinBan',
//        name: 'fechaFin',
//        vtype: 'daterange',
//        allowBlank: false,
//        startDateField: 'fechaIniBan',
//        emptyText: 'Fecha Final...'
//    });
//
//    var horaInicialCombus = Ext.create('Ext.form.field.Time', {
//        fieldLabel: 'Desde las',
//        name: 'horaIni',
//        format: 'H:i',
//        allowBlank: false,
//        emptyText: 'Hora Inicial...'
//    });
//
//    var horaFinCombus = Ext.create('Ext.form.field.Time', {
//        fieldLabel: 'Hasta las',
//        name: 'horaFin',
//        format: 'H:i',
//        allowBlank: false,
//        emptyText: 'Hora Final...'
//    });
//
//    var hoyCombs = Ext.create('Ext.button.Button', {
//        text: 'Hoy',
//        iconCls: 'icon-today',
//        handler: function() {
//            var nowDate = new Date();
//
//            dateIni.setValue(formatoFecha(nowDate));
//            fechaFinCombust.setValue(formatoFecha(nowDate));
//
//            horaInicialCombus.setValue('00:01');
//            horaFinCombus.setValue('23:59');
//        }
//    });
//
//    var hayerCombs = Ext.create('Ext.button.Button', {
//        text: 'Ayer',
//        iconCls: 'icon-yesterday',
//        handler: function() {
//            var nowDate = new Date();
//            var año = nowDate.getFullYear();
//            var mes = nowDate.getMonth() + 1;
//            if (mes < 10) {
//                mes = "0" + mes;
//            }
//            var dia = nowDate.getDate() - 1;
//            if (dia < 10) {
//                dia = "0" + dia;
//            }
//            nowDate.setMinutes(nowDate.getMinutes() + 10);
//
//            dateIni.setValue(año + "-" + mes + "-" + dia);
//            fechaFinCombust.setValue(año + "-" + mes + "-" + dia);
//
//            horaInicialCombus.setValue('00:01');
//            horaFinCombus.setValue('23:59');
//        }
//    });
//
//    var panelBotonesCombs = Ext.create('Ext.form.Panel', {
//        layout: 'column',
//        baseCls: 'x-plain',
//        items: [{
//                baseCls: 'x-plain',
//                bodyStyle: 'padding:0 5px 0 0',
//                items: [hoyCombs]
//            }, {
//                baseCls: 'x-plain',
//                bodyStyle: 'padding:0 5px 0 0',
//                items: [hayerCombs]
//            }]
//    });
//
//    contenedorVentanaConsCombus = Ext.create('Ext.form.Panel', {
//         frame: false,
//        padding: '5 5 5 5',
//        fieldDefaults: {
//            labelAlign: 'left',
//            labelWidth: 70,
//            width: 260
//        },
//        items: [{
//                layout: 'column',
//                baseCls: 'x-plain',
//                items: [{
//                        columnWidth: .5,
//                        baseCls: 'x-plain',
//                        items: [
//                            cbxEmpresasCombustibles,
//                            fechaInicioCombst,
//                            horaInicialCombus
//                        ]
//                    }, {
//                        columnWidth: .5,
//                        baseCls: 'x-plain',
//                        items: [
//                            cbxVehuclosCombustibles,
//                            fechaFinCombust,
//                            horaFinCombus
//                        ]
//                    }]
//            },
//            panelBotonesCombs, {
//                xtype: 'fieldset',
//                title: 'Opciones de Reporte',
//                collapsible: true,
//                layout: 'anchor',
//                margin: '10 0 0 0',
//                defaults: {
//                    anchor: '100%'
//                },
//                items: [{
//                        xtype: 'checkboxgroup',
//                        items: [{
//                                checked: true,
//                                boxLabel: 'Trazar Ruta',
//                                name: 'trazar_ruta_combustible',
//                                inputValue: 'trazar'
//                            }, {
//                                boxLabel: 'Reporte Ruta',
//                                name: 'reporte_ruta_combustible',
//                                inputValue: 'reporte'
//                            }]
//                    }]
//            }],
//        buttons: [{
//                text: 'Simbologia',
//                iconCls: 'icon-edit',
//                tooltip: 'Simbologia',
//                handler: ventanaSimbologia
//            }, {
//                text: 'Obtener',
//                iconCls: 'icon-consultas',
//                handler: function() {
//                    if (contenedorVentanaConsCombus.getForm().isValid()) {
//                        var trazar_ruta = this.up('form').down('[name=trazar_ruta_combustible]').getValue();
//                        var reporte_ruta = this.up('form').down('[name=reporte_ruta_combustible]').getValue();
//                        if (trazar_ruta || reporte_ruta) {
//
//                            contenedorVentanaConsCombus.getForm().submit({
//                                url: 'php/interface/report/getDataFlags.php',
//                                method: 'POST',
//                                waitMsg: 'Comprobando Datos...',
//                                params: {
//                                    nameVeh: cbxVehuclosCombustibles.getRawValue()
//                                },
//                                failure: function(form, action) {
//                                    switch (action.failureType) {
//                                        case Ext.form.action.Action.CLIENT_INVALID:
//                                            Ext.Msg.alert('Error', 'Los campos no se pueden enviar con valores invalidos.');
//                                            break;
//                                        case Ext.form.action.Action.CONNECT_FAILURE:
//                                            Ext.Msg.alert('Error', 'No hay datos a mostrar en su Petición');
//                                            break;
//                                        case Ext.form.action.Action.SERVER_INVALID:
//                                            Ext.Msg.alert('Error', action.result.message);
//                                            break;
//                                    }
//                                },
//                                success: function(form, action) {
//                                    var resultado = action.result;
//                                    if (trazar_ruta) {
//                                        clearLienzoTravel();
//                                        drawRutaMapa(resultado.puntos);
//                                        drawPointsRoute(resultado.puntos, "Puntos");
//                                        obtenergastoPorGalones(resultado.puntos);
//                                       // limpiarCapasHistorico();
//                                       // dibujarTrazadoHistorico(resultado.puntos);
//                                       //lienzosRecorridoHistorico(cbxVehBD.getValue(), resultado.puntos);
//                                    }
//
//                                    if (reporte_ruta) {
//                                        loadGridFlags(
//                                                resultado.puntos,
//                                                cbxEmpresasCombustibles.getValue(),
//                                                cbxVehuclosCombustibles.getValue(),
//                                                formatoFecha(fechaInicioCombst.getValue()),
//                                                formatoFecha(fechaFinCombust.getValue()),
//                                                formatoHora(horaInicialCombus.getValue()),
//                                                formatoHora(horaFinCombus.getValue()),
//                                                cbxVehuclosCombustibles.getRawValue()
//                                                );
//                                    }
//
//                                    VentanaCombustibles.hide();
//                                }
//                            });
//                        } else {
//                            Ext.MessageBox.show({
//                                title: 'Error...',
//                                msg: 'Escoga una de las Opciones de Reporte...',
//                                buttons: Ext.MessageBox.OK,
//                                icon: Ext.MessageBox.ERROR
//                            });
//                        }
//                    }
//                }
//            }, {
//                text: 'Cancelar',
//                iconCls: 'icon-cancelar',
//                handler: function() {
//                    VentanaCombustibles.hide();
//                }
//            }]
//    });
//});
//
//function ventanaConsumoCombustibles() {
//    if (!VentanaCombustibles) {
//        VentanaCombustibles = Ext.create('Ext.window.Window', {
//            layout: 'fit',
//            title: 'Consumo de Combustible',
//            iconCls: 'icon-flota',
//            resizable: false,
//                width: 560,
//            height: 300,
//            closeAction: 'hide',
//            plain: false,
//            items: [contenedorVentanaConsCombus]
//        });
//    }
//    contenedorVentanaConsCombus.getForm().reset();
//    contenedorVentanaConsCombus.down('[name=cbxVeh]').disable();
//
//    var nowDate = new Date();
//    contenedorVentanaConsCombus.down('[name=fechaIni]').setValue(formatoFecha(nowDate));
//    contenedorVentanaConsCombus.down('[name=fechaFin]').setValue(formatoFecha(nowDate));
//    contenedorVentanaConsCombus.down('[name=horaIni]').setValue('00:01');
//    contenedorVentanaConsCombus.down('[name=horaFin]').setValue('23:59');
//
//    VentanaCombustibles.show();
//}
//
//function ventanaBanderasClick(coop, eqp) {
//    ventanaConsumoCombustibles();
//    storeEmpresas.load({
//        params: {
//            idEmpresa: coop,
//            menuClick: 1
//        }
//    });
//
//    contenedorVentanaConsCombus.down('[name=cbxEmpresas]').setValue(coop);
//    contenedorVentanaConsCombus.down('[name=cbxVeh]').enable();
//
//    storeVeh.load({
//        params: {
//            cbxEmpresas: coop
//        }
//    });
//
//    contenedorVentanaConsCombus.down('[name=cbxVeh]').setValue(eqp);
//}
//;
//
//
//function loadGridFlags(records, idEmp, idEqp, fi, ff, hi, hf, vehiculo) {
//    var arrayColumn = new Array();
//    for (var i = 0; i <= 9; i++) {
//        arrayColumn[i] = 1;
//    }
//
//    var storeFlags = Ext.create('Ext.data.JsonStore', {
//        data: records,
//        proxy: {
//            type: 'ajax',
//            reader: 'array'
//        },
//        fields: [ 'latitud', 'longitud', {name: 'fecha_hora', type: 'date', dateFormat:'c'}, {name: 'fecha_hora_reg', type: 'date', dateFormat:'c'}, 'velocidad', 'bateria', 
//            'gsm', 'gps2', 'ign', 'direccion', 'color', 'evento', 'idEvento', 'g1', 'g2', 'salida']
//    });
//    var columnFlags = [];
//
////    if (records[0].bateria === -1) {
////        columnFlags = [
////            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
////            {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
////            {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
////            {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 75, cls: 'listview-filesize', renderer: formatSpeed},
////            {text: '<b>Evento</b>', width: 130, dataIndex: 'evento', align: 'center'},
////            {text: '<b>Est. Unid.</b>', width: 130, dataIndex: 'ign', align: 'center'},
////            {text: '<b>Id Est. Unid.</b>', width: 50, dataIndex: 'gsm', align: 'center'},
////            {text: '<b>Est. Mec.</b>', width: 130, dataIndex: 'gps2', align: 'center'}
////        ];
////    } else {
//        columnFlags = [
//            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
//            {text: '<b>Fecha y Hora</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora', align: 'center'},
//            {text: '<b>Registro</b>', xtype: 'datecolumn', format: 'd-m-Y H:i:s', width: 150, dataIndex: 'fecha_hora_reg', align: 'center'},
//            {text: '<b>Vel (Km/h)</b>', dataIndex: 'velocidad', align: 'center', width: 95, cls: 'listview-filesize', renderer: formatSpeed},
//            {text: '<b>Bateria</b>', width: 80, dataIndex: 'bateria', align: 'center', renderer: formatBatIgnGsmGps2},
//            {text: '<b>IGN</b>', width: 70, dataIndex: 'ign', align: 'center', renderer: formatBatIgnGsmGps2},
//            {text: '<b>GSM</b>', width: 70, dataIndex: 'gsm', align: 'center', renderer: formatBatIgnGsmGps2},
//            {text: '<b>GPS</b>', width: 70, dataIndex: 'gps2', align: 'center', renderer: formatBatIgnGsmGps2},
//            {text: '<b>G1</b>', width: 90, dataIndex: 'g1', align: 'center', renderer: formatStateTaxy,},
//            {text: '<b>G2</b>', width: 70, dataIndex: 'g2', align: 'center', renderer: formatPanic},
//            {text: '<b>Salida</b>', width: 70, dataIndex: 'salida', align: 'center'},
//            {text: '<b>Evento</b>', width: 280, dataIndex: 'evento', align: 'center'},
//            {text: '<b>Id Evento</b>', width: 80, dataIndex: 'idEvento', align: 'center'},
//        ];
////    }
//
//    var gridFlags = Ext.create('Ext.grid.Panel', {
//        region: 'center',
//        title: '<center>Combustible:</center>',
////        store: storeFlags,
//        columnLines: true,
//         autoScroll: true,
//        height: 435,
//        width: 800,
//        viewConfig: {
//            emptyText: 'No hay datos que Mostrar'
//        },
//        columns: columnFlags,
//        listeners: {
//            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
//                panelTabMapaAdmin.setActiveTab('panelMapaTab');
//                console.log(record);
//               // localizarDireccion(record.data.longitud, record.data.latitud, 17);
//            }
//        }
//    });
////    var hol='que tal';
////    var hol1='que tal';
////    
////             var contenedorWi = Ext.create('Ext.form.Panel', {
////                frame: true,                
////                bodyStyle:'padding:5px 5px 5px',
////                autoScroll:true,                                
////                items: [{
////                    html : '<TABLE id="tablestados">'+
////                '<TR class="alt"> ' +
////                '   <TD> <IMG SRC="img/inicio.png"></TD> ' +
////                '   <TD align="CENTER">'+hol+'</TD> ' +'<TD align="CENTER">'+hol+'</TD> '+
////                '</TR> ' +
////
////                '<TR> ' +
////                '   <TD> <IMG SRC="img/fin.png"></TD> ' +
////                '   <TD align="CENTER">'+hol1+'</TD> ' +' <TD align="CENTER">'+hol1+'</TD> ' +
////                '</TR> ' +
////            ' </TABLE>'                    
////                }]     
////            });
//  
//    var tab = Ext.create('Ext.container.Container', {
//        title: 'Reporte de Excesos de Velocidad',
//        fullscreen: true,
//        layout: 'border',
//        margin: '3 3 3 3',
//        frame: true,
//        iconCls: 'icon-reset',
//        items: [   {
//                id: 'panel-map',
//                name: 'map',
//                layout: 'border',
//                region: 'center',
//                title: 'Mapa',
//                iconCls: 'icon-map',
//                html: '<div id="map"></div>'
//            },contenedorWi]
//    });
//
//    panelTabMapaAdmin.add(tab);
//    panelTabMapaAdmin.setActiveTab(tab);
//   
//     
//            
//        
//  
//}


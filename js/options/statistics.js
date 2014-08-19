Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'Ext.ux.CheckColumn',
    'Ext.chart.*'
]);
var panelCentral;
var formGraficGeneral;
var panelCountByDevice;
var panelChartCountAccessByUser;
var panelChartCountByAsig;
var panelCountTramasMonthNow;
var rango;
var asignar;
var nombreEvento;
var menu;
var refresh = false;
var timeRefresh = 15;
var nameEvento;
var refresh = false;
var timeRefresh = 15;
var donut = false;
var date = Ext.create('Ext.form.field.Date', {
    fieldLabel: 'Elegir Fecha....',
    format: 'Y-m-d', //YYYY-MMM-DD
    id: 'datePanel',
    name: 'fecha',
    allowBlank: false,
    startDateField: 'fechaIniPan',
    maxValue: new Date(),
    emptyText: 'Fecha...',
    editable: false
});
var DatosAsinacion;
var storeCountByAsignaciones;


function formatDate(date) {
    año = date.getFullYear();
    var mes = date.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }
    var dia = date.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }
    return año + '-' + mes + '-' + dia;
    }

function createGrafic(parametro) {
    date.setDisabled(true);
    asignar = parametro;
    var mostrarEvento = "Evento : " + nombreEvento;
    var storeCountPanicByDayToday = Ext.create('Ext.data.JsonStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountPanicByDayToday.php?parametro=' + parametro + '&date=' + formatDate(date.getValue()),
            reader: {
                type: 'json',
                root: 'countByPanic'
            }
        },
        fields: [{name: 'idEquipo'}, {name: 'parametro'}, {name: 'evento'}, {name: 'total'}],
        listeners: {///El Load  Obtiene los datos en arreglo 
            load: function(thisObj, records, successful, eOpts) {
                if (records.length > 0) {
                    panelCountPanicByDayToday.setTitle(records[0].data.evento);
                    var mayor = records[0];
                    for (i = 0; i < records.length; i++) {
                        if (records[i].data.total > mayor) {
                            mayor = records[i].data.total;
                        }
                    }
                    rango = mayor;
                } else {
                    panelCountPanicByDayToday.setTitle("No tiene datos el Evento con Parametro:" + nameEvento[0]);
                }
            }
        }
    });

    var chartCountPanicByDayToday = Ext.create('Ext.chart.Chart', {
        animate: true,
        shadow: true,
        store: storeCountPanicByDayToday,
        autoScroll: true,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                title: 'Eventos',
                grid: true,
                minimum: 0,
                maximum: rango
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['idEquipo'],
                title: 'Equipos',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'idEquipo',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>Información</center>");
                         this.update("<b>Equipo:</b> " + storeItem.get('idEquipo') + "<br><b>Cantidad:</b> " + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#38B8BF'
                }
            }]
    });

    var panelCountPanicByDayToday = Ext.create('Ext.form.Panel', {
        height: 550,
        width: 1300,
        title: mostrarEvento,
        iconCls: 'icon-reset',
        border: true,
        layout: 'fit',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function() {
                    // Add a short delay to prevent fast sequential clicks
                    window.loadTask.delay(500, function() {
                        Ext.example.msg('Mensaje', 'Datos Recargados Correctamente.');
                        storeCountPanicByDayToday.reload();
                        
                    });
                }
            }, {
                text: 'Descargar como Imagen',
                iconCls: 'icon-donwloaded',
                handler: function() {
                    Ext.MessageBox.confirm('Confirmar Descarga', 'Descargar Imagen ?', function(choice) {
                        if (choice === 'yes') {
                            chartCountPanicByDayToday.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }
        ],
        items: chartCountPanicByDayToday
    });
    return  panelCountPanicByDayToday;
}


var agrgados_general = new Array();
function agregararregloGeneral(arreglo) {
    agrgados_general = arreglo;
    if (arreglo.length === 0) {
        date.setDisabled(false);
    }
}

var eliminados_general = new Array();
function eliminararregloGeneral(arreglo) {
    eliminados_general = arreglo;
}

var bandera = false;
var parametros = new Array();
function dinamiGrafic(arreglo1, arreglo2, modal) {
    var cont = 0;
    var resultados = new Array();
    if (modal === 1) {
        console.log(arreglo1.length);
        formGraficGeneral.removeAll();
        for (var i = 0; i < arreglo1.length; i++) {
            if (arreglo1[i] !== "") {
                formGraficGeneral.add(createGrafic(arreglo1[i]));
            }
        }
    } else {
        for (i = 0; i < arreglo1.length; i++) {
            bandera = false;
            for (j = 0; j < arreglo2.length; j++) {
                if (arreglo1[i] === arreglo2[j]) {
                    bandera = true;
                }
            }
            if (bandera === false) {
                resultados[cont] = arreglo1[i];
                cont++;
            }
        }
        agregararregloGeneral(resultados);
        eliminararregloGeneral(new Array());
        formGraficGeneral.removeAll();
        for (var i = 0; i < resultados.length; i++) {
            if (resultados[i] !== "") {
                formGraficGeneral.add(createGrafic(resultados[i]));
            }
        }
    }
}

var contE = 0;
var contA = 0;

function creaMenu() {
    menu = Ext.create('Ext.menu.Menu', {
        listeners: {
            click: function(menu, item, e, eOpts) {
                nameEvento = new Array();
                if (item.checked === true) {
                    if (agrgados_general.length > 0) {
                        contA = agrgados_general.length;
                        agrgados_general[contA] = item.getId();
                        var n = item.getId() + "-textEl";
                        nameEvento[0] = document.getElementById(n).innerHTML;
                        dinamiGrafic(agrgados_general, 1, 1);
                    } else {
                        var n = item.getId() + "-textEl";
                        nameEvento[0] = document.getElementById(n).innerHTML;
                        contA = agrgados_general.length;
                        agrgados_general[contA] = item.getId();
                        dinamiGrafic(agrgados_general, 1, 1);
                    }
                }
                if (item.checked === false) {
                    eliminados_general[contE] = item.getId();
                    dinamiGrafic(agrgados_general, eliminados_general, 2);
                }
            }
        }
    });

    var storeCountPanicByDayToday = Ext.create('Ext.data.JsonStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/monitoring/getEventos.php',
            reader: {
                type: 'json',
                root: 'getEvento'
            }
        },
        fields: [{name: 'evento'}, {name: 'parametro'}],
        listeners: {///El Load  Obtiene los datos en arreglo 
            load: function(thisObj, records, successful, eOpts) {
                var size = records.length;
                console.log(size);
                console.log(records);
                if (records.length > 0) {
                    for (var i = 0; i < size; i++) {
                        menu.add({text: records[i].data.evento, id: records[i].data.parametro + '', checked: false});

                    }
                } else {
                    console.log("Vacio");
                }
            }
        }
    });
    return menu;
}



var panelImagen = Ext.create('Ext.form.Panel', {
    width: 1000,
    height: 600,
    region: 'center',
    id: 'idpaelImagen',
    layout: 'fit',
    html: "<img src='img/logo.png' width='1000' height='500' id='imagenfondo'>"
});


function agregarGrficas() {
    if (!panelCentral) {
        formGraficGeneral = Ext.create('Ext.form.Panel', {
            //title: 'Eventos',
            id: 'idpanel',
            layout: {
                region: 'center',
                width: 1000,
                height: 500,
                type: 'table',
                columns: 1
            },
            padding: '5 5 5 5',
            defaults: {
                padding: '5 5 5 5'
            }
            , autoScroll: true,
            bodyStyle: "background-image: url('img/logo.png'); background-repeat:no-repeat;"

        });
        principal = Ext.create('Ext.form.Panel', {
            height: 550,
            width: 1000,
            title: 'Eventos',
            iconCls: 'icon-check',
            border: true,
            autoScroll: true,
            layout: 'fit',
            tbar: [{
                    xtype: 'splitbutton',
                    margin: '5 5 5 5',
                    iconCls: 'icon-check',
                    padding: '5 5 10 5',
                    width: '10%',
                    text: 'Eventos',
                    menu: creaMenu()
                }, date],
            items: formGraficGeneral
        });
        panelCentral = Ext.create('Ext.tab.Panel', {
            region: 'center',
            deferreRender: false,
            activeTab: 0,
            items: [panelCountByDevice, panelChartCountAccessByUser, panelCountTramasMonthNow, principal]
        });
    }
}




Ext.onReady(function() {
    creaMenu();
    date.setValue(formatDate(new Date));

    var storeCountByDevice = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountByDevice.php',
            reader: {
                type: 'json',
                root: 'countByDevice'
            }
        },
        fields: ['idEquipo', 'total']
    });

    var storeCountAccessByUser = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountAccessByUser.php',
            reader: {
                type: 'json',
                root: 'countAccessByUser'
            }
        },
        fields: ['usuario', 'persona', 'total']
    });

    var storeCountTypeByDevice = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountTypeByDevice.php',
            reader: {
                type: 'json',
                root: 'countTypeByDevice'
            }
        },
        fields: ['evento', 'abv', 'total']
    });

    var storeCountTramasMonthNow = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountTramasMonthNow.php',
            reader: {
                type: 'json',
                root: 'countByDay'
            }
        },
        fields: ['fecha', 'total']
    });

    storeCountByAsignaciones = Ext.create('Ext.data.Store', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/interface/statistics/getCountAsignaciones.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['empresa', 'total', 'direccion', 'telefono', ]
    });


    var chartCountByDevice = Ext.create('Ext.chart.Chart', {
        width: 8000,
        height: '100%',
        animate: true,
        shadow: true,
        store: storeCountByDevice,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                title: 'Tramas Diarias',
                grid: true,
                minimum: 0,
                maximum: 1500
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['idEquipo'],
                title: 'Equipos',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'idEquipo',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update("<b>Equipo:</b> " + storeItem.get('idEquipo') + "<br><b>Cantidad</b>: " + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#0040FF'
                },
                listeners: {
                    itemclick: function(item, eOpts) {
                        Ext.getCmp('form-info').setTitle('Información de Tramas Por Vehiculo: ' + item.value[0]);
                        storeCountTypeByDevice.load({
                            params: {
                                idEqp: item.value[0]
                            }
                        });
                    }
                }
            }]
    });

    var chartCountAccessByUser = Ext.create('Ext.chart.Chart', {
        animate: true,
        shadow: true,
        store: storeCountAccessByUser,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                title: 'Cantidad de Accesos',
                grid: true,
                minimum: 0,
                maximum: 20
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['usuario'],
                title: 'Usuarios',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'usuario',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update("<b>Persona:</b> " + storeItem.get('persona') + "<br><b>Cantidad</b>: " + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#0040FF'
                }
            }]
    });

    var chartCountTypeByDevice = Ext.create('Ext.chart.Chart', {
        width: '100%',
        height: '100%',
        xtype: 'chart',
        animate: true,
        store: storeCountTypeByDevice,
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 10,
        theme: 'Base:gradients',
        series: [{
                type: 'pie',
                field: 'total',
                showInLegend: true,
                donut: donut,
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        //calculate percentage.
                        var total = 0;
                        storeCountTypeByDevice.each(function(rec) {
                            total += rec.get('total');
                        });
                        this.setTitle(storeItem.get('evento'));
                        this.update('Porcentaje: ' + Math.round(storeItem.get('total') / total * 100) + '%<br>Total: ' + storeItem.get('total'));
                        botonGrafica.setVisible(true);
                    }
                },
                highlight: {
                    segment: {
                        margin: 20
                    }
                },
                label: {
                    field: 'abv',
                    display: 'rotate',
                    contrast: true,
                    font: '10px Arial'
                }
            }]
    });

    var chartCountTramasMonthNow = Ext.create('Ext.chart.Chart', {
        animate: true,
        shadow: true,
        store: storeCountTramasMonthNow,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                title: 'Tramas Mes Actual',
                grid: true,
                minimum: 0,
                maximum: 15000
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['fecha'],
                title: 'Fecha',
                label: {
                    rotate: {
                        degrees: 270
                    }
                }
            }],
        series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'fecha',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>Información</center>");
                         this.update("<b>Fecha:</b> " + storeItem.get('fecha') + "<br><b>Cantidad:</b>" + storeItem.get('total'));
                    }
                },
                style: {
                    fill: '#38B8BF'
                }
            }]

    });

    var ChartCountByAssignaciones = Ext.create('Ext.chart.Chart', {
        width: 400,
        height: 600,
        animate: true,
        store: storeCountByAsignaciones,
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 25,
        theme: 'Base:gradients',
        series: [
            {
                type: 'pie',
                angleField: 'total',
                showInLegend: true,
                tips: {
                    trackMouse: true,
                    width: 200,
                    height: 40,
                    renderer: function(storeItem, item) {
                        // calculate and display percentage on hover
                        var total = 0;
                        storeCountByAsignaciones.each(function(rec) {
                            total += rec.get('total');
                        });
                        this.setTitle(storeItem.get('empresa') + '</br>' + 'TOTAL: ' + storeItem.get('total') + ': ' + Math.round(storeItem.get('total') / total * 100) + '%');
                    }
                },
                highlight: {
                    segment: {
                        margin: 20
                    }
                },
                label: {
                    field: 'empresa',
                    display: 'rotate',
                    contrast: true,
                    font: '15px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
                }
            }]
    });

    panelChartCountAccessByUser = Ext.create('Ext.form.Panel', {
        title: 'Accesos Diarios',
        iconCls: 'icon-user',
        layout: 'fit',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function() {
                    // Add a short delay to prevent fast sequential clicks
                    window.loadTask.delay(500, function() {
                        Ext.example.msg('Mensaje', 'Datos Recargados Correctamente.');
                        storeCountAccessByUser.reload();
                    });
                }
            }, {
                text: 'Descargar como Imagen',
                iconCls: 'icon-donwloaded',
                handler: function() {
                    Ext.MessageBox.confirm('Confirmar Descarga', 'Descargar Imagen ?', function(choice) {
                        if (choice === 'yes') {
                            chartCountByDevice.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
        items: chartCountAccessByUser
    });

    panelChartCountByAsig = Ext.create('Ext.form.Panel', {
        title: 'Asignaciones',
        iconCls: 'icon-skp',
        border: true,
        layout: 'fit',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function() {
                    // Add a short delay to prevent fast sequential clicks
                    window.loadTask.delay(100, function() {
                        storeCountByAsignaciones.reload();
                    });
                }
            },
            {
            text: 'Descargar como Imagen',
           iconCls:'icon-donwloaded',
            handler: function() {
                Ext.MessageBox.confirm('Confirmar Descarga', 'Descargar Imagen ?', function(choice){
                    if(choice === 'yes'){
                        ChartCountByAssignaciones.save({
                            type: 'image/png',
                        });
                    }
                });
            }
        }
        ],
        items: ChartCountByAssignaciones

    });
    var botonGrafica = Ext.create('Ext.Button', {
        text: 'Descargar como Imagen',
        iconCls: 'icon-donwloaded',
        renderTo: Ext.getBody(),
        handler: function() {
            Ext.MessageBox.confirm('Confirmar Descarga', 'Descargar Imagen ?', function(choice) {
                if (choice === 'yes') {
                    chartCountTypeByDevice.save({
                        type: 'image/png'
                    });
                }
            });
        }
    });


    panelCountByDevice = Ext.create('Ext.form.Panel', {
        title: 'Tramas Diarias',
        iconCls: 'icon-statistics',
        layout: 'border',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function() {
                    // Add a short delay to prevent fast sequential clicks
                    Ext.example.msg('Mensaje', 'Datos Recargados Correctamente.');
                    window.loadTask.delay(500, function() {
                        storeCountByDevice.reload();
                    });
                }
            }],
        items: [{
                region: 'west',
                width: '60%',
                autoScroll: true,
                layout: 'hbox',
                items: chartCountByDevice
            }, {
                region: 'center',
                id: 'form-info',
                title: 'Información de Tramas Por Vehiculo: ',
                layout: 'hbox', tbar: [botonGrafica],
                items: chartCountTypeByDevice
            }]
    });
    //otra alternativa
    function perc(v) {
        return v + '%';
    }

    var form = false,
            selectedRec = false,
            //performs the highlight of an item in the bar series
            highlightCompanyPriceBar = function(storeItem) {
                var name = storeItem.get('empresa'),
                        series = barChart.series.get(0),
                        i, items, l;

                series.highlight = true;
                series.unHighlightItem();
                series.cleanHighlights();
                for (i = 0, items = series.items, l = items.length; i < l; i++) {
                    if (name == items[i].storeItem.get('empresa')) {
                        series.highlightItem(items[i]);
                        break;
                    }
                }
                series.highlight = false;
            },
            ChartCountByAssignaciones1 = function(storeItem) {
                var name = storeItem.get('empresa'),
                        series = ChartCountByAssignaciones1.series.get(0),
                        i, items, l;

                series.highlight = true;
                series.unHighlightItem();
                series.cleanHighlights();
                for (i = 0, items = series.items, l = items.length; i < l; i++) {
                    if (name == items[i].storeItem.get('empresa')) {
                        series.highlightItem(items[i]);
                        break;
                    }
                }
                series.highlight = false;
            };




    var gridPanel = Ext.create('Ext.grid.Panel', {
        id: 'company-form',
        flex: 7,
        with : 100,
        store: storeCountByAsignaciones,
        title: 'Datos por Asignaciones',
        columns: [
            {
                id: 'empresa',
                text: 'Empresa',
                flex: 1,
                sortable: true,
                dataIndex: 'empresa'
            },
            {
                text: 'Total',
                width: 90,
                sortable: true,
                dataIndex: 'total',
                align: 'right',
                renderer: 'perc'
            }
        ],
        listeners: {
            selectionchange: function(model, records) {
                var fields;
                if (records[0]) {
                    selectedRec = records[0];
                    if (!form) {
                        form = this.up('panel').down('form').getForm();
                        fields = form.getFields();
                        fields.each(function(field) {
                            if (field.name != 'empresa' && field.name == 'empresa') {
                                field.setDisabled(false);
                            }
                        });
                    } else {
                        fields = form.getFields();
                    }
                    // prevent change events from firing
                    form.suspendEvents();
                    form.loadRecord(selectedRec);
                    form.resumeEvents();
                    highlightCompanyPriceBar(selectedRec);
                }
            }
        }
    });

    //create a bar series to be at the top of the panel.
    var barChart = Ext.create('Ext.chart.Chart', {
        height: 150,
        margin: '0 0 0 0',
        cls: 'x-panel-body-default',
        shadow: true,
        animate: true,
        store: storeCountByAsignaciones,
        axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total'],
                minimum: 0,
                hidden: true,
            }
        ],
        series: [{
                type: 'column',
                axis: 'left',
                style: {
                    fill: '#456d9f'
                },
                highlightCfg: {
                    fill: '#a2b5ca'
                },
                label: {
                    contrast: true,
                    display: 'insideEnd',
                    field: 'total',
                    color: '#000',
                    orientation: 'vertical',
                    'text-anchor': 'middle',
                },
                listeners: {
                    itemmouseup: function(item) {

                        var series = barChart.series.get(0);
                        gridPanel.getSelectionModel().select(Ext.Array.indexOf(series.items, item));
                    }
                },
                xField: 'empresa',
                yField: ['total'],
                tips: {
                    trackMouse: true,
                    renderer: function(storeItem, item) {
                        this.setTitle("<center>Información</center>");
                        this.update("<b>Empresa:</b> " + storeItem.get('empresa') + "<br><b>Cantidad</b>: " + storeItem.get('total'));
                    }
                }
            }

        ]

    });


    var ChartCountByAssignaciones1 = Ext.create('Ext.chart.Chart', {
        width: 500,
        height: 180,
        animate: true,
        store: storeCountByAsignaciones,
        shadow: true,
        insetPadding: 10,
        theme: 'Base:gradients',
        series: [
            {
                type: 'pie',
                angleField: 'total',
                showInLegend: true,
                tips: {
                    trackMouse: true,
                    width: 150,
                    height: 40,
                    font: '8px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                    renderer: function(storeItem, item) {
                        // calculate and display percentage on hover
                        var total = 0;
                        storeCountByAsignaciones.each(function(rec) {
                            total += rec.get('total');
                        });
                        this.setTitle(storeItem.get('empresa') + '</br>' + 'TOTAL: ' + storeItem.get('total') + ': ' + Math.round(storeItem.get('total') / total * 100) + '%');
                    }
                },
                highlight: {
                    segment: {
                        margin: 10
                    }
                }, listeners: {
                    itemmouseup: function(item) {

                        var series = ChartCountByAssignaciones1().series.get(0);
                        gridPanel.getSelectionModel().select(Ext.Array.indexOf(series.items, item));
                    }
                },
                label: {
                    field: 'empresa',
                    display: 'rotate',
                    contrast: true,
                    font: '8px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
                }
            }]
    });
    DatosAsinacion = Ext.create('Ext.panel.Panel', {
        title: 'Asignaciones por empresa',
        frame: true,
        bodyPadding: 5,
        width: 1050,
        height: 840,
        icon: 'img/table_refresh.png',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [barChart, {
                xtype: 'container',
                layout: {type: 'hbox', align: 'stretch'},
                flex: 3,
                items: [gridPanel,
                    {
                        xtype: 'form',
                        flex: 3,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0 0 5 0',
                        title: 'Datos de la Empresa',
                        items: [{
                                margin: '5',
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'Empresa',
                                font: '9px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                                items: [
                                    {
                                        fieldLabel: 'Empresa',
                                        name: 'empresa',
                                        xtype: 'textfield',
                                        enforceMaxLength: true,
                                        disabled: true,
                                    }, {
                                        fieldLabel: 'Total',
                                        name: 'total',
                                        xtype: 'textfield',
                                        enforceMaxLength: true,
                                        disabled: true,
                                    },
                                    {
                                        xtype: 'panel',
                                        layout:'fit',
                                        items: [ChartCountByAssignaciones1]
                                    }
                                ]
                            }],
                        listeners: {
                            // buffer so we don't refire while the user is still typing
                            buffer: 100,
                            change: function(field, newValue, oldValue, listener) {
                                if (selectedRec && form) {
                                    if (newValue > field.maxValue) {
                                        field.setValue(field.maxValue);
                                    } else {
                                        if (form.isValid()) {
                                            form.updateRecord(selectedRec);
                                            updateRadarChart(selectedRec);
                                        }
                                    }
                                }
                            }
                        }
                    }]
            }],
    });
    //

    panelCountTramasMonthNow = Ext.create('Ext.form.Panel', {
        title: 'Tramas Mes Actual',
        iconCls: 'icon-fastrack',
        layout: 'fit',
        tbar: [{
                text: 'Actualizar',
                iconCls: 'icon-update',
                handler: function() {
                    // Add a short delay to prevent fast sequential clicks
                    Ext.example.msg('Mensaje', 'Datos Recargados Correctamente.');
                    window.loadTask.delay(500, function() {
                        storeCountTramasMonthNow.reload();
                    });
                }
            }, {
                text: 'Descargar como Imagen',
                iconCls: 'icon-donwloaded',
                handler: function() {
                    Ext.MessageBox.confirm('Confirmar Descarga', 'Descargar Imagen ?', function(choice) {
                        if (choice === 'yes') {
                            chartCountTramasMonthNow.save({
                                type: 'image/png',
                                title: 'diego'
                            });
                        }
                    });
                }
            }],
        items: chartCountTramasMonthNow
    });

    agregarGrficas();
    botonGrafica.setVisible(false);
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
                region: 'north',
                html: '<center><h1 class="x-panel-header">GRAFICAS ESTADISTICAS K-TAXY</h1></center>'
            }, panelCentral]
    });
    reloadStore(storeCountByDevice, 20);
    checkRolSesion(idRolKarview);
});

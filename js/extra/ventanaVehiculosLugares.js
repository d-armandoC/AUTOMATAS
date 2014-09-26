var panelVehiculosLugares;
var winVehiculosLugares;
var gridVehiculos;
var isLugar = false;

Ext.onReady(function() {

    var date = Ext.create('Ext.form.field.Date', {
        fieldLabel: 'Fecha',
        format: 'Y-m-d',
        name: 'fecha',
        value: new Date(),
        allowBlank: false,
        emptyText: 'Fecha de Busqueda...'
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

    var storeVehLugares = Ext.create('Ext.data.JsonStore', {
        proxy: {
            type: 'ajax',
            reader: 'array'
        },
        fields: ['idEquipo', 'fecha_hora', 'velocidad', 'latitud', 'longitud', 'bateria', 'ign', 'gsm', 'gps2', 'G2']
    });

    gridVehiculos = Ext.create('Ext.grid.Panel', {
        region: 'center',
        title: '<center>Vehiculos en el Lugar</center>',
        store: storeVehLugares,
        columnLines: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: '<b>Nº</b>', align: 'center', width: 40}),
            {text: 'Equipo', width: 100, dataIndex: 'idEquipo', align: 'center'},
            {text: 'Fecha', xtype: 'datecolumn', format: 'd-m-Y', width: 100, dataIndex: 'fecha_hora', align: 'center'},
            {text: 'Hora', xtype: 'datecolumn', format: 'H:i:s', width: 100, dataIndex: 'fecha_hora', align: 'center'},
            {text: 'Vel. (Km/h)', dataIndex: 'velocidad', align: 'center', width: 100, renderer: formatSpeed},
            {text: 'Bateria', width: 70, dataIndex: 'bateria', renderer: formatBatIgnGsmGps2},
            {text: 'IGN', width: 70, dataIndex: 'ign', renderer: formatBatIgnGsmGps2},
            {text: 'GSM', width: 70, dataIndex: 'gsm', renderer: formatBatIgnGsmGps2},
            {text: 'GPS2', width: 70, dataIndex: 'gps2', renderer: formatBatIgnGsmGps2},
            {text: 'G2', width: 100, dataIndex: 'G2', renderer: formatStateTaxy}
        ],
        listeners: {
            itemcontextmenu: function(thisObj, record, item, index, e, eOpts) {
                e.stopEvent();
                Ext.create('Ext.menu.Menu', {
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'icon-vehiculos_lugar', // Use a URL in the icon config
                            text: 'Ver Ubicación en el Mapa',
                            disabled: false,
                            handler: function(widget, event) {
                                panelTabMapaAdmin.setActiveTab('panelMapaTab');
                                localizarDireccion(record.data.longitud, record.data.latitud, 17);
//                                clearLienzoTravel();
//                                clearLienzoPointTravel();
//                                drawPointsRoute(record.data, "Puntos");
//                                drawRutaMapa(record.data);
                            }
                        })
                    ]
                }).showAt(e.getXY());
                return false;
            }
        }
    });

    panelVehiculosLugares = Ext.create('Ext.form.Panel', {
        padding: '5 5 5 5',
        layout: 'border',
        items: [{
                region: 'north',
                xtype: 'form',
                frame: true,
                items: [date, timeIni, timeFin],
                buttons: [{
                        text: 'Trazar Lugar',
                        iconCls: 'icon-trazar',
                        handler: function() {
                            if (this.up('form').getForm().isValid()) {
//                        trazando = 1;
//                        isLugar = true;
//                        estadoControlD("polygon");
//                        winVehiculosLugares.hide();
                                drawRoute = true;
                                vehiLugares = true;
                                drawLine.activate();
                                winVehiculosLugares.hide();
                            }
                        }
                    }]
            }, gridVehiculos]
    });
});

function ventanaVehLugares() {
    if (!winVehiculosLugares) {
        winVehiculosLugares = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Ubicar Vehiculos en Lugares',
            iconCls: 'icon-vehiculos_lugar',
            resizable: false,
            width: 650,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [panelVehiculosLugares]
        });
    }
    panelVehiculosLugares.getForm().reset();
    gridVehiculos.getStore().removeAll();
    winVehiculosLugares.show();
}
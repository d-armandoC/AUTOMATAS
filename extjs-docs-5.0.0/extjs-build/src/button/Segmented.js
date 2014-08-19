/**
 * SegmentedButton is a container for a group of {@link Ext.button.Button Button}s.
 */
Ext.define('Ext.button.Segmented', {
    extend: 'Ext.container.Container',
    xtype: 'segmentedbutton',
    requires: [ 'Ext.button.Button' ],

    config: {
        /**
         * @cfg {Boolean}
         * Allow toggling the pressed state of each button.
         * Only applicable when {@link #allowMultiple} is `false`.
         */
        allowDepress: false,

        /**
         * @cfg {Boolean}
         * Allow multiple pressed buttons.
         */
        allowMultiple: false,

        /**
         * @cfg {Boolean}
         * True to enable pressed/not pressed toggling.
         */
        allowToggle: true,

        /**
         * @cfg {Boolean}
         * True to align the buttons vertically
         */
        vertical: false
    },

    beforeRenderConfig: {
        /**
         * @cfg {String/Number/String[]/Number[]}
         * The value of this button.  When {@link #allowMultiple} is `false`, value is a
         * String or Number.  When {@link #allowMultiple is `true`, value is an array
         * of values.  A value corresponds to a child button's {@link Ext.button.Button#value
         * value}, or its index if no child button values match the given value.
         *
         * Using the `value` config of the child buttons with single toggle:
         *
         *     @example
         *     var button = Ext.create('Ext.button.Segmented', {
         *         renderTo: Ext.getBody(),
         *         value: 'optTwo', // begin with "Option Two" selected
         *         items: [{
         *             text: 'Option One',
         *             value: 'optOne'
         *         }, {
         *             text: 'Option Two',
         *             value: 'optTwo'
         *         }, {
         *             text: 'Option Three',
         *             value:  'optThree'
         *         }]
         *     });
         *
         *     console.log(button.getValue()); // optTwo
         *
         *     // Sets the value to optOne, and sets the pressed state of the "Option One" button
         *     button.setValue('optOne');
         *
         *     console.log(button.getValue()); // optOne
         *
         * Using multiple toggle, and index-based values:
         *
         *     @example
         *     var button = Ext.create('Ext.button.Segmented', {
         *         renderTo: Ext.getBody(),
         *         allowMultiple: true
         *         value: [1, 2], // begin with "Option Two" and "Option Three" selected
         *         items: [{
         *             text: 'Option One'
         *         }, {
         *             text: 'Option Two'
         *         }, {
         *             text: 'Option Three'
         *         }]
         *     });
         *
         *     // Sets value to [0, 2], and sets pressed state of "Option One" and "Option Three"
         *     button.setValue([0, 2]);
         *
         *     console.log(button.getValue()); // [0, 2]
         *
         *     // Remove all pressed buttons, and set value to null
         *     button.setValue(null);
         */
        value: undefined
    },

    layout: 'segmentedbutton',
    defaultType: 'button',
    maskOnDisable: false,

    baseCls: Ext.baseCSSPrefix + 'segmented-button',
    itemCls: Ext.baseCSSPrefix + 'segmented-button-item',
    // private
    _firstCls: Ext.baseCSSPrefix + 'segmented-button-first',
    // private
    _lastCls: Ext.baseCSSPrefix + 'segmented-button-last',
    // private
    _middleCls: Ext.baseCSSPrefix + 'segmented-button-middle',

    /**
     * @event toggle
     * Fires when any child button's pressed state has changed.
     * @param {Ext.button.Segmented} this
     * @param {Ext.button.Button} button The toggled button.
     * @param {Boolean} isPressed `true` to indicate if the button was pressed.
     */

    applyValue: function(value, oldValue) {
        var me = this,
            allowMultiple = me.getAllowMultiple(),
            values = (value instanceof Array) ? value : (value == null) ? [] : [value],
            oldValues = (oldValue instanceof Array) ? oldValue :
                    (oldValue == null) ? [] : [oldValue],
            buttonValue, button, values, oldValues, items, i, ln;

        // Set a flag to tell our toggle listener not to respond to the buttons' toggle
        // events while we are applying the value.
        me._isApplyingValue = true;

        if (!me.rendered) {
            // first time - add values of buttons with an initial config of pressed:true
            items = me.items.items;
            for (i = 0, ln = items.length; i < ln; i++) {
                button = items[i];
                if (button.pressed) {
                    buttonValue = button.value;
                    if (buttonValue == null) {
                        buttonValue = me.items.indexOf(button);
                    }

                    if (!Ext.Array.contains(values, buttonValue)) {
                        values.push(buttonValue);
                    }
                }
            }
        }

        ln = values.length;

        //<debug>
        if (ln > 1 && !allowMultiple) {
            Ext.Error.raise('Cannot set multiple values when allowMultiple is false');
        }
        //</debug>

        // press all buttons corresponding to the values
        for (i = 0; i < ln; i++) {
            value = values[i];
            button = me._lookupButtonByValue(value);

            if (button) {
                buttonValue = button.value;

                if ((buttonValue != null) && buttonValue !== value) {
                    // button has a value, but it was matched by index.
                    // transform the index into the button value
                    values[i] = buttonValue;
                }

                if (!button.pressed) {
                    button.setPressed(true);
                }
            }
            //<debug>
            else {
                // no matched button. fail.
                Ext.Error.raise("Invalid value '" + value + "' for segmented button: '" + me.id + "'");
            }
            //</debug>
        }

        value = allowMultiple ? values : ln ? values[0] : null;

        // unpress buttons for the old values, if they do not exist in the new values array
        for (i = 0, ln = oldValues.length; i < ln; i++) {
            oldValue = oldValues[i];
            if (!Ext.Array.contains(values, oldValue)) {
                me._lookupButtonByValue(oldValue).setPressed(false);
            }
        }

        me._isApplyingValue = false;

        return value;
    },

    beforeRender: function() {
        var me = this;

        me.addCls(me.baseCls + me._getClsSuffix());
        me._syncItemClasses(true);
        me.callParent();
    },

    onAdd: function(item) {
        var me = this,
            syncItemClasses = '_syncItemClasses';

        //<debug>
        var items = me.items.items,
            ln = items.length,
            i = 0,
            value;

        for(; i < ln; i++) {
            if (items[i] !== item) {
                value = items[i].value;
                if (value != null && value === item.value) {
                    Ext.Error.raise("Segmented button '" + me.id +
                        "' cannot contain multiple items with value: '" + value + "'");
                }
            }
        }
        //</debug>

        me.mon(item, {
            hide: syncItemClasses,
            show: syncItemClasses,
            toggle: '_onItemToggle',
            scope: me
        });

        if (me.getAllowToggle()) {
            item.enableToggle = true;
            if (!me.getAllowMultiple()) {
                item.toggleGroup = me.getId();
                item.allowDepress = me.getAllowDepress();
            }
        }

        item.addCls(me.itemCls + me._getClsSuffix());

        me._syncItemClasses();
        me.callParent([item]);
    },

    onRemove: function(item) {
        var me = this;

        item.removeCls(me.itemCls + me._getClsSuffix());
        me._syncItemClasses();
        me.callParent([item]);
    },

    //<debug>
    updateAllowDepress: function(newAllowDepress, oldAllowDepress) {
        if (this.rendered && (newAllowDepress !== oldAllowDepress)) {
            Ext.Error.raise("Changing the allowDepress config of a segmented button after render is not supported.");
        }
    },

    updateAllowMultiple: function(newAllowMultiple, oldAllowMultiple) {
        if (this.rendered && (newAllowMultiple !== oldAllowMultiple)) {
            Ext.Error.raise("Changing the allowMultiple config of a segmented button after render is not supported.");
        }
    },

    updateAllowToggle: function(newAllowToggle, oldAllowToggle) {
        if (this.rendered && (newAllowToggle !== oldAllowToggle)) {
            Ext.Error.raise("Changing the allowToggle config of a segmented button after render is not supported.");
        }
    },

    updateVertical: function(newVertical, oldVertical) {
        if (this.rendered && (newVertical !== oldVertical)) {
            Ext.Error.raise("Changing the orientation of a segmented button after render is not supported.");
        }
    },
    //</debug>

    privates: {
        _getClsSuffix: function() {
            return this.getVertical() ? '-vertical' : '-horizontal';
        },

        /**
         * Looks up a child button by its value
         * @private
         * @param {String/Number} value The button's value or index
         * @return {Ext.button.Button}
         */
        _lookupButtonByValue: function(value) {
            var items = this.items.items,
                ln = items.length,
                i = 0,
                button = null,
                buttonValue, btn;

            for (; i < ln; i++) {
                btn = items[i];
                buttonValue = btn.value;
                if ((buttonValue != null) && buttonValue === value) {
                    button = btn;
                    break;
                }
            }

            if (!button && typeof value === 'number') {
                // no button matched by value, assume value is an index
                button = items[value];
            }

            return button;
        },

        /**
         * Handles the "toggle" event of the child buttons.
         * @private
         * @param {Ext.button.Button} button
         * @param {Boolean} pressed
         */
        _onItemToggle: function(button, pressed) {
            if (this._isApplyingValue) {
                return;
            }
            var me = this,
                Array = Ext.Array,
                allowMultiple = me.allowMultiple,
                buttonValue = (button.value != null) ? button.value : me.items.indexOf(button),
                value = me.getValue(),
                valueIndex;

            if (allowMultiple) {
                valueIndex = Array.indexOf(value, buttonValue);
            }

            if (pressed) {
                if (allowMultiple) {
                    if (valueIndex === -1) {
                        value.push(buttonValue);
                    }
                } else {
                    me.value = buttonValue;
                }
            } else {
                if (allowMultiple) {
                    if (valueIndex > -1) {
                        value.splice(valueIndex, 1);
                    }
                } else if (value === buttonValue) {
                    me.value = null;
                }
            }

            me.fireEvent('toggle', me, button, pressed);
        },

        /**
         * Synchronizes the "first", "last", and "middle" css classes when buttons are
         * added, removed, shown, or hidden
         * @private
         * @param {Boolean} force force sync even if not rendered.
         */
        _syncItemClasses: function(force) {
            var me = this,
                firstCls, middleCls, lastCls, items, ln, visibleItems, item, i;

            if (!force && !me.rendered) {
                return;
            }

            firstCls = me._firstCls;
            middleCls = me._middleCls;
            lastCls = me._lastCls;
            items = me.items.items;
            ln = items.length;
            visibleItems = [];

            for (i = 0; i < ln; i++) {
                item = items[i];
                if (!item.hidden) {
                    visibleItems.push(item);
                }
            }

            ln = visibleItems.length;

            //remove all existing classes from visible items
            for (i = 0; i < ln; i++) {
                visibleItems[i].removeCls([ firstCls, middleCls, lastCls ]);
            }

            // do not add any classes if there is only one item (no border removal needed)
            if (ln > 1) {
                //add firstCls to the first visible button
                visibleItems[0].addCls(firstCls);

                //add middleCls to all visible buttons in between
                for (i = 1; i < ln - 1; i++) {
                    visibleItems[i].addCls(middleCls);
                }

                //add lastCls to the first visible button
                visibleItems[ln - 1].addCls(lastCls);
            }
        }
    }
});

/**
 * This class manages models and their associations. Instances of `Session` are typically
 * associated with some `Component` (perhaps the Viewport or a Window) and then used by
 * their `{@link Ext.app.ViewModel view models}` to enable data binding.
 *
 * The primary job of a Session is to manage a collection of records of many different
 * types and their associations. This often starts by loading records when requested (via
 * bind - see below) and culminates when it is time to save to the server.
 *
 * Because the Session tracks all records it loads, it ensures that for any given type of
 * model, only one record exists with a given `id`. This means that all edits of that
 * record are properly targeted at that one instance.
 *
 * Similarly, when associations are loaded, the `Ext.data.Store` created to hold the
 * associated records is tracked by the Session. So all requests for the "OrderItems" of
 * a particular Order id will result in the same Store. Adding and removing items from
 * that Order then is sure to remain consistent.
 *
 * # Data
 *
 * Since the Session is managing all this data, there are several methods it provides
 * to give convenient access to that data. The most important of these is `update` and
 * `getChanges`.
 *
 * The `update` and `getChanges` methods both operate on object that contains a summary
 * of records and associations and different CRUD operations.
 *
 * TODO
 *
 * ## Saving
 *
 * There are two basic ways to save the contents of a Session: `getChanges` and
 * `getSaveBatch`. We've already seen `getChanges`. The data contained in the CRUD object
 * can be translated into whatever shape is needed by the server.
 *
 * To leverage the `{@link Ext.data.Model#proxy proxy}` facilities defined by each Model
 * class, there is the `getSaveBatch` method. That method returns an `Ext.data.Batch`
 * object populated with the necessary `create`, `update` and `destory` operations to
 * save all of the changes in the Session.
 *
 * # Binding
 *
 * Most forms of data binding start with a `{@link Ext.app.ViewModel}` rather than a
 * session, but the session does provide binding for records and associations. These
 * forms of binding consist of an object with a `reference` and `id` property.
 *
 * ## Record Binding
 *
 * When a record of a particular `Ext.data.Model` derived type is desired, it can be bound
 * like so (we'll simplify this using links next):
 *
 *      viewModel.bind({
 *              reference: 'User',
 *              id: 42
 *          },
 *          function (user) {
 *              // called when the User with id=42 is loaded
 *          });
 *
 * ## Association Binding
 *
 * Similarly we can request an association by adding the `association` property.
 *
 *      viewModel.bind({
 *              reference: 'User',
 *              id: 42,
 *              association: 'groups'
 *          },
 *          function (groups) {
 *              // called when the "groups" for User id=42 are loaded
 *              // this will be an Ext.data.Store
 *          });
 */
Ext.define('Ext.data.Session', {
    requires: [
        'Ext.data.schema.Schema',
        'Ext.data.Batch',
        'Ext.data.matrix.Matrix'
    ],

    isSession: true,

    config: {
        /**
         * @cfg {String/Ext.data.schema.Schema} schema
         */
        schema: 'default'
    },

    destroyed: false,

    constructor: function (config) {
        var me = this;

        me.data = {};

        /*
         *  {
         *      UserGroups: new Ext.data.matrix.Matrix({
         *          association: UserGroups
         *      })
         *  }
         */
        me.matrices = {};

        me.identifierCache = {};

        // Bind ourselves so we're always called in our own scope.
        me.recordCreator = me.recordCreator.bind(me);

        me.initConfig(config);
    },

    destroy: function () {
        // TODO: Destroy records?
        this.data = null;
        this.destroy = Ext.emptyFn;
    },

    //<debug>
    checkModelType: function(type) {
        if (type.$isClass) {
            if (!type.entityName) {
                Ext.Error.raise('Unable to use anonymous models in a Session');
            }
        } else if (!this.getSchema().getEntity(type)) {
            Ext.Error.raise('Unknown entity type ' + type);
        }
    },
    //</debug>

    /**
     * Creates a new record and tracks it in this session.
     *
     * @param {String/Ext.Class} type The `entityName` or the actual class of record to create.
     * @param {Object} [data] The data for the record.
     * @return {Ext.data.Model} The new record.
     */
    createRecord: function (type, data) {
        //<debug>
        this.checkModelType(type);
        //</debug>
        var Model = type.$isClass ? type : this.getSchema().getEntity(type);
        // By passing the session to the constructor, it will call session.add()
        return new Model(data, this);
    },

    /**
     * Get a cached record from the session. If the record does not exist, it will
     * be created. If the `autoLoad` parameter is not set to `false`, the record will
     * be loaded via the {@link Ext.data.Model#proxy proxy} of the Model. Also see {@link #peekRecord}.
     *
     * @param {String/Ext.Class} type The `entityName` or the actual class of record to create.
     * @param {Object} id The id of the record.
     * @param {Boolean/Object} [autoLoad=true] `false` to prevent the record from being loaded if
     * it does not exist. If this parameter is an object, it will be passed to the {@link Ext.data.Model#load} call.
     * @return {Ext.data.Model} The record.
     */
    getRecord: function(type, id, autoLoad) {
        var record = this.peekRecord(type, id),
            Model;

        if (!record) {
            Model = type.$isClass ? type : this.getSchema().getEntity(type);
            record = Model.createWithId(id, null, this);
            if (autoLoad !== false) {
                record.load(Ext.isObject(autoLoad) ? autoLoad : undefined);
            }
        }
        return record;
    },

    /**
     * Gets an existing record from the session. The record will *not* be created if it does
     * not exist. Also see {@link #getRecord}.
     * @param {String/Ext.Class} type The `entityName` or the actual class of record to create.
     * @param {Object} id The id of the record.
     * @return {Ext.data.Model} The record, `null` if it does not exist.
     */
    peekRecord: function(type, id) {
        // Duplicate some of this logic from getEntry here to prevent the creation
        // of entries when asking for the existence of records. We may not need them
        //<debug>
        this.checkModelType(type);
        //</debug>
        var entityType = type.$isClass ? type : this.getSchema().getEntity(type),
            entityName = entityType.entityName,
            data = this.data,
            entry = data[entityName];

        entry = entry && entry[id];

        return (entry && entry.record) || null;
    },

    /**
     * Checks whether an entity exists in the session.
     *
     * @param {String/Ext.Class} type The `entityName` or the actual class of record to create.
     * @param {Object} id The id of the record.
     * @return {Boolean} `true` if the entity exists in the session
     */
    contains: function(type, id) {
        return !!this.peekRecord(type, id);
    },

    getSession: function () {
        return this;
    },


    /**
     * Returns an object describing all of the modified fields, created or dropped records
     * and many-to-many association changes maintained by this session.
     *
     * @return {Object}
     */
    getChanges: function () {
        var me = this,
            data = me.data,
            matrices = me.matrices,
            ret = null,
            schema = me.getSchema(),
            all, bucket, created, dirty, dropped, entity, entityType, id, id2, matrix, name,
            assoc, assocName, createOpt, key, members, updateOpt, writer, slice, slices,
            state;

        for (name in data) {
            // Consult the Writer for the entity to determine its preferences for writing
            // complete or partial data. We rely on the serialization of the record's
            // getData method whereas the Writer has its own ideas on the matter.
            entityType = schema.getEntity(name);
            writer = entityType.getProxy().getWriter();
            createOpt = Ext.Object.chain(writer.getAllDataOptions());
            updateOpt = Ext.Object.chain(writer.getPartialDataOptions());
            createOpt.serialize = updateOpt.serialize = true;

            all = data[name];  // all entities of type "name"
            for (id in all) {
                entity = all[id].record;
                if (entity) {
                    created = entity.phantom;
                    dirty   = entity.dirty;
                    dropped = entity.dropped;

                    if (created && dropped) {
                        continue;
                    }

                    if (created || dirty || dropped) {
                        bucket = (ret || (ret = {}))[name] || (ret[name] = {});

                        //  User: {
                        //      C: [
                        //          { id: 20, name: 'Don' }
                        //      ],
                        //      U: [
                        //          { id: 30, name: 'Don' }
                        //      ],
                        //      D: [ 40, 50 ]
                        //  }
                        if (created) {
                            bucket = bucket.C || (bucket.C = []);
                            bucket.push(entity.getData(createOpt));
                        } else if (dropped) {
                            bucket = bucket.D || (bucket.D = []);
                            bucket.push(entity.id);
                        } else { // dirty
                            bucket = bucket.U || (bucket.U = []);
                            bucket.push(entity.getData(updateOpt));
                        }
                    }
                }
            }
        }

        for (name in matrices) {
            matrix = matrices[name].left;  // e.g., UserGroups.left (Users)
            slices = matrix.slices;
            name = matrix.role.type; // e.g., "User"
            assocName = matrix.role.inverse.role; // e.g., "groups"

            for (id in slices) {
                slice = slices[id];
                members = slice.members;

                for (id2 in members) {
                    state = (assoc = members[id2])[2];

                    //  User: {
                    //      groups: {
                    //          C: {
                    //              20: [ 30, 40 ]  // associate User 20 w/Groups 30 & 40
                    //          },
                    //          D: {
                    //              10: [ 50 ]  // disassociate User 10 w/Group 50
                    //          }
                    //      }
                    //  }
                    if (state) {
                        key = (state < 0) ? 'D' : 'C';
                        bucket = (ret || (ret = {}))[name] || (ret[name] = {}); // User
                        bucket = bucket[assocName] || (bucket[assocName] = {}); // groups
                        bucket = bucket[key] || (bucket[key] = {}); // C or D
                        bucket = bucket[id] || (bucket[id] = []);

                        bucket.push(assoc[1]);
                    }
                }
            }
        }

        return ret;
    },

    gatherSaveOperations: function (batch) {
        var me = this,
            entities = me.data,
            map = null,
            all, bucket, created, dirty, dropped, entity, id, key, name, operation, proxy;

        for (name in entities) {
            all = entities[name];  // all entities of this type
            for (id in all) {
                entity = all[id].record;
                if (entity) {
                    created = entity.phantom;
                    dirty   = entity.dirty;
                    dropped = entity.dropped;

                    if (created && dropped) {
                        continue;
                    }

                    if (created || dirty || dropped) {
                        bucket = (map || (map = {}))[name] || (map[name] = {
                            entity: entity.self
                        });

                        key = created ? 'create' : (dropped ? 'destroy' : 'update');
                        bucket = bucket[key] || (bucket[key] = []);
                        bucket.push(entity);

                        //  User: {
                        //      proxy: User.getProxy(),
                        //      create: [
                        //          { id: 20, name: 'Don' }
                        //      ]
                        //  }
                    }
                }
            }
        }

        if (map) {
            if (!batch) {
                batch = new Ext.data.Batch();
            }

            for (name in map) {
                bucket = map[name];
                entity = bucket.entity; // the entity class
                delete bucket.entity;
                proxy = entity.getProxy();

                for (key in bucket) {
                    operation = proxy.createOperation(key, {
                        records: bucket[key]
                    });
                    operation.entityType = entity;

                    batch.add(operation);
                }
            }
        }

        return batch;
    },

    /**
     * Returns an `Ext.data.Batch` containing the `Ext.data.operation.Operation` instances
     * that are needed to save all of the changes in this session. This sorting is based
     * on operation type, associations and foreign keys. Generally speaking the operations
     * in the batch can be committed to a server sequentially and the server will never be
     * sent a request with an invalid (client-generated) id in a foreign key field.
     *
     * @param {Boolean} [sort=true] Pass `false` to disable the batch operation sort.
     * @return {Ext.data.Batch}
     */
    getSaveBatch: function (sort) {
        var batch = this.gatherSaveOperations();

        if (batch && sort !== false) {
            batch.sort();
        }

        return batch;
    },

    //-------------------------------------------------------------------------
    privates: {
        getEntry: function(type, id) {
            var entityType = type.$isClass ? type : this.getSchema().getEntity(type),
                entityName = entityType.entityName,
                data = this.data,
                entry;

            entry = data[entityName] || (data[entityName] = {});
            entry = entry[id] || (entry[id] = {matrices: {}});

            return entry;
        },

        /**
         * @private
         */
        add: function (record) {
            var id = record.id,
                entry = this.getEntry(record.self, id);

            //<debug>
            if (entry.record) {
                Ext.Error.raise('Duplicate id ' + record.id + ' for ' + record.entityName);
            }
            //</debug>

            entry.record = record;

            this.registerReferences(record);
        },

        applySchema: function (schema) {
            return Ext.data.schema.Schema.get(schema);
        },

        getIdentifier: function (entityType) {
            var cache = this.identifierCache,
                identifier = entityType.identifier,
                key = identifier.id || entityType.entityName,
                ret = cache[key];

            if (!ret) {
                if (identifier.clone) {
                    ret = identifier.clone({
                        cache: cache
                    });
                } else {
                    ret = identifier;
                }

                cache[key] = ret;
            }

            return ret;
        },

        getMatrix: function (matrix) {
            var name = matrix.isManyToMany ? matrix.name : matrix,
                matrices = this.matrices;

            return matrices[name] ||
                   (matrices[name] = new Ext.data.matrix.Matrix(this, matrix));
        },

        getMatrixSlice: function (role, id) {
            var matrix = this.getMatrix(role.association),
                side = matrix[role.side];

            return side.get(id);
        },

        recordCreator: function (data, Model) {
            var me = this,
                idField = Model.idField,
                id = idField.calculated ? (new Model(data)).id : data[idField.name],
                entry = me.getEntry(Model, id),
                record = entry.record;

            if (!record) {
                // We may have a stub that is loading the record (in fact this may be the
                // call coming from that Reader), but the resolution is simple. By creating
                // the record it is registered in the data[entityName][id] entry anyway
                // and the stub will deal with it onLoad.
                record = new Model(data, me);
            }
            //else {
                //TODO no easy answer here... we are trying to create a record and have
                //TODO some (potentially new) data. We probably should check for mid-air
                //TODO collisions using versionProperty but for now we just ignore the
                //TODO new data in favor of our potentially edited data.
            //}

            return record;
        },

        registerReferences: function (record, oldId) {
            var entityName = record.entityName,
                id = record.id,
                recordData = record.data,
                remove = oldId || oldId === 0,
                entry, i, fk, len, reference, references, refs, roleName;

            // Register this records references to other records
            len = (references = record.references).length;

            for (i = 0; i < len; ++i) {
                reference = references[i];  // e.g., an orderId field
                fk = recordData[reference.name];  // the orderId

                if (fk || fk === 0) {
                    reference = reference.reference; // the "order" association role
                    entityName = reference.type;
                    roleName = reference.inverse.role;

                    // Track down the entry for the associated record
                    entry = this.getEntry(reference.cls, fk);
                    refs = entry.refs || (entry.refs = {});
                    refs = refs[roleName] || (refs[roleName] = {});

                    refs[id] = record;
                    if (remove) {
                        delete refs[oldId];
                    }
                }
            }
        },

        spawn: function (config) {
            //TODO be more clever
            return new this.self(Ext.merge(Ext.merge({}, this.initialConfig), config));
        },

        updateReference: function (record, field, newValue, oldValue) {
            var reference = field.reference,
                entityName = reference.type,
                roleName = reference.inverse.role,
                entry, refs;

            if (oldValue || oldValue === 0) {
                // We must be already in this entry.refs collection
                refs = this.getEntry(entityName, oldValue).refs[roleName];
                delete refs[id];
            }

            if (newValue || newValue === 0) {
                entry = this.getEntry(entityName, newValue);
                refs = entry.refs || (entry.refs = {});
                refs = refs[roleName] || (refs[roleName] = {});
                refs[record.id] = record;
            }
        },

        //---------------------------------------------------------------------
        // Record callbacks called because we are the "session" for the record.

        _setNoRefs: {
            refs: false
        },

        onIdChanged: function (record, oldId, newId) {
            var me = this,
                entityName = record.entityName,
                id = record.id,
                bucket = me.data[entityName],
                entry = bucket[oldId],
                associations = record.associations,
                refs = entry.refs,
                setNoRefs = me._setNoRefs,
                association, fieldName, matrix, refId, role, roleName, roleRefs, store;

            //<debug>
            if (bucket[newId]) {
                Ext.Error.raise('Cannot change ' + entityName + ' id from ' + oldId +
                                ' to ' + newId + ' id already exists');
            }
            //</debug>

            delete bucket[oldId];
            bucket[newId] = entry;

            for (roleName in associations) {
                role = associations[roleName];
                if (role.isMany) {
                    store = role.getAssociatedItem(record);
                    if (store) {
                        store.associatedEntityId = newId;
                        matrix = store.matrix;
                        if (matrix) {
                            matrix.changeId(newId);
                        }
                    }
                }
            }

            if (refs) {
                for (roleName in refs) {
                    roleRefs = refs[roleName];
                    role = associations[roleName];
                    association = role.association;

                    if (association.isManyToMany) {
                        // TODO
                    } else {
                        fieldName = association.field.name;

                        for (refId in roleRefs) {
                            roleRefs[refId].set(fieldName, id, setNoRefs);
                        }
                    }
                }
            }

            me.registerReferences(record, oldId);
        }
    }
});

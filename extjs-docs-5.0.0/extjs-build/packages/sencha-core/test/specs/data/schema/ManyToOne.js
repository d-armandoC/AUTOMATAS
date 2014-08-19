describe("Ext.data.schema.ManyToOne", function() {
    
    var schema, Post, Thread, threadRole, postRole;

    function definePost(refCfg) {
        Post = Ext.define('spec.Post', {
            extend: 'Ext.data.Model',
            fields: ['id', 'content', {
                name: 'threadId',
                reference: Ext.apply({
                    type: 'Thread'
                }, refCfg)
            }]
        });
        
        threadRole = Post.associations.thread;
        postRole = Thread.associations.posts;
    }

    function complete(data, status) {
        Ext.Ajax.mockComplete({
            status: status || 200,
            responseText: Ext.JSON.encode(data)
        });
    }
    
    beforeEach(function() {
        MockAjaxManager.addMethods();
        schema = Ext.data.Model.schema;
        schema.setNamespace('spec');
        
        Thread = Ext.define('spec.Thread', {
            extend: 'Ext.data.Model',
            fields: ['id', 'title']
        });
    });
    
    afterEach(function() {
        MockAjaxManager.removeMethods();
        Ext.undefine('spec.Post');
        Ext.undefine('spec.Thread');
        
        schema.clear(true);
        Post = postRole = Thread = threadRole = schema = null;   
    });
    
    describe("Model.associations", function() {
        it("should have an association role on each model", function() {
            definePost();
            expect(Post.associations.thread).toBeDefined();
            expect(Thread.associations.posts).toBeDefined();
        });
        
        it("should have a reference back to the association for each role", function() {
            definePost();
            expect(Post.associations.thread.association).toBe(Thread.associations.posts.association);
            expect(Thread.associations.posts.association.isManyToOne).toBe(true);
        });     
    });
    
    describe("association default config", function() {
        var assoc;

        beforeEach(function() {
            definePost();
            assoc = threadRole.association;
        });
        
        it("should have a schema set", function() {
            expect(assoc.schema).toBe(schema);    
        });
        
        it("should have the reference field set", function() {
            expect(assoc.field).toBe(Post.getField('threadId'));
        });  
        
        it("should have the left part be set to the key holder", function() {
            expect(assoc.left).toBe(postRole);
        });
        
        it("should set definedBy to the key holder", function() {
            expect(assoc.definedBy).toBe(Post);    
        });
        
        it("should have the right part be set to the non key holder", function() {
            expect(assoc.right).toBe(threadRole);
        });
        
        it("should have the owner as null", function() {
            expect(assoc.owner).toBeNull();
        });
        
        it("should set the assoc name to {PluralKeyHolder}By{SingluarOther}", function() {
            expect(assoc.name).toBe('ThreadPosts');
        });
    });
    
    describe("left", function() {
        beforeEach(function() {
            definePost();
        });
        
        it("should set the role to be plural lowercase & the type to be the entity name", function() {
            expect(postRole.role).toBe('posts');
            expect(postRole.type).toBe('Post');
        });
        
        it("should set the inverse role to the right", function() {
            expect(postRole.inverse).toBe(threadRole);    
        });    
        
        it("should set the entity", function() {
            expect(postRole.cls).toBe(Post);    
        });
    });
    
    describe("right", function() {
        beforeEach(function() {
            definePost();
        });
        
        it("should set the role to be singular lowercase & the type to be the entity name", function() {
            expect(threadRole.role).toBe('thread');
            expect(threadRole.type).toBe('Thread');
        });
        
        it("should set the inverse role to the left", function() {
            expect(threadRole.inverse).toBe(postRole);    
        });    
        
        it("should set the entity", function() {
            expect(threadRole.cls).toBe(Thread);    
        });
    });
    
    describe("configuring", function() {
        it("should set an association name", function() {
            definePost({
                association: 'CustomName'
            });    
            expect(postRole.association.name).toBe('CustomName');
        });
        
        it("should set the owner based on the child param", function() {
            definePost({
                child: true
            });
            expect(postRole.association.owner).toBe(postRole);
            expect(postRole.owner).toBe(true);
        });
        
        it("should set the owner based on the parent param", function() {
            definePost({
                parent: true
            });
            expect(postRole.association.owner).toBe(threadRole);
            expect(threadRole.owner).toBe(true);
        });
        
        it("should be able to set a custom role", function() {
            definePost({
                role: 'foo'
            });
            threadRole = Post.associations.foo;
            expect(threadRole.association.name).toBe('ThreadFooPosts');
            expect(threadRole.role).toBe('foo');
        });
        
        describe("inverse", function() {
            it("should set with a string", function() {
                definePost({
                    inverse: 'foo'
                });
                postRole = Thread.associations.foo;
                expect(postRole.association.name).toBe('ThreadFoo');
                expect(postRole.role).toBe('foo');
            });
            
            it("should set with an object", function() {
                definePost({
                    inverse: {
                        role: 'foo'
                    }
                });
                postRole = Thread.associations.foo;
                expect(postRole.association.name).toBe('ThreadFoo');
                expect(postRole.role).toBe('foo');
            });
        });
    });
    
    describe("model decoration", function() {
        it("should generate a getter on the key holder", function() {
            definePost();
            expect(typeof Post.prototype.getThread).toBe('function');
        });
        
        it("should generate a setter on the key holder", function() {
            definePost();
            expect(typeof Post.prototype.setThread).toBe('function');
        });
        
        it("should define a getter on the inverse", function() {
            definePost();
            expect(typeof Thread.prototype.posts).toBe('function');
        });
        
        it("should allow a custom getter name on the key holder", function() {
            definePost({
                inverse: {
                    getterName: 'getFoo'
                }
            });
            expect(typeof Thread.prototype.getFoo).toBe('function');
        });
        
        it("should allow a custom setter name on the key holder", function() {
            definePost({
                setterName: 'setFoo'
            });
            expect(typeof Post.prototype.setFoo).toBe('function');
        });
        
        it("should allow a custom getter name on the inverse", function() {
            definePost({
                getterName: 'ghosts'
            });
            expect(typeof Post.prototype.ghosts).toBe('function');
        });

        it("should decorate the model based on the role", function() {
            var OtherPost = Ext.define('spec.OtherPost', {
                extend: 'Ext.data.Model',
                fields: ['id', 'name', {
                    name: 'threadAId',
                    reference: {
                        type: 'Thread',
                        role: 'ThreadA'
                    }
                }, {
                    name: 'threadBId',
                    reference: {
                        type: 'Thread',
                        role: 'ThreadB'
                    }
                }]
            });

            expect(typeof OtherPost.prototype.getThreadA).toBe('function');
            expect(typeof OtherPost.prototype.getThreadB).toBe('function');

            Ext.undefine('spec.OtherPost');
        });
    });
    
    describe("without session", function() {
        var spy, post, thread;

        beforeEach(function() {
            spy = jasmine.createSpy();
        });
        
        afterEach(function() {
            post = thread = null;
        });

        describe("the one", function() {
            beforeEach(function() {
                definePost();
            });

            describe("getter", function() {
                beforeEach(function() {
                    post = new Post({
                        id: 4
                    });
                    
                });
                describe("without an instance", function() {
                    describe("with no foreign key value", function() {
                        it("should return null", function() {
                            expect(post.getThread()).toBeNull();
                        });

                        it("should not make any request", function() {
                            spy = spyOn(Thread.getProxy(), 'read');
                            post.getThread();
                            expect(spy).not.toHaveBeenCalled();
                        });

                        describe("callbacks", function() {
                            it("should call the callbacks before the function returns", function() {
                                post.getThread(spy);
                                expect(spy).toHaveBeenCalled();
                                spy.reset();
                                post.getThread({
                                    success: spy
                                });
                                expect(spy).toHaveBeenCalled();
                                spy.reset();
                                post.getThread({
                                    callback: spy
                                });
                                expect(spy).toHaveBeenCalled();
                            });

                            it("should accept a function as the callback and default the scope to the model", function() {
                                post.getThread(spy);
                                var call = spy.mostRecentCall;
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.args[2]).toBe(true);
                                expect(call.object).toBe(post);
                            });
                            
                            it("should accept a function with a scope", function() {
                                var o = {};
                                post.getThread(spy, o);
                                expect(spy.mostRecentCall.object).toBe(o);   
                            });
                            
                            it("should accept an options object with success and default the scope to the model", function() {
                                post.getThread({
                                    success: spy
                                });  
                                var call = spy.mostRecentCall; 
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.object).toBe(post);  
                            });

                            it("should accept an options object with success and a scope", function() {
                                var o = {},
                                    call;

                                post.getThread({
                                    scope: o,
                                    success: spy
                                });  
                                call = spy.mostRecentCall; 
                                expect(call.object).toBe(o);  
                            });

                            it("should accept an options object with callback and default the scope to the model", function() {
                                post.getThread({
                                    callback: spy
                                });  
                                var call = spy.mostRecentCall; 
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.args[2]).toBe(true);
                                expect(call.object).toBe(post); 
                            });
                            
                            it("should accept an options object with callback and a scope", function() {
                                var o = {},
                                    call;

                                post.getThread({
                                    scope: o,
                                    callback: spy
                                });  
                                call = spy.mostRecentCall; 
                                expect(call.object).toBe(o); 
                            });
                        });
                    });

                    describe("with a foreign key value", function() {
                        beforeEach(function() {
                            post.set('threadId', 17);
                        });

                        it("should return an instance with the matching id", function() {
                            expect(post.getThread().getId()).toBe(17);
                        });

                        it("should be in a loading state", function() {
                            expect(post.getThread().isLoading()).toBe(true);
                        });

                        it("should trigger a load for the record", function() {
                            spy = spyOn(Thread.getProxy(), 'read');
                            post.getThread();
                            expect(spy.mostRecentCall.args[0].getId()).toBe(17);
                        });

                        describe("calling while during a load", function() {
                            it("should return the same record", function() {
                                var rec = post.getThread();
                                expect(post.getThread()).toBe(rec);
                            });

                            it("should not trigger a second load", function() {
                                post.getThread();
                                spy = spyOn(Thread.getProxy(), 'read');
                                post.getThread();
                                expect(spy).not.toHaveBeenCalled();
                            });

                            it("should not trigger any callback until load completes", function() {
                                post.getThread();
                                post.getThread({
                                    success: spy,
                                    callback: spy
                                });
                                expect(spy).not.toHaveBeenCalled();
                            });

                            it("should trigger the callbacks once loaded", function() {
                                post.getThread();
                                post.getThread({
                                    success: spy,
                                    callback: spy
                                });
                                complete({});
                                expect(spy.callCount).toBe(2);
                            });
                        });

                        describe("callbacks", function() {
                            it("should not trigger any callbacks until the load completes", function() {
                                post.getThread(spy);
                                post.getThread({
                                    success: spy
                                });
                                post.getThread({
                                    failure: spy
                                });
                                post.getThread({
                                    callback: spy
                                });
                                expect(spy).not.toHaveBeenCalled();

                            });

                            describe("when successful", function() {
                                it("should accept a function as the callback and default the scope to the model", function() {
                                    thread = post.getThread(spy);
                                    complete({});
                                    var call = spy.mostRecentCall;
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(true);
                                    expect(call.object).toBe(post);
                                });
                            
                                it("should accept a function with a scope", function() {
                                    var o = {};
                                    post.getThread(spy, o);
                                    complete({});
                                    expect(spy.mostRecentCall.object).toBe(o);   
                                });
                            
                                it("should accept an options object with success and default the scope to the model", function() {
                                    thread = post.getThread({
                                        success: spy
                                    });  
                                    complete({});
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.object).toBe(post);  
                                });

                                it("should accept an options object with success and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        success: spy
                                    });  
                                    complete({});
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o);  
                                });

                                it("should accept an options object with callback and default the scope to the model", function() {
                                    thread = post.getThread({
                                        callback: spy
                                    });  
                                    complete({});
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(true);
                                    expect(call.object).toBe(post); 
                                });
                            
                                it("should accept an options object with callback and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        callback: spy
                                    });  
                                    complete({});
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o); 
                                });
                            });

                            describe("when failed", function() {
                                it("should accept a function as the callback and default the scope to the model", function() {
                                    thread = post.getThread(spy);
                                    complete(null, 500);
                                    var call = spy.mostRecentCall;
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(false);
                                    expect(call.object).toBe(post);
                                });
                            
                                it("should accept a function with a scope", function() {
                                    var o = {};
                                    post.getThread(spy, o);
                                    complete(null, 500);
                                    expect(spy.mostRecentCall.object).toBe(o);   
                                });
                            
                                it("should accept an options object with failure and default the scope to the model", function() {
                                    thread = post.getThread({
                                        failure: spy
                                    });  
                                    complete(null, 500);
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.object).toBe(post);  
                                });

                                it("should accept an options object with failure and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        failure: spy
                                    });  
                                    complete(null, 500);
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o);  
                                });

                                it("should accept an options object with callback and default the scope to the model", function() {
                                    thread = post.getThread({
                                        callback: spy
                                    });  
                                    complete(null, 500);
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(false);
                                    expect(call.object).toBe(post); 
                                });
                            
                                it("should accept an options object with callback and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        callback: spy
                                    });  
                                    complete(null, 500);
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o); 
                                });
                            });
                        });
                    });
                });

                describe("with an already loaded instance", function() {
                    beforeEach(function() {
                        thread = new Thread({
                            id: 2
                        });
                        
                        
                        post.setThread(thread);
                    });

                    it("should return the same instance", function() {
                        expect(post.getThread()).toBe(thread);
                    });

                    it("should not attempt to load", function() {
                        spy = spyOn(Thread.getProxy(), 'read');
                        post.getThread();
                        expect(spy).not.toHaveBeenCalled();
                    });

                    it("should attempt to reload if called with options.reload", function() {
                        spy = spyOn(Thread.getProxy(), 'read').andReturn();
                        post.getThread({
                            reload: true
                        });
                        expect(spy).toHaveBeenCalled();
                    });

                    it("should reload the same record when called with reload", function() {
                        var result = post.getThread({
                            reload: true
                        });
                        expect(result).toBe(thread);
                    });

                    describe("callbacks", function() {
                        it("should call the callbacks before the function returns", function() {
                            post.getThread(spy);
                            expect(spy).toHaveBeenCalled();
                            spy.reset();
                            post.getThread({
                                success: spy
                            });
                            expect(spy).toHaveBeenCalled();
                            spy.reset();
                            post.getThread({
                                callback: spy
                            });
                            expect(spy).toHaveBeenCalled();
                        });

                        it("should accept a function as the callback and default the scope to the model", function() {
                            post.getThread(spy);
                            var call = spy.mostRecentCall;
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.args[2]).toBe(true);
                            expect(call.object).toBe(post);
                        });
                        
                        it("should accept a function with a scope", function() {
                            var o = {};
                            post.getThread(spy, o);
                            expect(spy.mostRecentCall.object).toBe(o);   
                        });
                        
                        it("should accept an options object with success and default the scope to the model", function() {
                            post.getThread({
                                success: spy
                            });  
                            var call = spy.mostRecentCall; 
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.object).toBe(post);  
                        });

                        it("should accept an options object with success and a scope", function() {
                            var o = {},
                                call;

                            post.getThread({
                                scope: o,
                                success: spy
                            });  
                            call = spy.mostRecentCall; 
                            expect(call.object).toBe(o);  
                        });

                        it("should accept an options object with callback and default the scope to the model", function() {
                            post.getThread({
                                callback: spy
                            });  
                            var call = spy.mostRecentCall; 
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.args[2]).toBe(true);
                            expect(call.object).toBe(post); 
                        });
                        
                        it("should accept an options object with callback and a scope", function() {
                            var o = {},
                                call;

                            post.getThread({
                                scope: o,
                                callback: spy
                            });  
                            call = spy.mostRecentCall; 
                            expect(call.object).toBe(o); 
                        });
                    });
                });
            });
        
            describe("setter", function() {
                beforeEach(function() {
                    post = new Post({
                        id: 7
                    });
                });

                describe("instance", function() {
                    it("should have the same record reference", function() {
                        var thread = new Thread({
                            id: 3
                        });
                        post.setThread(thread);
                        expect(post.getThread()).toBe(thread);
                    });
                    
                    it("should set the underlying key value", function() {
                        var thread = new Thread({
                            id: 3
                        });
                        post.setThread(thread);
                        expect(post.get('threadId')).toBe(3);  
                    });
                });
                
                describe("value", function() {
                    it("should set the underlying key", function() {
                        post.setThread(16);
                        expect(post.get('threadId')).toBe(16);    
                    });  
                    
                    it("should keep the same reference if setting the value with a matching id", function() {
                        var thread = new Thread({
                            id: 3
                        });
                        post.setThread(thread);
                        post.setThread(3);
                        expect(post.getThread()).toBe(thread);
                    });
                    
                    it("should clear the reference if a model is already set and a new id is passed", function() {
                        var thread = new Thread({
                            id: 3
                        });
                        post.setThread(thread);
                        post.setThread(13);
                        spy = spyOn(Thread.getProxy(), 'read');
                        // Reference doesn't exist, so need to grab it again here
                        post.getThread();
                        expect(spy.mostRecentCall.args[0].getId()).toBe(13);
                    });
                });
                
                describe("callbacks", function() {
                    it("should accept a function as the second arg, scope should default to the model", function() {
                        post.setThread(16, spy);
                        complete({});
                        var call = spy.mostRecentCall;
                        expect(call.args[0]).toBe(post);
                        expect(call.object).toBe(post);
                    });    
                    
                    it("should accept a function with a scope", function() {
                        var o = {};
                        thread = post.setThread(16, spy, o);
                        complete({});
                        expect(spy.mostRecentCall.object).toBe(o);
                    });
                    
                    describe("options object", function() {
                        var successSpy, failureSpy, callbackSpy;

                        beforeEach(function() {
                            successSpy = jasmine.createSpy();
                            failureSpy = jasmine.createSpy();
                            callbackSpy = jasmine.createSpy();
                        });

                        afterEach(function() {
                            successSpy = failureSpy = callbackSpy = null;
                        });

                        describe("on success", function() {
                            it("should call success/callback and scope should default to the model", function() {
                                post.setThread(16, {
                                    success: successSpy,
                                    callback: callbackSpy,
                                    failure: failureSpy
                                });
                                complete({});
                                expect(failureSpy).not.toHaveBeenCalled();
                                expect(successSpy).toHaveBeenCalled();
                                expect(callbackSpy).toHaveBeenCalled();
                                expect(successSpy.mostRecentCall.object).toBe(post);
                                expect(callbackSpy.mostRecentCall.object).toBe(post);
                            });

                            it("should use a passed scope", function() {
                                var scope = {};
                                post.setThread(16, {
                                    scope: scope,
                                    success: successSpy,
                                    callback: callbackSpy
                                });
                                complete({});
                                expect(successSpy.mostRecentCall.object).toBe(scope);
                                expect(callbackSpy.mostRecentCall.object).toBe(scope);
                            });
                        });

                        describe("on failure", function() {
                            it("should call failure/callback and scope should default to the model", function() {
                                post.setThread(16, {
                                    success: successSpy,
                                    callback: callbackSpy,
                                    failure: failureSpy
                                });
                                complete(null, 500);
                                expect(successSpy).not.toHaveBeenCalled();
                                expect(failureSpy).toHaveBeenCalled();
                                expect(callbackSpy).toHaveBeenCalled();
                                expect(failureSpy.mostRecentCall.object).toBe(post);
                                expect(callbackSpy.mostRecentCall.object).toBe(post);
                            });

                            it("should use a passed scope", function() {
                                var scope = {};
                                post.setThread(16, {
                                    scope: scope,
                                    failure: failureSpy,
                                    callback: callbackSpy
                                });
                                complete(null, 500);
                                expect(failureSpy.mostRecentCall.object).toBe(scope);
                                expect(callbackSpy.mostRecentCall.object).toBe(scope);
                            });
                        });
                    });
                });
            });
        });
        
        describe("the many", function() {
            function makeThread() {
                thread = new Thread({
                    id: 3
                });
            }
            
            var thread;
            
            afterEach(function() {
                thread = null;
            });
            
            it("should return a store", function() {
                definePost();
                makeThread();
                expect(thread.posts().isStore).toBe(true);         
            });
            
            it("should set the appropriate model type", function() {
                definePost();
                makeThread();
                expect(thread.posts().model).toBe(Post);    
            });
            
            it("should return the same store instance on multiple calls", function() {
                definePost();
                makeThread();
                var s = thread.posts();
                expect(thread.posts()).toBe(s);
            });
            
            it("should apply the storeConfig", function() {
                definePost({
                    inverse: {
                        storeConfig: {
                            autoLoad: true
                        }
                    }
                });
                makeThread();
                expect(thread.posts().getAutoLoad()).toBe(true);
            });
            
            describe("autoLoad", function() {
                it("should not load the store by default", function() {
                    definePost();
                    makeThread();
                    var spy = spyOn(Ext.data.Store.prototype, 'load').andReturn();
                    thread.posts();
                    expect(spy.callCount).toBe(0);    
                });  
                
                it("should load the store if configured with autoLoad: true", function() {
                    definePost({
                        inverse: {
                            autoLoad: true
                        }
                    }); 
                    
                    makeThread();
                    var spy = spyOn(Ext.data.Store.prototype, 'load').andReturn();
                    thread.posts();
                    expect(spy.callCount).toBe(1);          
                });
            });
            
            describe("keys", function() {
                
                beforeEach(function() {
                    definePost();
                });
                
                it("should default to the key to the primaryKey", function() {
                    makeThread();
                    var post = thread.posts().add({})[0];
                    expect(post.get('threadId')).toBe(3);
                });
                
                it("should set the primaryKey onto the foreignKey on add", function() {
                    makeThread();
                    var post = thread.posts().add({
                        'threadId': 1
                    })[0];
                    expect(post.get('threadId')).toBe(3);
                });
            });
        });
    });
    
    describe("with session", function() {
        var session, spy, post, thread;

        beforeEach(function() {
            session = new Ext.data.Session();
            spy = jasmine.createSpy();
        });
        
        afterEach(function() {
            session.destroy();
            session = post = thread = null;
        });

        describe("the one", function() {
            describe("getter", function() {
                beforeEach(function() {
                    definePost();
                    
                    post = new Post({
                        id: 4
                    }, session);
                    
                });
                describe("without an instance", function() {
                    describe("with no foreign key value", function() {
                        it("should return null", function() {
                            expect(post.getThread()).toBeNull();
                        });

                        it("should not make any request", function() {
                            spy = spyOn(Thread.getProxy(), 'read');
                            post.getThread();
                            expect(spy).not.toHaveBeenCalled();
                        });

                        describe("callbacks", function() {
                            it("should call the callbacks before the function returns", function() {
                                post.getThread(spy);
                                expect(spy).toHaveBeenCalled();
                                spy.reset();
                                post.getThread({
                                    success: spy
                                });
                                expect(spy).toHaveBeenCalled();
                                spy.reset();
                                post.getThread({
                                    callback: spy
                                });
                                expect(spy).toHaveBeenCalled();
                            });

                            it("should accept a function as the callback and default the scope to the model", function() {
                                post.getThread(spy);
                                var call = spy.mostRecentCall;
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.args[2]).toBe(true);
                                expect(call.object).toBe(post);
                            });
                            
                            it("should accept a function with a scope", function() {
                                var o = {};
                                post.getThread(spy, o);
                                expect(spy.mostRecentCall.object).toBe(o);   
                            });
                            
                            it("should accept an options object with success and default the scope to the model", function() {
                                post.getThread({
                                    success: spy
                                });  
                                var call = spy.mostRecentCall; 
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.object).toBe(post);  
                            });

                            it("should accept an options object with success and a scope", function() {
                                var o = {},
                                    call;

                                post.getThread({
                                    scope: o,
                                    success: spy
                                });  
                                call = spy.mostRecentCall; 
                                expect(call.object).toBe(o);  
                            });

                            it("should accept an options object with callback and default the scope to the model", function() {
                                post.getThread({
                                    callback: spy
                                });  
                                var call = spy.mostRecentCall; 
                                expect(call.args[0]).toBe(thread);
                                expect(call.args[1]).toBeNull();
                                expect(call.args[2]).toBe(true);
                                expect(call.object).toBe(post); 
                            });
                            
                            it("should accept an options object with callback and a scope", function() {
                                var o = {},
                                    call;

                                post.getThread({
                                    scope: o,
                                    callback: spy
                                });  
                                call = spy.mostRecentCall; 
                                expect(call.object).toBe(o); 
                            });
                        });
                    });

                    describe("with a foreign key value", function() {
                        beforeEach(function() {
                            post.set('threadId', 17);
                        });

                        it("should create an instance in the session", function() {
                            expect(post.getThread()).toBe(session.getRecord('Thread', 17, false));
                        });

                        it("should use an existing record instance", function() {
                            thread = session.getRecord('Thread', 17, false);
                            expect(post.getThread()).toBe(thread);
                        });

                        it("should not load an existing instance", function() {
                            thread = session.getRecord('Thread', {
                                id: 17
                            }, false);
                            post.getThread();
                            expect(thread.isLoading()).toBe(false);
                        });

                        it("should return an instance with the matching id", function() {
                            expect(post.getThread().getId()).toBe(17);
                        });

                        it("should be in a loading state", function() {
                            expect(post.getThread().isLoading()).toBe(true);
                        });

                        it("should trigger a load for the record", function() {
                            spy = spyOn(Thread.getProxy(), 'read');
                            post.getThread();
                            expect(spy.mostRecentCall.args[0].getId()).toBe(17);
                        });

                        describe("calling while during a load", function() {
                            it("should return the same record", function() {
                                var rec = post.getThread();
                                expect(post.getThread()).toBe(rec);
                            });

                            it("should not trigger a second load", function() {
                                post.getThread();
                                spy = spyOn(Thread.getProxy(), 'read');
                                post.getThread();
                                expect(spy).not.toHaveBeenCalled();
                            });

                            it("should not trigger any callback until load completes", function() {
                                post.getThread();
                                post.getThread({
                                    success: spy,
                                    callback: spy
                                });
                                expect(spy).not.toHaveBeenCalled();
                            });

                            it("should trigger the callbacks once loaded", function() {
                                post.getThread();
                                post.getThread({
                                    success: spy,
                                    callback: spy
                                });
                                complete({});
                                expect(spy.callCount).toBe(2);
                            });
                        });

                        describe("callbacks", function() {
                            it("should not trigger any callbacks until the load completes", function() {
                                post.getThread(spy);
                                post.getThread({
                                    success: spy
                                });
                                post.getThread({
                                    failure: spy
                                });
                                post.getThread({
                                    callback: spy
                                });
                                expect(spy).not.toHaveBeenCalled();

                            });

                            describe("when successful", function() {
                                it("should accept a function as the callback and default the scope to the model", function() {
                                    thread = post.getThread(spy);
                                    complete({});
                                    var call = spy.mostRecentCall;
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(true);
                                    expect(call.object).toBe(post);
                                });
                            
                                it("should accept a function with a scope", function() {
                                    var o = {};
                                    post.getThread(spy, o);
                                    complete({});
                                    expect(spy.mostRecentCall.object).toBe(o);   
                                });
                            
                                it("should accept an options object with success and default the scope to the model", function() {
                                    thread = post.getThread({
                                        success: spy
                                    });  
                                    complete({});
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.object).toBe(post);  
                                });

                                it("should accept an options object with success and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        success: spy
                                    });  
                                    complete({});
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o);  
                                });

                                it("should accept an options object with callback and default the scope to the model", function() {
                                    thread = post.getThread({
                                        callback: spy
                                    });  
                                    complete({});
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(true);
                                    expect(call.object).toBe(post); 
                                });
                            
                                it("should accept an options object with callback and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        callback: spy
                                    });  
                                    complete({});
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o); 
                                });
                            });

                            describe("when failed", function() {
                                it("should accept a function as the callback and default the scope to the model", function() {
                                    thread = post.getThread(spy);
                                    complete(null, 500);
                                    var call = spy.mostRecentCall;
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(false);
                                    expect(call.object).toBe(post);
                                });
                            
                                it("should accept a function with a scope", function() {
                                    var o = {};
                                    post.getThread(spy, o);
                                    complete(null, 500);
                                    expect(spy.mostRecentCall.object).toBe(o);   
                                });
                            
                                it("should accept an options object with failure and default the scope to the model", function() {
                                    thread = post.getThread({
                                        failure: spy
                                    });  
                                    complete(null, 500);
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.object).toBe(post);  
                                });

                                it("should accept an options object with failure and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        failure: spy
                                    });  
                                    complete(null, 500);
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o);  
                                });

                                it("should accept an options object with callback and default the scope to the model", function() {
                                    thread = post.getThread({
                                        callback: spy
                                    });  
                                    complete(null, 500);
                                    var call = spy.mostRecentCall; 
                                    expect(call.args[0]).toBe(thread);
                                    expect(call.args[1].isOperation).toBe(true);
                                    expect(call.args[2]).toBe(false);
                                    expect(call.object).toBe(post); 
                                });
                            
                                it("should accept an options object with callback and a scope", function() {
                                    var o = {},
                                        call;

                                    post.getThread({
                                        scope: o,
                                        callback: spy
                                    });  
                                    complete(null, 500);
                                    call = spy.mostRecentCall; 
                                    expect(call.object).toBe(o); 
                                });
                            });
                        });
                    });
                });

                describe("with an already loaded instance", function() {
                    beforeEach(function() {
                        thread = new Thread({
                            id: 2
                        }, session);
                        
                        
                        post.setThread(thread);
                    });

                    it("should return the same instance", function() {
                        expect(post.getThread()).toBe(thread);
                    });

                    it("should not attempt to load", function() {
                        spy = spyOn(Thread.getProxy(), 'read');
                        post.getThread();
                        expect(spy).not.toHaveBeenCalled();
                    });

                    it("should attempt to reload if called with options.reload", function() {
                        spy = spyOn(Thread.getProxy(), 'read').andReturn();
                        post.getThread({
                            reload: true
                        });
                        expect(spy).toHaveBeenCalled();
                    });

                    it("should reload the same record when called with reload", function() {
                        var result = post.getThread({
                            reload: true
                        });
                        expect(result).toBe(thread);
                    });

                    describe("callbacks", function() {
                        it("should call the callbacks before the function returns", function() {
                            post.getThread(spy);
                            expect(spy).toHaveBeenCalled();
                            spy.reset();
                            post.getThread({
                                success: spy
                            });
                            expect(spy).toHaveBeenCalled();
                            spy.reset();
                            post.getThread({
                                callback: spy
                            });
                            expect(spy).toHaveBeenCalled();
                        });

                        it("should accept a function as the callback and default the scope to the model", function() {
                            post.getThread(spy);
                            var call = spy.mostRecentCall;
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.args[2]).toBe(true);
                            expect(call.object).toBe(post);
                        });
                        
                        it("should accept a function with a scope", function() {
                            var o = {};
                            post.getThread(spy, o);
                            expect(spy.mostRecentCall.object).toBe(o);   
                        });
                        
                        it("should accept an options object with success and default the scope to the model", function() {
                            post.getThread({
                                success: spy
                            });  
                            var call = spy.mostRecentCall; 
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.object).toBe(post);  
                        });

                        it("should accept an options object with success and a scope", function() {
                            var o = {},
                                call;

                            post.getThread({
                                scope: o,
                                success: spy
                            });  
                            call = spy.mostRecentCall; 
                            expect(call.object).toBe(o);  
                        });

                        it("should accept an options object with callback and default the scope to the model", function() {
                            post.getThread({
                                callback: spy
                            });  
                            var call = spy.mostRecentCall; 
                            expect(call.args[0]).toBe(thread);
                            expect(call.args[1]).toBeNull();
                            expect(call.args[2]).toBe(true);
                            expect(call.object).toBe(post); 
                        });
                        
                        it("should accept an options object with callback and a scope", function() {
                            var o = {},
                                call;

                            post.getThread({
                                scope: o,
                                callback: spy
                            });  
                            call = spy.mostRecentCall; 
                            expect(call.object).toBe(o); 
                        });
                    });
                });
            });
        
            describe("setter", function() {
                // TODO
            });
        });

        describe("the many", function() {
            function makeThread() {
                thread = new Thread({
                    id: 3
                }, session);
            }
            
            var thread;
            
            afterEach(function() {
                thread = null;
            });
            
            it("should return a store", function() {
                definePost();
                makeThread();
                expect(thread.posts().isStore).toBe(true);         
            });
            
            it("should set the appropriate model type", function() {
                definePost();
                makeThread();
                expect(thread.posts().model).toBe(Post);    
            });

            it("should set the session on the store", function() {
                definePost();
                makeThread();
                expect(thread.posts().getSession()).toBe(session);
            });
            
            it("should return the same store instance on multiple calls", function() {
                definePost();
                makeThread();
                var s = thread.posts();
                expect(thread.posts()).toBe(s);
            });
            
            it("should apply the storeConfig", function() {
                definePost({
                    inverse: {
                        storeConfig: {
                            autoLoad: true
                        }
                    }
                });
                makeThread();
                expect(thread.posts().getAutoLoad()).toBe(true);
            });
            
            describe("autoLoad", function() {
                it("should not load the store by default", function() {
                    definePost();
                    makeThread();
                    var spy = spyOn(Ext.data.Store.prototype, 'load').andReturn();
                    thread.posts();
                    expect(spy.callCount).toBe(0);    
                });  
                
                it("should load the store if configured with autoLoad: true", function() {
                    definePost({
                        inverse: {
                            autoLoad: true
                        }
                    }); 
                    
                    makeThread();
                    var spy = spyOn(Ext.data.Store.prototype, 'load').andReturn();
                    thread.posts();
                    expect(spy.callCount).toBe(1);          
                });
            });
            
            describe("keys", function() {
                
                beforeEach(function() {
                    definePost();
                });
                
                it("should default to the key to the primaryKey", function() {
                    makeThread();
                    var post = thread.posts().add({})[0];
                    expect(post.get('threadId')).toBe(3);
                });
                
                it("should set the primaryKey onto the foreignKey on add", function() {
                    makeThread();
                    var post = thread.posts().add({
                        'threadId': 1
                    })[0];
                    expect(post.get('threadId')).toBe(3);
                });
            });
        });
    });
});

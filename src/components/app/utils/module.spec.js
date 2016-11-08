( function( window, define, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery'
    ], function( $ ) {

        describe( 'Base Module', function() {

            before( function() {
                requirejs.undef( 'utils/module' );
            } );

            afterEach( function() {
                requirejs.undef( 'utils/module' );
            } );

            it( 'should extend from an object literal', function( done ) {

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( {
                            test: 'test',
                            testFunction: function() {}
                        } ),
                        instance = new FakeClass();

                    expect( instance ).to.have.property( 'test' );
                    expect( instance.testFunction ).to.be.a( 'function' );
                    done();
                } );

            } );

            it( 'should call the default constructor methods', function( done ) {
                var fakeModule = {
                        ready: function() {},
                        events: function() {}
                    },
                    mock = sinon.mock( fakeModule );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        instance = new FakeClass();

                    mock.expects( 'ready' ).once();
                    mock.expects( 'events' ).once();
                    done();
                } );
            } );

            it( 'should call custom constructor methods', function( done ) {
                var fakeModule = {
                        constructors: [ 'testConstructor' ],
                        testConstructor: function() {}
                    },
                    mock = sinon.mock( fakeModule );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        instance = new FakeClass();

                    mock.expects( 'testConstructor' ).once();
                    done();
                } );
            } );

            it( 'should call constructor methods with arguments', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    mock = sinon.mock( fakeModule ),
                    testArgumentOne = 'test',
                    testArgumentTwo = {};

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        instance = new FakeClass( testArgumentOne, testArgumentTwo );

                    mock.expects( 'ready' ).once().withArgs( testArgumentOne, testArgumentTwo );
                    done();
                } );
            } );

            it( 'should extend an existing class', function( done ) {
                var fakeModule = {
                        ready: function() {},
                        test: function() {}
                    },
                    fakeExtension = {
                        ready: function() {}
                    };

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        SecondClass = FakeClass.extend( fakeExtension );

                    expect( FakeClass )
                        .not.to.be.equal( SecondClass );

                    expect( FakeClass.prototype.ready )
                        .not.to.be.equal( SecondClass.prototype.ready );

                    expect( FakeClass.prototype.test )
                        .to.be.equal( SecondClass.prototype.test );

                    done();
                } );
            } );

            it( 'should be named "module" by default', function( done ) {
                var fakeModule = {};

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        instance = new FakeClass();

                    expect( instance.name ).to.be.equal( 'module' );
                    done();
                } );
            } );

            it( 'should have a name given in the constructor', function( done ) {
                var fakeModule = {},
                    testname = 'test';

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule ),
                        instance = new FakeClass( null, {}, testname );

                    expect( instance.name ).to.be.equal( testname );
                    done();
                } );
            } );

            it( 'should trigger an event before initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );

                    fakeElement.one( 'beforeInit', function() {
                        done();
                    } );

                    var instance = new FakeClass( fakeElement );
                } );
            } );

            it( 'should trigger a namespaced event before initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );

                    fakeElement.one( 'beforeInit.' + fakeModuleName, function() {
                        done();
                    } );

                    var instance = new FakeClass( fakeElement, {}, fakeModuleName );
                } );
            } );

            it( 'should trigger an event after being initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );

                    fakeElement.one( 'afterInit', function() {
                        done();
                    } );

                    var instance = new FakeClass( fakeElement );
                } );
            } );

            it( 'should trigger a namespaced event after being initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );

                    fakeElement.one( 'afterInit.' + fakeModuleName, function() {
                        done();
                    } );

                    var instance = new FakeClass( fakeElement, {}, fakeModuleName );
                } );
            } );

            it( 'should call the fail method when a promise fails', function( done ) {
                var fakeModule = {
                        ready: function() {
                            var def = $.Deferred();
                            def.reject();
                            return def;
                        },
                        fail: function() {
                            done();
                        }
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );
                    var instance = new FakeClass( fakeElement, {}, fakeModuleName );
                } );
            } );

            it( 'should call the fail method when a promise fails and pass data', function( done ) {
                var fakeModule = {
                        ready: function() {
                            var def = $.Deferred();
                            def.reject( { error: true } );
                            return def;
                        },
                        fail: function( el, opt, err ) {
                            if ( err.error === true ) {
                                done();
                            }
                        }
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );
                    var instance = new FakeClass( fakeElement, {}, fakeModuleName );
                } );
            } );

            it( 'should call the defined fail method when a promise', function( done ) {
                var fakeModule = {
                        failMethod: 'readyFailed',
                        ready: function() {
                            var def = $.Deferred();
                            def.reject();
                            return def;
                        },
                        readyFailed: function() {
                            done();
                        }
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );
                    var instance = new FakeClass( fakeElement, {}, fakeModuleName );
                } );
            } );

            it( 'should have a unique id', function( done ) {
                var fakeModule = {
                        ready: function() {
                        }
                    },
                    fakeModuleName = 'test',
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var FakeClass = Module.extend( fakeModule );
                    var instanceA = new FakeClass( fakeElement, {}, fakeModuleName );
                    var instanceB = new FakeClass( fakeElement, {}, fakeModuleName );

                    expect( instanceA.uid ).not.equal( instanceB.uid );
                    done();
                } );
            } );

        } );

    } );

}( this, this.define, this.requirejs ) );

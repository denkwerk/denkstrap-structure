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
                    var Class = Module.extend( {
                            test: 'test',
                            testFunction: function() {}
                        } ),
                        instance = new Class();

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
                    var Class = Module.extend( fakeModule ),
                        instance = new Class();

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
                    var Class = Module.extend( fakeModule ),
                        instance = new Class();

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
                    var Class = Module.extend( fakeModule ),
                        instance = new Class( testArgumentOne, testArgumentTwo );

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
                    var Class = Module.extend( fakeModule ),
                        SecondClass = Class.extend( fakeExtension );

                    expect( Class ).not.to.be.equal( SecondClass );
                    expect( Class.prototype.ready ).not.to.be.equal( SecondClass.prototype.ready );
                    expect( Class.prototype.test ).to.be.equal( SecondClass.prototype.test );

                    done();
                } );
            } );

            it( 'should trigger an event before initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var Class = Module.extend( fakeModule );

                    fakeElement.one( 'beforeInit', function() {
                        done();
                    } );

                    var instance = new Class( fakeElement );
                } );
            } );

            it( 'should trigger an event after being initialized', function( done ) {
                var fakeModule = {
                        ready: function() {}
                    },
                    fakeElement = $( '<div></div>' );

                require( [ 'utils/module' ], function( Module ) {
                    var Class = Module.extend( fakeModule );

                    fakeElement.one( 'afterInit', function() {
                        done();
                    } );

                    var instance = new Class( fakeElement );
                } );
            } );

        } );

    } );

} )( this, this.define, this.requirejs );

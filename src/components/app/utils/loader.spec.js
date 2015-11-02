( function( window, define, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery'
    ], function( $ ) {

        describe( 'Loader', function() {

            before( function() {
                requirejs.undef( 'utils/loader' );
                requirejs.undef( 'utils/module' );
                requirejs.undef( 'jquery' );
                requirejs.undef( 'test' );
            } );

            afterEach( function() {
                requirejs.undef( 'utils/loader' );
                requirejs.undef( 'utils/module' );
                requirejs.undef( 'jquery' );
                requirejs.undef( 'test' );
            } );

            it( 'should initialize with document as default scope', function( done ) {
                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {} );

                    expect( loader.elementScope.is( document ) ).to.be.deep.equal( true );
                    done();
                } );
            } );

            it( 'should initialize with an element scope', function( done ) {
                var fakeElement = $( '<div></div>' );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    expect( loader.elementScope ).to.be.equal( fakeElement );
                    done();
                } );
            } );

            it( 'should init a module with the default class', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', [], function() { return fakeModule; } );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should init a module with a custom class', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="fancy-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement,
                        autoInitSelector: '.fancy-init'
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should initialize multiple modules', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledTwice ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should init global modules', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        isGlobal: true,
                        ready: function() {}
                    },
                    fakeApp = {};

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement,
                        globalScope: fakeApp
                    } );

                    setTimeout( function() {
                        expect( fakeApp.test ).to.be.an( 'object' );
                        done();
                    }, 50 );
                } );
            } );

            it( 'should init modules on a custom element', function( done ) {
                var scopeElement = $( '<div></div>' ),
                    fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: scopeElement
                    } );

                    loader.initModules( fakeElement );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

        } );

    } );

} )( this, this.define, this.requirejs );

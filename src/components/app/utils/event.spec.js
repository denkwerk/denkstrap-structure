( function( window, define, requirejs, undefined ) {
    'use strict';

    define( [
        'require',
        'jquery'
    ], function( require, $ ) {

        describe( 'Event Dispatcher', function() {

            var EVENT_TEST_1    = '/testrunner/1';
            var EVENT_TEST_2    = '/testrunner/2';
            var EVENT_TEST_3    = '/testrunner/3';
            var EVENT_TEST_4    = '/testrunner/4';
            var EVENT_TEST_5    = '/testrunner/5';
            var EVENT_TEST_5_NS = '/testrunner/5.namespace';
            var EVENT_TEST_6    = '/testrunner/6';
            var EVENT_TEST_6_NS = '/testrunner/6.namespace';
            var EVENT_TEST_7    = '/testrunner/7';

            before( function() {
                requirejs.undef( 'utils/event' );
            } );

            afterEach( function() {
                requirejs.undef( 'utils/event' );
            } );

            it( 'should register an event', function( done ) {

                require( [ 'utils/event' ], function( Event ) {

                    Event.on( EVENT_TEST_1, function() {} );
                    done();

                } );

            } );

            it( 'should fire an event', function( done ) {

                require( [ 'utils/event' ], function( Event ) {

                    Event.on( EVENT_TEST_2, function() {
                        done();
                    } );

                    Event.trigger( EVENT_TEST_2 );

                } );

            } );

            it( 'should pass the correct arguments', function( done ) {

                require( [ 'utils/event' ], function( Event ) {

                    var testArg = 'testString';

                    Event.on( EVENT_TEST_3, function( e, param ) {
                        expect( param ).to.be.equal( testArg );
                        done();
                    } );

                    Event.trigger( EVENT_TEST_3, [ testArg ] );

                } );

            } );

            it( 'should trigger an event with custom scope', function( done ) {
                require( [ 'utils/event' ], function( Event ) {

                    var testScope = {};

                    Event.on( EVENT_TEST_3, function( e, param ) {
                        expect( this ).to.be.equal( testScope );
                        done();
                    } );

                    Event.trigger( EVENT_TEST_3, [], testScope );

                } );
            } );

            it( 'should be possible to unregister an event', function( done ) {

                require( [ 'utils/event' ], function( Event ) {

                    var counter = 0;

                    Event.on( EVENT_TEST_4, function( e ) {
                        counter += 1;
                    } );

                    Event.trigger( EVENT_TEST_4 );

                    Event.off( EVENT_TEST_4 );

                    Event.trigger( EVENT_TEST_4 );

                    if ( counter === 1 ) {
                        done();
                    }

                } );

            } );

            it( 'should be possible to unregister a namespaced event ' +
                'without unregistering an other same named event ' +
                'without namespace',
                function( done ) {

                    require( [ 'utils/event' ], function( Event ) {

                        var counter = 0;

                        Event.on( EVENT_TEST_5, function( e ) {
                            counter += 1;
                        } );

                        Event.on( EVENT_TEST_5_NS, function( e ) {
                            counter += 1;
                        } );

                        Event.trigger( EVENT_TEST_5 );

                        Event.off( EVENT_TEST_5_NS );

                        Event.trigger( EVENT_TEST_5 );

                        if ( counter === 3 ) {
                            done();
                        }

                    } );

                } );

            it( 'should be possible to unregister a all ' +
                'same named events, even namespaced',
                function( done ) {

                    require( [ 'utils/event' ], function( Event ) {

                        var counter = 0;

                        Event.on( EVENT_TEST_6, function( e ) {
                            counter += 1;
                        } );

                        Event.on( EVENT_TEST_6_NS, function( e ) {
                            counter += 1;
                        } );

                        Event.trigger( EVENT_TEST_6 );

                        Event.off( EVENT_TEST_6 );

                        Event.trigger( EVENT_TEST_6 );

                        if ( counter === 2 ) {
                            done();
                        }

                    } );

                } );

            it( 'should be possible to register an event that is ' +
                'only called once',
                function( done ) {

                    require( [ 'utils/event' ], function( Event ) {

                        var counter = 0;

                        Event.one( EVENT_TEST_7, function( e ) {
                            counter += 1;
                        } );

                        Event.trigger( EVENT_TEST_7 );
                        Event.trigger( EVENT_TEST_7 );

                        if ( counter === 1 ) {
                            done();
                        }

                    } );

                } );

            it( 'should be possible to unregister a namespaced event ' +
                'more then one time',
                function( done ) {

                    require( [ 'utils/event' ], function( Event ) {

                        var counter = 0;

                        Event.on( EVENT_TEST_5, function( e ) {
                            counter += 1;
                        } );

                        Event.on( EVENT_TEST_5_NS, function( e ) {
                            counter += 1;
                        } );

                        Event.trigger( EVENT_TEST_5 );

                        Event.off( EVENT_TEST_5_NS );
                        Event.off( EVENT_TEST_5_NS );

                        Event.trigger( EVENT_TEST_5 );

                        if ( counter === 3 ) {
                            done();
                        }

                    } );

                } );

        } );

    } );

}( this, this.define, this.requirejs ) );

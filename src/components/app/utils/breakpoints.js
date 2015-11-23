( function( window, define, require, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery',
        'lodash',
        'utils/event'
    ], function( $, _, Event ) {

        /**
         * Global Breakpoint system
         */

        var EVENT_BREAKPOINT_CHANGE = 'Breakpoint/change';

        return {

            isGlobal: true,
            currentBreakpoint: '',

            defaults: function() {
                return {
                    selector: 'body',
                    defaultBreakpoint: 'default'
                };
            },

            ready: function(  element, options ) {
                this.settings = _.extend( this.defaults(), options );

                this.currentBreakpoint = this.get();
            },

            events: function( element, options ) {
                this.settings = _.extend( this.defaults(), options );

                $( window ).on( 'resize', _.bind( function() {
                    var breakpoint = this.get();
                    if ( this.currentBreakpoint !== breakpoint ) {
                        this.currentBreakpoint = breakpoint;
                        Event.trigger( EVENT_BREAKPOINT_CHANGE, [ breakpoint ] );
                        $( this.settings.selector ).trigger( EVENT_BREAKPOINT_CHANGE, [ breakpoint ] );
                    }
                }, this ) );
            },

            get: function() {
                var breakpoint = this.settings.defaultBreakpoint;
                if ( 'getComputedStyle' in window ) {
                    breakpoint = window.getComputedStyle(
                        document.querySelector( this.settings.selector ),
                            ':after'
                        ).getPropertyValue( 'content' );
                    breakpoint = breakpoint.replace( /"/g, '' );
                }
                return breakpoint;
            }

        };
    } );

} )( this, this.define, this.require, this.requirejs );

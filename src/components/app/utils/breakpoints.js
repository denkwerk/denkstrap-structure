( function( window, define, require, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery',
        'lodash',
        'utils/event'
    ], function( $, _, Event ) {

        /**
         * Global Breakpoint system
         *
         * Usage: This is a global module. It will be saved in tha utils/core object.
         *
         * Events will be fired on the global event-bus and the element specified in the
         * selector.
         *
         * @module utils/breakpoints
         */

        /**
         * The change breakpoint event
         *
         * Fired when the breakpoint changes
         *
         * @event Breakpoint/change
         */
        var EVENT_BREAKPOINT_CHANGE = 'Breakpoint/change';

        return {

            isGlobal: true,
            currentBreakpoint: '',

            /**
             * Returns the default configuration
             *
             * @method defaults
             */
            defaults: function() {
                return {
                    selector: 'body',
                    defaultBreakpoint: 'default'
                };
            },

            /**
             * The ready constructor
             *
             * @method ready
             * @param {jQuery} element The element
             * @param {Object} options The options
             */
            ready: function( element, options ) {
                this.settings = _.extend( this.defaults(), options );

                this.currentBreakpoint = this.get();
            },

            /**
             * The events constructor
             *
             * @method events
             * @param {jQuery} element The element
             * @param {Object} options The options
             */
            events: function( element, options ) {
                this.settings = _.extend( this.defaults(), options );

                $( window ).on( 'resize', _.bind( function() {
                    var breakpoint = this.get();
                    if ( this.currentBreakpoint !== breakpoint ) {
                        this.currentBreakpoint = breakpoint;
                        Event.trigger( EVENT_BREAKPOINT_CHANGE, [ breakpoint ] );
                        $( this.settings.selector ).trigger(
                            EVENT_BREAKPOINT_CHANGE,
                            [ breakpoint ]
                        );
                    }
                }, this ) );
            },

            /**
             * Returns the current breakpoint
             *
             * @method get
             * @returns {String} The current breakpoint
             */
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

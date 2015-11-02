( function( window, define, require, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery'
    ], function( $ ) {

        var o = $( {} );

        /**
         * Global event system by analogy to the jQuery event system
         */
        return {
            trigger: function() {
                o.trigger.apply( o, arguments );
            },

            on: function() {
                o.on.apply( o, arguments );
            },

            one: function() {
                o.one.apply( o, arguments );
            },

            off: function() {
                o.off.apply( o, arguments );
            }
        };
    } );

} )( this, this.define, this.require, this.requirejs );

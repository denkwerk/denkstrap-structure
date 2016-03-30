( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {

        return {

            // Optional definition of constructor functions
            // Default:
            // constructors: [ 'ready', 'events' ],

            ready: function( element, options ) {
                element.style.color = 'red';
            },

            events: function( element, options ) {

            }

        };
    } );

}( this, this.define, this.require ) );

( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {
        return {

            /**
             * The extend helper
             *
             * This helper extends an existing object with new properties or override
             * properties specified.
             *
             * @param  {Object} baseObject   The object that has to be extended
             * @param  {Object} extendObject The object extending the base object
             * @return {Object}              The base object including extensions
             */
            extend: function( baseObject, extendObject ) {
                for ( var key in extendObject ) {
                    if ( extendObject.hasOwnProperty( key ) ) {
                        baseObject[ key ] = extendObject[ key ];
                    }
                }
                return baseObject;
            }
        };
    } );

}( this, this.define, this.require ) );

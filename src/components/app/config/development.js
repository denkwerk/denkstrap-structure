( function( window, define, require, undefined ) {
    'use strict';

    define( [
        'utils/core',
        'lodash'
    ], function( App, _ ) {

        var moduleOptions = {
            example: 'foo'
        };

        /**
         * BASE Config
         *
         * Globale config Settings.
         *
         * @module config
         * @class App.config
         */

        var config = {
            DEBUG: true,
            modules: [],
            dev: true,

            set: function( module, options ) {
                moduleOptions[ module ] = options;
            },

            get: function( module ) {
                return moduleOptions[ module ];
            }
        };

        _.extend( App, { config: config } );

        return App.config;
    } );

}( this, this.define, this.require ) );

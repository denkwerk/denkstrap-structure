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
         * PRODUCTION Config
         *
         * This config file will be used on production build
         *
         * @module config
         * @class App.config
         */

        var config = {
            DEBUG: false,
            modules: [],
            dev: false,

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

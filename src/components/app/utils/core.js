( function( window, define, require, requirejs, undefined ) {
    'use strict';

    define( [
        'utils/loader'
    ], function( Loader ) {

        /**
         * Core Module
         *
         * Is used to load all modules related to DOM Elements
         * All modules are loaded from the app/loader module
         *
         * @module app/core
         */

        /**
         * App object literal
         * @global
         * @type {{}}
         */
        var App = {
            /**
             * Initialize core modules
             *
             * @method init
             */
            init: function() {

                this.loader = new Loader( {
                    globalScope: App,
                    autoInitSelector: '.auto-init'
                } );

            }
        };

        return App;
    } );

}( this, this.define, this.require, this.requirejs ) );

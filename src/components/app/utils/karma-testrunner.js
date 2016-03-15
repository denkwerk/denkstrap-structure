( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {
        var karma = window.__karma__;

        var tests = [];
        for ( var file in karma.files ) {
            if ( /\.spec\.js$/.test( file ) ) {
                tests.push( file );
            }
        }

        require( tests, function() {
            karma.start();
        } );

    } );

}( this, this.define, this.require ) );

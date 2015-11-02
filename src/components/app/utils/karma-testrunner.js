( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {

        var tests = [];
        for ( var file in window.__karma__.files ) {
            if ( /\.spec\.js$/.test( file ) ) {
                tests.push( file );
            }
        }

        require( tests, function() {
            window.__karma__.start();
        } );

    } );

}( this, this.define, this.require ) );

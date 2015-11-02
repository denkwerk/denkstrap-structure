( function( window, define, require, undefined ) {
    'use strict';

    require.config( {
        baseUrl: '/base/components/app',

        deps: [
            'main'
        ],

        callback: function() {
            require( [ 'utils/karma-testrunner' ] );
        }
    } );

}( this, this.define, this.require ) );

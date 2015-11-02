( function( window, define, require, undefined ) {
    'use strict';

    define( [
        'module'
    ], function( plugin ) {

        var buildMap = {};

        var load = {

            parseName: function( moduleName ) {

                var init = ( moduleName.split( ':' ).pop() === 'init' );
                var name = moduleName.split( ':' ).shift();

                return {
                    name: name,
                    init: init
                }
            },

            load: function( mname, req, onload, config ) {

                var parsedName = load.parseName( mname );

                req( [ parsedName.name ], function( value ) {

                    if ( config.isBuild ) {
                        onload( value );
                        return;
                    }

                    require( [ 'utils/module' ], function( Module ) {

                        var Class;

                        if ( value.isGlobal && typeof config.globalScope === 'object' ) {
                            var methods    = value.constructors || [ 'ready', 'events' ];
                            var moduleName = parsedName.name.split( '/' ).pop();
                            Class = config.globalScope[moduleName] = value;

                            if ( parsedName.init ) {
                                methods.forEach( function( method ) {
                                    if ( typeof value[method] === 'function' ) {
                                        try {
                                            value[method].call( value, null, {} );
                                        } catch ( error ) {
                                            throw error;
                                        }
                                    }
                                } );
                            }

                        } else {
                            Class = Module.extend( value );
                            if ( parsedName.init ) {
                                Class = new Class( $( {} ), {}, parsedName.name );
                            }
                        }

                        onload( Class );

                        require.undef( plugin.id + '!' + mname );

                    } );
                } );

            }
        };

        return load;
    } );
}( this, define, require ) );

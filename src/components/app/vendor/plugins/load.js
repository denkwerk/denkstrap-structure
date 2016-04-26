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
                            var moduleName = parsedName.name.split( '/' ).pop();
                            Class = config.globalScope[moduleName] = value;
                        } else {
                            Class = Module.extend( value );
                        }

                        if ( parsedName.init ) {
                            this.init( Class, null, {} );
                        }

                        onload( Class );

                        require.undef( plugin.id + '!' + mname );

                    }.bind( this ) );
                }.bind( this ) );

            },

            init: function( module ) {

                if ( module.isGlobal ) {
                    var args = Array.prototype.splice.call( arguments, 1 );
                    var methods = module.constructors || [ 'ready', 'events' ];

                    methods.forEach( function( method ) {
                        if ( typeof module[method] === 'function' ) {
                            try {
                                module[method].apply( module, args );
                            } catch ( error ) {
                                throw error;
                            }
                        }
                    } );

                } else {
                    // Applies bind to module and passes arguments before creating an instance.
                    // Note that the first argument in the arguments array is the module itself, so it gets
                    // bound to the module and passes the other arguments.
                    module = new ( Function.prototype.bind.apply( module, arguments ) );
                }

                return module;
            }
        };

        return load;
    } );
}( this, define, require ) );

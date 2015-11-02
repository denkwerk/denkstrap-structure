( function( window, define, require, requirejs, undefined ) {
    'use strict';

    var document = window.document;

    define( [
        'jquery',
        'lodash',
        'utils/module'
    ], function( $, _, Module ) {

        /**
         * Module Loader
         *
         * Initializes local and global modules. To initialize modules automatically
         * the class 'auto-init' is required on the related DOM Element
         *
         * Used lodash methods
         * (is required for the grunt lodashAutobuild Task which is not able to parse chains)
         * _.chain _.map _.unique _.flatten _.matchesProperty _.union
         *
         * @example Example
         * var loader = new Loader(element);
         * // returns {Object}
         *
         * @class
         * @classdesc Loader class
         */

        var autoInitSelector = '.auto-init';

        /**
         * Constructor
         *
         * @constructs Loader
         * @param {Object} options
         * @param {Object} [options.globalScope] Scope on which the global modules will be attached
         * @param {jQuery/Zepto} [options.elementScope] DOM element scope
         * @param {Boolean} [options.autoInit] Unless 'false' the Loader will automatically
         * initialize all Modules in Scope
         * @returns {
         *    {
         *      initLocal: initLocalModule,
         *      initGlobal: initGlobalModule,
         *      loadModules: loadModules, modules: Array
         *    }
         * }
         */
        function Loader ( options ) {

            this.elementScope = options.elementScope || $( document );
            this.globalScope   = _.isObject( options.globalScope ) ? options.globalScope : {};
            this.options = options;

            if ( options.autoInit !== false ) {
                this.initModules();
            }

            return this;

        }

        /**
         * Initializes all Modules in elementScope
         *
         * @function initModules
         * @memberof Loader
         * @param {jQuery/Zepto} [element] Optionally an jQuery/Zepto element can be passed
         * wich will be used as scope
         */
        Loader.prototype.initModules = function( element ) {
            var elementScope = element || this.elementScope;
            var moduleElements = elementScope.find(
                this.options.autoInitSelector ||
                autoInitSelector
            );
            var module, target;

            var modules = {
                minor: [],
                major: []
            };

            var moduleNames = {
                minor: [],
                major: []
            };

            /**
             * Creates array with module objects
             */

            _.each( moduleElements, _.bind( function( element, index ) {
                module = this.getModule( moduleElements.eq( index ) );
                target = module.priority ? modules.major : modules.minor;

                target.push( module );
            }, this ) );

            /**
             * Creates Lists with all modules and extensions to load in a
             * single require Call per priority
             *
             * TODO: Optimize union
             */

            moduleNames.major = _.chain( modules.major )
                .map( 'source' )
                .union( _.map( modules.major, 'extensions' ) )
                .flatten()
                .unique()
                .value();

            if ( moduleNames.major.length ) {
                this.loadModules( moduleNames.major, modules.major );
            }

            moduleNames.minor = _.chain( modules.minor )
                .map( 'source' )
                .union( _.map( modules.minor, 'extensions' ) )
                .flatten()
                .unique()
                .value();

            if ( moduleNames.minor.length ) {
                this.loadModules( moduleNames.minor, modules.minor );
            }
        };

        /**
         * Extracts module data from DOM-Element (jQuery/Zepto)
         *
         * @function getModule
         * @memberof Loader
         * @param {jQuery/Zepto} element
         * @returns {{element: jQuery/Zepto, source: Array, options: Object, extensions: Array}}
         */
        Loader.prototype.getModule = function( element ) {
            return {
                element: element,

                source: element.data( 'module' ) ?
                    element.data( 'module' ).replace( / /g, '' ).split( ',' )
                    : [],

                options: element.data( 'options' ),

                extensions: element.data( 'extensions' ) ?
                    element.data( 'extensions' ).replace( / /g, '' ).split( ',' )
                    : [],

                priority: element.data( 'priority' ) ?
                    element.data( 'priority' )
                    : false
            };
        };

        /**
         * Initializes the global modules
         *
         * @function initGlobalModule
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/Zepto} options.element
         * @param {Object} options.options
         * @param {String} options.moduleName
         */
        Loader.prototype.initGlobalModule = function( options ) {
            var methods = options.module.constructors || [ 'ready', 'events' ];
            var name    = options.moduleName.split( '/' ).pop();

            this.globalScope[ name ] = options.module;

            _.each( methods, function( method, index ) {
                if ( _.isFunction( options.module[ method ] ) ) {
                    try {
                        options.module[ method ].call(
                            options.module,
                            options.element,
                            options.options
                        );
                    } catch ( error ) {
                        throw error;
                    }
                }
            } );
        };

        /**
         * Initializes the locale modules
         *
         * @function initLocalModule
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/Zepto} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         */
        Loader.prototype.initLocalModule = function( options ) {
            var ModuleClass = Module.extend( options.module );
            var ModuleInstance;

            if ( options.extensions.length ) {
                _.each( options.extensions, function( extension ) {
                    ModuleClass = ModuleClass.extend( extension );
                } );
            }

            this.initLocalClass( {
                module: ModuleClass,
                element: options.element,
                options: options.options,
                moduleName: options.moduleName
            } );
        };

        /**
         * Initializes a Class of an existing Module
         *
         * @function initLocalClass
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/Zepto} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         */
        Loader.prototype.initLocalClass = function( options ) {

            // For testing purposes attach module to element
            options.element.data(
                options.moduleName,
                new options.module( options.element, options.options, options.moduleName )
            );
        };

        /**
         * Loads modules in array and call initialize functions
         *
         * @function loadModules
         * @memberof Loader
         * @param {Array} moduleNames List of modules names
         * @param {Array} modules List of module objects
         */
        Loader.prototype.loadModules = function( moduleNames, modules ) {
            require( moduleNames, _.bind( function() {
                var args = arguments;

                _.each( modules, _.bind( function( moduleObject ) {

                    _.each( moduleObject.source, _.bind( function( moduleName ) {
                        var indexInArg = _.indexOf( moduleNames, moduleName );
                        var module = args[ indexInArg ];
                        var isLocal = !module.isGlobal;
                        var isFunction = _.isFunction( module );
                        var initFunction = isFunction ?
                            this.initLocalClass
                            : isLocal ?
                            this.initLocalModule
                            : this.initGlobalModule;
                        var extensions = [];

                        var extensionIndexInArg;

                        /**
                         * Searches related extensions and pushes them into an array
                         */
                        if ( isLocal && moduleObject.extensions.length ) {
                            _.each( moduleObject.extensions, function( extensionName, index ) {
                                extensionIndexInArg = _.indexOf( moduleNames, extensionName );

                                if ( _.contains( args[ extensionIndexInArg ].extend, moduleName ) ) {
                                    extensions.push( args[ extensionIndexInArg ] );
                                }
                            } );
                        }

                        /**
                         * Initialize Module
                         */
                        initFunction.call( this, {
                            module: module,
                            element: moduleObject.element,
                            options: moduleObject.options,
                            moduleName: moduleName,
                            extensions: extensions
                        } );
                    }, this ) );
                }, this ) );
            }, this ) );
        };

        return Loader;
    } );

}( this, this.define, this.require, this.requirejs ) );

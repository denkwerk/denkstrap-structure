( function( window, define, require, requirejs, undefined ) {
    'use strict';

    var document = window.document;

    define( [
        'require',
        'utils/module',
        'vendor/polyfills/promise'
    ], function( require, Module ) {

        /*
         * Extends NodeList prototype with Array.prototype.forEach function. Does not work in
         * IE < 8. For this case you better use the jQuery version of this library.
         *
         * TODO: Move all native extensions to a single file.
         */
        NodeList.prototype.forEach = Array.prototype.forEach;

        /**
         * Module Loader
         *
         * Initializes local and global modules. To initialize modules automatically
         * the class 'auto-init' is required on the related DOM Element
         *
         * Used lodash methods
         * (is required for the grunt lodashAutobuild Task which is not able to parse chains)
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
         * @param {jQuery/Zepto/HTMLElement} [options.elementScope] DOM element scope
         * @param {Boolean} [options.autoInit] Unless 'false' the Loader will automatically
         * initialize all Modules in Scope
         * @param {Function} requireContext The require.js context for the Loader instance
         * @returns {
         *    {
         *      initLocal: initLocalModule,
         *      initGlobal: initGlobalModule,
         *      loadModules: loadModules, modules: Array
         *    }
         * }
         */
        function Loader ( options, requireContext ) {

            this.elementScope = ( options.elementScope && options.elementScope.jquery ) ?
                options.elementScope.get( 0 ) :
                options.elementScope || document;
            this.globalScope   = ( typeof options.globalScope === 'object' ) ?
                options.globalScope :
                {};
            this.options = options;
            this.requireContext = requireContext || require;
            this.promise = new Promise( function( resolve, reject ) {
                this.resolve = resolve;
                this.reject = reject;
            }.bind( this ) );
            this.pendingModules = {
                major: 0,
                minor: 0
            };

            this.moduleLoaded = function( type ) {
                if ( type && this.pendingModules.hasOwnProperty( type ) ) {
                    this.pendingModules[ type ]--;
                }

                if ( !this.pendingModules.major && !this.pendingModules.minor ) {
                    this.resolve();
                }
            }.bind( this );

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
         * @param {jQuery/Zepto/HTMLElement} [element] Optionally an jQuery/Zepto element can be
         *                                             passed wich will be used as scope
         * @returns {Promise} The returned Promise will be resolved when all local modules
         *                    are initialized
         */
        Loader.prototype.initModules = function( element ) {
            var elementScope = ( element && element.jquery ) ?
                element.get( 0 ) :
                element || this.elementScope;
            var moduleElements = elementScope.querySelectorAll(
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

            moduleElements.forEach( function( element, index ) {
                module = this.getModule( moduleElements.item( index ) );
                target = module.priority ? modules.major : modules.minor;

                target.push( module );
            }.bind( this ) );

            /**
             * Creates Lists with all modules and extensions to load in a
             * single require Call per priority
             *
             * TODO: Optimize union
             */

            var generateModulesArray = function( inputArray ) {
                var result = inputArray.map( function( module ) { // map sources
                        return module.source;
                    } ).concat( inputArray.map( function( module ) { // concatenate with extensionsf
                        return module.extensions;
                    } ) ).reduce( function( acc, items ) { // flatten array
                        return acc.concat( items );
                    }, [] ).reduce( function( acc, item ) { // uniuqe entries
                        /* jshint bitwise: false */
                        if ( !acc.length || !~acc.indexOf( item ) ) {
                            /* jshint bitwise: true */
                            acc.push( item );
                        }
                        return acc;
                    }, [] );
                return result;
            };

            moduleNames.major = generateModulesArray( modules.major );

            if ( moduleNames.major.length ) {
                this.loadModules( moduleNames.major, modules.major, 'major' );
            }

            moduleNames.minor = generateModulesArray( modules.minor );

            if ( moduleNames.minor.length ) {
                this.loadModules( moduleNames.minor, modules.minor, 'minor' );
            }

            if ( !moduleNames.minor.length && !moduleNames.major.length ) {
                this.moduleLoaded();
            }

            return this.promise;
        };

        /**
         * Extracts module data from DOM-Element (jQuery/Zepto)
         *
         * @function getModule
         * @memberof Loader
         * @param {jQuery/Zepto/HTMLElement} element
         * @returns {{element: HTMLElement, source: Array, options: Object, extensions: Array}}
         */
        Loader.prototype.getModule = function( element ) {
            return {
                element: element,

                source: element.getAttribute( 'data-module' ) ?
                    element.getAttribute( 'data-module' ).replace( / /g, '' ).split( ',' )
                    : element.getAttribute( 'data-modules' ) ?
                    element.getAttribute( 'data-modules' ).replace( / /g, '' ).split( ',' )
                    : [],

                options: JSON.parse( element.getAttribute( 'data-options' ) ),

                extensions: element.getAttribute( 'data-extension' ) ?
                    element.getAttribute( 'data-extension' ).replace( / /g, '' ).split( ',' )
                    : element.getAttribute( 'data-extensions' ) ?
                    element.getAttribute( 'data-extensions' ).replace( / /g, '' ).split( ',' )
                    : [],

                priority: element.getAttribute( 'data-priority' ) ?
                    JSON.parse( element.getAttribute( 'data-priority' ) )
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
         * @param {jQuery/Zepto/HTMLElement} options.element
         * @param {Object} options.options
         * @param {String} options.moduleName
         */
        Loader.prototype.initGlobalModule = function( options ) {
            var methods = options.module.constructors || [ 'ready', 'events' ];
            var name    = options.moduleName.split( '/' ).pop();

            this.globalScope[ name ] = options.module;

            methods.forEach( function( method, index ) {
                if ( typeof options.module[ method ] === 'function' ) {
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

            this.moduleLoaded( options.type );
        };

        /**
         * Initializes the locale modules
         *
         * @function initLocalModule
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/Zepto/HTMLElement} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         */
        Loader.prototype.initLocalModule = function( options ) {
            var ModuleClass = Module.extend( options.module );
            var ModuleInstance;

            if ( options.extensions.length ) {
                options.extensions.forEach( function( extension ) {
                    ModuleClass = ModuleClass.extend( extension );
                } );
            }

            this.initLocalClass( {
                module: ModuleClass,
                element: options.element,
                options: options.options,
                moduleName: options.moduleName,
                type: options.type
            } );
        };

        /**
         * Initializes a Class of an existing Module
         *
         * @function initLocalClass
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/Zepto/HTMLElement} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         */
        Loader.prototype.initLocalClass = function( options ) {
            return new options.module(
                options.element,
                options.options,
                options.moduleName,
                this.moduleLoaded, options.type
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
        Loader.prototype.loadModules = function( moduleNames, modules, type ) {

            this.requireContext( moduleNames, function() {
                var args = arguments;

                // PendingModules has to be updated BEFORE the initializing process has been started
                // TODO: Optimize
                modules.forEach( function( moduleObject ) {

                    moduleObject.source.forEach( function( moduleName ) {

                        var indexInArg = moduleNames.indexOf( moduleName );
                        var module = args[ indexInArg ];

                        //Var isLocal = !module.isGlobal;
                        //if ( isLocal ) {
                        this.pendingModules[ type ]++;

                        //}

                    }, this );

                }, this );

                modules.forEach( function( moduleObject ) {

                    moduleObject.source.forEach( function( moduleName ) {
                        var indexInArg = moduleNames.indexOf( moduleName );
                        var module = args[ indexInArg ];
                        var isLocal = !module.isGlobal;
                        var isFunction = typeof module === 'function';
                        var initFunction = isFunction ?
                            this.initLocalClass
                            : isLocal ?
                            this.initLocalModule
                            : this.initGlobalModule;
                        var extensions = [];

                        var extensionIndexInArg;

                        /**
                         * Searchs related extensions and pushes them into an array
                         */
                        if ( isLocal && moduleObject.extensions.length ) {
                            moduleObject.extensions.forEach( function( extensionName, index ) {
                                extensionIndexInArg = moduleNames.indexOf( extensionName );

                                /* jshint bitwise: false */
                                if ( !!~args[ extensionIndexInArg ].extend.indexOf(
                                        moduleName
                                    ) ) {
                                    /* jshint bitwise: true */
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
                            extensions: extensions,
                            type: type
                        } );
                    }, this );
                }, this );
            }.bind( this ) );
        };

        return Loader;
    } );

}( this, this.define, this.require, this.requirejs ) );

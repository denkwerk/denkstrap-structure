( function( window, define, require, requirejs, undefined ) {
    'use strict';

    var document = window.document;

    define( [
        'require',
        'utils/module',
        'utils/helper',
        'utils/conditions',
        'vendor/polyfills/promise'
    ], function( require, Module, helper, conditions ) {

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
         * @param {jQuery/HTMLElement} [options.elementScope] DOM element scope
         * @param {Boolean} [options.autoInit] Unless 'false' the Loader will automatically
         * initialize all Modules in Scope
         * @param {Function} requireContext The require.js context for the Loader instance
         * @returns {this}
         */
        function Loader( options, requireContext ) {

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
         * @param {jQuery/HTMLElement} [element] Optionally an jQuery element can be
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

            /*
             * Creates array with module objects
             */
            Array.prototype.forEach.call(
                moduleElements,
                function( element, index ) {
                    module = this.getModule( moduleElements.item( index ) );
                    target = module.priority ? modules.major : modules.minor;

                    target.push( module );
                }.bind( this )
            );

            if ( modules.major.length ) {
                this.loadModules( modules.major, 'major' );
            }

            if ( modules.minor.length ) {
                this.loadModules( modules.minor, 'minor' );
            }

            if ( !modules.minor.length && !modules.major.length ) {
                this.moduleLoaded();
            }

            return this.promise;
        };

        /**
         * Extracts module data from DOM-Element (jQuery)
         *
         * @function getModule
         * @memberof Loader
         * @param {jQuery/HTMLElement} element
         * @returns {{element: HTMLElement, source: Array, options: Object, extensions: Array, condition: Object}}
         */
        Loader.prototype.getModule = function( element ) {

            var condition  = element.getAttribute( 'data-condition' );

            return {
                element: element,

                source: element.getAttribute( 'data-module' ) ?
                    element.getAttribute( 'data-module' ).replace( / /g, '' ).split( ',' ) :
                    element.getAttribute( 'data-modules' ) ?
                    element.getAttribute( 'data-modules' ).replace( / /g, '' ).split( ',' ) :
                        [],

                options: JSON.parse( element.getAttribute( 'data-options' ) ),

                extensions: element.getAttribute( 'data-extension' ) ?
                    element.getAttribute( 'data-extension' ).replace( / /g, '' ).split( ',' ) :
                    element.getAttribute( 'data-extensions' ) ?
                    element.getAttribute( 'data-extensions' ).replace( / /g, '' ).split( ',' ) :
                        [],

                priority: element.getAttribute( 'data-priority' ) ?
                    JSON.parse( element.getAttribute( 'data-priority' ) ) :
                    false,

                condition: ( typeof condition === 'string' && condition.indexOf( '{' ) !== -1 ) ?
                    JSON.parse( condition ) :
                    condition
            };
        };

        /**
         * Initializes the global modules
         *
         * @function initGlobalModule
         * @memberof Loader
         * @param {Object} options
         * @param {Object} options.module
         * @param {jQuery/HTMLElement} options.element
         * @param {Object} options.options
         * @param {String} options.moduleName
         * @param {String} options.type
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
         * @param {jQuery/HTMLElement} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         * @param {Boolean} options.hasCondition
         * @param {String} options.type
         */
        Loader.prototype.initLocalModule = function( options ) {
            var ModuleClass = Module.extend( options.module );

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
                hasCondition: options.hasCondition,
                type: options.type
            } );
        };

        /**
         * Initializes a Class of an existing Module
         *
         * @function initLocalClass
         * @memberof Loader
         * @param {Object} options
         * @param {Function} options.module
         * @param {jQuery/HTMLElement} options.element
         * @param {Object} options.options
         * @param {Array} options.extensions
         * @param {String} options.moduleName
         * @param {Boolean} options.hasCondition
         * @return {Module}
         */
        Loader.prototype.initLocalClass = function( options ) {
            return new options.module(
                options.element,
                options.options,
                options.moduleName,
                !options.hasCondition ? this.moduleLoaded : undefined,
                options.type
            );
        };

        /**
         * Iterates through all passed modules and initializes them respectively registers a condition if necessary.
         *
         * @function loadModules
         * @memberof Loader
         * @param {Array} modules List of module objects
         * @param {String} type Describes if its a minor or major type module
         */
        Loader.prototype.loadModules = function( modules, type ) {

            modules.forEach( function( moduleObject ) {

                moduleObject.source.forEach( function( source ) {

                    if (
                        moduleObject.condition &&
                        (
                            typeof moduleObject.condition === 'string' ||
                            moduleObject.condition.hasOwnProperty( source )
                        )
                    ) {

                        var condition =  ( typeof moduleObject.condition === 'string' ) ?
                            moduleObject.condition :
                            moduleObject.condition[ source ];

                        try {
                            conditions[ condition ].call(
                                this,
                                helper.once( this.loadModule.bind( this, source, moduleObject, type ) ),
                                moduleObject.element
                            );
                        } catch ( error ) {
                            console.warn( 'The condition "' + moduleObject.condition[ source ] + '" doesn\'t exist.' );
                        }

                    } else {
                        this.pendingModules[ type ]++;
                        this.loadModule.call( this, source, moduleObject, type );
                    }

                }.bind( this ) );

            }.bind( this ) );

        };

        /**
         * Requires a module and initializes it with all extensions
         *
         * @function loadModule
         * @memberof Loader
         * @param {String} source Modulename
         * @param {Object} moduleObject
         * @param {String} type Describes if its a minor or major type module
         */
        Loader.prototype.loadModule = function( source, moduleObject, type ) {

            this.requireContext( [ source ], function( module ) {

                var isLocal = !module.isGlobal;
                var isFunction = typeof module === 'function';
                var initFunction = isFunction ?
                    this.initLocalClass :
                    isLocal ?
                    this.initLocalModule :
                        this.initGlobalModule;
                var extensions = [];
                var promise = new Promise( function( resolve ) {

                    /**
                     * Searchs related extensions and pushes them into an array
                     */
                    if ( isLocal && moduleObject.extensions.length ) {

                        this.requireContext( moduleObject.extensions, function() {

                            Array.prototype.forEach.call( arguments, function( extension ) {

                                /* jshint bitwise: false */
                                if ( !!~extension.extend.indexOf( source ) ) {
                                    extensions.push( extension );
                                }
                                /* jshint bitwise: true */

                            } );

                            resolve();

                        } );

                    } else {
                        resolve();
                    }

                }.bind( this ) );

                /**
                 * Initialize Module
                 */
                promise.then( function() {

                    initFunction.call( this, {
                        module: module,
                        element: moduleObject.element,
                        options: moduleObject.options,
                        moduleName: source,
                        extensions: extensions,
                        hasCondition: moduleObject.condition !== null,
                        type: type
                    } );

                }.bind( this ) );

            }.bind( this ) );

        };

        return Loader;
    } );

}( this, this.define, this.require, this.requirejs ) );

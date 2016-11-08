( function( window, define, require, undefined ) {
    'use strict';

    define( [
        'vendor/polyfills/object.create',
        'vendor/polyfills/promise',
        'vendor/polyfills/custom-event'
    ], function() {

        var _lastId = 0;

        /**
         * Module Class
         * @class Module
         */

        /**
         * Event beforeInit
         * @type {string}
         */
        var EVENT_BEFORE_INIT = 'beforeInit';
        /**
         * Event afterInit
         * @type {string}
         */
        var EVENT_AFTER_INIT = 'afterInit';

        /**
         * Simple JavaScript Inheritance for ES 5.1
         * based on http://ejohn.org/blog/simple-javascript-inheritance/
         * (inspired by base2 and Prototype)
         * MIT Licensed.
         */
        /* jshint ignore: start */
        /* eslint-disable */
        var fnTest = /xyz/.test( function() {xyz;} ) ? /\b_super\b/ : /.*/;
        /* eslint-enable */
        /* jshint ignore: end */

        /**
         * The base Class implementation (does nothing)
         */
        function BaseClass() {}

        /**
         * Create a new Class that inherits from this class
         *
         * @constructs Module
         * @method extend
         * @memberof Module
         * @param {Object} props
         * @returns {Function}
         */
        BaseClass.extend = function( props ) {
            var _super = this.prototype;

            /**
             * Set up the prototype to inherit from the base class
             * (but without running the init constructor)
             *
             * @type {_super}
             */
            var proto = Object.create( _super );

            /**
             * Copy the properties over onto the new prototype
             */
            /* jshint ignore: start */
            for ( var name in props ) {

                /**
                 * Check if we're overwriting an existing function
                 */

                if ( typeof props[ name ] === 'function' &&
                    typeof _super[ name ] === 'function' &&
                    fnTest.test( props[ name ] ) ) {

                    proto[ name ] = ( function( name, fn ) {
                        return function() {
                            var tmp = this._super;

                            /**
                             * Add a new ._super() method that is the same method
                             * but on the super-class
                             */
                            this._super = _super[ name ];

                            /**
                             * The method only need to be bound temporarily, so we
                             * remove it when we're done executing
                             */
                            var ret = fn.apply( this, arguments );
                            this._super = tmp;

                            return ret;
                        };
                    }( name, props[ name ] ) );

                } else if ( typeof props[ name ] === 'object' ) {

                    proto[ name ] = Object.create( props[ name ] );

                    if ( typeof _super[ name ] === 'object' ) {
                        proto[ name ]._super = _super[ name ];
                    }

                } else {
                    proto[ name ] = props[ name ];
                }
            }
            /* jshint ignore: end */

            /**
             * Extracts element
             *
             * Checks for jquery or HTMLElement and returns the corresponding HTMLElement
             *
             * @param {HTMLElement|jQuery} value The value from which to extract
             * @param {HTMLElement} extractedElement The extracted element
             * @returns {HTMLElement}
             * @private
             */
            var extractElement = function( value, extractedElement ) {
                if ( value && value.jquery ) {
                    extractedElement = value.get( 0 );
                } else if ( value && value instanceof HTMLElement ) {
                    extractedElement = value;
                }
                return extractedElement;
            };

            /**
             * Fire a Custom DOM event
             *
             * @param {HTMLElement} element The element
             * @param {String} event The name of the event
             * @param {String} name The namespace
             * @private
             */
            var fireDOMEvent = function( element, event, name ) {
                if ( element !== null ) {
                    var beforeInitEvent = new CustomEvent( event, {} ),
                        beforeInitEventNS = new CustomEvent(
                            event + '.' + name,
                            {}
                        );

                    element.dispatchEvent( beforeInitEvent );
                    element.dispatchEvent( beforeInitEventNS );
                }
            };

            var newClass = function Module() {
                var args = arguments;

                this.name = args[ 2 ] || 'module';
                this.uid = this.uid || this.name + '_' + _lastId++;

                var constructors = this.constructors || [ 'ready', 'events' ];
                var errorMethodName = this.failMethod || 'fail';

                var element = document.createElement( 'div' );
                var methods = {};
                var errorMethod = null;
                var loadedCallback = ( typeof args[ 3 ] === 'function' ) ?
                    args [ 3 ] :
                    undefined;
                var type = ( loadedCallback && typeof args[ 4 ] === 'string' ) ?
                    args[ 4 ] :
                    undefined;

                /**
                 * Assignment of the contructor functions
                 */
                constructors.forEach( function( method ) {
                    methods[ method ] = typeof proto[ method ] === 'function' ?
                        proto.hasOwnProperty( method ) ?
                            proto[ method ] :
                            _super[ method ] :
                        function() {};
                } );

                /**
                 * Assignment of the error method
                 * @type {Function}
                 */
                errorMethod = typeof proto[ errorMethodName ] === 'function' ?
                    proto.hasOwnProperty( errorMethodName ) ?
                        proto[ errorMethodName ] :
                        _super[ errorMethodName ] :
                    function() {};

                element = extractElement( args[ 0 ], element );

                /**
                 * BeforeInit Event
                 * @event beforeInit
                 * @event beforeInit:namespace
                 */
                fireDOMEvent( element, EVENT_BEFORE_INIT, this.name );

                /**
                 * Initialization of constructor functions
                 *
                 * If a deferred object is passed by the constructor functions return
                 * value the afterInit events will be fired when the deferred objects
                 * are resolved
                 */

                var promise = methods[ constructors[ 0 ] ].apply( this, args );

                if ( !promise || typeof promise.then !== 'function' ) {
                    promise = new Promise( function( resolve, reject ) {
                        resolve( promise );
                    } );
                }

                constructors.forEach( function( cName, index ) {

                    if ( index === 0 ) {
                        return;
                    }

                    var initArgs = Array.prototype.slice.call( args, 0, 2 );

                    promise = promise.then( function() {
                        initArgs = initArgs.concat( Array.prototype.slice.call( arguments ) );

                        return methods[ cName ].apply( this, initArgs );
                    }.bind( this ) );

                }, this );

                if ( typeof errorMethod === 'function' ) {
                    var catchMethod = function() {
                        var initArgs = Array.prototype.slice.call( args, 0, 2 );
                        initArgs = initArgs.concat( Array.prototype.slice.call( arguments ) );

                        errorMethod.apply( this, initArgs );
                    }.bind( this );

                    if ( typeof promise.catch === 'function' ) {
                        promise.catch( catchMethod );
                    } else if ( typeof promise.fail === 'function' ) {
                        promise.fail( catchMethod );
                    }

                }

                promise.then( function() {

                    /**
                     * AfterInit Event
                     *
                     * @event afterInit
                     * @event afterInit:namespace
                     */
                    fireDOMEvent( element, EVENT_AFTER_INIT, this.name );

                    if ( loadedCallback && type ) {
                        loadedCallback( type );
                    }

                }.bind( this ) );

            };

            /**
             * Populate our constructed prototype object
             * @type {_super}
             */
            newClass.prototype = proto;

            /**
             * Enforce the constructor to be what we expect
             * @type {Function}
             */
            proto.constructor = newClass;

            /**
             * And make this class extendable
             * @type {Function}
             */
            newClass.extend = BaseClass.extend;

            return newClass;
        };

        return BaseClass;

    } );

}( this, this.define, this.require ) );

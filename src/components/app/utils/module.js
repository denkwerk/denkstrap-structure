( function( window, define, require, undefined ) {
    'use strict';

    define( [
        'lodash',
        'jquery',
        'vendor/polyfills/object.create'
    ], function( _, $ ) {

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
        var fnTest = /xyz/.test( function() {xyz;} ) ? /\b_super\b/ : /.*/;
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
                    } )( name, props[ name ] );

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

            var newClass = function Module() {
                var args = arguments;

                this.name = args[ 2 ] || 'module';
                this.uid = this.uid || _.uniqueId( this.name + '_' );

                var constructors = this.constructors || [ 'ready', 'events' ];

                var element = $( {} );
                var methods = {};
                var loaderPromise = ( args[ 3 ] && args[ 3 ].resolve ) ?
                    args [ 3 ] :
                    undefined;
                var type = ( loaderPromise && typeof args[ 4 ] === 'string' ) ?
                    args[ 4 ] :
                    undefined;

                /**
                 * Assignment of the contructor functions
                 */
                _.each( constructors, function( method ) {
                    methods[ method ] = typeof proto[ method ] === 'function' ?
                        proto.hasOwnProperty( method ) ?
                            proto[ method ]
                            : _super[ method ]
                        : function() {};
                } );

                if ( args[ 0 ] && args[ 0 ].jquery ) {
                    element = args[ 0 ];
                }

                /**
                 * BeforeInit Event
                 * @event beforeInit
                 * @event beforeInit:namespace
                 */
                if ( !_.isNull( element ) ) {
                    element
                        .trigger( EVENT_BEFORE_INIT + '.^', [ element ] )
                        .trigger( EVENT_BEFORE_INIT + '.' + this.name, [ element ] );
                }

                /**
                 * Initialization of constructor functions
                 *
                 * If a deferred object is passed by the constructor functions return
                 * value the afterInit events will be fired when the deferred objects
                 * are resolved
                 *
                 * TODO: Support für ES6 Promises
                 */

                var promise = $.when(
                    methods[ constructors[ 0 ] ].apply( this, args )
                );

                _.each( constructors, function( cName, index ) {

                    if ( index === 0 ) {
                        return;
                    }

                    promise = promise.then( _.bind( function() {
                        var initArgs = Array.prototype.slice.call( args, 0, 2 );
                        initArgs = initArgs.concat( Array.prototype.slice.call( arguments ) );

                        return $.when(
                            methods[ cName ].apply( this, initArgs )
                        );
                    }, this ) );

                }, this );

                promise.then( _.bind( function() {

                    /**
                     * AfterInit Event
                     *
                     * @event afterInit
                     * @event afterInit:namespace
                     */
                    if ( !_.isNull( element ) ) {
                        element
                            .trigger( EVENT_AFTER_INIT + '.^', [ element ] )
                            .trigger( EVENT_AFTER_INIT + '.' + this.name, [ element ] );
                    }

                    if ( loaderPromise && type ) {
                        loaderPromise.notify( type );
                    }

                }, this ) );

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

( function( window, define, require, requirejs, undefined ) {
    'use strict';

    define( [], function() {

        /**
         * Event
         * @param {String} name Event name
         * @param {Array} namespace Event namespaces
         * @param {Function} callback Event callback function
         * @param {Boolean} once When 'true' event will be destroyed after the first time
         * triggered
         * @constructor
         */

        function Event( name, namespace, callback, once ) {
            this.type       = name;
            this.namespace  = namespace;
            this.callback   = callback;
            this.once       = once || false;
        }

        /**
         * Trigger Event
         * @param {Array} namespace Event namespaces
         * @param {Object} context Context will be applied to callback function. If undefined the
         *                         context is the event itself
         * @param {Array} args Arguments will be passed in callback function
         */
        Event.prototype.trigger = function( namespace, context, args ) {
            if ( !namespace.length || this.hasNamespace( namespace ) ) {
                var eventArgs = [ this ];
                if ( Array.isArray( args ) && args.length > 0 ) {
                    args.forEach( function( arg ) {
                        eventArgs.push( arg );
                    } );
                }

                this.callback.apply( context || this, eventArgs );
            }
        };

        /**
         * Checks if event has given namespace
         * @param {String} namespace
         * @param {String} [subscribedNamespace] Only for function recursion!
         * @returns {boolean}
         */
        Event.prototype.hasNamespace = function( namespace, subscribedNamespace ) {
            var pNS = namespace.slice( 0 );
            var sNS = subscribedNamespace || this.namespace.slice( 0 );

            if ( pNS[ 0 ] === sNS[ 0 ] ) {

                pNS.splice( 0, 1 );
                sNS.splice( 0, 1 );

                if ( pNS.length && sNS.length ) {
                    return this.hasNamespace( pNS, sNS );
                } else {
                    return ( pNS.length === sNS.length ) || ( sNS.length > pNS.length );
                }
            } else {
                return false;
            }
        };

        /**
         * Dispatcher
         * @constructor
         */
        function Dispatcher() {
            this._events = {};
        }

        /**
         * Splits event name in name and namespaces
         * @param {String} eventName
         * @returns {{name: String, namespace: Array}}
         */
        Dispatcher.prototype.splitName = function( eventName ) {
            var namespace   = eventName.split( '.' );

            return {
                name: namespace.splice( 0, 1 ).toString(),
                namespace: namespace
            };
        };

        /**
         * Subscribes an Event
         * @param {String} eventName Event name including namespace
         * @param {Function} callback Callback function
         * @param {Boolean} [once] When 'true' event will be destroyed after the first time
         * triggered
         */
        Dispatcher.prototype.subscribeEvent = function( eventName, callback, once ) {
            var name   = this.splitName( eventName );
            var target = this._events[ name.name ] || ( this._events[ name.name ] = [] );

            target.push( new Event( name.name, name.namespace, callback, once ) );
        };

        /**
         * Subscribes an Event
         * @param {String} name Event name including namespace
         * @param {Function} callback Callback function
         */
        Dispatcher.prototype.on = function( name, callback ) {
            this.subscribeEvent( name, callback );
        };

        /**
         * Subscribes an Event which will be destroyed after first time triggered
         * @param {String} name Event name including namespace
         * @param {Function} callback Callback function
         */
        Dispatcher.prototype.one = function( name, callback ) {
            this.subscribeEvent( name, callback, true );
        };

        /**
         * Unsubscribes an event
         * @param {String} eventName Event name including namespace
         */
        Dispatcher.prototype.off = function( eventName ) {
            var name   = this.splitName( eventName );
            var events = this._events[ name.name ];

            if ( events === undefined ) {
                return;
            }

            if ( name.namespace.length ) {
                events.forEach( function( event, index ) {
                    if ( event.hasNamespace( name.namespace ) ) {
                        events[ index ] = null;
                    }
                } );

                events = events.filter( function( event ) {
                    return !!event;
                } );

                this._events[ name.name ] = events;
            } else {
                delete this._events[ name.name ];
            }
        };

        /**
         * Triggers an event
         * @param {String} eventName Event name including namespace
         * @param {Array} [args] Arguments wich will be passed in the event callback
         * @param {Object} [context] Context will be applied to event callback
         */
        Dispatcher.prototype.trigger = function( eventName, args, context ) {
            var name   = this.splitName( eventName );
            var events = this._events[ name.name ];

            if ( events === undefined ) {
                return;
            }

            events.forEach( function( event, index ) {

                if ( event === null ) {
                    return;
                }

                event.trigger( name.namespace, context, args );

                if ( event.once ) {
                    events[ index ] = null;
                }

            } );

            events = events.filter( function( event ) {
                return !!event;
            } );
        };

        return new Dispatcher();
    } );

}( this, this.define, this.require, this.requirejs ) );

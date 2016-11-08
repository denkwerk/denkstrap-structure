( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {

        /**
         * CONDITIONS
         *
         * This file contains all init conditions usable by the loader.
         * Missing a useful condition? Feel free to contribute by
         * submitting them for the default package! ¯\_(ツ)_/¯
         *
         * @returns {Object} conditions
         */

        return {

            /**
             * in-viewport condition
             *
             * Initialize a module when it appears in the viewport
             *
             * @param {Function} load Use to load module
             * @param {HTMLElement} element
             */
            'in-viewport': function( load, element ) {

                function check() {

                    var rect = element.getBoundingClientRect();

                    return (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        (
                            rect.top <= ( window.innerHeight ||
                                document.documentElement.clientHeight ) &&
                            rect.left <= ( window.innerWidth ||
                                document.documentElement.clientWidth )
                        ) ||
                        (
                            rect.bottom <= ( window.innerHeight ||
                                document.documentElement.clientHeight ) &&
                            rect.right <= ( window.innerWidth ||
                                document.documentElement.clientWidth )
                        )
                    );
                }

                function listener() {
                    if ( check() ) {
                        window.removeEventListener( 'scroll', listener );
                        load();
                    }
                }

                window.addEventListener( 'scroll', listener );

                listener();

            }
        };
    } );

}( this, this.define, this.require ) );

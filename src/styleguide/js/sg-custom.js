/**
 * sg-scripts.js
 */

var SGB = window.SGB || {};

( function( w, SGB, undefined ) {

    var doc = w.document,
        docEl = doc.documentElement;

    // Replace no-js class with js class
    docEl.className = docEl.className.replace( /no-js/gi, '' );
    docEl.className += ' js';

    // Cut the mustard
    if ( 'querySelector' in doc && Array.prototype.forEach ) {

        // TODO: chef if class is already on. reduced vies gets it twice
        // -jLaz
        docEl.className += ' sg-enhanced';

        // Syntactic sugar for querySelectorAll and event delegates courtesy
        // @paul_irish: https://gist.github.com/paulirish/12fb951a8b893a454b32
        var queryAll = document.querySelectorAll.bind( document );

        Node.prototype.on = window.on = function( name, fn ) {
            this.addEventListener( name, fn );
        };

        NodeList.prototype.forEach = Array.prototype.forEach;

        NodeList.prototype.on = NodeList.prototype.addEventListener = function( name, fn ) {
            this.forEach( function( elem, i ) {
                elem.on( name, fn );
            } );
        };

        /* jshint ignore:start */
        // Add functionality to toggle classes on elements
        function _hasClass( el, cl ) {
            var regex = new RegExp( '(?:\\s|^)' + cl + '(?:\\s|$)' );
            return !!el.className.match( regex );
        }

        function _addClass( el, cl ) {
            el.className += ' ' + cl;
        }

        function _removeClass( el, cl ) {
            var regex = new RegExp( '(?:\\s|^)' + cl );
            el.className = el.className.replace( regex, '' );
        }

        function _toggleClass( el, cl ) {
            _hasClass( el, cl ) ? _removeClass( el, cl ) : _addClass( el, cl );
        }
        /* jshint ignore:end */

        // Public methods
        SGB.toggleNav = function() {
            _toggleClass( docEl, 'nav-is-active' );
        };

        SGB.hideNav = function() {
            _removeClass( docEl, 'nav-is-active' );
        };

        // Source Code toggle
        // -jLaz

        var getNextSource = function( el ) {
            if ( el.parentElement === null ) {
                return false;
            } else if ( el.parentElement.nextElementSibling &&
                 el.parentElement.nextElementSibling.children.length > 0 &&
                 _hasClass( el.parentElement.nextElementSibling.children[ 0 ], 'sg-source' ) ) {
                return el.parentElement.nextElementSibling.children[ 0 ];
            } else {
                return getNextSource( el.parentElement );
            }
        };

        SGB.toggleSourceCode = function() {
            var sourceCode = getNextSource( this );
            if ( sourceCode instanceof HTMLElement ) {
                _toggleClass( sourceCode, 'sg-source-active' );
            }
        };

        // Source Code toggle Button

        SGB.toggleActiveCodeBtnClass = function() {
            var button = this;
            var buttonIcon = this.childNodes[ 1 ];
            _toggleClass( button, 'btn-active' );
            _toggleClass( buttonIcon, 'fa-code' );
            _toggleClass( buttonIcon, 'fa-times' );
        };

        // Documentation Toggle
        // -jLaz

        SGB.toggleActiveDocumentationBtnClass = function() {
            var button = this;
            var buttonIcon = this.childNodes[ 1 ];
            _toggleClass( button, 'btn-active' );
            _toggleClass( buttonIcon, 'fa-align-left' );
            _toggleClass( buttonIcon, 'fa-times' );
        };

        queryAll( '.sg-nav-toggle' ).on( 'click', SGB.toggleNav );
        //queryAll( '.sg-nav-group a' ).on( 'click', SGB.hideNav );
        queryAll( '.sg-btn--source' ).on( 'click', SGB.toggleSourceCode );
        queryAll( '.sg-btn--source' ).on( 'click', SGB.toggleActiveCodeBtnClass );
        queryAll( '.sg-btn--select' ).on( 'click', SGB.selectSourceCode );
        queryAll( '.btn-documentation' ).on( 'click', SGB.toggleActiveDocumentationBtnClass );
    }
}( this, SGB ) );

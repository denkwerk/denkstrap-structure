/**
 * sg-scripts.js
 */

var SGB = window.SGB || {};

( function( w, SGB, undefined ) {

    var doc = w.document,
        docEl = doc.documentElement,
        $stickies;

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

        // recalculate the height of the content of the current sg-section
        // so that the next sticky header knows its new position
        // when source code or documentation is toggled.
        // b/c the function in Instagram-Like sticky headers fires on documend.load
        // -jLaz & marius

        function _recalculateStickies() {
            $stickies.each( function() {
                var $thisSticky = $( this );

                $thisSticky
                    .data( 'originalPosition', $thisSticky.offset().top )
                    .data( 'originalHeight', $thisSticky.outerHeight() )
                    .parent()
                    .height( $thisSticky.outerHeight() );
            } );
        }

        /* jshint ignore:end */

        // Public methods
        SGB.toggleNav = function() {
            _toggleClass( docEl, 'nav-is-active' );
        };

        SGB.hideNav = function() {
            _removeClass( docEl, 'nav-is-active' );
        };

        // Bulk toggle options for documentation and source code
        // -jLaz

        $( '#sg-toggle-all-doc' ).on( 'click', function() {
            if ( $( this ).is( ':checked' ) ) {
                $( '.sg-btn-documentation' ).addClass( 'sg-btn-active' );
                $( '.sg-btn-documentation i' ).addClass( 'fa-times' );
                $( '.sg-btn-documentation i' ).removeClass( 'fa-align-left' );
                $( '.sg-documentation-container' ).addClass( 'sg-active' );
            } else {
                $( '.sg-btn-documentation' ).removeClass( 'sg-btn-active' );
                $( '.sg-btn-documentation i' ).removeClass( 'fa-times' );
                $( '.sg-btn-documentation i' ).addClass( 'fa-align-left' );
                $( '.sg-documentation-container' ).removeClass( 'sg-active' );
            }
        } );

        $( '#sg-toggle-all-source' ).on( 'click', function() {
            if ( $( this ).is( ':checked' ) ) {
                $( '.sg-btn--source' ).addClass( 'sg-btn-active' );
                $( '.sg-btn--source i' ).addClass( 'fa-times' );
                $( '.sg-btn--source i' ).removeClass( 'fa-code' );
                $( '.sg-source-container' ).addClass( 'sg-active' );
            } else {
                $( '.sg-btn--source' ).removeClass( 'sg-btn-active' );
                $( '.sg-btn--source i' ).removeClass( 'fa-times' );
                $( '.sg-btn--source i' ).addClass( 'fa-code' );
                $( '.sg-source-container' ).removeClass( 'sg-active' );
            }
        } );

        SGB.toggleAllDocumentation = function() {
            if ( document.getElementById( 'sg-toggle-all-doc' ).checked ) {
                _recalculateStickies();
            } else {
                _recalculateStickies();
            }
        };

        SGB.toggleAllSource = function() {
            if ( document.getElementById( 'sg-toggle-all-source' ).checked ) {
                _recalculateStickies();
            } else {
                _recalculateStickies();
            }
        };

        // Source Code toggle
        // REFACTOR THIS!
        // -jLaz

        /*var getNextSource = function( el ) {
            if ( el.parentElement === null ) {
                return false;
            } else if ( el.parentElement.parentElement.parentElement.parentElement
                        .nextElementSibling.nextElementSibling &&
                el.parentElement.parentElement.parentElement.parentElement
                .nextElementSibling.nextElementSibling.children.length > 0 &&
                 _hasClass( el.parentElement.parentElement.parentElement.parentElement
                            .nextElementSibling.nextElementSibling.children[ 0 ], 'sg-source' ) ) {
                return el.parentElement.parentElement.parentElement.parentElement
                       .nextElementSibling.nextElementSibling.children[ 0 ];
            } else {
                return getNextSource( el.parentElement.parentElement.parentElement.parentElement );
            }
        };

        SGB.toggleSourceCode = function() {
            var sourceCode = getNextSource( this );
            if ( sourceCode instanceof HTMLElement ) {
                _toggleClass( sourceCode, 'sg-source-active' );
                _recalculateStickies();
            }
        };*/

        // Documentation & Source Code Toggle
        // REFACTOR THIS!
        // -jLaz

        SGB.toggleActiveDocumentationBtnClass = function() {
            var button = this;
            var buttonIcon = this.childNodes[ 1 ];
            _toggleClass( button, 'sg-btn-active' );
            _toggleClass( buttonIcon, 'fa-align-left' );
            _toggleClass( buttonIcon, 'fa-times' );

            var thisContainer = $( this ).closest( '.sg-section' ).find( '.sg-documentation-container' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        SGB.toggleActiveSourceBtnClass = function() {
            var button = this;
            var buttonIcon = this.childNodes[ 1 ];
            _toggleClass( button, 'sg-btn-active' );
            _toggleClass( buttonIcon, 'fa-code' );
            _toggleClass( buttonIcon, 'fa-times' );

            var thisContainer = $( this ).closest( '.sg-section' ).find( '.sg-source-container' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        queryAll( '.sg-nav-toggle' ).on( 'click', SGB.toggleNav );
        queryAll( '.sg-nav-group a' ).on( 'click', SGB.hideNav );
        queryAll( '.sg-btn--source' ).on( 'click', SGB.toggleSourceCode );
        queryAll( '.sg-btn--source' ).on( 'click', SGB.toggleActiveCodeBtnClass );
        queryAll( '.sg-btn--select' ).on( 'click', SGB.selectSourceCode );
        queryAll( '.sg-btn-documentation' ).on( 'click', SGB.toggleActiveDocumentationBtnClass );
        queryAll( '.sg-btn--source' ).on( 'click', SGB.toggleActiveSourceBtnClass );
        queryAll( '#sg-toggle-all-doc' ).on( 'click', SGB.toggleAllDocumentation );
        queryAll( '#sg-toggle-all-source' ).on( 'click', SGB.toggleAllSource );

        // Instagram-Like sticky headers
        // https://codepen.io/sales/pen/oxqzOe
        // with modifications (comments)
        // -jLaz

        var stickyHeaders = ( function() {
            var $window = $( window );
            var load = function( stickies ) {

                if ( typeof stickies === 'object' && stickies instanceof jQuery && stickies.length > 0 ) {
                    $stickies = stickies.each( function() {
                        var $thisSticky = $( this ).wrap( '<div class="sticky-header-helper" />' );
                        $thisSticky
                            .data( 'originalPosition', $thisSticky.offset().top )
                            .data( 'originalHeight', $thisSticky.outerHeight() )
                            .parent()
                            .height( $thisSticky.outerHeight() );
                    } );

                    $window.off( 'scroll.stickies' ).on( 'scroll.stickies', function() {
                        _whenScrolling();
                    } );
                }
            };

            var _whenScrolling = function() {
                $stickies.each( function( i ) {
                    var $thisSticky = $( this ),
                        $stickyPosition = $thisSticky.data( 'originalPosition' );

                    if ( $stickyPosition <= $window.scrollTop() ) {
                        var $nextSticky = $stickies.eq( i + 1 ),
                            $nextStickyPosition = $nextSticky.data( 'originalPosition' ) -
                            $thisSticky.data( 'originalHeight' );
                        $thisSticky.addClass( 'fixed' );

                        if ( $nextSticky.length > 0 && $thisSticky.offset().top >= $nextStickyPosition ) {
                            $thisSticky.addClass( 'absolute' ).css( 'top', $nextStickyPosition );
                        }
                    } else {
                        var $prevSticky = $stickies.eq( i - 1 );
                        $thisSticky.removeClass( 'fixed' );

                        if ( $prevSticky.length > 0 &&
                            $window.scrollTop() <= $thisSticky.data( 'originalPosition' ) -
                                $thisSticky.data( 'originalHeight' ) ) {

                            // $prevSticky.removeClass("absolute").removeAttr("style");
                            // We still need the style attribute here b/c the element is still fixed
                            // and we don't want 100% width again. But since the Attribute was removed to get
                            // rid of the top value, we set top to zero
                            $prevSticky.removeClass( 'absolute' ).css( 'top', 0 );
                        }
                    }
                } );
            };

            return {
                    load: load
                };
        } )();

        // because we're responsive, we need to update the height value on the sticky headers

        $( window ).on( 'resize', function() {
            $( '.sticky-header-helper' ).height( $( '.sg-section-header' ).height() );
        } );

        // you can make it happen. You can make it REAL!
        $( function() {
            stickyHeaders.load( $( '.sg-section-header' ) );
        } );
    }
}( this, SGB ) );

/**
 * sg-custom-fullview.js
 */

var SGB = window.SGB || {};

( function( w, SGB, undefined ) {

    var doc = w.document; //html

    // Syntactic sugar for querySelectorAll and event delegates courtesy
    // @paul_irish: https://gist.github.com/paulirish/12fb951a8b893a454b32
    var queryAll = document.querySelectorAll.bind( document );

    // Cut the mustard
    if ( 'querySelector' in doc && Array.prototype.forEach ) {

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

        /**
         * Get the closest element for the given selector
         *
         * @param {HTMLElement} element
         * @param {String} selector
         * @return {HTMLElement|null}
         * @private
         */
        function _getClosest( element, selector ) {
            if ( !element ) {
                return null;
            }

            return element.matches( selector ) ? element :
                _getClosest( element.parentElement, selector );
        }

        /*
        ** recalculate the height of the content of the current sg-section
        ** so that the next sticky header knows its new position
        ** when source code or documentation is toggled.
        ** b/c the function in Instagram-Like sticky headers fires on documend.load
        ** -jLaz & mbuescher
        */

        function _recalculateStickies() {
            if ( navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1 ) {
                // no sticky headres for firefox
                // b/c there is a bug with the non-fixed elements and transform
            } else {
                stickyInfo.forEach( function( info ) {
                    info.originalHeight = info.el.scrollHeight;
                    info.originalPosition = info.el.getBoundingClientRect().top;
                    info.el.parentElement.style.height = info.el.scrollHeight + 'px';
                } );
            }
        }

        /* jshint ignore:end */

        /*
        ** Bulk toggle options for documentation and source code
        ** -jLaz & troth
        */

        var toggleAllDocBtn = document.querySelector( '#sg-toggle-all-doc' ),
            allDocBtns = document.querySelectorAll( '.js-sg-btn-documentation' ),
            allDocContainer = document.querySelectorAll( '.sg-documentation-container' );

        toggleAllDocBtn.addEventListener( 'click', function() {
            if ( toggleAllDocBtn.checked ) {
                Array.prototype.forEach.call( allDocBtns, function( button ) {
                    _addClass( button, 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allDocContainer, function( container ) {
                    _addClass( container, 'sg-active' );
                } );

                _recalculateStickies();
            } else {
                Array.prototype.forEach.call( allDocBtns, function( button ) {
                    _removeClass( button, 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allDocContainer, function( container ) {
                    _removeClass( container, 'sg-active' );
                } );

                _recalculateStickies();
            }
        } );

        var toggleAllSourceBtn = document.querySelector( '#sg-toggle-all-source' ),
            allSourceBtns = document.querySelectorAll( '.sg-btn-source' ),
            allSourceContainer = document.querySelectorAll( '.sg-source-container' );

        toggleAllSourceBtn.addEventListener( 'click', function() {
            if ( toggleAllSourceBtn.checked ) {
                Array.prototype.forEach.call( allSourceBtns, function( button ) {
                    button.classList.add( 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allSourceContainer, function( container ) {
                    container.classList.add( 'sg-active' );
                } );

                _recalculateStickies();
            } else {
                Array.prototype.forEach.call( allSourceBtns, function( button ) {
                    button.classList.remove( 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allSourceContainer, function( container ) {
                    container.classList.remove( 'sg-active' );
                } );

                _recalculateStickies();
            }
        } );

        /*
        ** Instagram-Like sticky headers
        ** https://codepen.io/sales/pen/oxqzOe
        ** with modifications (comments)
        ** -jLaz
        **
        ** Without jQuery! Bouyah!
        ** -mariusbuescher
        **/

        if ( navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1 ) {
            // no sticky headres for firefox
            // b/c there is a bug with the non-fixed elements and transform
        } else {

            var stickyInfo = [];

            var stickyHeaders = ( function() {
                var load = function( stickies ) {
                    stickyInfo = Array.prototype.map.call( stickies, function( el ) {
                        var wrapper = document.createElement( 'div' );
                        wrapper.classList.add( 'js-sticky-header-helper' );

                        el.parentElement.insertBefore( wrapper, el.parentElement.children[ 0 ] );
                        wrapper.appendChild( el );

                        wrapper.style.height = el.scrollHeight + 'px';

                        return {
                            el: el,
                            originalHeight: el.scrollHeight,
                            originalPosition: el.getBoundingClientRect().top
                        };
                    } );

                    window.addEventListener( 'scroll', function() {
                        _whenScrolling();
                    } );
                };

                var _whenScrolling = function() {
                    stickyInfo.forEach( function( info, i ) {
                        var nextSticky = stickyInfo[ i + 1 ];
                        var nextStickyPosition = info.originalPosition - window.scrollY;

                        if ( nextStickyPosition <= 0 ) {
                            info.el.classList.add( 'fixed' );
                            if ( nextSticky.originalPosition - window.scrollY - info.originalHeight < 0 ) {
                                info.el.style.top =
                                    ( nextSticky.originalPosition - window.scrollY - info.originalHeight ) + 'px';
                            } else {
                                info.el.style.top = null;
                            }
                        } else {
                            info.el.classList.remove( 'fixed' );
                        }
                    } );
                };

                return {
                        load: load
                    };
            } )();

            // because we're responsive, we need to update the height value on the sticky headers
            window.addEventListener( 'resize', function() {
                var stickyHeaderHelper = document.querySelector( '.js-sticky-header-helper' );

                stickyHeaderHelper.style.height = document.querySelector( '.js-sg-section-header' ).clientHeight + 'px';
            } );

            // sticky headers - you can make it happen. You can make it REAL!
            $( function() {
                stickyHeaders.load( document.querySelectorAll( '.js-sg-section-header' ) );
            } );

            // recalculate the sticky headers again after we toggle one of the documentation or source buttons
            SGB.recalculateStickiesOnDocumentationToggleBtn = function() {
                var thisContainer = _getClosest( this, '.js-sg-section' )
                    .querySelector( '.js-sg-documentation-container' );
                thisContainer.addEventListener( 'transitionend', function( event ) {
                    _recalculateStickies();
                } );
            };

            SGB.recalculateStickiesOnSourceToggleBtn = function() {
                var thisContainer = _getClosest( this, '.js-sg-section' )
                    .querySelector( '.js-sg-source-container' );
                thisContainer.addEventListener( 'transitionend', function( event ) {
                    _recalculateStickies();
                } );
            };

            Array.prototype.forEach.call( queryAll( '.js-sg-btn-documentation' ), function( el ) {
                el.addEventListener( 'click', SGB.recalculateStickiesOnDocumentationToggleBtn );
            } );

            Array.prototype.forEach.call( queryAll( '.js-sg-btn-source' ), function( el ) {
                el.addEventListener( 'click', SGB.recalculateStickiesOnSourceToggleBtn );
            } );
        }

        /*
        ** init iframe resizer
        ** https://github.com/davidjbradshaw/iframe-resizer
        ** http://davidjbradshaw.github.io/iframe-resizer/
        */

        var iframeResize = iFrameResize( {
            //hide timeout warnings
            warningTimeout: 0,
            // include pos: absolute elements and bigger elements coming in when interacting with sth
            heightCalculationMethod: 'min',
            // recalcilate the sticky headers
            initCallback: function() {
                _recalculateStickies();

                $( this ).bind( 'transitionend', function( event ) {
                    _recalculateStickies();
                } );
            },
            resizedCallback: function() {
                _recalculateStickies();

                $( this ).bind( 'transitionend', function( event ) {
                    _recalculateStickies();
                } );
            }
        }, 'iframe' );

        // All the stuff I can't do in vanilla js b/c I'm a noob.
        // REFACTOR THIS!
        // -jLaz

        // some navigation magic

        var lv0LinkParent = $( '.sg-nav-link-lv-0.js-sg-nav-link-parent' );
        var lv1activeClass = 'nav-lv1-is-active';
        var closeLV1Button = $( '.js-sg-sub-nav-toggle' );
        var navShowItemClass = 'sg-show-item';
        var navShowItemSelector = '.' + navShowItemClass;

        var current;

        var activeClass = 'active';

        /*
        ** highlight active section in navigation
        ** useful???
        */

        Array.prototype.forEach.call( document.querySelectorAll( '.js-sg-section' ), function( section ) {
            section.addEventListener( 'mouseenter', function( event ) {
                var anchor = event.currentTarget.querySelector( '.js-sg-section-anchor' ),
                    id = anchor ? anchor.id : null;

                Array.prototype.forEach.call( document.querySelectorAll( '[href="#' + id + '"]' ), function( link ) {
                    link.classList.add( activeClass );
                } );
            } );

            section.addEventListener( 'mouseleave', function( event ) {
                var anchor = event.currentTarget.querySelector( '.js-sg-section-anchor' ),
                    id = anchor ? anchor.id : null;

                Array.prototype.forEach.call( document.querySelectorAll( '[href="#' + id + '"]' ), function( link ) {
                    link.classList.remove( activeClass );
                } );
            } );
        } );

        /*
        ** toggle navigation container when we click the menu/close button
        ** and also when we click on a nav link
        */

        var html = document.querySelector( 'html' );

        var toggleNavigationContainer = function() {
            _toggleClass( html, 'nav-is-active' );
        };

        var toggleOpeningClosingClass = function() {
            if ( _hasClass( html, 'nav-opened' ) ) {
                _removeClass( html, 'nav-opened' );
                _addClass( html, 'nav-closing' );

                $( '.sg-navigation-container' ).one( 'transitionend', function( event ) {
                    _removeClass( html, 'nav-closing' );
                    _addClass( html, 'nav-closed' );
                } );

            } else {
                _removeClass( html, 'nav-closed' );
                _addClass( html, 'nav-opening' );

                $( '.sg-navigation-container' ).one( 'transitionend', function( event ) {
                    _removeClass( html, 'nav-opening' );
                    _addClass( html, 'nav-opened' );
                } );
            }
        };

        Array.prototype.forEach.call( queryAll( '.js-sg-nav-toggle' ), function( el ) {
            el.addEventListener( 'click', toggleNavigationContainer );
            el.addEventListener( 'click', toggleOpeningClosingClass );
        } );

        Array.prototype.forEach.call( queryAll( '.js-sg-nav-link-child' ), function( el ) {
            el.addEventListener( 'click', toggleNavigationContainer );
            el.addEventListener( 'click', toggleOpeningClosingClass );
        } );

        /**/

        var navLinkParent = '.js-sg-nav-link-parent';
        var navOpenedClass = 'sg-nav-opened';
        var navOpenedSelector = '.' + navOpenedClass;

        $( document ).on( 'click', navLinkParent, function() {

            current = this;

            /*
            ** Open the current next level list.
            */

            var thisSiblingItem = $( this ).siblings().find( '> .js-sg-nav-item' );
            thisSiblingItem.toggleClass( 'sg-show-item' );
            //_toggleClass( thisSiblingItem, 'sg-show-item' );

            /*
            ** add an extra class b/c the icon toggle is buggy when it comes to multiple levels
            */

            _toggleClass( this, navOpenedClass );

            /*
            ** detect if nav-text has more than one line and if yes, add class multiline
            */

            var $navText = $( '.js-sg-nav-text' );

            $navText.each( function() {
                if ( $( this ).height() > 30 ) {
                    $( this ).parent().addClass( 'multiline' );
                }
            } );
        } );

        // extra class in action: using this to find all items with mius icons
        // to resolve the bug where lv1 items were still on minus when closed.
        // b/c of that, the next toggle gave them the plus icon but they were then open
        // so it was the opposite way around.
        // -jLaz

        $( document ).on( 'click', navOpenedSelector, function() {

            $( this ).removeClass( navOpenedClass );
            $( this ).parent().find( navOpenedSelector ).removeClass( navOpenedClass );
            $( this ).parent().find( navShowItemSelector ).removeClass( navShowItemClass );

        } );

        // media query event handler for screen <=768px
        // https://www.sitepoint.com/javascript-media-queries/
        // -jLaz

        if ( matchMedia ) {
            var toMQ = window.matchMedia( '(max-width: 768px)' );
            toMQ.addListener( WidthChange );
            WidthChange( toMQ );
        }

        // media query change
        function WidthChange( toMQ ) {
            if ( toMQ.matches ) {

                // add an active class for lv1 navigation

                lv0LinkParent.on( 'click', function() {

                    if ( $( 'html' ).hasClass( lv1activeClass ) ) {
                        //
                    } else {
                        $( 'html' ).addClass( lv1activeClass );
                    }

                } );

                // mobile nav close button for lv1

                closeLV1Button.on( 'click', function( event ) {

                    $( 'html' ).removeClass( lv1activeClass );

                    // we cant use .toggle here b/c this leads to problematic behaviour
                    // so we need to do special things for speacial elements

                    var navList = $( current ).siblings( '.sg-nav-list' );

                    if ( navList.hasClass( 'sg-nav-lv-1' ) ) {
                        navList.one( 'transitionend', function( event ) {

                            $( event.target ).find( navShowItemSelector ).removeClass( navShowItemClass );
                            $( navOpenedSelector ).removeClass( activeClass ).removeClass( navOpenedClass );

                        } );
                    } else {
                        $( navOpenedSelector + ' + .sg-nav-lv-1' ).one( 'transitionend', function( event ) {

                            $( event.target ).find( navShowItemSelector ).removeClass( navShowItemClass );
                            $( navOpenedSelector ).removeClass( activeClass ).removeClass( navOpenedClass );

                        } );
                    }

                } );

            } else {
                // window width is >=769px
            }

        }

        /*
        ** Responsive iframe view
        ** jLaz
        */

        var iframes = document.querySelectorAll( 'iframe' );

        var changeIframeWidth = function( event ) {
            var newWidth = event.currentTarget.getAttribute( 'data-width' ),
                navigationContainer = document.querySelector( '.sg-navigation-container' ),
                buttonActiveClass = 'sg-btn-active',
                responsiveToggleButton = document.querySelector(
                    '.js-sg-btn-responsive-toggle.' + buttonActiveClass
                );

            Array.prototype.forEach.call( iframes, function( iframe ) {

                // add this class to html for styling purposes
                // we have a modal showing up from closing navigation till resizing iframe width & height
                html.classList.add( 'sg-refreshing-modules-modal' );

                // resize iframe width after navigation has closed
                navigationContainer.addEventListener( 'transitionend', function( event ) {
                    iframe.style.width = newWidth;
                } );

                // resize iframe height after iframe width is done
                // also recalculate the sticky headers and remove the styling class
                iframe.addEventListener( 'transitionend', function( event ) {
                    iframe.iFrameResizer.resize();
                    _recalculateStickies();
                    html.classList.remove( 'sg-refreshing-modules-modal' );
                } );

                // set active class to clicked button

                if ( responsiveToggleButton ) {
                    responsiveToggleButton.classList.remove( buttonActiveClass );
                    responsiveToggleButton.removeAttribute( 'disabled', 'disabled' );
                }
                event.currentTarget.classList.add( buttonActiveClass );
                event.currentTarget.setAttribute( 'disabled', 'disabled' );
            } );
        };

        Array.prototype.forEach.call( queryAll( '.js-sg-btn-responsive-toggle' ), function( el ) {
            el.addEventListener( 'click', changeIframeWidth );
            el.addEventListener( 'click', toggleNavigationContainer );
            el.addEventListener( 'click', toggleOpeningClosingClass );
        } );

    }
}( this, SGB ) );


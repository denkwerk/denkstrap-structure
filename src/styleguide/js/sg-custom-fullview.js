/**
 * sg-custom-fullview.js
 */

var SGB = window.SGB || {};

( function( w, SGB, undefined ) {

    var doc = w.document,
        docEl = doc.documentElement, //html
        $stickies;

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
                $stickies.each( function() {
                    var $thisSticky = $( this );

                    $thisSticky
                        .data( 'originalPosition', $thisSticky.offset().top )
                        .data( 'originalHeight', $thisSticky.outerHeight() )
                        .parent()
                        .height( $thisSticky.outerHeight() );
                } );
            }
        }

        /* jshint ignore:end */

        /*
        ** Bulk toggle options for documentation and source code
        ** -jLaz & troth
        */

        var toggleAllDocBtn = document.getElementById( 'sg-toggle-all-doc' ),
            allDocBtns = document.getElementsByClassName( 'js-sg-btn-documentation' ),
            allDocContainer = document.getElementsByClassName( 'sg-documentation-container' );

        toggleAllDocBtn.addEventListener( 'click', function() {
            if ( toggleAllDocBtn.checked ) {
                Array.prototype.forEach.call( allDocBtns, function( button ) {
                    _addClass( button, 'sg-btn-active');
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

        var toggleAllSourceBtn = document.getElementById( 'sg-toggle-all-source' ),
            allSourceBtns = document.getElementsByClassName( 'sg-btn-source' ),
            allSourceContainer = document.getElementsByClassName( 'sg-source-container' );

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
        */

        if ( navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1 ) {
            // no sticky headres for firefox
            // b/c there is a bug with the non-fixed elements and transform
        } else {

            var stickyHeaders = ( function() {
                var $window = $( window );
                var load = function( stickies ) {

                    if ( typeof stickies === 'object' && stickies instanceof jQuery && stickies.length > 0 ) {
                        $stickies = stickies.each( function() {
                            var $thisSticky = $( this ).wrap( '<div class="js-sticky-header-helper" />' );
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

                                $prevSticky.removeClass( 'absolute' ).removeAttr( 'style' );
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
                $( '.js-sticky-header-helper' ).height( $( '.js-sg-section-header' ).height() );
            } );

            // sticky headers - you can make it happen. You can make it REAL!
            $( function() {
                stickyHeaders.load( $( '.js-sg-section-header' ) );
            } );

            // recalculate the sticky headers again after we toggle one of the documentation or source buttons
            SGB.recalculateStickiesOnDocumentationToggleBtn = function() {
                var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-documentation-container' );
                thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                    _recalculateStickies();
                } );
            };

            SGB.recalculateStickiesOnSourceToggleBtn = function() {
                var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-source-container' );
                thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
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
        */

        var iframes = iFrameResize( {
            //hide timeout warnings
            warningTimeout: 0,
            // include pos: absolute elements and bigger elements coming in when interacting with sth
            heightCalculationMethod: 'max',
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
        var activeSelector = '.' + activeClass;

        /*
        ** highlight active section in navigation
        */

        $( document ).ready( function() {

            $( '.js-sg-section' ).mouseenter( function() {
                var id = $( this ).find( '.js-sg-section-anchor' ).attr( 'id' ),
                    navigationlinks = document.querySelector( '.js-sg-nav-link-child' );

                _removeClass( navigationlinks, activeClass );
                //_addClass( '[href=#' + id + ']', 'activeClass' );
                $( '[href=#' + id + ']' ).addClass( activeClass );
            } );

        } );

        /* 
        ** toggle navigation container when we click the menu/close button
        ** and also when we click on a nav link
        */

        var html = document.querySelector( 'html' )
            zIndexClass = 'nav-z-index';


        var toggleNavigationContainer = function() {
            _toggleClass( html, 'nav-is-active' );
        };

        var addNavigationZIndex = function() {
            _addClass( html, 'nav-z-index' );
        };

        var removeNavigationZIndex = function() {
            _removeClass( html, 'nav-z-index' );
        };

        var toggleNavigationZIndex = function( event ) {
            if ( _hasClass( html, 'nav-z-index' ) ) {
                removeNavigationZIndex();
            } else {
                //queryAll( '.sg-navigation-container' ).one( 'transitionend', function( event ) {
                $( '.sg-navigation-container' ).one( 'transitionend', function( event ) {
                    addNavigationZIndex();
                } );
            }
        };

        Array.prototype.forEach.call( queryAll( '.js-sg-nav-toggle' ), function( el ) {
            el.addEventListener( 'click', toggleNavigationContainer );
            el.addEventListener( 'click', toggleNavigationZIndex );
        } );

        Array.prototype.forEach.call( queryAll( '.js-sg-nav-link-child' ), function( el ) {
            el.addEventListener( 'click', toggleNavigationContainer );
            el.addEventListener( 'click', removeNavigationZIndex );
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

            var thisSiblingItem = $(this).siblings().find( '> .js-sg-nav-item' );
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

    }
}( this, SGB ) );


/**
 * sg-custom-fullview.js
 */

var SGB = window.SGB || {};

( function( w, SGB, undefined ) {

    var doc = w.document,
        docEl = doc.documentElement,
        $stickies;

    // Replace no-js class with js class
    docEl.className = docEl.className.replace( /no-js/gi, '' );
    docEl.className += ' js';

    // Syntactic sugar for querySelectorAll and event delegates courtesy
    // @paul_irish: https://gist.github.com/paulirish/12fb951a8b893a454b32
    var queryAll = document.querySelectorAll.bind( document );

    // Cut the mustard
    if ( 'querySelector' in doc && Array.prototype.forEach ) {

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

        // Bulk toggle options for documentation and source code
        // -jLaz & troth

        var toggleAllDocBtn = document.getElementById( 'sg-toggle-all-doc' ),
            allDocBtns = document.getElementsByClassName( 'js-sg-btn-documentation' ),
            allDocContainer = document.getElementsByClassName( 'sg-documentation-container' );

        toggleAllDocBtn.addEventListener( 'click', function() {
            if ( toggleAllDocBtn.checked ) {
                Array.prototype.forEach.call( allDocBtns, function( button ) {
                    button.classList.add( 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allDocContainer, function( container ) {
                    container.classList.add( 'sg-active' );
                } );

                _recalculateStickies();
            } else {
                Array.prototype.forEach.call( allDocBtns, function( button ) {
                    button.classList.remove( 'sg-btn-active' );
                } );

                Array.prototype.forEach.call( allDocContainer, function( container ) {
                    container.classList.remove( 'sg-active' );
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

        // Instagram-Like sticky headers
        // https://codepen.io/sales/pen/oxqzOe
        // with modifications (comments)
        // -jLaz

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
            $( '.js-sticky-header-helper' ).height( $( '.js-sg-section-header' ).height() );
        } );

        // you can make it happen. You can make it REAL!
        $( function() {
            stickyHeaders.load( $( '.js-sg-section-header' ) );
        } );

        // recalculate the sticky headers again after we toggle one of the documentation or source buttons
        SGB.recalculateStickiesOnDocumentationToggleBtn = function() {
            var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-documentation-container' );

            thisContainer.toggleClass( 'sg-active' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        SGB.recalculateStickiesOnSourceToggleBtn = function() {
            var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-source-container' );

            thisContainer.toggleClass( 'sg-active' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        queryAll( '.js-sg-btn-documentation' ).on( 'click', SGB.recalculateStickiesOnDocumentationToggleBtn );
        queryAll( '.js-sg-btn-source' ).on( 'click', SGB.recalculateStickiesOnSourceToggleBtn );

        // init iframe resizer
        $( 'iframe' ).iFrameResize( {
            warningTimeout: 0, //hide timeout warnings
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
        } );

    }
}( this, SGB ) );

// All the stuff I can't do in vanilla js b/c I'm a noob.
// REFACTOR THIS!
// -jLaz

var activeClass = 'active';
var activeSelector = '.' + activeClass;

var navLinkParent = '.js-sg-nav-link-parent';

$( document ).ready( function() {
    // highlight active section in navi
    $( '.js-sg-section' ).mouseenter( function() {
        var id = $( this ).find( '.js-sg-section-anchor' ).attr( 'id' );

        $( 'a' ).removeClass( activeClass );
        $( '[href=#' + id + ']' ).addClass( activeClass );
    } );

    // initial nav toggle to archieve display:none on all li's
    $( navLinkParent ).siblings().children().toggle();

} );

// some navigation magic
// -jLaz

var navOpenedClass = 'js-sg-nav-opened';
var navOpenedSelector = '.' + navOpenedClass;

$( document ).on( 'click', navLinkParent, function() {

    // this opens the li's again but just the next level
    $( this ).parent().find( '.js-sg-nav-item' ).toggle();

    // adding an active class to the item
    $( this ).toggleClass( activeClass );

    // adding an extra class b/c the icon toggle is buggy when it comes to multiple levels
    $( this ).addClass( navOpenedClass );

    // detect if nav-text has more than one line and if yes, add class multiline
    var $navText = $( '.js-sg-nav-text' );

    $navText.each( function() {
        if ( $( this ).height() > 30 ) {
            $( this ).parent().addClass( 'multiline' );
        }
    } );
} );

// extra class in action: using this to find all fa-mius Icons
// to resolve the bug where lv1 items were still on fa-minus even when closed.
// b/c of that, the next toggle gave them fa-plus but they were then open
// so it was the opposite way around.
// also remove all active classes.
// -jLaz

$( document ).on( 'click', navOpenedSelector, function() {
    $( this ).parent().find( activeSelector ).removeClass( activeClass );
    $( this ).removeClass( navOpenedClass );
    $( this ).parent().find( navOpenedSelector ).removeClass( navOpenedClass );
} );

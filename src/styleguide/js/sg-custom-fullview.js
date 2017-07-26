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
        } );

    }
}( this, SGB ) );

// All the stuff I can't do in vanilla js b/c I'm a noob.
// REFACTOR THIS!
// -jLaz

var navLinkParent = '.js-sg-nav-link-parent';
var activeClass = 'active';
var activeSelector = '.' + activeClass;
var navOpenedClass = 'js-sg-nav-opened sg-nav-opened';
var navOpenedSelector = '.' + navOpenedClass;

var lv0LinkParent = $( '.sg-nav-link-lv-0.js-sg-nav-link-parent' );
var lv1activeClass = 'nav-lv1-is-active';
var closeLV1Button = $( '.js-sg-sub-nav-toggle' );
var navShowItemClass = 'sg-show-item';
var navShowItemSelector = '.' + navShowItemClass;

var current;

$( document ).ready( function() {

    // highlight active section in navi
    $( '.js-sg-section' ).mouseenter( function() {
        var id = $( this ).find( '.js-sg-section-anchor' ).attr( 'id' );

        $( 'a' ).removeClass( activeClass );
        $( '[href=#' + id + ']' ).addClass( activeClass );
    } );

    // initial nav toggle to archieve display:none on li's
    //$( navLinkParent ).siblings().children().toggle();

} );

// some navigation magic
// -jLaz

$( document ).on( 'click', navLinkParent, function() {

    current = this;

    // this opens the li's again but just the next level
    $( this ).siblings().find( '> .js-sg-nav-item' ).toggleClass( 'sg-show-item' );

    // adding an active class to the item
    //$( this ).toggleClass( activeClass );

    // adding an extra class b/c the icon toggle is buggy when it comes to multiple levels
    $( this ).toggleClass( navOpenedClass );
    console.log( 'navOpenedClass toggled' );

    // detect if nav-text has more than one line and if yes, add class multiline
    var $navText = $( '.js-sg-nav-text' );

    $navText.each( function() {
        if ( $( this ).height() > 30 ) {
            $( this ).parent().addClass( 'multiline' );
        }
    } );
} );

// extra class in action: using this to find all mius Icons
// to resolve the bug where lv1 items were still on minus even when closed.
// b/c of that, the next toggle gave them fa-plus but they were then open
// so it was the opposite way around.
// also remove all active classes.
// -jLaz

$( document ).on( 'click', navOpenedSelector, function() {

    $( this ).removeClass( navOpenedClass );
    $( this ).parent().find( navOpenedSelector ).removeClass( navOpenedClass );
    console.log( 'navOpenedClass removed this' );

    $( this ).parent().find( activeSelector ).removeClass( activeClass );

} );

// add an active class for lv1 navigation
// TODO <1025px only

lv0LinkParent.on( 'click', function() {

    if ( $( 'html' ).hasClass( lv1activeClass ) ) {
        $( 'html' ).removeClass( lv1activeClass );
    } else {
        $( 'html' ).addClass( lv1activeClass );
    }

} );

closeLV1Button.on( 'click', function( event ) {

    console.log( 'click' );
    console.log( current );

    $( 'html' ).removeClass( lv1activeClass );

    // we cant use .toggle here b/c this leads to problematic behaviour
    // so we need to do special things for speacial elements

    var navList = $( current ).siblings( '.sg-nav-list' );
    console.log( navList );

    /*
    navList.one( 'transitionend', function( event ) {
        console.log( 'is lv1' );
        console.log( event.target );
        console.log( 'transitionend' );

        $( event.target ).find( '.sg-show-item' ).removeClass('sg-show-item');
        $( 'h3.js-sg-nav-opened' ).removeClass( activeClass ).removeClass( navOpenedClass );

        console.log('navOpenedClass removed');
    } );
    */

    if ( navList.hasClass( 'sg-nav-lv-1' ) ) {
        navList.one( 'transitionend', function( event ) {
            console.log( 'is lv1' );
            console.log( event.target );
            console.log( 'transitionend' );

            $( event.target ).find( navShowItemSelector ).removeClass( navShowItemClass );
            $( 'h3.js-sg-nav-opened' ).removeClass( activeClass ).removeClass( navOpenedClass );

            console.log( 'navOpenedClass removed' );
        } );
    } else {

        $( '.js-sg-nav-opened + .sg-nav-lv-1' ).one( 'transitionend', function( event ) {
            console.log( 'is not lv1' );
            console.log( event.target );
            console.log( 'transitionend' );

            $( event.target ).find( navShowItemSelector ).removeClass( navShowItemClass );
            $( 'h3.js-sg-nav-opened' ).removeClass( activeClass ).removeClass( navOpenedClass );

            console.log( 'navOpenedClass lv2 removed' );
        } );
    }

} );

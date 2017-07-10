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

        // Toggle Navigation container

        SGB.toggleNav = function() {
            _toggleClass( docEl, 'nav-is-active' );
        };

        SGB.hideNav = function() {
            _removeClass( docEl, 'nav-is-active' );
        };

        queryAll( '.sg-nav-toggle' ).on( 'click', SGB.toggleNav );
        queryAll( '.sg-nav-group a' ).on( 'click', SGB.hideNav );

        // Bulk toggle options for documentation and source code
        // -jLaz & troth

        var toggleAllDocBtn = document.getElementById( 'sg-toggle-all-doc' ),
            allDocBtns = document.getElementsByClassName( 'sg-btn-documentation' ),
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

        // Single toggles for documentation and source code
        // -jLaz

        SGB.toggleSingleDocBtn = function() {
            var button = this,
                buttonIcon = this.childNodes[ 1 ];

            _toggleClass( button, 'sg-btn-active' );

            var thisContainer = $( this ).closest( '.sg-section' ).find( '.sg-documentation-container' );

            thisContainer.toggleClass( 'sg-active' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        queryAll( '.sg-btn-documentation' ).on( 'click', SGB.toggleSingleDocBtn );

        SGB.toggleSingleSourceBtn = function() {
            var button = this,
                buttonIcon = this.childNodes[ 1 ];

            _toggleClass( button, 'sg-btn-active' );

            var thisContainer = $( this ).closest( '.sg-section' ).find( '.sg-source-container' );

            thisContainer.toggleClass( 'sg-active' );
            thisContainer[ 0 ].addEventListener( 'transitionend', function( event ) {
                _recalculateStickies();
            } );
        };

        queryAll( '.sg-btn-source' ).on( 'click', SGB.toggleSingleSourceBtn );

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

        /*!
         * @copyright Copyright (c) 2017 IcoMoon.io
         * @license   Licensed under MIT license
         *            See https://github.com/Keyamoon/svgxuse
         * @version   1.2.2
         */
        /*jslint browser: true */
        /*global XDomainRequest, MutationObserver, window */
        ( function() {
            'use strict';
            if ( window && window.addEventListener ) {
                var cache = Object.create( null ); // holds xhr objects to prevent multiple requests
                var checkUseElems;
                var tid; // timeout id
                var debouncedCheck = function() {
                    clearTimeout( tid );
                    tid = setTimeout( checkUseElems, 100 );
                };
                var unobserveChanges = function() {
                    return;
                };
                var observeChanges = function() {
                    var observer;
                    window.addEventListener( 'resize', debouncedCheck, false );
                    window.addEventListener( 'orientationchange', debouncedCheck, false );
                    if ( window.MutationObserver ) {
                        observer = new MutationObserver( debouncedCheck );
                        observer.observe( document.documentElement, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        } );
                        unobserveChanges = function() {
                            try {
                                observer.disconnect();
                                window.removeEventListener( 'resize', debouncedCheck, false );
                                window.removeEventListener( 'orientationchange', debouncedCheck, false );
                            } catch ( ignore ) {}
                        };
                    } else {
                        document.documentElement.addEventListener( 'DOMSubtreeModified', debouncedCheck, false );
                        unobserveChanges = function() {
                            document.documentElement.removeEventListener( 'DOMSubtreeModified', debouncedCheck, false );
                            window.removeEventListener( 'resize', debouncedCheck, false );
                            window.removeEventListener( 'orientationchange', debouncedCheck, false );
                        };
                    }
                };
                var createRequest = function( url ) {
                    // In IE 9, cross origin requests can only be sent using XDomainRequest.
                    // XDomainRequest would fail if CORS headers are not set.
                    // Therefore, XDomainRequest should only be used with cross origin requests.
                    function getOrigin( loc ) {
                        var a;
                        if ( loc.protocol !== undefined ) {
                            a = loc;
                        } else {
                            a = document.createElement( 'a' );
                            a.href = loc;
                        }
                        return a.protocol.replace( /:/g, '' ) + a.host;
                    }
                    var Request;
                    var origin;
                    var origin2;
                    if ( window.XMLHttpRequest ) {
                        Request = new XMLHttpRequest();
                        origin = getOrigin( location );
                        origin2 = getOrigin( url );
                        if ( Request.withCredentials === undefined && origin2 !== '' && origin2 !== origin ) {
                            Request = XDomainRequest || undefined;
                        } else {
                            Request = XMLHttpRequest;
                        }
                    }
                    return Request;
                };
                var xlinkNS = 'http://www.w3.org/1999/xlink';
                checkUseElems = function() {
                    var base;
                    var bcr;
                    var fallback = '';
                    var hash;
                    var href;
                    var i;
                    var inProgressCount = 0;
                    var isHidden;
                    var isXlink = false;
                    var Request;
                    var url;
                    var uses;
                    var xhr;
                    function observeIfDone() {
                        // If done with making changes, start watching for chagnes in DOM again
                        inProgressCount -= 1;
                        if ( inProgressCount === 0 ) { // if all xhrs were resolved
                            unobserveChanges(); // make sure to remove old handlers
                            observeChanges(); // watch for changes to DOM
                        }
                    }
                    function attrUpdateFunc( spec ) {
                        return function() {
                            if ( cache[ spec.base ] !== true ) {
                                if ( spec.isXlink ) {
                                    spec.useEl.setAttributeNS( xlinkNS, 'xlink:href', '#' + spec.hash );
                                } else {
                                    spec.useEl.setAttribute( 'href', '#' + spec.hash );
                                }
                            }
                        };
                    }
                    function onloadFunc( xhr ) {
                        return function() {
                            var body = document.body;
                            var x = document.createElement( 'x' );
                            var svg;
                            xhr.onload = null;
                            x.innerHTML = xhr.responseText;
                            svg = x.getElementsByTagName( 'svg' )[ 0 ];
                            if ( svg ) {
                                svg.setAttribute( 'aria-hidden', 'true' );
                                svg.style.position = 'absolute';
                                svg.style.width = 0;
                                svg.style.height = 0;
                                svg.style.overflow = 'hidden';
                                body.insertBefore( svg, body.firstChild );
                            }
                            observeIfDone();
                        };
                    }
                    function onErrorTimeout( xhr ) {
                        return function() {
                            xhr.onerror = null;
                            xhr.ontimeout = null;
                            observeIfDone();
                        };
                    }
                    unobserveChanges(); // stop watching for changes to DOM
                    // find all use elements
                    uses = document.getElementsByTagName( 'use' );
                    for ( i = 0; i < uses.length; i += 1 ) {
                        try {
                            bcr = uses[ i ].getBoundingClientRect();
                        } catch ( ignore ) {
                            // failed to get bounding rectangle of the use element
                            bcr = false;
                        }
                        href = uses[ i ].getAttribute( 'href' );
                        if ( !href ) {
                            href = uses[ i ].getAttributeNS( xlinkNS, 'href' );
                            isXlink = true;
                        } else {
                            isXlink = false;
                        }
                        if ( href && href.split ) {
                            url = href.split( '#' );
                        } else {
                            url = [ '', '' ];
                        }
                        base = url[ 0 ];
                        hash = url[ 1 ];
                        isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;
                        if ( bcr && bcr.width === 0 && bcr.height === 0 && !isHidden ) {
                            // the use element is empty
                            // if there is a reference to an external SVG, try to fetch it
                            // use the optional fallback URL if there is no reference to an external SVG
                            if ( fallback && !base.length && hash && !document.getElementById( hash ) ) {
                                base = fallback;
                            }
                            if ( base.length ) {
                                // schedule updating xlink:href
                                xhr = cache[ base ];
                                if ( xhr !== true ) {
                                    // true signifies that prepending the SVG was not required
                                    setTimeout( attrUpdateFunc( {
                                        useEl: uses[ i ],
                                        base: base,
                                        hash: hash,
                                        isXlink: isXlink
                                    } ), 0 );
                                }
                                if ( xhr === undefined ) {
                                    Request = createRequest( base );
                                    if ( Request !== undefined ) {
                                        xhr = new Request();
                                        cache[ base ] = xhr;
                                        xhr.onload = onloadFunc( xhr );
                                        xhr.onerror = onErrorTimeout( xhr );
                                        xhr.ontimeout = onErrorTimeout( xhr );
                                        xhr.open( 'GET', base );
                                        xhr.send();
                                        inProgressCount += 1;
                                    }
                                }
                            }
                        } else {
                            if ( !isHidden ) {
                                if ( cache[ base ] === undefined ) {
                                    // remember this URL if the use element was not empty and no request was sent
                                    cache[ base ] = true;
                                } else if ( cache[ base ].onload ) {
                                    // if it turns out that prepending the SVG is not necessary,
                                    // abort the in-progress xhr.
                                    cache[ base ].abort();
                                    delete cache[ base ].onload;
                                    cache[ base ] = true;
                                }
                            } else if ( base.length && cache[ base ] ) {
                                setTimeout( attrUpdateFunc( {
                                    useEl: uses[ i ],
                                    base: base,
                                    hash: hash,
                                    isXlink: isXlink
                                } ), 0 );
                            }
                        }
                    }
                    uses = '';
                    inProgressCount += 1;
                    observeIfDone();
                };
                // The load event fires when all resources have finished loading,
                // which allows detecting whether SVG use elements are empty.
                window.addEventListener( 'load', function winLoad() {
                    window.removeEventListener( 'load', winLoad, false ); // to prevent memory leaks
                    tid = setTimeout( checkUseElems, 0 );
                }, false );
            }
        }() );

    }
}( this, SGB ) );

// All the stuff I can't do in vanilla js b/c I'm a noob.
// REFACTOR THIS!
// -jLaz

$( document ).ready( function() {
    // highlight active section in navi
    $( '.sg-section' ).mouseenter( function() {
        var id = $( this ).find( '.sg-section-anchor' ).attr( 'id' );
        $( 'a' ).removeClass( 'active' );
        $( '[href=#' + id + ']' ).addClass( 'active' );
    } );

    // collapse navi
    $( '.sg-navigation .sg-nav-group h3.sg-nav-link' ).siblings().children().toggle();

    // do this in twig!
    $( '.sg-nav-link-parent' ).parent( 'li' ).addClass( 'sg-nav-item-parent' );
} );

// some navigation magic
// -jLaz
$( document ).on( 'click', '.sg-nav-link-parent', function() {

    // this opens just the next level
    $( this ).parent().find( '.sg-nav-item' ).toggle();

    // adding an active class to the item
    $( this ).toggleClass( 'active' );
    
    // adding an extra class b/c the icon toggle is buggy when it comes to multiple levels
    $( this ).addClass( 'sg-nav-opened' );

    // detect if nav-text has more than one line
    var $navText = $( '.sg-nav-text' );
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
$( document ).on( 'click', '.sg-nav-opened', function() {
    $( this ).parent().find( '.active' ).removeClass( 'active' );
    $( this ).removeClass( 'sg-nav-opened' );
    $( this ).parent().find( '.sg-nav-opened' ).removeClass( 'sg-nav-opened' );
} );

// experimental

// Resize preview
// -jLaz
/*
$( '#btn-320' ).on( 'click', function() {
    $( '.sg-preview' ).css( 'width', 320 );
} );
$( '#btn-480' ).on( 'click', function() {
    $( '.sg-preview' ).css( 'width', 480 );
} );
$( '#btn-768' ).on( 'click', function() {
    $( '.sg-preview' ).css( 'width', 768 );
} );
$( '#btn-1024' ).on( 'click', function() {
    $( '.sg-preview' ).css( 'width', 1024 );
} );
$( '#btn-1200' ).on( 'click', function() {
    $( '.sg-preview' ).css( 'width', 1200 );
} );
$( '#btn-reset' ).on( 'click', function() {
    $( '.sg-preview' ).removeAttr( 'style' );
} );
*/

/*
var $resizeLength = this.$element.find( '.sg-preview' ),
    $handleLeft = this.$element.find( '.sg-esize-handle-left' ),
    $handleRight = this.$element.find( '.sg-resize-handle-right' );

interact( '.sg-preview' )
.resizable( {
    axis: 'x',
    edges: {
        left: $handleRight[ 0 ],
        right: $handleLeft[ 0 ],
        bottom: false,
        top: false
    }
} )
.on( 'resizemove', function( event ) {
    var target = event.target,
        x = ( parseFloat( target.getAttribute( 'data-x' ) ) || 0 ),
        y = ( parseFloat( target.getAttribute( 'data-y' ) ) || 0 );

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute( 'data-x', x );
    target.setAttribute( 'data-y', y );
    target.textContent = Math.round( event.rect.width ) + '×' + Math.round( event.rect.height );
} );
*/

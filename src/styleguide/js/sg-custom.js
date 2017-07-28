/**
 * sg-custom.js
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

        // TODO: check if class is already on. reduced view gets it twice
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

        // Single toggles for documentation and source code
        // -jLaz

        SGB.toggleSingleDocBtn = function() {
            var button = this,
                buttonIcon = this.childNodes[ 1 ];

            _toggleClass( button, 'sg-btn-active' );

        };

        queryAll( '.js-sg-btn-documentation' ).on( 'click', SGB.toggleSingleDocBtn );

        SGB.toggleSingleSourceBtn = function() {
            var button = this,
                buttonIcon = this.childNodes[ 1 ];

            _toggleClass( button, 'sg-btn-active' );
        };

        queryAll( '.js-sg-btn-source' ).on( 'click', SGB.toggleSingleSourceBtn );

        // toggle active class when we click the documentation or source buttons
        SGB.DocumentationToggleBtn = function() {
            var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-documentation-container' );
            thisContainer.toggleClass( 'sg-active' );
        };

        SGB.SourceToggleBtn = function() {
            var thisContainer = $( this ).closest( '.js-sg-section' ).find( '.js-sg-source-container' );
            thisContainer.toggleClass( 'sg-active' );
        };

        queryAll( '.js-sg-btn-documentation' ).on( 'click', SGB.DocumentationToggleBtn );
        queryAll( '.js-sg-btn-source' ).on( 'click', SGB.SourceToggleBtn );

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

$( '.js-sg-btn-bgcolor' ).on( 'click', function() {
    var classes = [ 'sg-section js-sg-section bgcolor-2', 'sg-section js-sg-section bgcolor-3', 'sg-section js-sg-section bgcolor-1' ];

    $( this ).parents( '.js-sg-section' ).each( function() {
        this.className = classes[ ( $.inArray( this.className, classes ) + 1 ) % classes.length ];
    } );
} );

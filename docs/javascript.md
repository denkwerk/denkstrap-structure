# denkstrap-structure JavaScript API

### Inhalt
- [Module](#module)
  - [Aufbau eines Moduls](#aufbau-eines-moduls)
  - [Einbindung im HTML](#einbindung-im-html)
  - [Verwendung im JavaScript](#verwendung-im-javascript)
  - [Konstruktor-Methoden](#konstruktor-methoden)
  - [Modul Typen](#modul-typen)
    - [Globale Module](#globale-module)
    - [Lokale Module](#lokale-module)
      - [Promise](#promise)
      - [Events](#events)
      - [Beispiele](#beispiele)
- [Extensions](#extensions)
- [Funktionssammlungen](#funktionssammlungen)
- [Events](#events-1)
- [Loader](#loader)
  - [Konfiguration](#konfiguration)
    - [globalScope](#globalscope)
    - [autoInitSelector](#autoinitselector)
    - [autoInit](#autoinit)
  - [initModules](#initmodules)
  - [Beispiel](#beispiel)
- [Abhängigkeiten](#abhangigkeiten)
- [TODOs](#todos)

***

## Module
Zwei Modultypen stehen zur Verfügung: *globale* und *lokale* Module. Ein globales Modul wird einem Objektliteral hinzugefügt (z.B. `window.App`). Wenn mehrere Module des selben Typs initialisiert werden, teilen sie sich den selben Scope im Objektliteral. Das bewirkt unter Umständen, dass sich diese Module während der Laufzeit teilweise gegenseitig überschreiben. Ein lokales Modul wird beim initialisieren instanziert. Jedes lokale Modul besitzt seinen eigenen Scope. Desweiteren können lokale Module mit Extensions erweitert werden und besitzen diverse weitere Eigenschaften.
### Aufbau eines Moduls
Der Grundaufbau beider Modultypen ist prinzipiell gleich. Die Methoden `ready` und `events` dienen als Konstruktor-Methoden, werden beim Initialisieren durch den **Loader** ausgeführt und bekommen als Argumente das zugehörige DOM-Element (jQuery) sowie die Options übergeben. Die Konstruktor-Methoden können jedoch auch manuell festgelegt werden (siehe [Konstruktor-Methoden](#konstruktor-methoden)).

```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            ready: function ( element, options ) {

            },

            events: function ( element, options ) {

            }

        };
    });

}( this, this.define, this.require ));
```

### Einbindung im HTML
Zunächst muss `require.js` mit der entsprechenden `main.js` am Ende des `<body>` geladen werden:

```html
<body>
<!-- content -->
<script type="text/javascript" data-main="/components/app/main.js" src="/components/app/vendor/require.js"></script>
</body>
```

Dann können die Module innerhalb des Markups angegeben werden. Durch den Loader werden sie automatisch nachgeladen und initialisiert, wenn sie benötigt werden:

```html
<div class="auto-init" data-module="modules/example" data-options='{"foo": "bar"}'></div>
```

Es besteht die Möglichkeit ein Modul priorisiert zu laden. Priorisiert ausgezeichnete Module werden in einem separaten require-Call vor allen anderen *gewöhnlichen* Modulen geladen.
```html
<div class="auto-init" data-module="modules/example" data-options='{"foo": "bar"}' data-priority="true"></div>
```

### Verwendung im JavaScript
Wenn ein Modul **ohne Loader** geladen werden soll, kann im `define` Block ein `load!` vorangestellt werden. Soll es zudem initialisiert werden, kann ein `:init` hinten angestellt werden, nun werden die Konstruktor-Methoden  mit den Argumenten `element = $({})` und `options = {}` ausgeführt.
> **Wichtig**
> Hierfür muss das require-Plugin (`src/js/vendor/load.js`) in der require Config im Path Objekt definiert werden. Zudem muss für globale Module in der require Config der `globalScope` definiert werden. (Siehe `main.js`)

```javascript
define([
    'load!modules/test-module/test-module',
    'load!modules/test-module/test-module:init'
], function ( foo, bar ) {
    // tuwas
}
```

### Konstruktor-Methoden
Über die Eigenschaft `constructors` kann ein Array übergeben werden, um die Konstruktor-Methoden zu definieren. Die Methoden werden in der im Array definierten Reihenfolge ausgeführt. Wird die Eigenschaft nicht gesetzt, werden die `ready` und `events` Methoden ausgeführt.

```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            constructors: ['init'],

			ready: function ( element, options ) {
				// Wird nicht ausgeführt
			},

            init: function ( element, options ) {
				// Wird ausgeführt
            }

        };
    });

}( this, this.define, this.require ));
```

### Modul Typen
#### Globale Module
Damit ein Modul vom Loader als ein globales erkannt wird, muss die Property `isGlobal` auf `true` gesetzt werden:

```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            isGlobal: true,

            ready: function ( element, options ) {

            },

            events: function ( element, options ) {

            }

        };
    });

}( this, this.define, this.require ));
```

#### Lokale Module
Lokale Module besitzen zusätzliche Eigenschaften. Jedes Modul bekommt eine eindeutige ID (`uid`) sowie den Modulnamen (`name`) zugewiesen. Über das `this` Keyword besteht innerhalb der Module Zugriff auf diese Eigenschaften.

```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            ready: function ( element, options ) {
                console.log(this.uid);  //=> "local_1"
                console.log(this.name); //=> "modules/example"
            },

            events: function ( element, options ) {

            }

        };
    });

}( this, this.define, this.require ));
```
##### Promise
Wird in einer Konstruktor-Methode ein `Promise` (aktuell werden nur jQuery Promises unterstützt: [jQuery Deferred Dokumentation](https://api.jquery.com/jquery.deferred/)) zurückgegeben, werden die darauffolgenden Konstruktor-Methoden erst ausgeführt, sobald das Promise resolved ist.
##### Events
Des weiteren werden beim Initialisieren lokaler Module einige standardisierte Events auf den DOM-Elementen gefeuert. Jedes Event wird zusätzlich einmal mit dem Modulnamen (`this.name`) als Namespace gefeuert. Falls auf einem DOM-Element mehrere Module geladen werden, kann so zwischen den gefeuerten Events unterschieden werden.
###### beforeInit
Dieses Event wird vor dem Ausführen der Konstruktor-Methoden gefeuert.
###### afterInit
Dieses Event wird nach dem Ausführen der Konstruktor-Methoden gefeuert. Wenn diese `Promises` zurückgegeben, wird das `afterInit` Event erst gefeuert, sobald diese resolved sind.
##### Beispiele
```html
<div class="auto-init" data-module="modules/example, modules/foo"></div>
```

**modules/example**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            ready: function ( element, options ) {

				// Die jQuery AJAX Methode liefert ein $.Deferred.promise() zurück
                var request = $.ajax({
                    url: '/beispiel/url',
                    success: function () {
                        // tuwas
                    }
                });

                return request;
            },

            events: function ( element, options ) {
                element.on('afterInit.modules/foo', function () {
                    // Wird ausgeführt, wenn modules/foo fertig initialisiert wurde
                });
            }

        };
    });

}( this, this.define, this.require ));
```
**modules/foo**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            ready: function ( element, options ) {
                this.deferred = new $.Deferred();

                this.wait();

                return this.deferred.promise();
            },

            wait: function () {
                setTimeout(_.bind(function () {
                    this.deferred.resolve();
                }, this), 2000);
            }

        };
    });

}( this, this.define, this.require ));
```

## Extensions
Lokale Module können durch Extensions erweitert werden. Eine Extension kann ein bestehendes Modul vor dem initialisieren modifizieren. Innerhalb Funktionen der Extension kann über `this._super()` auf das Original der erweiterten Funktion zugegriffen werden.

```html
<div class="auto-init" data-module="modules/example, modules/foo" data-extensions="extensions/example"></div>
```

Damit die im Beispiel geladene Extension nur das Modul `modules/example` erweitert und nicht auch das Modul `modules/foo`, muss in der Extension in einem Array die zu erweiternden Module definiert werden.

**extensions/example**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            // Definiert die zu erweiternden Module
            extend: ['modules/example'],

            ready: function ( element, options ) {
                this.foo();

                // Führt die ready-Methode des erweiterten Moduls aus
                this._super(element, options);
            },

            foo: function () {
                // tuwas
            }

        };
    });

}( this, this.define, this.require ));
```

## Funktionssammlungen
Für literale Objekte z.B. Funktionssammlungen ist es nicht notwendig als Grundlage auf die Module zurück zu greifen. Für diesen Zweck reicht es ein Objekt mit den entsprechenden Methoden zurück zu geben.
  
**modules/funktionssammlung**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            method1: function () {
            
            },
            
            method2: function () {
            
            }

        };
    });

}( this, this.define, this.require ));
```
  
**modules/example**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash',
        'modules/funktionssammlung'
    ], function ( $, _, funktionssammlung ) {

        return {

            ready: function ( element, options ) {
          
                funktionssammlung.method1();
          
            }

        };
    });

}( this, this.define, this.require ));
```

## Events
Der Event-Dispatcher basiert auf dem jQuery Eventsystem. Er bietet alle Vor- und Nachteile die das jQuery Eventsystem mit sich bringt.

**modules/event_example1**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash',
        'utils/event'
    ], function ( $, _, Event ) {

        return {

            ready: function ( element, options ) {
            	Event.trigger('ready', [element]);
            }

        };
    });

}( this, this.define, this.require ));
```

**modules/event_example2**
```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash',
        'utils/event'
    ], function ( $, _, Event ) {

        return {

            events: function ( element, options ) {
            	Event.on('ready', function ( event, element ) {
                	// tuwas
                });
            }

        };
    });

}( this, this.define, this.require ));
```

## Loader
Wenn Module per JavaScript initialisiert werden müssen (zum Beispiel per AJAX nachgeladene Module), kann in einem Modul eine Instanz des Loaders angelegt und entsprechend konfiguriert werden:

### Konfiguration
Die Konfiguration des Loaders erfolgt durch ein Objekt beim Erzeugen der Instanz. Folgende Eigenschaften sind konfigurierbar:

#### globalScope
Bestimmt das Objekt, dem globale Module beim initilaisieren hinzugefügt werden. Beispiel: Wenn als Objekt `App` definiert wird, ist ein globales Modul mit dem Namen `modules/globalExample` nach dem initialisieren mit `App.globalExample` zugänglich.

#### autoInitSelector
Definiert mit welchem Selector zu initialisierende Module gefunden werden.

#### autoInit
Legt fest, ob der Loader beim Erzeugen einer Instanz automatisch die initModules Methode ausführt

### initModules
Wird mit dem Element, in dem die zu ladenden Module enthalten sind als Argument ausgeführt. Von der `initModules` Methode wird ein Promise zurück gegeben, das resolved wird sobald alle Module fertig initialisiert wurden.

### Beispiel

```javascript
( function( window, define, require, undefined ) {
    'use strict';

    define( [
        'jquery',
        'lodash',
        'app/core',
        'app/loader'
    ], function( $, _, App, Loader ) {

        return {

            // Definiert die auszuführenden Konstruktor-Methoden und die
            // Reihenfolge
            constructors: [ 'ready', 'loadModules' ],

            // Erzeugt eine Instanz des Loaders
            loader: new Loader( {

                // Definiert das Objekt dem globale Module hinzugefügt werden
                globalScope: App,

                // Definiert den Selector für auszuführende Module
                autoInitSelector: '.xhr-init',

                // Legt fest, dass beim Erzeugen der Loader Instanz nicht
                // automatisch die initModules Methode ausgeführt wird
                autoInit: false

            } ),

            ready: function( element, options ) {

                // Die jQuery AJAX Methode gibt ein Promise zurück das resolved
                // wird sobald der AJAX Request erfolgreich abgeschlossen ist
                return $.ajax( {
                    url: '/ajax/async-carousel.html',
                    success: function( html ) {
                        element.append( html );
                    }
                } )
            },

            // Wird erst ausgeführt wenn das von der jQuery AJAX Methode
            // zurückgegebene Promise resolved ist
            loadModules: function( element, options ) {

                // Lädt in Element enthaltene Module mit der Klasse 'xhr-init'
                return this.loader.initModules( element );
            },
            
            // Wird ausgeführt sobald das vom Loader zurückgegebene Promise resolved wurde, 
            // also alle Module initialisiert wurden
            events: function () {
                // Tu was
            }

        };
    } );

}( this, this.define, this.require ) );
```

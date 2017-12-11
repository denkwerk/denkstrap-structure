# denkstrap-structure JavaScript API

### Contents
- [Modules](#modules)
  - [Structure of a module](#structure-of-a-module)
  - [Integration in the HTML](#integration-in-the-html)
  - [Usage in the JavaScript](#usage-in-the-javascript)
  - [Constructors](#constructors)
  - [Module types](#module-types)
    - [Global modules](#global-modules)
    - [Local module](#local-modules)
      - [Promises](#promises)
      - [Events](#events)
      - [Examples](#examples)
- [Extensions](#extensions)
- [Collections](#collections)
- [Configuration](#configuration)
- [Events](#events-1)
- [Conditions](#conditions-1)
- [Loader](#loader)
  - [Configuration](#configuration)
    - [globalScope](#globalscope)
    - [autoInitSelector](#autoinitselector)
    - [autoInit](#autoinit)
  - [initModules](#initmodules)
  - [Example](#example)
  - [Pending Modules](#pending-modules)

***

## Modules

There are two types of modules: *global* and *local* ones. A global module is attached to an object literal, e.g. `window.App`. When you initialize several global modules of the same type, they share the same scope in the object literal. This possibly causes an overrides of properties in the object at runtime. When you initialize a local module an instance of this module will automatically be created. Because of this behaviour each local module has its own scope, even you initalizing multiple modules of the same type. In addition there are some other neat features and its actually possible to extend them.

### Structure of a module

The base structure of both module types is basically the same. By default the methods `ready` and `events` are the constructors and they will be automatically executed by the [**Loader**](#loader) when a module is initialized. Both methods will be executed at least with the both arguments `element` (the corresponding [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)) and the `options` (options can be defined in the `data-options` Attribute on the corresponding HTMLElement as JSON structure). You can also define the constructors by your own (q.v. [Constructors](#constructors)).

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

### Integrating with HTML

First you have to load `require.js` at the end of the `<body>` and define your `main.js` in the `data-main` attribute:

```html
<body>
<!-- content -->
<script type="text/javascript" data-main="/components/app/main.js" src="/components/app/vendor/require.js"></script>
</body>
```

Now you can define your modules on the corresponding HTMLElements. The [**Loader**](#loader) will initialize them automatically. You can also define multiple modules.

```html
<div class="auto-init" data-module="modules/example" data-options='{"foo": "bar"}'></div>
<div class="auto-init" data-module="modules/foo, modules/bar" data-options='{"foo": "bar"}'></div>
```

#### Prioritization

It's possible to mark modules as important. Important modules will be loaded and executed in prior to all *regular* modules.

```html
<div class="auto-init" data-module="modules/example" data-options='{"foo": "bar"}' data-priority="true"></div>
```

#### Conditions

You can also load modules just under a certain condition. In order to do this, define the condition in the `data-condition` attribute. It's possible to define a condition applied to all modules on the HTMLElement or for a specific module as well. To find out which conditions are available and how to create your own have a look at: [Conditions](#conditions-1)

```html
<!-- Condition for all modules on this element: -->
<div class="auto-init" data-module="modules/foo" data-options='{"foo": "bar"}' data-condition="in-viewport"></div>

<!-- Condition will only applied on 'modules/foo' on this element: -->
<div class="auto-init" data-module="modules/foo, modules/bar" data-options='{"foo": "bar"}' data-condition='{"modules/foo": "in-viewport"}'></div>
```

### Usage in JavaScript

If you want to load a module **without the Loader**, add a `load!` ahead the modules name in the define statement. When the module should also be initialized, add a `:init` behind the modules name to execute all constructors with the arguments `null` (instead of an HTMLElement) and `{}` (instead of the options).

> **Important!**
> You have to define the `globalScope` for global modules and add the `load` require plugin (`src/js/app/vendor/load.js`) to the `path` section of your require-config. (q.v. `main.js`)

```javascript
define([
    'load!modules/test-module/test-module',
    'load!modules/test-module/test-module:init'
], function ( foo, bar ) {
    // do something
});
```

Sometimes it's necessary to define the arguments by your own. If so, remove the `:init` and initialize the module with the `load` plugin manually. Therefor you have to add the plugin by itself to the define statement and assign it to a variable. Now you can call the `init` method, pass your module as the first argument and subsequently all your further arguments.

```javascript
define([
    'load',
    'load!modules/global-module',
    'load!modules/local-module'
], function ( load, global, local ) {

  var arg1, arg2;

  load.init( global, arg1, arg2 );
  load.init( local,  arg1, arg2 );

  // It's also possible to assign the initalized module to a variable
  var globalModule = load.init( global, arg1, arg2 );
  var localModule  = load.init( local,  arg1, arg2 );

});
```

### Constructors

The property `constructors` overrides the default methods (`ready` and `events`) with an array of method names executed on module construction. The methods will be executed in the arrays order.

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
				// won't be executed
			},

            init: function ( element, options ) {
				// will be executed
            }

        };
    });

}( this, this.define, this.require ));
```

### Module types

#### Global modules

If you want to initialize a module globally, make sure the property `isGlobal` is set to `true`.

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

#### Local Modules

Local modules own some additional properties. Each module has an unique ID `uid` and a it's `name`. Both are accessible via the `this` keyword.

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

##### Promises

If a constructor returns a `promise` (currently you can use [jQuery Promises](https://api.jquery.com/jquery.deferred/) and [ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) as well) the following constructors will be executed first when that promise is resolved.

###### Fail

You can define the name of a method which will be executed in case of a promise rejection with the property `failMethod`. By default the name of this method is `fail`;

##### Events

When a module gets initialized, `beforeInit` and `afterInit` events are fired on the corresponding HTMLElement. Each event is fired a second time with the modules name (`this.name`) as namespace. So you can differentiate between events from multiple modules on that element.

###### beforeInit

This event gets fired before the constructors are executed.

###### afterInit

This event gets fired when all constructors have been executed. If you work with promises, this event won't be fired until these are resolved.

##### Examples

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

				// the jQuery AJAX Method returns a $.Deferred.promise
                return $.ajax({
                    url: '/example/url'
                });

            },

            events: function ( element, options ) {
                element.on('afterInit.modules/foo', function () {
                    // will be executed when the module modules/foo has been initialized
                });
            },

            fail: function ( element, options, jqXHR, textStatus, errorThrown ) {
                // will be executed when the promise fails
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

It is possible to extend local modules. An extension modifies an existing module before it gets initialized. Within functions of the extensions you can access the original functions via `this._super()`.

```html
<div class="auto-init" data-module="modules/example, modules/foo" data-extensions="extensions/example"></div>
```

You have to define an array of possible target modules for the extension with the property `extend` for making sure that just valid targets are extended on HTMLElements with multiple modules.

**extensions/example**

```javascript
(function ( window, define, require, undefined ) {
    'use strict';

    define([
        'jquery',
        'lodash'
    ], function ( $, _ ) {

        return {

            // define target module
            extend: ['modules/example'],

            ready: function ( element, options ) {
                this.foo();

                // executes the parents ready method
                this._super(element, options);
            },

            foo: function () {
                // do something
            }

        };
    });

}( this, this.define, this.require ));
```

## Collections

Its not necessary to create a module for a collection of functions. For this case you can simply return an literal object.

**modules/collection**

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
        'modules/collection'
    ], function ( $, _, collection ) {

        return {

            ready: function ( element, options ) {

                collection.method1();

            }

        };
    });

}( this, this.define, this.require ));
```

## Configuration

It is possible to provide different configurations for different environments. This is archieved using the require.js build. All configuration files are in the `app/config` folder. Here you can provide configs for a specific module or global configs. You can get and set those via the `get` and `set` methods.

The configurations are loaded via `config` in the define-block. E.g.:

 ```javascript
 define( [ 'config' ], function( config ) {
   // get configs for module example
   var fooConfig = config.get( 'example' );
 } );
 ```

 ### Require.js error handler

 There is a function called `requireError` in the global block of the configs. With this function you can implement a special error handling for errors during script loading from require.js. You can use this to track if scripts loaded from a CDN can be loaded. If not you can implement an error handler pushing an event to your analytics or your logging tool. Then you can see the error really early.

  ```javascript
  ( function( window, define, require, undefined ) {
      'use strict';

      /*
       * ...
       */

          var config = {
              /*
               * ...
               */

              requireError: function( err ) {
                  // Error-Handling
              }

              /*
               * ...
               */
          };

    /*
     * ...
     */

  }( this, this.define, this.require ) );
  ```

## Events

The event dispatcher is based on the jquery event api but acts a little different. In addition it is possible to define a scope in which the callback function will be executed.

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
            	Event.trigger('ready', [element], this);
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
                	// do something
                });
            }

        };
    });

}( this, this.define, this.require ));
```

## Conditions

If you want to specify under what circumstances a module is loaded you can create a condition and link it to the module. You can find a [collection](#collection) with some predefined conditions here: `app/utils/conditions.js`. Feel free to add your own conditions.

```javascript
( function( window, define, require, undefined ) {
    'use strict';

    define( [], function() {

        return {

            'in-viewport': function( load, element ) { ... },
            'is-visible' : function( load, element ) { ... }

        };
    } );

}( this, this.define, this.require ) );
```

When a module is linked to a condition (see [Integrating with HTML](#integrating-with-html)), the condition is responsible to trigger the load process. In order to do this the `load` function and the `HTMLElement` are passed as arguments into the condition. To start the load process simply call the load function.

> **Important:** When the `load` function doesn't get called, the module will never be initialized. So make sure your condition works properly.

**Let's clarify this with the `in-viewport` condition**

```javascript
'in-viewport': function( load, element ) {

    // checks if the element is visible inside the viewports bounds
    function check () { ... }

    // listener which gets called by the scroll event
    function listener () {

        if ( check() ) {
            // deletes event listener on positive check
            // and the loads the module
            window.removeEventListener( 'scroll', listener );
            load();
        }
    }

    window.addEventListener( 'scroll', listener );

    listener();

}
```

## Loader

Sometimes it's usefull to load modules within the JavaScript (e.g. via AJAX loaded modules) For that you can create an instance of the Loader and configure it by your own.

### Configuration

To configure the loader, pass an object to the constructor. Following options are available:

#### globalScope

Defines to which object global modules are attached when they get initialized. For example: When you define `App` as `globalScope`, a global module with the name `modules/globalExample` will be attached to `App.globalExample`.

#### autoInitSelector

Defines which selector will be used to query the elements.

#### autoInit

When set to `true` the Loader will call the `initModules` method immediately.

### initModules

Registers [conditions](#conditions) or loads all modules within the defined `HTMLElement`. Returns a promise which will be resolved when all modules (except modules that are linked to a condition) are loaded completely.

### Example

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

            // defines constructors
            constructors: [ 'ready', 'loadModules' ],

            // creates an instance of the Loader
            loader: new Loader( {

                // defines to which element global modules
                // will be attached
                globalScope: App,

                // defines the selector for the HMTLElements
                autoInitSelector: '.xhr-init',

                // defines that the loader does NOT initialize
                // the module immediately
                autoInit: false

            } ),

            ready: function( element, options ) {

                // the jquery AJAX method returns a promise that gets
                // resolved when the AJAX call has finished
                return $.ajax( {
                    url: '/ajax/async-carousel.html',
                    success: function( html ) {
                        element.appendChild( html.get( 0 ) );
                    }
                } )
            },

            // will be executed when the AJAX call has finished
            loadModules: function( element, options ) {

                // loads all modules that are defined on the HTMLElements
                // with the class 'xhr-init'
                return this.loader.initModules( element );
            },

            // will be called when all modules that has been loaded by
            // the loader has been initialized (the returned promise has
            // been resolved)
            events: function () {
                // do something
            }

        };
    } );

}( this, this.define, this.require ) );
```

### Pending Modules

The loader has a property called `pendingModules`. Here the amount of modules pending to load is stored. They are grouped by their priority (major/minor). When the loader is finished the numbers are equals to 0.

You can access this property within the `dev`-configuration of the app in the global scope via `App.loader.pendingModules`.

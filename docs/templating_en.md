# denkstrap-structure templating

> Special features when working with templates in denkstrap-setup

## Table of contents

- [Templating-language](#templating-language)
- [Integrating with the denkstrap-setup](#integrating-with-the-denkstrap-setup)
- [Pages](#pages)
- [Importing components](#importing-components)

## Templating-language

[nunjucks](https://mozilla.github.io/nunjucks/) is used as our main templating language. It offers a lot of features to make
the template more variable and organize the sources better. We strongly recommend using macros for organizing modules and
pattern. This makes it easier to reuse them.

## Integrating with the denkstrap-setup

We use grunt as our build-tool. To integrate nunjucks into our setup we developed [grunt-nunjuckr](https://github.com/denkwerk/grunt-nunjuckr).
It is a static site generator for grunt using nunjucks as the templating engine. You can configure nunjucks within
your grunt configuration. We already defined some global variables to make work with template easier:

- `basePath`: Path to the components
- `templatePath`: Path to the layouts
- `modulesPath`: Path to the modules
- `patternsPath`: Path to the pattern
- `appPath`: Path to JavaScript app core
- `srcPath`: Path to the root-directory of the sources
- `production`: Flag for production environment

## Pages

The page structure can be found under `src/components/pages/`. Files with the `.njs` ending will be renderd and then placed
as HTML-files und the `dist`-folder. For example if you want to make a page with the URL `example/carousel.html`, you must
create a directory called `example` in the folder `src/components/pages/`. Within the `example/` directoy you make a new file
called `carousel.njs`. This is rendered and the output is written to `dist/example/carousel.html`.

## Importing components

As mentioned earlier, we strongly recommend to use macros for organizing components. This makes them reusable. For this
purpose we developed a special importer for nunjucks. This importer makes it possible to import all modules or all pattern
with just one `import` statement.

Modules can be imported with `{% import 'modules' as modules %}` into the variable `modules`. Afterwards they can be used
with `{{ modules.ordnername.macroname() }}`. Pattern can be imported and used in a similar way (`{% import 'patterns' as patterns %}`).

> __Warning:__ Be careful when importing a module into another module. Importing all modules into a module leads to an infinite loop.
This breaks the template rendering. The same applies for pattern.

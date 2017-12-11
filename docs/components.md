# denkstrap components structure

## Table of contents

- [Introduction](#introduction)
- [Structure](#structure)
  - [Folder structure](#folder-structure)

## Introduction

Big projects tend to be chaotic realy early. You always wonder where all the CSS,
and JavaScript for a module can be found. At denkwerk we try to encounter this problem
with a simple pattern. All source files belonging to one module are stored in the same
place. This is similar to the idea of Web-Components. You do not need to search for
stylesheets in a `css` or `sass` folder, look for markup files in a `templates`-folder
or search for the JavaScript files in a seperate `js`-folder. Everything can be found
in one place.

## Structure

For our needs we split all modules into two categories. Similar to the Atomic-Design
pattern we try to split the *modules* into seperate, reusable *patterns*. Patterns can be
used in modules, patterns in patterns and modules in modules. Using modules within
patterns is not allowed.

### Folder structure

From the structure of the modules there is the following folder structure abstractes:

```
  |--root
  |  |--src
  |     |--components
  |        |--pattern
  |           |--pattern-example-a
  |              |--pattern-example-a.html
  |              |--pattern-example-a.scss
  |        |--modules
  |           |--module-example-a
  |              |--module-example-a.html
  |              |--module-example-a.scss
  |              |--module-example-a.js
```

You may use another layer here to add more structure into your project. You
could group all headlines, buttons or teasers in one directory.

# denkstrap-structure

> denkwerk standard project structure

***WARNING:*** Version 2 is **NOT** compatible with modules from previous versions.

## Requirements

There are a few prerequisites for this repository:

- [nvm](https://github.com/creationix/nvm) on Mac and Linux, [nvmw](https://github.com/hakobera/nvmw) or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows
- As an alternative you have node.js version 4.2 as your systems default node.js version
- [ruby](https://www.ruby-lang.org/de/) version 1.9.3+
- [Sass](http://sass-lang.com/) version 3.4.1+

## Initialization

When first cloning this repository you have to do an initialization. Due to the fact we are
using node.js for our build tasks you have to install all the dependencies.

But first things first. We use node.js version 4.2 which is the Long-Term-Support version. As
you have read in the requirements section you have to have either node.js 4.2 installed or nvm
installed. If you do not sure which version of node.js is installed check it by typing ```node --version```
in your console. If you should see something like ```4.2.1``` you are good to go to the installation
section. If not, go on reading the Initializing Node.js section.

### Initializing Node.js

Be sure to have nvm installed! Switch to bash by entering ```bash``` in the console.
Then type ```nvm --version``` in your console to check.

If it is not installed use [these instructions](https://github.com/creationix/nvm#user-content-install-script). When you are using Windows try [nvmw](https://github.com/hakobera/nvmw) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

Are you sure nvm is installed? Fine! Type ```nvm install 4.2``` to your terminal.

#### Windows?

The description above does yet not work 100% on Windows machines. When you just type ```nvm install```
there will not be happening as much as on POSIX systems. You have to type ```nvm install 4.2``` or
```nvm use 4.2``` if you have node.js version 4.2 already installed. That will work fine. When
[#63](https://github.com/hakobera/nvmw/pull/63) gets merged the description above will work on Windows machines.

### Installation

There are some prerequisites for this project template to be installed. Type ```npm install``` to
install all Grunt modules.

The second thing you have to install is [scss-lint](https://github.com/brigade/scss-lint). Install
this module by typing ```gem install scss-lint -v 0.32.0``` into your console.

### Update

When someone changed in the project the required Node modules, run the command ```npm update```.

## Build

When you have all requirements installed, run the following grunt tasks to build the frontend:

`grunt development` or `grunt dev` for a development build with uncompressed sources

`grunt production` or `grunt prod` for a production build with compressed sources

Additionally you can run the `grunt lint` task to ensure all sources are bug-free and follow the coding guidelines. Have a look at our test-stack documentation for advenced javascript testing.

## Documentations

There are a few more Documentations:
- [JavaScript API](docs/javascript_en.md) [[DE](docs/javascript.md)]
- [Components structure](docs/components.md) [[DE](docs/komponenten.md)]
- [JavaScript Testing](docs/javascript-testing_en.md) [[DE](docs/javascript-testing.md)]

## Node.js dependencies

You may wonder why some of the packages are in the dev-dependencies. There is a reason for that: the core modules get improved constantly. There are two different kinds of dependencies:

- `dependencies`
- `devDependencies`

These two dependencies have different goals.

### `dependencies`

Here all dependencies needed for the basic project setup are defined. This is kind of the _production_ mode of this repository.

### `devDependencies`

In this property all you can find all dependencies that are additionaly needed for extending the core modules and writing unit tests. If you don't need those dependecies in your project delete them from the `package.json` before installing all node-modules. __Only delete those dependencies when you surely know there will be no unit tests needed.__

Happy Coding!

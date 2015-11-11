# denkstrap-structure

> denkwerk standard project structure

## Requirements

There are a few prequites for this repository:

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

There are some prequites for this project template to be installed. Type ```npm install``` to
install all Grunt modules.

The second thing you have to install is [scss-lint](https://github.com/brigade/scss-lint). Install
this module by typing ```gem install scss_lint``` into your console.

## Build

When you have all requirements installed, run the following grunt tasks to build the frontend:

`grunt development` or `grunt dev` for a development build with uncompressed sources

`grunt production` or `grunt prod` for a production build with compressed sources

Additionally you can run the `grunt lint` task to ensure all sources are bug-free and follow the coding guidelines. Have a look at our test-stack documentation for advenced javascript testing.

## Documentations

There are a few more Documentations:
- [JavaScript API (german)](docs/javascript.md)
- [Components structure (german)](docs/komponenten.md)
- [JavaScript Testing (german)](docs/javascript-testing.md)

Happy Coding!

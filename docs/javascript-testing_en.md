# JavaScript Testing

Modern web applications get complex really fast. To keep those applications
maintainable you need a simple method to test if all your changes do not break
old functionality or APIs. This is where automated tests come in handy.

## Table of contents

- [Structure](#structure)
  - [Test-Runner](#test-runner)
  - [Testing-Framework](#testing-framework)
  - [Assertion-Framework](#assertions)
  - [Mocking-Framework](#mocks)
- [Testing of the module structure](#testing-of-the-module-structure)

## Structure

You need several components to run tests in the frontend:

- [Test-Runner](#test-runner)
- [Testing-Framework](#testing-framework)
- [Assertion-Framework](#assertions)
- [Mocking-Framework](#mocks)

### Test-Runner

We use [karma](https://karma-runner.github.io/0.13/index.html) as a Test-Runner. Here
you can test your code in different browsers. Within this runner we need a testing framework
to describe our tests.

### Testing-Framework

In this case the testing framework is [mocha.js](http://mochajs.org/). It is utilized to describe
the different test cases.

We use mocha.js because it only describes the test cases. Other tasks will be covered by other
frameworks. mocha.js supports different kinds of writing tests. We agreed to use the Behaviour Driven
Development style, short BDD.

### Assertions

To test the output of the code you need assertions. We use [chai.js](http://chaijs.com/) to assert
values. This framework supports, like mocha.js different styles. Here we also use BDD;

### Mocks

Often there are dependencies between modules and other libraries. We always try to test only one
specific module and therefore we need to mock the dependencies. There is a library for that:
[sinon.js](http://sinonjs.org/). This makes it easy to mock objects and function.

We can create methods with an exactly defined output or we can test if a method is called with the
specified parameters.

## Testing of the module structure

Our module structure is based on require.js. It is rather easy to test this. You just have to keep
in mind, that dependencies may be replaced by mocks. For this case the definition of the module has
to be resetted and redefined with the mock object. The reset is best placed in one of the [hooks](http://mochajs.org/#hooks).

E.g.:

```javascript
define( [], function() {

    describe( 'Some module', function() {

        beforeEach( function() {
            requirejs.undef( 'modules/some-module' );
            requirejs.undef( 'modules/some-dependency' );
        } );

        after( function() {
            requirejs.undef( 'modules/some-module' );
            requirejs.undef( 'modules/some-dependency' );
        } );

        it( 'should do some magic', function( done ) {
            var fakeDependency = {
                callMe: sinon.spy()
            };
            define( 'modules/some-dependency', fakeDependency );

            require( [ 'modules/some-module' ], function( Module ) {
                var module = new Module();

                expect( fakeDependency.callMe.called ).to.be.true;
                done();
            } );
        } );

    } );

} );
```

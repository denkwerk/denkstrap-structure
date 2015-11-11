# JavaScript Testing

Moderne Web-Anwendungen werden sehr schnell sehr komplex. Um solche komplexen
Anwendungen später auch warten zu können benötigt es eine einfache Methode um
zu prüfen, ob die gemachten Änderungen auch keine alte Funktionalität beeinflussen.
Hier können automatisierte Tests Abhilfe schaffen.

## Inhalt

- [Aufbau](#aufbau)
  - [Test-Runner](#test-runner)
  - [Testing-Framework](#testing-framework)
  - [Assertion-Framework](#assertions)
  - [Mocking-Framework](#mocks)
- [Testen der Modulstruktur](#testen-der-modulstruktur)

## Aufbau

Um Tests ausführen zu können werden mehrere Komponenten benötigt:

- [Test-Runner](#test-runner)
- [Testing-Framework](#testing-framework)
- [Assertion-Framework](#assertions)
- [Mocking-Framework](#mocks)

### Test-Runner

Wir setzen [karma](https://karma-runner.github.io/0.13/index.html) als Test-Runner ein.
Dadurch haben wir die Möglichkeit unseren Code in verschiedenen Browsern zu testen. Darin
verwenden wir dann ein Testing-Framework um die Tests zu beschreiben.

### Testing-Framework

Das Testing-Framework, in unserem Fall [mocha.js](http://mochajs.org/), dient dazu die verschiedenen
Testfälle zu beschreiben.

Wir setzen mocha.js ein, da wirklich nur die Beschreibung der Testfälle übernimmt. Andere Aufgaben werden
entsprechend von anderen Frameworks übernommen. Zudem unterstützt mocha.js nicht nur eine Art
die Tests zu beschreiben, sondern gleich mehrere. Wir setzen aber auf Behaviour Driven Development,
krz BDD.

### Assertions

Um in einem Testfall auch prüfen zu können ob der zu testende Code sich auch richtig verhält
werden Assertions eingesetzt. Hier bauen wir auf [chai.js](http://chaijs.com/), da auch dieses
Framework mehrere Arten der Beschreibung unterstützt. Auch bei den Assertions setzten wir auf BDD.

### Mocks

Oftmals bestehen Abhängigkeiten zwichen Modulen. Da wir aber immer nur ein spezielles Modul
testen wollen, nutzen wir sog. Mocks. Wir nutzen [sinon.js](http://sinonjs.org/) als Bibliothek,
die uns das Mocken von Objekten erleichtert.

Hierüber können wir Methoden mit genau definiertem Output schaffen oder auch prüfen ob eine bestimmte
Methode mit definierten Parametern aufgerufen wurde.

## Testen der Modulstruktur

Da die Modulstruktur auf require.js aufbaut ist es eher unproblematisch sie zu testen. Es muss
lediglich beachtet werden, dass die Abhängigkeiten ggf. durch Mocks ersetzt werden. Dazu muss die
Definition des entsprechenden Moduls zuerst zurückgesetzt werden und dann mit dem Mock neu definiert
werden. Das Zurücksetzen geschieht in der Regel in einem der [Hooks](http://mochajs.org/#hooks).

Hier ein Beispiel:

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

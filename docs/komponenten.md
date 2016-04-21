# denkstrap Komponenten-Struktur

## Inhalt

- [Einleitung](#einleitung)
- [Aufteilung](#aufteilung)
  - [Ordnerstruktur](#ordnerstruktur)

## Einleitung

Große Projekte werden schnell unübersichtlich. Es stellt sich immer wieder
die Frage wo nun das CSS oder das JavaScript für ein Modul liegt. Im denkwerk
versuchen wir Unübersichtlichkeit mit einem einfachen Pattern Herr zu werden.
Wir legen Markup, CSS und JavaScript eines Moduls an einem Ort ab. Das ganze
geschieht ähnlich zur Idee der Web-Components. So muss man nicht in einem
```CSS```-Ordner nach den Styles, in einem ```Templates```-Ordner nach dem Markup
und in einem ```JS```-Ordner nach den JavaScript Dateien suchen. Alles ist an
einem einzigen Ort zu finden.

## Aufteilung

Wir haben festgestellt, dass eine Aufteilung der Module sinnvoll ist. Ähnlich
Atomic-Design Pattern versuchen wir die *Module* in einzelne, gemeinsame *Pattern*
aufzuteilen. Dabei können Pattern in Modulen, Pattern in Pattern und Module in
Modulen geladen werden, Module in Pattern ist aber nicht möglich.

### Ordnerstruktur

Aus dieser Aufteilung der Module in Pattern ergibt sich bei uns folgende Ordnerstruktur:

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

Ggf. können noch Zwischenebenen eingeführt werden, dass bspw. alle Headlines,
alle Buttons oder alle Teaser einem Ordner abgelegt sind.

### Implementierung

Wenn die einzelnen Komponenten als nunjucks-Macros angelegt werden, dann gilt es folgendes
zu beachten: Innerhalb der Macro-Bibliothek sollten die entsprechenden Macros einmal
aufgerufen werden.

Beispiel:

```html
{% macro test() %}
<!-- contents of macro -->
{% endmacro %}

{{ test() }}
```

Das sorgt dafür, dass die einzelnen Komponenten im Styleguide sichtbar werden. Im normalen
Gebrauch über die `import`-Funktion von nunjucks ist dieser Bereich allerdings nicht sichtbar.
Somit kann die Komponentenbibliothek als Macro-Sammlung gepflegt werden und ist gleichzeitig
im Styleguide sichtbar.

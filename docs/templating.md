# denkstrap-structure Templating

> Besonderheiten beim Templating im denkstrap-Setup

## Inhalt

- [Templating-Sprache](#templating-sprache)
- [Einbindung in das denkstrap-Setup](#einbindung-in-das-denkstrap-setup)
- [Seiten](#seiten)
- [Import der Komponenten](#import-der-komponenten)

## Templating-Sprache

Als Templating-Sprache wird [nunjucks](https://mozilla.github.io/nunjucks/) genutzt. Hier stehen dem Entwickler eine
Reihe von Möglichkeiten zur Verfügung um Templates variabler zu machen und besser zu organisieren. Wir setzen stark auf
die Anwendung von Macros zur Organisation der Module und Pattern. Das sorgt für bessere Wiederverwendbarkeit.

## Einbindung in das denkstrap-Setup

Da wir als Build-Umgebung grunt einsetzen wurde der [grunt-nunjuckr](https://github.com/denkwerk/grunt-nunjuckr)
entwickelt. Hier wird mittels einer grunt-Konfiguration ein einfacher statischer Seitengenerator aufgesetzt. Im Setup
werden schon einige globale Variablen gesetzt, die die Arbeit mit den Templates erleichtern:

- `basePath`: Pfad zu den Komponenten
- `templatePath`: Pfad zu den Layouts
- `modulesPath`: Pfad zu den Modulen
- `patternsPath`: Pfad zu den Pattern
- `appPath`: Pfad zum JavaScript App Core
- `srcPath`: Pfad zum Root der Quelldateien
- `production`: Gibt an ob es sich um einen Produktionbuild handelt

## Seiten

Die Seiten-Struktur liegt unter `src/components/pages/`. Dateien mit der Endung `.njs` werden gerendert und analog im `dist`-
Verzeichnis als HTML-Seiten angelegt. Soll also eine Seite mit dem URL-Pfad `example/carousel.html` angelegt werden, dann muss
im Verzeichnis `src/components/pages/` der Ordner `example/` angelegt werden. Darin muss die Datei `carousel.njs` liegen,
die dann nach dem Rendern die entsprechende HTML-Datei ausgibt.

## Import der Komponenten

Wie schon erwähnt soll zur Organisation der Komponenten verstärkt auf Macros gesetzt werden, damit diese besser wiederverwendbar
sind. Dazu wurde ein spezieller Importer entwickelt, der es ermöglicht alle Module bzw. alle Pattern gleichzeitig zu
importieren und somit weniger `import`-Statements in einer Datei angeben zu müssen.

Module können einfach mit `{% import 'modules' as modules %}` in die Variable `modules` importiert werden. Danach kann einfach über
`{{ modules.ordnername.macroname() }}` auf das Modul zugegriffen werden. Für Pattern existiert ein analoger Mechanismus
(`{% import 'patterns' as patterns %}`).

> __Achtung:__ Werden alle Module in einem Modul importiert entsteht eine unendliche Rekursion und das Templating funktioniert
nicht mehr. Gleiches gilt für Pattern.

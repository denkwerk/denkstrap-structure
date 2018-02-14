#SASS Konfiguration, Variabeln & Mixins:

## Struktur 

	src/
	  components/
		sass/
		  config/
			_breakpoints.scss
			_indent.scss
		  variables/
			_breakpoints.scss
			_indent.scss

## Einrichtung

Zu Projektstart werden in der `_breakpoints.scss` alle vom Konzept und Design festgelegten Breakpoint-Variablen nach dem "mobile-first"-Ansatz in der SASS-Map hinterlegt. Namen, Werte und Anzahl sind hierbei frei definierbar. (siehe auch [SASS-Maps](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps))

**Beispiel:**

	$breakpoints: (
	  	default: 0, 	// mobile
	    small: 480px, 	// mobile landscape
	    medium: 768px, 	// tablet portrait
	    large: 1024px, 	// tablet landscape / small desktop
	    xlarge: 1280px 	// desktop + 
	);

Weniger ist mehr. Bei der Wahl der Breakpoints sollten lediglich für das Design globale und bedeutende Breakpoints verwendet werden (z.B. für globale Layout-/Schriftgrößen-Anpassungen, welche im Design zu finden sind).
 
**Hinweis**:
Breakpoints die zum Fixen einzelner Module und Pattern notwenig sind werden hier nicht gepflegt.


## Anwendung

Die gepflegten Breakpoints können über zwei vordefinierte Mixins verwendet werden:

### Direkte Nutzung über `@breakpoint($size)`
Input: 

	@breakpoint(medium) {
		.myButton { ... }
	}

Output: 

	@media (min-width: 480px) {
		. myButton { ... }
	}

### Optionen
	
| Name       	| Optionen 	 | 
| :----------	| :-----------|
| **$size** 		| Name eines Breakpoints `small` oder direkte Angabe `480px` <br> Default: `default`|
| **$inherit**	| `true`, `false` oder Name eines Breakpoints z.B. `medium` <br>Default: `true` | 
| **$selector** 	| `min-width` oder `max-width`<br> Default: `min-width` | 

### Optionen im Detail inkl. Beispiele:

#### $size
Setzt den gewünschten Wert in die Bedingung des zu generierenden Media-Query. Es wird überprüft ob der angegebene Breakpoint-Name in der $map: `$breakpoints` gefunden wird. Ist dies der Fall, wird der dort hinterlegte Wert für den Media-Query eingesetzt.

	@breakpoint(small) {
		...
	}
	
compiled:
 
	@media (min-width: 480px) {
		...
	}

Ist der Wert `default` wird kein Media Query um den Inhalt des Mixins generiert. Freie Werte wie z.B. `460px` werden direkt in den Media Query übertragen.

	@breakpoint() {
	  .container { width: 100% }
	}

	@breakpoint(460px) {
	  .container { width: 50% }
	}
	
complied:
 
	.container { width: 100% }
	
	@media (min-width: 460px) {
	  .container { width: 50% }
	}

#### $inherit
Über `$inherit` kann der zuvor über die `$size` gesteuerte Media-Query mit einer `max-width` eingeschränkt werden. 

Per default wird hier mit `true` keine Einschränkung gesetzt.

Bei `false` wird automatisch der nächstliegenden Breakpoint aus der Konfiguration geholt, um 1px verringert und als max-width zusätzlich in den Media-Query setzt. 

#####Beispiel 1
	@breakpoint($inherit: false) { ... } 
					↓ 
	@media (max-width: 479px) { ... }
 	
#####Beispiel 2

  	@breakpoint($size: medium, $inherit: false) { ... }
  					↓ 						↓
  	@media (min-width: 768px) and (max-width: 1023px) { ... }

	
Soll ein bestimmter Bereich über mehrere Breakpoints abgedeckt werden, kann dies über den Namen des  Breakpoints gemacht werden. Hierbei wird der Breakpoint unter `$inherit` angegeben, welcher *einschließlich* abgedeckt werden soll. 

#####Beispiel 1
  
  	@breakpoint($inherit: large) { ... }
  					   ↓ 			
  	@media (max-width: 1279px) { ... }


##### $selector



### Indirekte Nutzung über `@indent()` 

... Dokument in Arbeit 



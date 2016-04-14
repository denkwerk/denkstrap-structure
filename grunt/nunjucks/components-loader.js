/**
 * Components Loader for nunjucks
 */
var fs = require( 'fs' );
var glob = require( 'glob' );
var camelcase = require( 'camelcase' );

var ComponentsLoader = require( 'nunjucks' ).Loader.extend( {
    init: function( srcPath ) {
        this.srcPath = srcPath;
    },

    getSource: function( name ) {
        var componentsPath = this.srcPath + 'components/' + name;

        try {
            var stats = fs.statSync( componentsPath );
            if ( stats.isDirectory() ) {
                var files = glob.sync( '**/*.njs', {
                    cwd: componentsPath
                } );

                var loadingSrc = '';
                var file = files.pop();

                while ( file !== undefined  ) {
                    var componentName = camelcase( file.match( /^[\w\-]+/ )[ 0 ] );

                    loadingSrc += '{% import "' + componentsPath + '/' + file + '" as ' + componentName + ' %}\n';
                    loadingSrc += '{% set ' + componentName + ' = ' + componentName + ' %}\n';

                    file = files.pop();
                }

                return {
                    src: loadingSrc,
                    path: name,
                    noCache: false
                };
            } else {
                return false;
            }
        } catch ( e ) {
            return false;
        }
    }
} );

module.exports = ComponentsLoader;

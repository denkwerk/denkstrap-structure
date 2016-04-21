/**
 * Grunt nunjuckr plugin
 * https://github.com/denkwerk/grunt-nunjuckr
 */

module.exports = function( grunt, options ) {
    var ComponentsLoader = require( './nunjucks/components-loader.js' );
    var glob = require( 'glob' );

    return {
        options: {
            globals: {
                basePath: '<%= srcPath %>components/',
                templatePath: '<%= srcPath %>components/site/layout/',
                modulesPath: '<%= srcPath %>components/modules/',
                patternsPath: '<%= srcPath %>components/patterns/',
                appPath: '<%= srcPath %>components/app/',
                srcPath: '<%= srcPath %>',
                production: true
            },
            loader: new ComponentsLoader( options.srcPath ),
            ext: '.html'
        },
        production: {
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/site/pages/',
                    src: '**/*.njs',
                    dest: '<%= distPath %>',
                    ext: '.html'
                }
            ]
        },
        development: {
            options: {
                globals: {
                    basePath: '<%= srcPath %>components/',
                    templatePath: '<%= srcPath %>components/site/layout/',
                    modulesPath: '<%= srcPath %>components/modules/',
                    patternsPath: '<%= srcPath %>components/patterns/',
                    appPath: '<%= srcPath %>components/app/',
                    srcPath: '<%= srcPath %>',
                    production: false,
                    liveReloadPort: '<%= liveReloadPort %>'
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/site/pages/',
                    src: '**/*.njs',
                    dest: '<%= distPath %>',
                    ext: '.html'
                }
            ]
        },

        // Nunjuckr styleguide tasks
        'styleguide-development-overview': {
            options: {
                data: {},
                preprocessData: function( data ) {
                    var pattern = glob.sync( options.srcPath + 'components/patterns/**/*.njs' );
                    var modules = glob.sync( options.srcPath + 'components/modules/**/*.njs' );

                    pattern = pattern.map( function( patternPath ) {
                        return patternPath.match( /^[\w\/]+components\/patterns\/([\w\-]+)\/([\w\-]+)\.njs$/ )[ 1 ];
                    } );

                    modules = modules.map( function( modulePath ) {
                        return modulePath.match( /^[\w\/]+components\/modules\/([\w\-]+)\/([\w\-]+)\.njs$/ )[ 1 ];
                    } );

                    data.pattern = pattern;
                    data.modules = modules;

                    return data;
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/site/styleguide/',
                    src: 'index.njs',
                    dest: '<%= distPath %>styleguide',
                    ext: '.html'
                }
            ]
        },
        'styleguide-development-modules': {
            options: {
                data: {},
                setUp: function( env ) {
                    env.addFilter( 'moduleName', function( patternPath ) {
                        return patternPath.match( /^[\w\/]+components\/modules\/([\w\-]+)\/([\w\-]+)\.njs$/ )[ 1 ];
                    } );
                    return env;
                },
                preprocessData: function( data, file ) {
                    data.module = file;
                    data.template = file;

                    return data;
                },
                preprocessFilePath: function() {
                    return 'src/components/site/styleguide/module.njs';
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/modules/',
                    src: '**/*.njs',
                    dest: '<%= distPath %>styleguide/modules/',
                    ext: '.html'
                }
            ]
        },
        'styleguide-development-pattern': {
            options: {
                data: {},
                setUp: function( env ) {
                    env.addFilter( 'patternName', function( patternPath ) {
                        return patternPath.match( /^[\w\/]+components\/patterns\/([\w\-]+)\/([\w\-]+)\.njs$/ )[ 1 ];
                    } );
                    return env;
                },
                preprocessData: function( data ) {
                    var pattern = glob.sync( options.srcPath + 'components/patterns/**/*.njs' );

                    data.pattern = pattern;

                    return data;
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/site/styleguide/',
                    src: 'pattern.njs',
                    dest: '<%= distPath %>styleguide/',
                    ext: '.html'
                }
            ]
        }
    };
};

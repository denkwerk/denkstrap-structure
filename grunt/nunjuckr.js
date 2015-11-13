/**
 * Grunt nunjuckr plugin
 * https://github.com/denkwerk/grunt-nunjuckr
 */

module.exports = function( grunt, options ) {
    var glob = require( 'glob' );

    return {
        options: {
            data: {
                basePath: '<%= srcPath %>components/',
                templatePath: '<%= srcPath %>components/site/layout/',
                modulePath: '<%= srcPath %>components/modules/',
                patternPath: '<%= srcPath %>components/pattern/',
                appPath: '<%= srcPath %>components/app/',
                srcPath: '<%= srcPath %>',
                production: true
            },
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
                data: {
                    basePath: '<%= srcPath %>components/',
                    templatePath: '<%= srcPath %>components/site/layout/',
                    modulePath: '<%= srcPath %>components/modules/',
                    patternPath: '<%= srcPath %>components/pattern/',
                    appPath: '<%= srcPath %>components/app/',
                    srcPath: '<%= srcPath %>',
                    production: false
                }
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= srcPath %>components/site/pages/',
                    src: '**/*.njs',
                    dest: '<%= srcPath %>pages/',
                    ext: '.html'
                }
            ]
        },

        // Nunjuckr styleguide tasks
        'styleguide-development-overview': {
            options: {
                data: {
                    basePath: '<%= srcPath %>components/',
                    templatePath: '<%= srcPath %>components/site/layout/',
                    modulePath: '<%= srcPath %>components/modules/',
                    patternPath: '<%= srcPath %>components/pattern/',
                    appPath: '<%= srcPath %>components/app/',
                    srcPath: '<%= srcPath %>'
                },
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
                    dest: '<%= srcPath %>styleguide',
                    ext: '.html'
                }
            ]
        },
        'styleguide-development-modules': {
            options: {
                data: {
                    basePath: '<%= srcPath %>components/',
                    templatePath: '<%= srcPath %>components/site/layout/',
                    modulePath: '<%= srcPath %>components/modules/',
                    patternPath: '<%= srcPath %>components/pattern/',
                    appPath: '<%= srcPath %>components/app/',
                    srcPath: '<%= srcPath %>'
                },
                preprocessData: function( data, file ) {
                    data.moduleName = file;
                    data.moduleTemplate = file;

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
                    dest: '<%= srcPath %>styleguide/modules/',
                    ext: '.html'
                }
            ]
        },
        'styleguide-development-pattern': {
            options: {
                data: {
                    basePath: '<%= srcPath %>components/',
                    templatePath: '<%= srcPath %>components/site/layout/',
                    modulePath: '<%= srcPath %>components/modules/',
                    patternPath: '<%= srcPath %>components/pattern/',
                    appPath: '<%= srcPath %>components/app/',
                    srcPath: '<%= srcPath %>'
                },
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
                    dest: '<%= srcPath %>styleguide/',
                    ext: '.html'
                }
            ]
        }
    };
};

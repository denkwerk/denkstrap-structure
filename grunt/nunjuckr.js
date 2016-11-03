/**
 * Grunt nunjuckr plugin
 * https://github.com/denkwerk/grunt-nunjuckr
 */

module.exports = function( grunt, options ) {
    var ComponentsLoader = require( './nunjucks/components-loader.js' );

    return {
        options: {
            globals: {
                basePath: '<%= srcPath %>components/',
                templatePath: '<%= srcPath %>components/site/layout/',
                modulesPath: '<%= srcPath %>components/modules/',
                patternsPath: '<%= srcPath %>components/patterns/',
                appPath: '<%= srcPath %>components/app/',
                srcPath: '<%= srcPath %>',
                production: true,
                append: function( targetObj, key, data ) {
                    targetObj[ key ] = data;
                }
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
                    liveReloadPort: '<%= liveReloadPort %>',
                    append: function( targetObj, key, data ) {
                        targetObj[ key ] = data;
                    }
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
        }
    };
};

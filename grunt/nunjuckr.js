/**
 * Grunt nunjuckr plugin
 * https://github.com/denkwerk/grunt-nunjuckr
 */

module.exports = function( grunt, options ) {
    return {
        options: {
            data: {
                basePath: '<%= srcPath %>components/',
                templatePath: '<%= srcPath %>components/site/layout/',
                modulePath: '<%= srcPath %>components/modules/',
                patternPath: '<%= srcPath %>components/patterns/',
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
                    patternPath: '<%= srcPath %>components/patterns/',
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
        }
    };
};

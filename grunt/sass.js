/**
 * Grunt Sass plugin
 * https://github.com/sindresorhus/grunt-sass
 */

module.exports = {
    development: {
        options: {
            sourceMap: true
        },
        files: { '<%= srcPath %>css/main.css': '<%= srcPath %>components/sass/main.scss' }
    },
    production: {
        options: {
            outputStyle: 'compressed'
        },
        files: { '<%= distPath %>css/main.css': '<%= srcPath %>components/sass/main.scss' }
    }
};

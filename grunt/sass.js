/**
 * Grunt Sass plugin
 * https://github.com/sindresorhus/grunt-sass
 */

module.exports = {
    dev: {
        options: {
            sourceMap: true
        },
        files: { '<%= srcPath %>css/main.css': '<%= srcPath %>components/sass/main.scss' }
    },
    dist: {
        options: {
            outputStyle: 'compressed'
        },
        files: { '<%= dist %>/css/main.css': '<%= srcPath %>components/sass/main.scss' }
    }
};

/**
 * Grunt Watch plugin
 * https://github.com/gruntjs/grunt-contrib-watch
 */
module.exports = {
    options: {
        spawn: false,
        livereload: true
    },

    sass: {
        options: {
            event: [ 'added', 'deleted', 'changed' ],
            atBegin: true
        },
        files: [
            '<%= srcPath %>**/*.scss'
        ],
        tasks: [
            'newer:stylelint:scss',
            'sass:development',
            'postcss:cssDevelopment'
        ]
    },

    js: {
        options: {
            event: [ 'added', 'deleted', 'changed' ],
            atBegin: true
        },
        files: [
            '<%= srcPath %>/components/**/*.js',
            '!<%= srcPath %>/components/**/*.spec.js'
        ],
        tasks: [
            'copy:js'
        ]
    },

    html: {
        files: [
            '<%= srcPath %>components/**/*.njs'
        ],
        tasks: [
            'nunjuckr:development'
        ],
        options: {
            atBegin: true
        }
    }
};

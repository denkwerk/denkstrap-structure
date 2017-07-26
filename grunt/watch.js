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
            'sass:development',
            'postcss:scss',
            'postcss:css'
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

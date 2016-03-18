/**
 * Grunt Watch plugin
 * https://github.com/gruntjs/grunt-contrib-watch
 */
module.exports = {
    options: {
        nospawn: false,
        livereload: '<%= liveReloadPort %>'
    },
    sass: {
        files: [
            '<%= srcPath %>**/*.scss'
        ],
        tasks: [
            'sass:development'
        ],
        options: {
            atBegin: true
        }
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

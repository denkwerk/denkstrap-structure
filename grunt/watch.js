/**
 * Grunt Watch plugin
 * https://github.com/gruntjs/grunt-contrib-watch
 */
module.exports = {
    options: {
        nospawn: false,
        livereload: '<%= livereloadPort %>'
    },
    sass: {
        files: [
            '<%= srcPath %>**/*.scss'
        ],
        tasks: [
            'sass:dev'
        ],
        options: {
            atBegin: true
        }
    }

};

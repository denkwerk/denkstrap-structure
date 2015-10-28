/**
 * Grunt JSHint plugin
 * https://github.com/gruntjs/grunt-contrib-jshint
 */
module.exports = {
    frontend: [
        '<%= srcPath %>**/*.js'
    ],
    grunt: [
        '<%= gruntPath %>**/*.js',
        'Gruntfile.js'
    ],
    ci: {
        options: {
            force: true,
            reporter: 'jslint',
            reporterOutput: 'test/jshint-lint-report.xml'
        },
        files: {
            src: [
                '<%= srcPath %>**/*.js',
                '<%= gruntPath %>**/*.js',
                'Gruntfile.js'
            ]
        }
    }
};

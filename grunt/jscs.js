/**
 * Grunt JSCS plugin
 * https://github.com/jscs-dev/grunt-jscs
 */
module.exports = {
    options: {
        config: '.jscsrc',
        fix: true
    },
    frontend: [
        '<%= srcPath %>**/*.js'
    ],
    grunt: [
        '<%= gruntPath %>**/*.js',
        'Gruntfile.js'
    ],
    karma: [
        'karma.conf.js'
    ],
    ci: {
        options: {
            fix: false,
            force: true,
            reporter: 'checkstyle',
            reporterOutput: '<%= testResultPath %>jscs-lint-report.checkstyle.xml'
        },
        files: {
            src: [
                '<%= srcPath %>**/*.js',
                '<%= gruntPath %>**/*.js',
                'Gruntfile.js',
                'karma-conf.js'
            ]
        }
    }
};

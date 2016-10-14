/**
 * Grunt ESLint plugin
 * https://github.com/sindresorhus/grunt-eslint
 */
module.exports = {
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
            format: 'checkstyle',
            outputFile: '<%= testResultPath %>eslint-lint-report.checkstyle.xml',
            quiet: true
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

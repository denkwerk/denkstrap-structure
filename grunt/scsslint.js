/*
 * SCSS Lint Grunt plugin
 * https://github.com/ahmednuaman/grunt-scss-lint
 */

module.exports = {

    // Lint scss folder
    scss: [
        '<%= srcPath %>components/**/*.scss',
        '!<%= srcPath %>components/sass/vendor/**/*.scss'
    ],

    options: {
        config: '.scss-lint.yml',
        reporterOutput: '<%= testResultPath %>scss-lint-report.xml',
        compact: true,
        maxBuffer: NaN
    }
};

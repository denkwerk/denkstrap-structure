/*
 * SCSS Lint Grunt plugin
 * https://github.com/ahmednuaman/grunt-scss-lint
 */

module.exports = {
    // Lint scss folder
    scss: [
        '<%= srcPath %>/scss'
    ],

    options: {
        config: '<%= testPath %>.scss-lint.yml',
        reporterOutput: '<%= testPath %>scss-lint-report.xml',
        compact: true,
        maxBuffer: NaN
    }
};

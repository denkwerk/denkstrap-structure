/**
 * grunt stylelint plugin
 * https://github.com/wikimedia/grunt-stylelint
 */
module.exports = {
    options: {
        configFile: '.stylelintrc',
        failOnError: true,
        reportNeedlessDisables: false,
        syntax: 'scss'
    },
    scss: {
        src: [
            '<%= srcPath %>components/**/*.scss'
        ]
    },
    ci: {
        options: {
            formatter: require( 'stylelint-checkstyle-formatter' ),
            failOnError: false,
            outputFile: 'artifacts/test/stylelint-report.checkstyle.xml'
        },
        src: [
            '<%= srcPath %>components/**/*.scss'
        ]
    }
};

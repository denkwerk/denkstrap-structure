/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 *
 * Rules for stylelint
 * https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */

module.exports = function( grunt, options ) {
    return {
        options: {
            configFile: '.stylelintrc',
            formatter: 'string',
            ignoreDisables: false,
            failOnError: true,
            outputFile: '',
            reportNeedlessDisables: false,
            syntax: ''
        },
        all: [
            'src/components/**/**/*.scss',
            '!src/components/sass/vendor/**/*.scss'

        ]
    };
};

/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 */

// https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
// https://github.com/stylelint/stylelint/blob/master/docs/user-guide/example-config.md
// https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md


module.exports = function( grunt, options ) {
    return {
        autoprefixer: {
            options: {
                processors: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 2 versions', 'ie >= 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
                    } )
                ]
            },
            src: '<%= distPath %>css/**/*.css'
        },
        stylelint: {
            options: {
                processors: [
                    require( 'stylelint' )( {} )
                ],
                syntax: require('postcss-scss'),

                extends: [
                    'stylelintrc'
                ]
            },

            src: [
                '<%= srcPath %>components/**/**/*.scss',
                '!<%= srcPath %>components/sass/vendor/**/*.scss',
                '!<%= srcPath %>components/sass/mixins/grid/**/*.scss'
            ]
        }
    };
};

/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 *
 * Rules for stylelint
 * https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */

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
        lintscss: {
            options: {
                processors: [
                    require( 'stylelint' )( {} )
                ],
                syntax: require( 'postcss-scss' ),
                extends: [
                    'stylelintrc'
                ]
            },

            src: [
                '<%= srcPath %>components/**/**/*.scss',
                '!<%= srcPath %>components/sass/vendor/**/*.scss'
            ]
        }
    };
};


// new added configs for stylelint : to discuss
//
// declaration-no-important
// // Disallow !important within declarations.
//
// declaration-block-no-duplicate-properties
// // Disallow duplicate properties within declaration blocks.
//
// declaration-block-no-ignored-properties
// // Disallow property values that are ignored due to another property value in the same rule.
//
// declaration-block-semicolon-newline-after
// // Require a newline or disallow whitespace after the semicolons of declaration blocks.
//
// no-extra-semicolons
// // Disallow extra semicolons.
//
// no-unsupported-browser-features
// // Disallow features that are unsupported by the browsers that you are targeting.

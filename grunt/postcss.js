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

// add to .stylelintrc if needed
// http://stylelint.io/user-guide/rules/no-unsupported-browser-features/

// 'no-unsupported-browser-features': [ true, {
//     browsers: [ 'last 2 versions', 'ie > 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
// }]

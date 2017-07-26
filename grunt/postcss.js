/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 *
 * Rules for stylelint
 * https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */

module.exports = function( grunt, options ) {
    return {
        scss: {
            options: {
                // map: true,
                syntax: require( 'postcss-scss' ),
                processors: [
                    require( 'stylelint' )( { configFile: '.stylelintscssrc' } )
                ]
            },
            src: [ '<%= srcPath %>components/**/*.scss' ]
        },

        css: {
            options: {
                map: true,
                processors: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 2 versions', 'ie >= 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
                    } ),
                    require( 'postcss-inline-svg' ),
                    require( 'postcss-svgo' ),
                    require( 'stylelint' )
                ]
            },
            // src: '<%= distPath %>css/**/*.css'
            src: [
                '<%= distPath %>css/*.css'
            ]
        }
    };
};

//  .stylelintscssrc
// declaration-block-no-ignored-properties -> deprecated
// selector-no-id rule. Use selector-max-id with 0 as its primary option
// "scss/double-slash-comment-inline": "never" -> removed

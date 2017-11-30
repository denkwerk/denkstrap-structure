/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 *
 * Rules for stylelint
 * https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */

module.exports = function( grunt, options ) {
    return {
        cssDevelopment: {
            options: {
                map: true,
                processors: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 2 versions', 'ie >= 9', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
                    } )
                ]
            },
            src: [ '<%= distPath %>css/*.css' ]
        },

        cssProduction: {
            options: {
                map: false,
                processors: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 2 versions', 'ie >= 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
                    } )
                ]
            },
            src: [ '<%= distPath %>css/*.css' ]
        }
    };
};

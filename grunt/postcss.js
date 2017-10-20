/**
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
 *
 * Rules for stylelint
 * https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
 */

module.exports = function( grunt, options ) {
    return {
        scsslint: {
            options: {
                syntax: require( 'postcss-scss' ),
                processors: [
                    require( 'stylelint' )( { configFile: '.stylelintrc' } )
                ]
            },
            src: [ '<%= srcPath %>components/**/*.scss' ]
        },

        cssDevelopment: {
            options: {
                map: true,
                processors: [
                    require( 'autoprefixer' )( {
                        browsers: [ 'last 2 versions', 'ie >= 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
                    } ),
                    require( 'postcss-inline-svg' ),
                    require( 'postcss-svgo' )
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
                    } ),
                    require( 'postcss-inline-svg' ),
                    require( 'postcss-svgo' )
                ]
            },
            src: [ '<%= distPath %>css/*.css' ]
        }
    };
};

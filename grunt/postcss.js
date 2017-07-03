/*
 * Grunt postcss plugin
 * https://github.com/nDmitry/grunt-postcss
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
        }
    };
};

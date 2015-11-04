/**
 * Grunt autoprefixer plugin
 * https://github.com/jscs-dev/grunt-jscs
 */
module.exports = function( grunt, options ) {
    return {
        options: {
            browsers: [ 'last 2 versions', 'ie >= 8', 'Firefox >= 12', 'ios >= 7', 'android >= 4' ]
        },
        development: {
            src: '<%= srcPath %>css/**/*.css'
        },
        production: {
            src: '<%= distPath %>css/**/*.css'
        }
    };
};

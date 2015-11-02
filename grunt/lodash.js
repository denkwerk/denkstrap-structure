/**
 * Grunt lodash plugin
 * https://github.com/lodash/grunt-lodash
 */

module.exports = function( grunt, options ) {
    return {
        build: {
            modifier: 'none',
            dest: '<%= srcPath %>components/app/vendor/lodash.build.js',
            options: {
                exports: [ 'amd' ],
                include: 'map, flatten, unique'
            }
        }
    };
};

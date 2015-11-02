/**
 * Grunt lodash-autobuild plugin
 * https://github.com/jjt/grunt-lodash-autobuild
 */

module.exports = function( grunt, options ) {
    return {
        app: {
            src: [
                '<%= srcPath %>components/**/*.js',
                '!<%= srcPath %>components/app/vendor/*.js'
            ],
            options: {
                lodashConfigPath: 'lodash.build.options.include',
                lodashObjects: [ '_' ],
                lodashTargets: [ 'build' ]
            }
        }
    };
};

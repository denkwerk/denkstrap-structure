/**
 * Grunt Task to Copy Folders and Files
 *
 */

module.exports = {
    lodashRestore: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= srcPath %>',
                src: [
                    'components/app/vendor/lodash.js'
                ],
                dest: '<%= srcPath %>',
                rename: function( dest, src ) {
                    return dest + src.replace( 'lodash.js', 'lodash.build.js' );
                }
            }
        ]
    }
};

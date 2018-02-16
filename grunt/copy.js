/**
 * Grunt copy plugin
 * https://github.com/gruntjs/grunt-contrib-copy/
 */

module.exports = {

    js: {
        expand: true,
        cwd: '<%= srcPath %>components/',
        src: [
            '**/*.js',
            '!**/*.spec.js'
        ],
        dest: '<%= distPath %>js/'
    }//,
    // org Js files from node_modules folder are taken
    // styleguide: {
    //     expand: true,
    //     cwd: '<%= srcPath %>styleguide',
    //     src: [
    //         '**/*.js',
    //         '**/*.svg',
    //         '!**/*.spec.js'
    //     ],
    //     dest: '<%= distPath %>styleguide/'
    // }

};

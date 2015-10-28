module.exports = function(grunt) {
    var path = require('path');

    // measures the time each task takes
    require('time-grunt')(grunt);


    // Load all grunt tasks listed in package.json and load grunt configs
    require('load-grunt-config')(grunt, {
        // path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), 'grunt'),

        // auto grunt.initConfig
        init: true,

        // global variables for Grunt plugins
        // example: <%= srcPath %>
        data: {

            // Paths to src, dist and test folders
            srcPath: 'src/',
            distPath: 'dist/',
            testPath: 'test/',
            testResultPath: 'artifacts/test/',
            gruntPath: 'grunt/'
        },

        // use different function to merge config files
        // mergeFunction: require('recursive-merge'),

        // can optionally pass options to load-grunt-tasks.
        // If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {

            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        },

        // can post process config object before it gets passed to grunt
        postProcess: function(config) {},

        // allows to manipulate the config object before it gets merged with the data object
        preMerge: function(config, data) {}
    });

};

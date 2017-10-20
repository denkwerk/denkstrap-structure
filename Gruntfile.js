module.exports = function( grunt ) {
    var path = require( 'path' );

    // Measures the time each task takes
    require( 'time-grunt' )( grunt );

    // Load all grunt tasks listed in package.json and load grunt configs
    require( 'load-grunt-config' )( grunt, {

        jitGrunt: {
            jitGrunt: true,
            staticMappings: {
                scsslint: 'grunt-scss-lint'
            }
        },

        // Path to task.js files, defaults to grunt dir
        configPath: path.join( process.cwd(), 'grunt' ),

        // Auto grunt.initConfig
        init: true,

        // Global variables for Grunt plugins
        // example: <%= srcPath %>
        data: {

            // Paths to src, dist and test folders
            srcPath: 'src/',
            distPath: 'dist/',
            testResultPath: 'artifacts/test/',
            gruntPath: 'grunt/',

            // Package
            pkg: grunt.file.readJSON( 'package.json' )
        },

        // Use different function to merge config files
        // mergeFunction: require('recursive-merge'),

        // Can optionally pass options to load-grunt-tasks.
        // If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {

            pattern: 'grunt-*',
            config: require( './package.json' ),
            scope: [ 'dependencies', 'devDependencies' ]
        },

        // Can post process config object before it gets passed to grunt
        postProcess: function( config ) {},

        // Allows to manipulate the config object before it gets merged with the data object
        preMerge: function( config, data ) {}
    } );

};

// Karma configuration
// Generated on Mon Sep 21 2015 14:52:54 GMT+0200 (CEST)

module.exports = function( config ) {
    config.set( {

        // Base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'src/',

        // Frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'mocha', 'requirejs', 'chai', 'sinon' ],

        // List of files / patterns to load in the browser
        files: [
            { pattern: 'components/**/*.js', included: false, served: true },
            'components/app/main-test.js'
        ],

        // List of files to exclude
        exclude: [
        ],

        // Preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'components/app/utils/**/!(*.spec|karma-testrunner).js': [ 'coverage' ]
        },

        // Test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'mocha', 'coverage' ],

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'PhantomJS' ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // optionally, configure the reporter
        coverageReporter: {
            dir: '../artifacts/test/coverage/',
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
                { type: 'teamcity', subdir: '.', file: 'teamcity.txt' }
            ]
        }
    } );
};

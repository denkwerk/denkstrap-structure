module.exports = function( grunt, options ) {
    return {
        test: {
            configFile: 'karma.conf.js',
            singleRun: true
        },

        ci: {
            configFile: 'karma.conf.js',
            singleRun: true,
            reporters: [ 'jenkins', 'coverage' ],
            jenkinsReporter: {
                outputFile: '../<%= testResultPath %>karma-tests.junit.xml',
                suite: 'denkstrap-structure'
            }
        }
    };
};

module.exports = function( grunt, options ) {
    return {
        test: {
            configFile: 'karma.conf.js',
            singleRun: true
        },

        ci: {
            configFile: 'karma.conf.js',
            singleRun: true,
            reporters: [ 'jenkins' ],
            jenkinsReporter: {
                outputFile: '../<%= testResultPath %>karma-tests.xml',
                suite: 'deka-if6-modules'
            }
        }
    };
};

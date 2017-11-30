/**
 * Grunt requirejs plugin
 * https://github.com/gruntjs/grunt-contrib-requirejs
 */

module.exports = function( grunt, options ) {

    return {
        development: {
            options: {
                appDir: '<%= srcPath %>components',
                baseUrl: './app',
                mainConfigFile: '<%= srcPath %>components/app/main.js',
                dir: '<%= distPath %>js',

                fileExclusionRegExp: /\.(njs|scss|gitkeep)/,

                findNestedDependencies: true,
                optimizeAllPluginResources: true,
                removeCombined: false,
                optimize: 'none',

                modules: [
                    {
                        name: 'main'
                    }
                ]
            }
        },

        production: {
            options: {
                appDir: '<%= srcPath %>components',
                baseUrl: './app',
                mainConfigFile: '<%= srcPath %>components/app/main.js',
                dir: '<%= distPath %>js',

                fileExclusionRegExp: /\.(njs|scss|gitkeep)/,

                findNestedDependencies: true,
                optimizeAllPluginResources: true,
                removeCombined: false,

                paths: {

                    // Use production config for production build
                    config: 'config/production'
                },

                modules: [
                    {
                        name: 'main',
                        include: [

                            // Change to your chosen event dispatcher
                            'utils/event'
                        ]
                    }
                ]
            }
        }
    };
};

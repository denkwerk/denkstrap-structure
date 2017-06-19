module.exports = function( grunt, options ) {
    return {
        styleguide: {
            options: {
                inputPath: '<%= distPath %>tmp',
                outputPath: '<%= distPath %>styleguide',
                docPath: '<%= srcPath %>components',
                webPath: '/styleguide',
                stylesheets: [
                    '/css/main.css',
                    '/styleguide/css/sg-custom.css'
                ],
                footerScripts: [
                    '/js/app/main.js'
                ]
            }
        }
    };
};

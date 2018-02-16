module.exports = function( grunt, options ) {
    return {
        styleguide: {
            options: {
                inputPath: '<%= distPath %>tmp',
                inputPagesPath: '<%= distPath %>pages',
                outputPagesPath: 'pages',
                outputPath: '<%= distPath %>styleguide',
                docPath: '<%= srcPath %>components',
                webPath: '/styleguide',
                templateStyleguideStylesheet: '<%= distPath %>styleguide/css/sg-custom.css',
                footerScripts: [
                    '/js/app/main.js'
                ],
                // define this, if you want to define all the styleguide templates by your own
                //templatesPath: '<%= srcPath %>styleguide',

                // path to the content template
                templateSrcPath: '<%= srcPath %>styleguide',
                iframeTemplate: 'iframe.njk'
            }
        }
    };
};

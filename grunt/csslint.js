/**
 * Grunt CSSLint plugin
 * https://github.com/gruntjs/grunt-contrib-csslint
 */
module.exports = {
    options: {
        csslintrc: '.csslintrc',
        formatters: [
            {
                id: 'checkstyle-xml',
                dest: 'artifacts/test/csslint.xml'
            },
            {
                id: 'text'
            }
        ]
    },
    development: {
        src: [ '<%= distPath %>css/*.css' ]
    },
    production: {
        src: [ '<%= distPath %>css/*.css' ]
    }
};

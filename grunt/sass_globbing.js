// Include all files alphabetically from a folder
// https://github.com/DennisBecker/grunt-sass-globbing/

module.exports = function (grunt, options) {
    return {
        dist: {
            files: {
                '<%= srcPath %>components/sass/import/variables.scss': '<%= srcPath %>components/sass/variables/**/*.scss',
                '<%= srcPath %>components/sass/import/mixins.scss': '<%= srcPath %>components/sass/mixins/**/*.scss',
                '<%= srcPath %>components/sass/import/vendor.scss': '<%= srcPath %>components/vendor/**/*.scss',
                '<%= srcPath %>components/sass/import/site.scss': '<%= srcPath %>components/site/**/*.scss',
                '<%= srcPath %>components/sass/import/patterns.scss': '<%= srcPath %>components/patterns/**/*.scss',
                '<%= srcPath %>components/sass/import/modules.scss': '<%= srcPath %>components/modules/**/*.scss'
            },
            options: {
                useSingleQuotes: true
            }
        }
    };
};

// Include all files alphabetically from a folder
// https://github.com/DennisBecker/grunt-sass-globbing/

module.exports = function (grunt, options) {
    return {
        dist: {
            files: {
                '<%= srcPath %>components/sass/import/variables.scss': '<%= srcPath %>components/sass/variables/**/*.scss',
                '<%= srcPath %>components/sass/import/mixins.scss': '<%= srcPath %>sass/mixins/**/*.scss'
            }
        }
    };
};

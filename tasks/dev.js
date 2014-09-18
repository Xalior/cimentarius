module.exports = function(grunt) {
    grunt.registerTask('dev', ['concat', 'sass', 'imagemin', 'autoprefixer', 'copy']);
    grunt.registerTask('watch:dev', function() {
        grunt.config('watch', grunt.config.get(['watch']).dev);
        grunt.task.run('watch');
    });
};

module.exports = function(grunt) {
    grunt.registerTask('dev', ['concat', 'sass', 'imagemin', 'autoprefixer', 'cssmin', 'copy']);
    grunt.registerTask('watch:dev', function() {
        console.log(grunt.config.get(['watch']).dev);
        grunt.config('watch', grunt.config.get(['watch']).dev);
        grunt.task.run('watch');
    });
};

module.exports = function(grunt) {
  grunt.registerTask('release', ['default']);
    grunt.registerTask('watch:release', function() {
        grunt.config('watch', grunt.config.get(['watch']).release);
        grunt.task.run('watch');
    });
};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      bar: {src: ['./client/js/*.js'],
        dest: './client/js/dist/deployment.js'},
    },

    uglify: {
      bar: {src: './client/js/dist/deployment.js',
            dest: './client/js/dist/deployment.min.js'},
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', function(n) {
    grunt.task.run([
      'concat'
    ]);
  });
};
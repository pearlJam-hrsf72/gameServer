module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      bar: {src: ['./client/js/*.js'],
        dest: './client/js/dist/deployment.js'}
    },

    uglify: {
      bar: {src: './client/js/dist/babelDeployment.js',
        dest: './client/js/dist/deployment.min.js'}
    },

    shell: {
      babel: {
        command: 'babel client/js/dist/deployment.js --out-file client/js/dist/babelDeployment.js'
      },
      gitadd: {
        command: [
          'git add .',
          'git commit -m "this is an auto-commit through grunt"'
        ].join(' && ')
      },
      heroku: {
        command: 'git push heroku +HEAD:master'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-exec')

  grunt.registerTask('babel', function (n) {
    grunt.task.run([
      'shell:babel'
    ])
  })

  grunt.registerTask('build', function (n) {
    grunt.task.run([
      'concat', 'babel', 'uglify'
    ])
  })

  grunt.registerTask(['commit'], function (n) {
    grunt.task.run([
      'shell:gitadd'
    ])
  })

  grunt.registerTask('deploy', function (n) {
    grunt.task.run([
      'build', 'commit', 'shell:heroku'
    ])
  })
}

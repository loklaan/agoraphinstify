module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: ''
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'server.js', 'routes/*', 'public/js/*'],
      options: {
        // None
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default tasks.
  grunt.registerTask('setup', ['wiredep']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', []);

};
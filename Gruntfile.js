module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: ''
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-wiredep');

  // Default tasks.
  grunt.registerTask('setup', ['wiredep']);
  grunt.registerTask('default', []);

};
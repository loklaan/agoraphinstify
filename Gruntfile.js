module.exports = function(grunt) {

  // Environment targets
  var _plugins = ['karma-jasmine', 'karma-coverage'];
  var _browsers = [];
  if (process.env.TRAVIS) {
    console.log('TravisCI environment detected by Grunt.');
    _plugins.push('karma-firefox-launcher');
    _plugins.push('karma-phantomjs-launcher');
    _browsers.push('Firefox');
    _browsers.push('PhantomJS');
  } else {
    _plugins.push('karma-chrome-launcher');
    _plugins.push('karma-firefox-launcher');
    _plugins.push('karma-phantomjs-launcher');
    _browsers.push('Chrome');
    _browsers.push('Firefox');
    _browsers.push('PhantomJS');
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: [
          'public/views/index.html'
        ]
      },
      testenv: {
        devDependencies: true,
        src: [
          'karma.conf.js'
        ],
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower#dev:*(\S*))(\n|\r|.)*?(\/\/\s*endbower#dev)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'server.js', 'routes/*', 'public/js/*'],
      options: {
        // None
      }
    },
    jasmine_node: {
      options: {
        specFolders: ['tests/server/'],
        forceExit: false,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        captureExceptions: true,
        showColors: true
      },
      coverage: {
          savePath : "coverage/server/",
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: _browsers,
        plugins: _plugins
      },
      continuous: {
        singleRun: true,
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-karma');

  // Default tasks.
  grunt.registerTask('setup', ['wiredep']);
  // jasmine_node must come after karma.conf.js gets
  // wrongfullly covered
  grunt.registerTask('test', ['jshint', 'karma:continuous', 'jasmine_node']);
  grunt.registerTask('default', []);

};
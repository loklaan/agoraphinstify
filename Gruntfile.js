module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

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
        ],
        exclude: [
          'public/libs/leaflet/dist/leaflet-src.js',
          'public/libs/angular-loading-bar/build/loading-bar.css'
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
        },
        exclude: [
          'public/libs/leaflet/dist/leaflet-src.js',
        ]
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
      },
      continuous: {
        singleRun: true,
        browsers: _browsers,
        plugins: _plugins
      },
      quick: {
        browsers: ['PhantomJS'],
        plugins: ['karma-jasmine', 'karma-coverage', 'karma-phantomjs-launcher']
      }
    },

    useminPrepare: {
      html: 'public/views/index.html',
      options: {
        dest: 'public/'
      }
    },

    usemin: {
      html:['public/dist/index.html']
    },

    copy: {
      main: {
        src: 'public/views/index.html', dest: 'public/dist/index.html'
      }
    }

  });

  // Default tasks.
  grunt.registerTask('default', []);
  grunt.registerTask('setup', ['wiredep']);
  grunt.registerTask('heroku:production', [
    'wiredep',
    'copy',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin']);
  // jasmine_node must come after karma.conf.js gets
  // wrongfullly covered
  grunt.registerTask('test', ['jshint', 'karma:continuous', 'jasmine_node']);

};
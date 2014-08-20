module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: [
      'jasmine'
    ],
    files: [
      // bower#dev:js
      'public/libs/jquery/dist/jquery.js',
      'public/libs/bootstrap/dist/js/bootstrap.js',
      'public/libs/angular/angular.js',
      'public/libs/angular-route/angular-route.js',
      'public/libs/angular-resource/angular-resource.js',
      'public/libs/angular-animate/angular-animate.js',
      'public/libs/leaflet-dist/leaflet.js',
      'public/libs/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'public/libs/angular-mocks/angular-mocks.js',
      // endbower#dev
      'public/js/*.js',
      'tests/client/*.js'
    ],
    preprocessors: {
      'public/js/*.js': ['coverage'],
      'tests/client/*.js': ['coverage']
    },
    exclude: [],
    reporters: [
      'progress',
      'coverage'
    ],
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/client',
      subdir: function(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      }
    },
    port: 1412,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    captureTimeout: 60000,
    singleRun: false,
    browsers: [],
    plugins: []
  });
};
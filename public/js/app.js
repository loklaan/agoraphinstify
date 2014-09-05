/**
 * Agoraphinstify Main module.
 */

(function() {

  var module = angular.module('AgoraApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngAudio',
    'leaflet-directive',
    'angular-loading-bar'
    ]);

  module.config([
    '$locationProvider',
    '$routeProvider',
    'cfpLoadingBarProvider',
  function($locationProvider, $routeProvider, cfpLoadingBarProvider) {

    cfpLoadingBarProvider.includeBar = false;

    var map = {
      templateUrl: '../views/partials/map.html',
      controller: 'MapController',
      controllerAs: 'map',
      reloadOnSearch: false
    };
    var instify = {
      templateUrl: '/partials/instify',
      controller: 'InstifyController',
      controllerAs: 'instify'
    };
    $routeProvider.
    // Map view homepage
    when('/map', map).
    // Instify view by event
    when('/event/:eventId/artist/:performerId', instify).
    otherwise({
      redirectTo: '/map'
    });

    $locationProvider.html5Mode(true);
  }]);

})();
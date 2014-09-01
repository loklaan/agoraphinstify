/**
 * Agoraphinstify Main module.
 */

(function() {

  var module = angular.module('AgoraApp', [
    'ngRoute',
    'ngResource',
    'leaflet-directive',
    'angular-loading-bar'
    ]);

  module.config([
    '$routeProvider',
    'cfpLoadingBarProvider',
  function($routeProvider, cfpLoadingBarProvider) {

    cfpLoadingBarProvider.includeBar = false;

    $routeProvider.
    // Map view homepage
    when('/', {
      templateUrl: '../views/partials/map.html',
      controller: 'MapController',
      controllerAs: 'map'
    }).
    // Instify view by event
    when('/e/:eventId/:performerId', {
      templateUrl: '../views/partials/instify.html',
      controller: 'InstifyController',
      controllerAs: 'instify'
    }).
    // Instify view by venue
    when('/v/:venueId', {
      templateUrl: '../views/partials/instify.html',
      controller: 'InstifyController',
      controllerAs: 'instify'
    });
  }]);

})();
/**
 * Agoraphinstify Main module.
 */

(function() {

  var module = angular.module('AgoraApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'leaflet-directive',
    'angular-loading-bar'
    ]);

  module.config([
    '$locationProvider',
    '$routeProvider',
    'cfpLoadingBarProvider',
  function($locationProvider, $routeProvider, cfpLoadingBarProvider) {

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
      templateUrl: '/partials/instify',
      controller: 'InstifyController',
      controllerAs: 'instify'
    }).
    // Instify view by venue
    when('/v/:venueId', {
      templateUrl: '/partials/instify',
      controller: 'InstifyController',
      controllerAs: 'instify'
    });

    $locationProvider.html5Mode(true);
  }]);

})();
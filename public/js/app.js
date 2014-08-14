/**
 * Agorophinstify Main module.
 */

(function() {

  var module = angular.module('AgoroApp', [
    'ngRoute',
    'AgoroApp.controllers',
    'AgoroApp.directives',
    'AgoroApp.services'
    ]);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    // Map view homepage
    when('/', {
      templateUrl: 'partials/map.html',
      controller: 'MapController'
    }).
    // Instify view by event
    when('/event/:eventId', { // 
      templateUrl: 'partials/instify.html',
      controller: 'InstifyController'
    }).
    // Instify view by venue
    when('/venue/:venueId', {
      templateUrl: 'partials/instify.html',
      controller: 'InstifyController'
    });
  }]);
  
})();
/**
 * Agoraphinstify Images Controller.
 */

 (function() {

  var module = angular.module('AgoraApp');

  /**
   * Images Controller
   * Handles updating the Map with new data.
   */
  module.controller('ImagesController', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'Events',
    'EventMarkers',
    'Images',
  function($scope, $rootScope, $routeParams, $timeout, Events, EventMarkers, Images) {
    // TODO: stop map requests
    $scope.images = [];

    Events.getEvent({id: $routeParams.eventId},
      function(event) {
        Images.startGet(event.venue_name, event.latitude, event.longitude);
      }, function(reasion) {
        console.error(reason);
      });

    $rootScope.$on('images:update', function(event, newImages) {
      $scope.images = newImages;
    });
  }]);

})();
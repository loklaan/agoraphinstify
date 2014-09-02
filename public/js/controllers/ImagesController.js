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
    Events.stopGet();

    $scope.images = [];
    $scope.event = {};
    $scope.hasMore = false;
    $scope.hasFailed = false;

    $scope.showWarning = function() {
      return $scope.hasFailed && $scope.images.length === 0;
    };

    $scope.getMoreImages = function() {
      $scope.hasMore = false;
      Images.getNext();
    };

    $scope.getImages = function() {
      Events.getEvent({id: $routeParams.eventId},
        // Success API call
        function(event) {
          $scope.event = event;
          Images.startGet(event.venue_name, event.latitude, event.longitude);
        },
        // Failed API call
        function(reasion) {
          console.error(reason);
        });
    };
    $scope.getImages();


    $rootScope.$on('images:update', function(event, newImages, hasMore) {
      $scope.images = newImages;
      $scope.hasMore = hasMore;
    });

    $rootScope.$on('images:locationfail', function(event, venueName) {
      $scope.hasFailed = true;
    });
  }]);

})();
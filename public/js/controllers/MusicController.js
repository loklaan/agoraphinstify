/**
 * Agoraphinstify Music Controller.
 */

 (function() {

  var module = angular.module('AgoraApp');

  /**
   * Music Controller
   * Handles audio queuing and playback. Also manages the Users
   * GeoIP information.
   */
  module.controller('MusicController', [
    '$scope',
    '$rootScope',
    '$route',
    '$routeParams',
    '$timeout',
    'Music',
    'Events',
  function($scope, $rootScope, $route, $routeParams, $timeout, Music, Events) {

    // Artist queuing depends on Browsers URL location
    var firstRoute = false;
    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      if (angular.isDefined(current.params.performerId)) {
        // Embed Spotify iframe causes chain route digests on first load
        if (firstRoute && angular.isUndefined(previous)) {
          return;
        }
        firstRoute = true;
        Events.getPerformer(current.params.performerId,
          function(performer) {
            Music.queueNewArtist(performer.name);
          }
        );
      }
    });

    $scope.track = false;
    $scope.playing = false;
    $scope.pulseCounter = 0;

    $scope.pausePlay = function() {
      if ($scope.playing) {
        Music.pause();
      } else {
        Music.play();
      }
    };

    $scope.next = function() {
      Music.next();
    };

    $scope.back = function() {
      Music.back();
    };

    $rootScope.$on('music:newtrack', function(event, track) {
      $scope.track = track;
      $scope.pulseCounter++;
    });

    $rootScope.$on('music:playing', function(event) {
      $scope.playing = true;
    });

    $rootScope.$on('music:paused', function(event) {
      $scope.playing = false;
    });

  }]);

})();
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
    '$location',
    'Music',
    'Events',
  function($scope, $rootScope, $route, $routeParams, $location, Music, Events) {

    // Artist queuing depends on Browsers URL location
    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      if (angular.isDefined(current.params.performerId)) {
        Events.getPerformer(current.params.performerId,
          function(performer) {
            Music.queueNewArtist(performer.name);
          }
        );
      }
    });

    $scope.track = false;
    $rootScope.$on('music:playing', function(event, track) {
      $scope.track = track;
    });

    $scope.playing = false;
    $scope.playBtnClass = function() {
      var cssClass = 'glyphicon glyphicon-';
      cssClass += playing ? 'play' : 'pause';
      return cssClass;
    };

    $scope.pausePlay = function() {
      if ($scope.playing) {
        $scope.playing = false;
        Music.pause();
      } else {
        $scope.playing = true;
        Music.play();
      }
    };
    $scope.pause = function() {
      $scope.playing = false;
      Music.pause();
    };
    $scope.next = function() {
      $scope.playing = true;
      Music.next();
    };
    $scope.back = function() {
      $scope.playing = true;
      Music.back();
    };

  }]);

})();
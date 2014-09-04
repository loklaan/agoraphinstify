/**
 * Music Track Player
 *
 * Element
 *
 * Player widget that is hooked up to the Music
 * Controller. Should be persistent across the app.
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.directive('trackPlayer', [
  function() {

    return {

      restrict: 'E',

      templateUrl: '/partials/trackplayer',

      controller: 'MusicController',

      controllerAs: 'musicCtrl'

    };

  }]);

})(_);
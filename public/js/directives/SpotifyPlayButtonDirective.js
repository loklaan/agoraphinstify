/**
 * Spotify Modal for embedded 'Play Button'
 *
 * Element
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.directive('spotifyModal', [
  function() {

    return {

      restrict: 'E',

      templateUrl: '/partials/spotifyplaybutton',

      controller: 'SpotifyPlayButtonController',

      controllerAs: 'spotifyPlayCtrl'

    };

  }]);

})(_);
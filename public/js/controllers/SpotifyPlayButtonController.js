/**
 * Agoraphinstify Spotify Play Button Controller.
 */

 (function() {

  var module = angular.module('AgoraApp');

  /**
   * Play Button embedded widjet Controller.
   * Handles updating the spotify URI for the iframe src.
   */
  module.controller('SpotifyPlayButtonController', [
    '$scope',
    '$rootScope',
    '$sce',
    '$timeout',
    'Music',
  function($scope, $rootScope, $sce, $timeout, Music) {

    /* Subscribing */
    $rootScope.$on('music:newuri', function(event, uri) {
      $timeout(function() {
        $scope.spotifyEmbedUrl = buildSpotifyEmbedUrl(uri);
      }, 3000);
    });

    function buildSpotifyEmbedUrl(spotifyURI) {
      return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=' + spotifyURI);
    }

  }]);

})();
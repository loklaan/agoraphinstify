/**
 * Agorophinstify Controllers module.
 */

 (function() {

  var module = angular.module('AgoroApp');

  /**
   * Map Controller
   * Handles updating the Map with new data.
   */
  module.controller('MapController', [
    '$scope',
    'leafletData',
    'Events',
    'EventMarkers',
    '$rootScope',
    '$timeout',
  function($scope, leafletData, Events, EventMarkers, $rootScope, $timeout) {

    // MAP DEFAULTS
    angular.extend($scope, {
      default: {
        zoomControl: false
      },
      center: {
        autoDiscover: true,
        zoom: 14,
        lat: 0,
        lng: 0
      },
      tiles: {
        url: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        options: {
          attribution: '&copy; <a href="http://stamen.com">Stamen Design</a> Tile Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
        }
      },
      markers: {},
      _map: {},
      _scrubBuffer: {}
    });

    leafletData.getMap().then(function(map) {
      $scope._map = map;

      // map changes trigger new eventful query chain
      $scope._map.addEventListener('moveend resize', function() {
        // prevent new eventful request from instaly happening on
        // new map changes
        $timeout.cancel($scope._scrubBuffer);
        $scope._scrubBuffer = $timeout(callEventful, 1500);
      });
    });

    // EventMarkers ng service will publish new markers
    $rootScope.$on('markers:update', function(event, newMarkers) {
      $scope.markers = newMarkers;
    });

    function callEventful() {
      var within = getApproxMapRadiusKM($scope._map);
      within = within < 25 ? within : 25; // limit events search radius to 25km
      var center = $scope._map.getCenter();
      var results = Events.startGet({
        where: center.lat + ',' + center.lng,
        within: within
      });
    }

    function getApproxMapRadiusKM() {
      // FIX: divide by something accurate
      return $scope._map.getBounds().getNorthEast().
      distanceTo($scope._map.getCenter()) / 1000;
    }

  }]);

  module.controller('InstifyController', [
    '$scope',
    '$routeParams',
  function($scope, $routeParams) {



  }]);

})();
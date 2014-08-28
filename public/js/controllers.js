/**
 * Agorophinstify Controllers module.
 */

 (function() {

  var module = angular.module('AgoroApp.controllers', [
    'leaflet-directive'
    ]);

  /**
   * Map Controller
   * Handles updating the Map with new data.
   */
  module.controller('MapController', [
    '$scope',
    'leafletData',
    'Eventful',
    'Markers',
    '$rootScope',
  function($scope, leafletData, Eventful, Markers, $rootScope) {

    // MAP DEFAULTS
    angular.extend($scope, {
      default: {
        zoomControl: false
      },
      center: {
        autoDiscover: true,
        zoom: 14
      },
      tiles: {
        url: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        options: {
          attribution: '&copy; <a href="http://stamen.com">Stamen Design</a> Tile Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
        }
      },
      markers: {}
    });

    leafletData.getMap().then(function(map) {
      // map changes update triggers new eventful query chain
      map.addEventListener('moveend resize', function() {
        var within = getApproxMapRadiusKM(map);
        within = within < 25 ? within : 25; // limit events search radius to 25km
        var center = map.getCenter();
        var results = Eventful.startGet({
          where: center.lat + ',' + center.lng,
          within: within
        });
      });
    });

    // Markers ng service will publish new markers
    $rootScope.$on('markers:update', function(event, newMarkers) {
      $scope.markers = newMarkers;
    });

  }]);

  module.controller('InstifyController', [
    '$scope',
    '$routeParams',
  function($scope, $routeParams) {



  }]);

  function getApproxMapRadiusKM(map) {
    // FIX: divide by something accurate
    return map.getBounds().getNorthEast().distanceTo(map.getCenter()) / 1000;
  }

})();
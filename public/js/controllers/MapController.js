/**
 * Agoraphinstify Map Controller.
 */

 (function() {

  var module = angular.module('AgoraApp');

  /**
   * Map Controller
   * Handles updating the Map with new data.
   */
  module.controller('MapController', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$location',
    'leafletData',
    'Events',
    'EventMarkers',
    'Map',
  function($scope, $rootScope, $timeout, $location, leafletData, Events, EventMarkers, Map) {

    var route = {
          lat: undefined,
          lng: undefined
        },
        search = $location.search();
    if (search.lat && search.lng) {
      route.lat = parseFloat(search.lat);
      route.lng = parseFloat(search.lng);
    }

    // MAP DEFAULTS
    angular.extend($scope, {
      default: {
        zoomControl: false
      },
      center: {
        autoDiscover: Map.info() === null && angular.isUndefined(route.lat) ?
          true :
          false,
        zoom: Map.info() === null ? 14 : Map.info().zoom,
        lat: Map.info() === null ?
          (angular.isDefined(route.lat) ? route.lat : 0) :
          Map.info().lat,
        lng: Map.info() === null ?
          (angular.isDefined(route.lng) ? route.lng : 0) :
          Map.info().lng
      },
      tiles: {
        url: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        options: {
          attribution: '&copy; <a href="http://stamen.com">Stamen Design</a> Tile Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
        }
      },
      markers: EventMarkers.markers(),
      _map: {},
      _scrubBuffer: {}
    });

    leafletData.getMap().then(function(map) {
      $scope._map = map;

      if (Map.info() !== null) {
        buildUrl(Map.info().lat, Map.info().lng);
        $timeout(function() {
          map.on('moveend resize', mapWatcher);
        }, 200);
      } else {
        map.on('moveend resize', mapWatcher);

        // hotlinking doesn't trigger otherwise
        if (route.lat) {
          map.fire('moveend');
        }
      }
    });

    // EventMarkers ng service will publish new markers
    $rootScope.$on('markers:update', function(event, newMarkers) {
      $scope.markers = newMarkers;
    });

    // prevent map changes from instantly making eventful request
    function mapWatcher() {
      $timeout.cancel($scope._scrubBuffer);
      $scope._scrubBuffer = $timeout(callEventful, 1500);
    }

    function callEventful() {
      // Update stored map
      updateMapInfo();
      var within = getApproxMapRadiusKM($scope._map);
      within = within < 25 ? within : 25; // limit events search radius to 25km
      var center = $scope._map.getCenter();
      buildUrl(center.lat, center.lng);
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

    function updateMapInfo() {
      Map.info({
        zoom: $scope._map.getZoom(),
        lat: $scope._map.getCenter().lat,
        lng: $scope._map.getCenter().lng
      });
    }

    function buildUrl(lat, lng) {
      $location.search({lat: lat, lng: lng});
    }

  }]);

  module.controller('InstifyController', [
    '$scope',
    '$routeParams',
  function($scope, $routeParams) {



  }]);

})();
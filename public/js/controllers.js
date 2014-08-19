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
    'EventSearch',
  function($scope, leafletData, EventSearch) {

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
      // map changes updates eventful data
      map.addEventListener('moveend resize', function() {
        var within = getApproxMapRadiusKM(map);
        var center = map.getCenter();
        var results = EventSearch.get({
          where: center.lat + ',' + center.lng,
          within: within
        }, function() {
          console.log('Got events...');
          window.markers = $scope.markers = {};
          results.events.event.forEach(function(event, index, events) {
            if (event.performers) {
              var marker = event.venue_name.replace(/\s|\W/g, '').toLowerCase();
              if ($scope.markers[marker]) {
                $scope.markers[marker].message += ', ' + event.performers.performer.name;
              } else {
                $scope.markers[marker] = {
                  lat: parseFloat(event.latitude),
                  lng: parseFloat(event.longitude),
                  message: event.venue_name + ': ' + event.performers.performer.name,
                  draggable: false
                };
              }
            } else {
              console.log('Got no performers...');
            }
          });
        });

      });
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
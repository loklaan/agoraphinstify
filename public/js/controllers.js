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
      // do stuff with map object
    });

  }]);

  module.controller('InstifyController', [
    '$scope',
    '$routeParams',
  function($scope, $routeParams) {



  }]);

})();
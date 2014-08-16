/**
 * Agorophinstify Controllers module.
 */

 (function() {

  var module = angular.module('AgoroApp.controllers', [
    'leaflet-directive'
    ]);

  module.controller('MapController', ['$scope', 'leafletData', function($scope, leafletData) {

    // MAP DEFAULTS
    $scope.default = {
      zoomControl: false
    };
    $scope.center = {
      autoDiscover: true,
      zoom: 14
    };
    $scope.tiles = {
      url: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
      options: {
        attribution: '&copy; <a href="http://stamen.com">Stamen Design</a> Tile Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors'
      }
    };

    leafletData.getMap().then(function(map) {
      // do stuff with map object
    });
  }]);

  module.controller('InstifyController', ['$scope', '$routeParams', function($scope, $routeParams) {

  }]);

})();
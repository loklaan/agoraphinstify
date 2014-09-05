/**
 * Map Service for storing a Leaflet Map information
 */

(function() {

  var module = angular.module('AgoraApp');

  module.factory('Map', [
  function() {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var MapFactory = {},
        _map = null;


/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    /**
     * Gets the map info. If provided a object, will set that
     * before returning.
     * @param  {[object]} map  Optional map info object
     * @return {object}        Stored map info object
     */
    MapFactory.info = function(map) {
      if (angular.isDefined(map)) {
        _map = map;
      }

      return _map;
    };


    return MapFactory;

  }]);

})();
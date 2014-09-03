/**
 * Telize API Service
 *
 * Responsible for getting the geo ip information of the User.
 * This information is used solely for determining the Country
 * Code of the visitingg User. Only the Country Code will be
 * transported to the server.
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.factory('GeoIP', [
    '$resource',
    '$rootScope',
  function($resource, $rootScope) {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var API = 'http://www.telize.com/geoip';

    var GeoIPFactory = {},
        _geoip = null;


/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    GeoIPFactory.getVisitorGeoIP = function() {
      GeoIPLocation.get(
        // Success API call
        function(geoipData) {
          _geoip = geoipData;
          $rootScope.$broadcast('geoip:new', _geoip);
        },
        // Failed API call
        function(reason) {
          console.error(reason);
        }
      );
    };

    GeoIPFactory.getCountryCode = function() {
      return _geoip ? _geoip.country_code : null;
    };


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    var GeoIPLocation = $resource(API, {},
      {
        get: {
          method: 'GET'
        }
      });


/* ==========================================================================
   Immediately Invoked
   ========================================================================== */

    GeoIPFactory.getVisitorGeoIP();


    return GeoIPFactory;

  }]);

})(_);
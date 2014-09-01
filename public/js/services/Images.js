/**
 * Agoraphinstify Images Service module.
 */

(function() {

  var module = angular.module('AgoraApp');

  var api = {
    eventful: {
      url: '/api/spotify'
    }
  };

  /**
   * Instagram API Service (via proxy API)
   * @return {object} Exposes a service property, startGet.
   *
   *   @startGet {function}
   *       Starts querying for all available images for a location
   */
  module.factory('Images', [
    '$resource',
  function($resource) {
    var _images = [], _request = {id: 0};

    var NearbyLocations = $resource(api.spotify.url + '/locations/search',
      {},
      {
        get: {
          method: 'GET',
          params: {
            distance: 50
          }
        }
      });

    var LocationMedia = $resource(api.spotify.url + '/locations/:locationId/media/recent',
      {},
      {
        get: {
          method: 'GET'
        }
      });

    /**
     * Finds Instagram location entities within a 50m radius of the
     * coordinates that match the Venue name. Begins Image queries
     * for venue matched locations.
     * @param  {String} venueName   Name of the location / venue
     * @param  {object} params      API query key/values
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocations(venueName, params, currentReq) {
      NearbyLocations.get(params,
        function(results) {
          if (currentReq !== _request.id) {
            return;
          }

          // TODO: add timeout for response errors
          var matchingVenues = [];
          results.data.forEach(function(location, index, locations) {
            if (venue.toLowerCase() === location.name.toLowercase()) {
              matchingVenues.push(location.id);
            }
          });
          matchingVenues.forEach(function(locationId, index, locationIds) {
            getImages({locationId: locationId}, currentReq);
          });
        }, function(reason) {
          console.error(reason);
        });
    }

    /**
     * Gets Instagram images for an Instagram location record. Broadcasts an
     * update event on new Images.
     * @param  {object} params      API query key/values
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getImages(params, currentReq) {
      LocationMedia.get(params,
        function(results) {
          if (currentReq !== _request.id) {
            return;
          }

          results.data.forEach(function(image, index, images) {
            _images.push(image.images.standard_resolution);
          });

          $rootScope.$broadcast('images:update', _images);

          if (angular.isDefined(results.pagination)) {
            params.max_id = results.pagination.nex_max_id;
            getImages(params, currentReq);
          }
        }, function(reason) {
          console.error(reason);
        });
    }

    /**
     * Starts getting new available images for a venue location.
     * @param  {String} venueName Name of the location / venue. Usually Eventfuls.
     * @param  {Number} latitude
     * @param  {Number} longitute
     */
    function getNewImages(venueName, latitude, longitute) {
      resetState();
      getLocations(venueName, {lat: latitude, lng: longitute}, ++_request.id);
    }

    function resetState() {
      _images = [];
    }

    // see Service comments
    return {
      startGet: getNewImages
    };
  }]);

})();

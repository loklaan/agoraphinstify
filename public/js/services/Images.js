/**
 * Agoraphinstify Images Service module.
 */

(function(_) {

  var module = angular.module('AgoraApp');

  var api = {
    instagram: {
      url: '/api/instagram'
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
    '$rootScope',
  function($resource, $rootScope) {
/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var _images = [],
        _request = {id: 0},
        LOCATION_REPEATS = 10;


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    var NearbyLocations = $resource(api.instagram.url + '/locations/search',
      {},
      {
        get: {
          method: 'GET',
          params: {
            distance: 50
          }
        }
      });

    var LocationMedia = $resource(api.instagram.url + '/locations/:locationId/media/recent',
      {},
      {
        get: {
          method: 'GET'
        }
      });


/* ==========================================================================
   Factory Functions
   ========================================================================== */

    /**
     * Finds Instagram location entities within a 50m radius of the
     * coordinates that match the Venue name. Begins Image queries
     * for venue matched locations.
     * @param  {String} venueName   Name of the location / venue
     * @param  {object} params      API query key/values
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocations(venueName, params, currentReq) {
      var plusOrMinus = Math.round() < 0.5 ? -1 : 1;
      var tempParams = params;

      do {
        NearbyLocations.get(tempParams,
          function(results) {
            if (currentReq !== _request.id) {
              return;
            } else if (results.data.length > 0) {

              var resultMatches = _.filter(results.data,
                function(location) {
                  var isMatchup = compareVenueNames(venueName, location.name);
                  if (isMatchup) {
                    console.log('Find matching venue: ' + location.name);
                  }
                  return isMatchup;
              });

              _request.imagesParams = _.union(_request.imagesParams,
                _.map(resultMatches, function(location) {
                  return {locationId: location.id};
                }));

              if (++_request.responses >= LOCATION_REPEATS) {
                getLocationImages(currentReq);
              }
            }
          }, function(reason) {
            console.error(reason);
          });

        tempParams.lat =  params.lat + plusOrMinus * Math.random() * 0.001;
        tempParams.lng =  params.lng + plusOrMinus * Math.random() * 0.001;
        _request.attempts--;
      } while (_request.attempts > 0);
    }

    function compareVenueNames(one, two) {
      one = one.toLowerCase();
      two = two.toLowerCase();
      return one.indexOf(two) !== -1 || two.indexOf(one) !== -1;
    }

    /**
     * Gets Instagram images for an Instagram location record. Broadcasts an
     * update event on new Images.
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocationImages(currentReq) {
      _.forEach(_request.imagesParams, function(params, index) {
        LocationMedia.get(params,
          function(results) {
            if (currentReq !== _request.id) {
              return;
            }

            _.forEach(results.data, function(imageData) {
              _images.push(imageData.images.standard_resolution);
            });

            $rootScope.$broadcast('images:update', _images);

            if (angular.isDefined(results.pagination)) {
              // Queue up params for getNextImagesPage() that have other pages
              _request.imagesParams[index].max_id = results.pagination.next_max_id;
            } else {
              // Remove params that have no pages left
              _request.imagesParams = _.without(_request.imagesParams, params);
            }
          }, function(reason) {
            console.error(reason);
          });
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
      getLocations(venueName, {lat: parseFloat(latitude), lng: parseFloat(longitute)}, ++_request.id);
    }

    function getNextImagesPage() {
      getLocationImages(_request.id);
    }

    function resetState() {
      _images = [];
      _request.attempts = LOCATION_REPEATS;
      _request.responses = 0;
      _request.imagesParams = [];
      _request.matches = [];
    }

    function stopRequests() {
      _request.id++;
    }

    // see Service comments
    return {
      startGet: getNewImages,
      getNext: getNextImagesPage,
      stopGet: stopRequests,
      images: function() {
        return _images;
      }
    };
  }]);

})(_);

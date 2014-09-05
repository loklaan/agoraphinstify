/**
 * Instagram API Service (via proxy API)
 *
 * Responsible for getting images from a particular
 * location. See Factory Public Functions for more.
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.factory('Images', [
    '$resource',
    '$rootScope',
  function($resource, $rootScope) {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

   var API = '/api/instagram',
       LOCATION = {
        attempts: 20,
        distance: 50,
      };

    var ImagesFactory = {},
        _images = [],
        _request = {
          id: 0
        };

/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    /**
     * Starts getting new available images for a venue location and begins a queue
     * on the Service for next available images.
     *
     * @param  {String} venueName  Name of the location / venue. Usually Eventfuls.
     * @param  {Number} latitude
     * @param  {Number} longitute
     */
    ImagesFactory.startGet = function(venueName, latitude, longitute) {
      resetState();
      _request.id += 1;
      getLocations({
        name: venueName,
        lat: parseFloat(latitude),
        lng: parseFloat(longitute)
      }, _request.id);
    };

    /**
     * Stops any current Image requests from finishing and breaks the queue for
     * next available images.
     */
    ImagesFactory.stopGet = function() {
      _request.id += 1;
    };

    /**
     * Starts getting the next available images from the Services queue.
     * @return {[type]} [description]
     */
    ImagesFactory.getNext = function() {
      getLocationImages(_request.id);
    };


/* ==========================================================================
   Factory Private Functions
   ========================================================================== */

    /**
     * Finds Instagram location entities within a radius of the
     * coordinates that match the Venue name.
     *
     * @param  {object} params      API query key/values
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocations(params, currentReq) {
      NearbyLocations.get(params,
        // Success
        function(results) {
          if (currentReq !== _request.id) {
            // New or stopRequest() called
            return;
          } else if (results.meta.code === 200) {

            // Initialise queue of locations
            _request.queue = _.map(results.data, function(location) {
              return {
                locationId: location.id
              };
            });

            // Start getting images
            getLocationImages(currentReq);

          } else {
            $rootScope.$broadcast('images:locationfail', params.name);
          }
        },
        // Failed API call
        function(reason) {
          console.error(reason);
        }
      );
    }

    /**
     * Gets Instagram images for an Instagram location record. Broadcasts an
     * update event on new Images. Queues next page of available Images.
     *
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocationImages(currentReq) {
      // Grab images for all queued location images
      _.forEach(_request.queue, function(params) {
        LocationMedia.get(params,
          // Success API call
          function(results) {
            if (currentReq !== _request.id) {
              // New or stopRequest() called
              return;
            }

            // Grab the revelant full size image for the Service
            _.forEach(results.data, function(imageData) {
              _images.push(imageData.images.standard_resolution);
            });

            // Update queue with new information
            if (angular.isDefined(results.pagination) && angular.isDefined(results.pagination.next_max_id)) {
              // Queue up params for getNextImagesPage() that have other pages
              var index = _.findIndex(_request.queue, {
                locationId: params.locationId
              });
              _request.queue[index].max_id = results.pagination.next_max_id;
            } else {
              // Remove params that have no pages left
              _request.queue = _.reject(_request.queue, {
                locationId: params.locationId
              });
            }

            // Publish new images to subscribers
            $rootScope.$broadcast('images:update', _images, _request.queue.length > 0);
          },
          // Failed API call
          function(reason) {
            console.error(reason);
          });
      });
    }


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    /* Requires custom 'attempts' and 'name' proxy params. See server api routes. */
    var NearbyLocations = $resource(API + '/locations/search', {}, {
      get: {
        method: 'GET',
        params: {
          distance: LOCATION.distance,
          attempts: LOCATION.attempts
        }
      }
    });

    var LocationMedia = $resource(API + '/locations/:locationId/media/recent', {}, {
      get: {
        method: 'GET'
      }
    });


/* ==========================================================================
   Utility Functions
   ========================================================================== */

    function resetState() {
      _images = [];
      _request.queue = [];
    }


    return ImagesFactory;
  }]);

})(_);

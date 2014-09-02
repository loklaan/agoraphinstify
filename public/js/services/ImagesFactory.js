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
        pingrepeats: 20,
        pingvariance: 0.001,
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
      getLocations(venueName, {
        lat: parseFloat(latitude),
        lng: parseFloat(longitute)
      }, ++_request.id);
    };

    /**
     * Stops any current Image requests from finishing and breaks the queue for
     * next available images.
     */
    ImagesFactory.stopGet = function() {
      _request.id++;
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
     * coordinates that match the Venue name. Queues next page of
     * available Images.
     *
     * @param  {String} venueName   Name of the location / venue
     * @param  {object} params      API query key/values
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getLocations(venueName, params, currentReq) {
      var tempParams = params;

      // Trying several slighty altered coordinates
      _.times(LOCATION.pingrepeats, function() {
        NearbyLocations.get(tempParams,
          // Success
          function(results) {
            if (currentReq !== _request.id) {
              // New or stopRequest() called
              return;
            } else if (results.data.length > 0) {

              // Make array of Instagram locations with similar Venue names
              var resultMatches = _.filter(results.data,
                function(location) {
                  return compareVenueNames(venueName, location.name);
                });

              // Join array of valid API params with modules queued params
              _request.queue = _.union(_request.queue,
                _.map(resultMatches, function(location) {
                  return {
                    locationId: location.id
                  };
                }));

              // Once all queries are done
              if (++_request.responses >= LOCATION.pingrepeats) {
                if (_request.queue.length > 0) {
                  // Start getting images
                  _request.queue = _.uniq(_request.queue, 'locationId');
                  getLocationImages(currentReq);
                } else {
                  // or broadcast a failed attempt
                  $rootScope.$broadcast('images:locationfail', venueName);
                }
              }
            }

          },
          // Failed API call
          function(reason) {
            console.error(reason);
          }
        );

        tempParams.lat = params.lat + hackyPingVariance();
        tempParams.lng = params.lng + hackyPingVariance();
      });
    }

    /**
     * Gets Instagram images for an Instagram location record. Broadcasts an
     * update event on new Images.
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

    var NearbyLocations = $resource(API + '/locations/search', {}, {
      get: {
        method: 'GET',
        params: {
          distance: LOCATION.distance
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

    function hackyPingVariance() {
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      return (plusOrMinus * (Math.random() * LOCATION.pingvariance));
    }

    function compareVenueNames(one, two) {
      // TODO: do something fancier
      one = one.toLowerCase();
      two = two.toLowerCase();
      return one.indexOf(two) !== -1 || two.indexOf(one) !== -1;
    }

    function resetState() {
      _images = [];
      _request.responses = 0;
      _request.queue = [];
    }


    return ImagesFactory;
  }]);

})(_);

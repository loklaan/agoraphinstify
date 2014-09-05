/**
 * Instagram API endpoints.
 */

(function(exports) {
  "use strict";

  var _ = require('lodash-node');
  var request = require('request');
  var proxy = require('./proxy.js');

  exports.init = function(app, api) {

    /**
     * Route for Instagram location search using a hacky aggregation
     * of many queries, slightly variating coordinates.
     *
     * Additional query params added:
     *   @name     {String}  Name of location/venue
     *   @attempts {Number}  Number of queries should be made to
     *                       try and get results
     */
    app.get('/api/instagram/locations/search*', function(req, res) {
      req.query.lat = parseFloat(req.query.lat);
      req.query.lng = parseFloat(req.query.lng);

      var attemptReturns = 0,
          locationsBucket = [],
          origQuery = _.clone(req.query, true);

      _.times(origQuery.attempts, function() {
        var params = {};
        _.merge(params, api.instagram.auth);
        _.merge(params, req.query);
        var options = {
              target: api.instagram.url,
              params: params,
              sanspaths: [
                'api',
                'instagram'
              ]
            };
        var url = proxy.getUrl(req.url, options);

        request(url, function(err, response, body) {
          locationsBucket.push(JSON.parse(body));
          attemptReturns += 1;
          if (attemptReturns >= origQuery.attempts) {
            filterLocations(locationsBucket, origQuery.name,
              function(err, locations) {
                res.json({
                  meta: {
                    code: locations.length > 0 ? 200 : 400
                  },
                  data: locations
                });
              }
            );
          }
        });

        // Variate the coordinate
        var range = api.instagram.geolocation_variance;
        req.query.lat = origQuery.lat + randomVarianceInRange(range);
        req.query.lng = origQuery.lng + randomVarianceInRange(range);
      });

    });

    /**
     * Catchall proxy route for Instagram endpoints.
     */
    app.get('/api/instagram/*', function(req, res) {

      var options = {
        target: api.instagram.url,
        sanspaths: [
          'api',
          'instagram'
        ],
        params: api.instagram.auth
      };

      proxy.through(req, res, options);

    });

  };

/* ==========================================================================
   Utility Functions
   ========================================================================== */

  function randomVarianceInRange(range) {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return (plusOrMinus * (Math.random() * range));
  }

  function compareVenueNames(one, two) {
    // TODO: do something fancier
    one = one.toLowerCase();
    two = two.toLowerCase();
    return one.indexOf(two) !== -1 || two.indexOf(one) !== -1;
  }

  function filterLocations(locationsArray, name, callback) {
    var filteredLocations = [];

    _.forEach(locationsArray, function(location, index) {
      // if response has body.data > 0
      if (location.data.length > 0) {
        // filter body.data for venueName matches
        var matchingLocations = _.filter(location.data,
          function(entry) {
            return compareVenueNames(name, entry.name);
          });

        if (matchingLocations.length > 0) {
          filteredLocations = _.union(filteredLocations, matchingLocations);
        }
      }
    });

    if (filteredLocations.length > 0) {
      filteredLocations = _.uniq(filteredLocations, 'id');
    }

    callback(null, filteredLocations);
  }

})(exports);
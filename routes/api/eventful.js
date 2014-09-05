/**
 * Eventful API endpoints.
 */

(function(exports) {
  "use strict";

  var proxy = require('./proxy.js');

  exports.init = function(app, api) {

    /**
     * Proxy route for Eventful endpoints.
     */
    app.get('/api/eventful/*', function(req, res) {

      var options = {
        target: api.eventful.url,
        sanspaths: [
          'api',
          'eventful'
        ],
        params: api.eventful.auth
      };

      proxy.through(req, res, options);

    });

  };

})(exports);
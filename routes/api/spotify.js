/**
 * Spotify API andpoints
 */

(function(exports) {
  "use strict";

  var proxy = require('./proxy.js');

  exports.init = function(app, api) {

    /**
     * Catchall proxy route for Soitify endpoints.
     */
    app.get('/api/spotify/*', function(req, res) {

      var options = {
        target: api.spotify.url,
        sanspaths: [
          'api',
          'spotify'
        ]
      };

      proxy.through(req, res, options);

    });

  };

})(exports);
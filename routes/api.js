/**
 * RESTful API routes used by client apps.
 *
 * Exclusively involves 'proxy' routes pointing to external APIs.
 * Proxied requests are rewritten to comply to external API
 * services.
 */

(function (exports) {
  'use strict';

  var apiDetails = require('../config.json');

  /**
   * Intialises API routes onto Express server.
   */
  exports.init = function(app) {

    require('./api/eventful.js').init(app, apiDetails);

    require('./api/spotify.js').init(app, apiDetails);

    require('./api/instagram.js').init(app, apiDetails);

  };

})(exports);
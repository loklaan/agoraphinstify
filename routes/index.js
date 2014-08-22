/**
 * Routes module, configuring route files for Express.
 */

(function(exports) {
  "use strict";

  /**
   * Aggregation of declared routes used by Express.
   */
  exports.init = function(app) {

    var routesApi = require('./api.js');
    var routesWebClient = require('./webclient.js');

    routesApi.init(app);
    routesWebClient.init(app);

  };

})(exports);
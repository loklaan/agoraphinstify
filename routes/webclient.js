/**
 * GET routes for Angular's views.
 */

(function(exports) {
  "use strict";

  var path = require('path');

  var templates = path.join(__dirname, '../public/views/');
  var distribution = path.join(__dirname, '../public/dist/');

  /**
   * Intialises declared web client routes.
   */
  exports.init = function(app) {

    function serveIndex(req, res, next) {
      var indexPath = process.env.NODE_ENV === 'production' ? distribution : templates;
      res.sendFile(indexPath + 'index.html');
    }

    /**
     * Main index template.
     */
    app.get('/', serveIndex);

    /**
     * Partial templates used by directives.
     */
    app.get('/partials/:name', function (req, res) {
      var name = req.params.name;
      res.sendFile(templates + 'partials/' + name + '.html');
    });

    /**
     * Event hotlinking, described by IDs provided by Eventful
     */
    app.get('/e/:eventId/:patientId', serveIndex);

  };

})(exports);
/**
 * GET routes for Angular's views.
 */

(function(exports) {
  "use strict";

  var path = require('path');

  var templates = path.join(__dirname, '../public/views/');

  /**
   * Intialises declared web client routes.
   */
  exports.init = function(app) {

    /**
     * Main index template.
     */
    app.get('/', function(req, res){
      res.sendFile(templates + 'index.html');
    });

    /**
     * Partial templates used by directives.
     */
    app.get('/partials/:name', function (req, res) {
      var name = req.params.name;
      res.sendFile(templates + 'partials/' + name + '.html');
    });

  };

})(exports);
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

    /**
     * Main index template.
     */
    app.get('/', function(req, res){
      var indexPath = process.env.NODE_ENV === 'production' ? distribution : templates;
      res.sendFile(indexPath + 'index.html');
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
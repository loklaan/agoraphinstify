var request = require('supertest'),
    express = require('express'),
    apiRoutes = require('../../routes/api.js'),
    apiConfig = require('../../config.json');

var app = express();

/**
 * Copied api routes from server.js
 */
app.get('/api/eventful/*', apiRoutes.eventful);

describe('eventful routes', function() {
  it('should proxy a search to/from live eventful server', function(done) {
    request(app)
      // Example 2 @ http://api.eventful.com/docs/events/search
      .get('/api/eventful/events/search/?where=32.746682,-117.162741&within=25')
      // yes, they don't set their content-type to json
      .expect('Content-Type', /text\/javascript/)
      .expect(200, done);
  });
});
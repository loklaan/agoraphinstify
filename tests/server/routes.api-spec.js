var request = require('supertest'),
    express = require('express'),
    routes = require('../../routes/api.js'),
    apiConfig = require('../../config.json');

var app = express();

/**
 * Routes
 */
routes.init(app);

describe('Proxy API', function() {

  describe('eventful route', function() {
    it('should proxy an event search to/from live eventful server', function(done) {
      request(app)
        // Example 2 @ http://api.eventful.com/docs/events/search
        .get('/api/eventful/events/search/?where=32.746682,-117.162741&within=25')
        // yes, they don't set their content-type to json
        .expect('Content-Type', /text\/javascript/)
        .expect(200, done);
    });
  });

  describe('spotify route', function() {
    it('should proxy an artist search to/from live spotify server', function(done) {
      request(app)
        // Example Request @ https://developer.spotify.com/web-api/search-item/
        .get('/api/spotify/search?q=tania%20bowra&type=artist')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

    describe('instagram route', function() {
    it('should proxy a tag search to/from live instagram server', function(done) {
      request(app)
        // Example 2 @ http://instagram.com/developer/endpoints/tags/
        .get('/api/instagram/tags/nofilter/media/recent')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

});
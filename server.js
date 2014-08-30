/**
 * Module Dependencies
 */
var express = require('express'),
    routes = require('./routes'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * Configuration
 */
app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));

app.set('port', process.env.PORT || 3000);

var env = process.env.NODE_ENV || 'development';

// development environment only
if (env === 'development') {
  app.use(errorHandler());
}

// production environment only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */
routes.init(app);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Agoraphinstify EXPRESS server listening on port ' + app.get('port') + '...');
});
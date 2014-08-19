
/**
 * Proxy routes for APIs used by the Angular app.
 */

var Url = require('url');
var request = require('request');
/**
 * Each object within is key/value formatted for that particular service.
 * @type {Object}
 */
var apiDetails = {
  eventful: {
    url: 'http://api.eventful.com/json',
    auth: {
      app_key: 'DH3Ff2FxLkH6VbBp'
    }
  },
  spotify: {
    url: 'http://api.spotify.com/v1'
  },
  instagram: {
    url: 'http://api.instagram.com/v1',
    auth: {
      client_id: '1799b886cb2d423191584c5ccde96b16'
    }
  }
};

exports.eventful = function(req, res) {

  proxy(req, res, {
    target: apiDetails.eventful.url,
    sanspaths: [
      'api',
      'eventful'
    ],
    params: apiDetails.eventful.auth
  });

};

exports.spotify = function(req, res) {

  proxy(req, res, {
    target: apiDetails.spotify.url,
    sanspaths: [
      'api',
      'spotify'
    ]
  });

};

exports.instagram = function(req, res) {

  proxy(req, res, {
    target: apiDetails.instagram.url,
    sanspaths: [
      'api',
      'instagram'
    ],
    params: apiDetails.instagram.auth
  });

};

/**
 * Simple proxy using request package.
 * @param  {object} req      Http request object
 * @param  {object} res      Http response oject
 * @param  {object} options  Options include target, sanspaths and params
 *
 * Example:
 *   proxy(req, res, {
 *     target: 'http://some.url/thing/',
 *     // removes relevant subpaths
 *     // from http://localhost/api/spotify
 *     sanspaths: [
 *       'api',
 *       'spotify'
 *     ],
 *     parms: {
 *       key: value
 *     }
 *   })
 */
function proxy(req, res, options) {

  // clean proxy api path for target api
  var rewritePath = req.url;
  if (options.sanspaths) {
    rewritePath = removeSubPaths(rewritePath, options.sanspaths);
  }

  // add extra parameters
  if (options.params) {
    rewritePath = addParams(rewritePath, options.params);
  }

  rewritePath = Url.parse(rewritePath).path;
  // first forward slash denotes a root
  rewritePath = rewritePath.replace(/\//, '');

  // stitch together the target url
  var targetUrl = options.target;
  // make certain of trailing slash, else request.resolve ignores pathnames
  if (targetUrl[targetUrl.length + 1] !== '/') {
    targetUrl += '/';
  }
  targetUrl = Url.resolve(targetUrl, rewritePath);

  // one. line. proxy.
  // best example of streaming.
  req.pipe(request({
    url: targetUrl,
    headers: {
      'User-Agent': 'request'
    }
  })).pipe(res);

}

/**
 * Removes matching subpaths from a url.
 * @param  {string} url       Url string
 * @param  {array}  subpaths  Array of subpath strings
 * @return {string}           Returns a formatted url string
 */
function removeSubPaths(url, subpaths) {

  var urlObj = Url.parse(url);
  for (var i in subpaths) {
    var match = new RegExp('/' + subpaths[i]);
    urlObj.pathname = urlObj.pathname.replace(match, '');
  }
  return Url.format(urlObj);

}

/**
 * Adds parameters into a url.
 * @param  {string} url     Url string
 * @param  {object} params  Parameters as properties of the param object
 * @return {string}         Returns a formatted url string
 */
function addParams(url, params) {

  var urlObj = Url.parse(url, true);
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      urlObj.search = null; // annoying first priority for Url.format
      urlObj.query[prop] = params[prop];
    }
  }
  return Url.format(urlObj);

}
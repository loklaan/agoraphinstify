/**
 * Proxy Module for piping requests through external APIs.
 */

(function(exports) {
  "use strict";

  var Url = require('url');
  var request = require('request');

  /**
   * Simple proxy using the request package.
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
  exports.through = function(req, res, options) {

    var targetUrl = this.getUrl(req.url, options);

    // one. line. proxy.
    // best example of streaming.
    request({
      url: targetUrl,
      headers: {
        'User-Agent': 'request'
      }
    }).pipe(res);

  };

  /**
   * Transforms a URL
   * @param  {string} originalurl Base url
   * @param  {object} options     Options include target, sanspaths and params
   * @return {string}             Transformed url
   */
  exports.getUrl = function(originalurl, options) {

    // clean unwanted paths for proxy url
    var rewritePath = originalurl;
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

    // stitch together the proxy url
    var proxyUrl = options.target;
    // make certain of trailing slash
    if (proxyUrl[proxyUrl.length + 1] !== '/') {
      proxyUrl += '/';
    }
    return Url.resolve(proxyUrl, rewritePath);

  };

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
   * @param  {object} params  Parameters as properties of the project's
   *                          config.json auths
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

})(exports);
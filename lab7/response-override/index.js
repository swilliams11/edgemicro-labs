'use strict';
var debug = require('debug')('plugin:response-override');

module.exports.init = function(config, logger, stats) {

  return {

    onrequest: function(req, res, next) {
      debug('response-override plugin onrequest');
      req.headers['x-foo-request-start'] = Date.now();
      next();
    },

    ondata_request: function(req, res, data, next) {
      debug('response-override plugin ondata_request ' + data.length);
      var transformed = data.toString().toUpperCase();
      debug('response-override plugin ondata_request transformed data: ' + transformed);
      next(null, transformed);
    },

    onend_request: function(req, res, data, next) {
      debug('response-override plugin onend_request');
      next(null, data);
    },

    ondata_response: function(req, res, data, next) {
      debug('response-override ***** plugin ondata_response');
      next(null, null);
    },

    onend_response: function(req, res, data, next) {
      debug('response-override **** plugin onend_response');
      debug('response from target is: ' + data);
      next(null, "Hello, World from the response-override plugin!\n\n");
    }
  };
}

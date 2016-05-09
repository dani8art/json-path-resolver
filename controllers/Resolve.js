/*!
 * Copyright(c) 2016 Daniel Arteaga
 * MIT Licensed
 * 
 * @author Daniel Artega <dani8art.da@gmail.com>
 */
 
'use strict';

var url = require('url');


var Resolve = require('./ResolveService');


module.exports.resolvesPath = function resolvesPath (req, res, next) {
  	Resolve.resolvesPath(req.swagger.params, res, next);
};

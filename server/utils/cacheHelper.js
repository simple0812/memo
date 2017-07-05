var NodeCache = require('node-cache');
var cache = new NodeCache({ checkperiod: 60 });

module.exports = cache;
var Memo = require('./memo');
var Blog = require('./blog');
var config = require('../config');

var db = require('./db');
var rootdb = require('./rootdb');

exports.Memo = Memo;
exports.Blog = Blog;
exports.db = db;
exports.syncDb = function() {
  return rootdb.query(`CREATE DATABASE IF NOT EXISTS ${config.DB.database} CHARSET utf8`, { raw: true })
  .then(() => {
    return db.sync();
  });
};
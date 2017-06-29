var Memo = require('./memo');
var config = require('../config');

var db = require('./db');
var rootdb = require('./rootdb');


exports.Memo = Memo;
exports.db = db;
exports.syncDb = function() {
    return rootdb.query(`CREATE DATABASE IF NOT EXISTS ${config.DB.database} CHARSET utf8`, { raw: true })
    .then(() => {
        return db.sync();
    });
}
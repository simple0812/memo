var Sequelize = require('sequelize');
var config = require('../config');

//可配置多个数据库
var db = new Sequelize('mysql', config.DB.user, config.DB.password, {
  host: config.DB.host,
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0
  }
});

module.exports = db;
var db = require('./db');
var Sequelize = require('sequelize');
var common = require('../utils/common');

var Blog = db.define('blog', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT
    },
    title: {
      type: Sequelize.STRING(100),
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    createdAt: {
      type: Sequelize.BIGINT(13)
    }
}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  tableName: 'blog'
});

Blog.hook('beforeCreate', function(model, options, fn) {
  model.createdAt || (model.createdAt = common.getTime());
  fn(null, model);
});

module.exports = Blog;
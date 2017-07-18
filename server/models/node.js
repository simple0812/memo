var db = require('./db');
var Sequelize = require('sequelize');
var common = require('../utils/common');

var Node = db.define('node', {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100)
    },
    type: {
      type: Sequelize.STRING(100),
    },
    path: {
      type: Sequelize.STRING(100),
    },
    mtime: {
      type: Sequelize.BIGINT(13),
    },
    remark: {
      type: Sequelize.STRING(100),
    },
    size: {
      type: Sequelize.STRING(100),
    },
    pid: {
      type: Sequelize.STRING(100),
    }
}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  tableName: 'node'
});

Node.hook('beforeCreate', function(model, options, fn) {
  model.createdAt || (model.createdAt = common.getTime());
  fn(null, model);
});

module.exports = Node;
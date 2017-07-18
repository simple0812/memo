var jsonHelper = require('../../utils/jsonHelper');
var common = require('../../utils/common');
var config = require('../../config');
var _ = require('lodash');
var models = require('../../models');
var uuidv1 = require('uuid/v1');
var path = require('path');
var fs = require('fs');


function getTyeByext(fileName) {
  var extension = path.extname(fileName).toLowerCase().slice(1);
  var p = {
    picture:['bmp', 'gif', 'jpg', 'jpeg', 'png', 'bmp'],
    document:['doc', 'docx', 'docm', 'dotx', 'dotm', 'xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam', 'ppt', 'pptx', 'pptm', 'ppsx', 'potx', 'pdf', 'txt'],
    video:['avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mp4', 'mkv', 'vob'],
    //other:[]
  }

  for(var key in p) {
    if(p[key].indexOf(extension) !== -1) {
      return key;
    }
  }

  return 'other';
}

exports.page = function(req, res) {
  var pageSize = +req.query.pageSize || 10;
  var pageIndex = +req.query.pageIndex || 1;
  var firNum = (pageIndex - 1) * pageSize;
  var keyword = req.query.keyword || '';
  var type = req.query.type || '';
  var pid = req.query.pid || '';

  var query = {
    limit: pageSize,
    offset: firNum,
    raw: true,
    where: {

    }
  };

  if(keyword.trim()) {
    query.where.name = { like: '%' + keyword + '%' };
  }

  if(type.trim()) {
    query.where.type = type;
  }

  if(pid.trim()) {
    query.where.pid = pid;
  }

  models.Node.findAndCountAll(query).then(function(result) {
    var docs = result.rows;
    var count = result.count;

    res.json(jsonHelper.pageSuccess(docs, count));
  }).catch(err => {
      res.json(jsonHelper.getError(err.message));
  });
};

exports.mkdir = function(req, res) {
  var path = req.query.path || '/';
  var pid = req.query.pid || '';
  var name = req.query.name || '';
 
  var id = uuidv1();
  var node = {
    id: id,
    name:name,
    type:'dir',
    path:path,
    mtime: common.getTime(),
    size:0,
    pid:pid
  };

  models.Node.create(node, { raw : true}).then(doc => {
    if(!doc) {
      throw new Error('upload failed');
    }
    res.json(jsonHelper.getSuccess('upload success'));
  }).catch(err => {
    res.json(jsonHelper.getError(err.message));
  })
};

exports.upload = function(req, res) {
  var path = req.query.path || '/';
  var pid = req.query.pid || '';
  var files = req.files;
  if(!files || !files.length) {
    res.json(jsonHelper.getError('file is empty'));
  }
  var file = req.files[0];
 
  var id = uuidv1();
  var type = getTyeByext(file.filename);
  var node = {
    id: id,
    name:file.filename,
    type:type,
    path:path,
    mtime: common.getTime(),
    size:file.size,
    pid:pid
  };

  models.Node.create(node, { raw : true}).then(doc => {
    if(!doc) {
      throw new Error('upload failed');
    }

    fs.renameSync(config.UPLOAD_DIR + '/' + file.filename, config.UPLOAD_DIR + '/' + doc.dataValues.id);

    res.json(jsonHelper.getSuccess('upload success'));
  }).catch(err => {
    res.json(jsonHelper.getError(err.message));
  })
};

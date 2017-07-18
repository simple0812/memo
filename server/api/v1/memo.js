var jsonHelper = require('../../utils/jsonHelper');
var _ = require('lodash');
var models = require('../../models');

exports.page = function(req, res) {
  var pageSize = +req.query.pageSize || 10;
  var pageIndex = +req.query.pageIndex || 1;
  var firNum = (pageIndex - 1) * pageSize;
  var keyword = req.query.keyword || '';

  var query = {
    limit: pageSize,
    offset: firNum,
    raw: true
  };

  if (keyword.trim()) {
    query.where = {
      $or:[
        { description: { like: '%' + keyword + '%' }},
        { link: { like: '%' + keyword + '%' }}
      ]
    };
  }

  models.Memo.findAndCountAll(query).then(function(result) {
    var docs = result.rows;
    var count = result.count;

    res.json(jsonHelper.pageSuccess(docs, count));
  }).catch(err => {
      res.json(jsonHelper.getError(err.message));
  });
};

exports.baz = function(req, res) {
  res.json(jsonHelper.getSuccess('baz'));
};

exports.create = function(req, res) {
  var p = req.body;
  if(!p || !_.keys(p).length) {
    return res.json(jsonHelper.getError('data is empty'));
  }

  if(!p.link) {
    return res.json(jsonHelper.getError('link is empty'));
  } 

  if(!p.description) {
    return res.json(jsonHelper.getError('description is empty'));
  } 
  p.id = p.id || null;

  if(p.link.indexOf('http://') !== 0 && p.link.indexOf('https://') !== 0) {
    p.link = 'http://' + p.link;
  }

  models.Memo.upsert(p).then(doc => {
      res.json(jsonHelper.getSuccess(p));
  }).catch(err => {
      res.json(jsonHelper.getError(err.message));
  });
};

exports.update = function(req, res) {
  var p = req.body;
  if(!p || !_.keys(p).length) {
    return res.json(jsonHelper.getError('data is empty'));
  }

  if(!p.link) {
    return res.json(jsonHelper.getError('link is empty'));
  } 

  if(!p.description) {
    return res.json(jsonHelper.getError('description is empty'));
  } 

  if(!p.id) {
    return res.json(jsonHelper.getError('id is empty'));
  } 
  
  models.Memo.upsert(p).then(doc => {
    res.json(jsonHelper.getSuccess(doc));
  }).catch(err => {
    res.json(jsonHelper.getError(err.message));
  });
};

exports.remove = function(req, res) {
  console.log(req.body);
  var p = req.body;
  
  if(!p || !p.length ) {
      return res.json(jsonHelper.getError('data is emtpy'));
  }
  models.Memo.destroy({where:{id:{$in:p}}}).then(doc => {
    res.json(jsonHelper.getSuccess(doc));
  }).catch(err => {
    res.json(jsonHelper.getError(err.message));
  });
};


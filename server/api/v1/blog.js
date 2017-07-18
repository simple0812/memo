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
    raw: true,
    attributes:['id', 'title']
  };

  if (keyword.trim()) {
    query.where = {
      title: { like: '%' + keyword + '%' }
    };
  }

  models.Blog.findAndCountAll(query).then(function(result) {
    var docs = result.rows;
    var count = result.count;

    res.json(jsonHelper.pageSuccess(docs, count));
  }).catch(err => {
      res.json(jsonHelper.getError(err.message));
  });
};

exports.getById = function(req, res) {
  var id = req.params.id;
  if(!id) {
    res.json(jsonHelper.getError('id is empty'));
  }

  models.Blog.findById(id).then(doc => {
      res.json(jsonHelper.getSuccess(doc));
  }).catch(err => {
      res.json(jsonHelper.getError(err.message));
  });
};

exports.create = function(req, res) {
  var p = req.body;
  if(!p || !_.keys(p).length) {
    return res.json(jsonHelper.getError('data is empty'));
  }

  if(!p.content) {
    return res.json(jsonHelper.getError('content is empty'));
  } 
  var promise;
  if(!p.id  || +p.id === 0) {
    p.id = null;
    promise = models.Blog.create(p, {raw:true});
  } else {
    promise = models.Blog.upsert(p);
  }

  promise.then(doc => {
    if(!p.id) {
      res.json(jsonHelper.getSuccess(doc));
    } else {
      res.json(jsonHelper.getSuccess(p));
    }
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
  
  models.Blog.upsert(p).then(doc => {
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
  models.Blog.destroy({where:{id:{$in:p}}}).then(doc => {
    res.json(jsonHelper.getSuccess(doc));
  }).catch(err => {
    res.json(jsonHelper.getError(err.message));
  });
};



var fs = require('fs');
var httpHelper = require('../utils/httpHelper');
var config = require('../config');
var jsonHelper = require('../utils/jsonHelper');
var logger = require('../utils/logger');
var _ = require('lodash');
var models = require('../models');

exports.render = function(req, res) {
    res.render('memo.html')
}
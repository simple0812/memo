var request = require('request');
var Promise = require('bluebird');
var logger = require('../utils/logger');
var common = require('../utils/common');

module.exports = (function() {
  var MAX_HTTP_RETRIES = 3;
  var RETRY_DELAY = 5000;
  var TIMEOUT = 30000;

  function handle(host, option, postData, callback) {
    var tries = MAX_HTTP_RETRIES;
    option = option || {};
    postData = postData || {};

    function attempt() {
      var opt = {
        uri: host,
        body: postData,
        json: true,
        method: option.method || postData.method || 'post',
        timeout: TIMEOUT
      };

      for (var each in option) { 
        if(option.hasOwnProperty(each)) {
          opt[each] = option[each];
        }
      }

      request(opt, function(err, res, data) {
        if (!err && (res.statusCode === 200 || res.statusCode === 304)) {
          callback(null, data);
        } else if (--tries) {
          setTimeout(attempt, RETRY_DELAY);
        } else {
          callback(err, data);
        }
      });
    }

    attempt();
  }

  function post(host, postData, opt) {
    return new Promise(function(resolve, reject) {
      opt = opt || {};
      postData = postData || {};
      opt.method = 'post';

      handle(host, opt, postData, function(err, data) {
        if (err) {
          logger.normal.error(host + '->' + err.message);
          return reject(new Error('获取数据失败'));
        }

        resolve(data);
      });
    });

  }

  function req(host, opt, postData) {
    opt = opt || {};
    postData = postData || {};
    return new Promise(function(resolve, reject) {
      handle(host, opt, postData, function(err, data) {
        if (err) {
          logger.normal.error(host + '->' + err.message);
          return reject(new Error('获取数据失败'));
        }

        resolve(data);
      });
    });
  }
  
  return {
    post: post,
    request: req
  };

})();
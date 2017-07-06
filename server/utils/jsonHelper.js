module.exports = (function() {
  function Constructor(status, message, result) {
    this.code = status;
    this.message = message;
    this.result = result;
  }

  function getError(err) {
    return new Constructor('error', err.message || err, '');
  }

  function getSuccess(docs) {
    return new Constructor('success', '', docs);
  }

  function pageSuccess(doc, allCount) {
    var json = new Constructor('success', '', doc);
    json.total = allCount;
    return json;
  }

  return {
    getError: getError,
    getSuccess: getSuccess,
    pageSuccess: pageSuccess
  };

})();
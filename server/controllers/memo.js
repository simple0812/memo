exports.render = function(req, res) {
  res.render('memo.html');
};

exports.redirect = function(req, res) {
  res.redirect('/link.html');
};
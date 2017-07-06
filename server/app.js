var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-locals');
var logger = require('./utils/logger');
var path = require('path');
var compress = require('compression');
var helmet = require('helmet'); //服务安全(点击劫持等)
var csurf = require('csurf'); //csrf
var cors = require('cors'); //跨域访问
var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', engine);

app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(compress());
app.use(require('cookie-session')({
    secret: 'zhanglei'
}));

var env = process.env.NODE_ENV || 'production';

app.use(express.static(path.join(__dirname, '../dist')));

app.use(logger.middleware);

app.use(function(req, res, next) {
  if (req.path === '/api' || req.path.indexOf('/api') === -1) {
    csurf()(req, res, next);
    return;
  }
  next();
});

app.use('/api/v1', cors(), apiRouterV1);
app.use('/', webRouter);

app.use(function(req, res, next) {
  var err = new Error('Not Found ' + req.originalUrl);
  err.status = 404;
  next(err);
});

if (env === 'development') {
  app.use(require('errorhandler')());
} else {
  app.use(function(err, req, res) {
    return res.status(err.status || 500).send(err.message || '500 status');
  });
}

module.exports = app;
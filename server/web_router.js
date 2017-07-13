var express = require('express');
var config = require('./config');
var router = express.Router();
var ctrl = require('./controllers/memo');

router.get('/', ctrl.redirect);
router.get('/memo', ctrl.render);

module.exports = router;
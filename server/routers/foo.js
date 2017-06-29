var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/foo');

router.get('/api/bar', ctrl.bar);
router.get('/api/baz', ctrl.baz);

module.exports = router;
var express = require('express');
var router = express.Router();
var ctrl = require('./api/v1/memo');

router.get('/memo/page', ctrl.page);
router.post('/memo', ctrl.create);
router.put('/memo', ctrl.update);
router.delete('/memo', ctrl.remove);

module.exports = router;
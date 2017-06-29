var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/memo');

router.get('/api/memo/page', ctrl.page);
router.post('/api/memo', ctrl.create);
router.put('/api/memo', ctrl.update);
router.delete('/api/memo', ctrl.remove);

module.exports = router;
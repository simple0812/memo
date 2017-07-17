var express = require('express');
var router = express.Router();
var ctrl = require('./api/v1/memo');
var blogCtrl = require('./api/v1/blog');

router.get('/memo/page', ctrl.page);
router.post('/memo', ctrl.create);
router.put('/memo', ctrl.update);
router.delete('/memo', ctrl.remove);

router.get('/blog/page', blogCtrl.page);
router.get('/blog/:id', blogCtrl.getById);
router.post('/blog', blogCtrl.create);
router.put('/blog', blogCtrl.update);
router.delete('/blog', blogCtrl.remove);


module.exports = router;
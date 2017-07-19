var express = require('express');
var router = express.Router();
var ctrl = require('./api/v1/memo');
var blogCtrl = require('./api/v1/blog');
var fileCtrl = require('./api/v1/file');
var upload = require('./utils/multerHelper');

router.get('/memo/page', ctrl.page);
router.post('/memo', ctrl.create);
router.put('/memo', ctrl.update);
router.delete('/memo', ctrl.remove);

router.get('/blog/page', blogCtrl.page);
router.get('/blog/:id', blogCtrl.getById);
router.post('/blog', blogCtrl.create);
router.put('/blog', blogCtrl.update);
router.delete('/blog', blogCtrl.remove);

router.post('/upload', upload.array('files'), fileCtrl.upload);
router.post('/mkdir', fileCtrl.mkdir);
router.get('/file/page', fileCtrl.page);
router.delete('/file', fileCtrl.remove);

module.exports = router;
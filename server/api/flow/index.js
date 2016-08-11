'use strict';

var express = require('express');
var controller = require('./flow.controller');

var router = express.Router();


router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/mail-merge', controller.createMailMerge);
router.get('/mail-merge/:template/config', controller.getMailMergeConfig);
router.get('/mail-merge/:template/form', controller.getMailMergeForm);
router.get('/mail-merge/:template/email', controller.getMailMergeEmail);
router.get('/mail-merge/:template/document', controller.getMailMergeDocument);

module.exports = router;

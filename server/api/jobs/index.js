'use strict';

import {Router} from 'express';
import * as controller from './jobs.controller';

var router = new Router();


router.get('/init', controller.index);
router.get('/pause', controller.pause);
router.get('/resume', controller.resume);
router.get('/start', controller.start);
router.get('/shutdown', controller.shutdown);

module.exports = router;

'use strict';

import {Router} from 'express';
import * as controller from './jobs.controller';

var router = new Router();

router.get('/start', controller.start);
router.get('/shutdown', controller.shutdown);
router.get('/status', controller.status);

module.exports = router;

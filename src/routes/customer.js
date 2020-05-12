'use strict';

const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/customerController');
const authService   = require('../services/auth-service');

router.get('/', controller.get);
router.post('/auth', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
router.post('/', controller.post);

module.exports = router;
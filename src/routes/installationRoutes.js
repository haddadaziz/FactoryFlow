const express = require('express');
const router = express.Router();
const installationController = require('../controllers/installationController.js');

router.get('/status', installationController.getStatus);
router.post('/',installationController.install);
module.exports = router;

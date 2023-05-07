const express = require('express');
const router = express.Router();
const { refreshTokenControl } = require('../controllers/refreshAccessTokenController')

router.route('/').get(refreshTokenControl)

module.exports = router;
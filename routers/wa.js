const express = require('express');
const api = require('../controllers/waController');
const router = express.Router();

router.post('/send', api);


module.exports = router;
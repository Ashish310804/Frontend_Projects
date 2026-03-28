const express = require('express');
const router = express.Router();
const { getData, updateData } = require('../controllers/gasController');

router.get('/data', getData);
router.post('/update', updateData);

module.exports = router;
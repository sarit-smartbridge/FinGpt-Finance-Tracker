const express = require('express');
const reportController = require('../controllers/report.controller');

const router = express.Router();

router.post('/generate-pdf', reportController.generatePdf);

module.exports = router;

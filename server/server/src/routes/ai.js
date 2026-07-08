const express = require('express');
const aiController = require('../controllers/ai.controller');

const router = express.Router();

router.post('/categorize', aiController.categorize);
router.get('/insights/:monthId', aiController.insights);
router.post('/chat', aiController.chat);

module.exports = router;

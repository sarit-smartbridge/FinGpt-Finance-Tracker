const express = require('express');
const aiController = require('../controllers/ai.controller');

const router = express.Router();

router.post('/categorize', aiController.categorize);
router.get('/insights/:monthId', aiController.insights);
router.post('/chat', aiController.chat);
router.post('/tools/:tool', aiController.tool);
router.post('/receipt', aiController.receipt);

module.exports = router;

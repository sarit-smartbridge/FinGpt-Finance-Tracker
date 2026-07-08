const express = require('express');
const budgetController = require('../controllers/budget.controller');

const router = express.Router();

router.post('/', budgetController.saveBudget);
router.get('/:userId', budgetController.listBudgets);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;

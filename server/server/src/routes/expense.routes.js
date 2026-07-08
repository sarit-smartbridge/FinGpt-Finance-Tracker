const express = require('express');
const expenseController = require('../controllers/expense.controller');

const router = express.Router();

router.post('/expenses', expenseController.createOrUpdateExpense);
router.post('/addRow', expenseController.addRow);
router.put('/expenses/:expenseId/tables/:tableName/rows/:rowId', expenseController.updateRow);
router.get('/expenses/:expenseId/tables/:tableName/rows/:rowId', expenseController.getRow);
router.delete('/expenses/:expenseId/tables/:tableName/rows/:rowId', expenseController.deleteRow);
router.delete('/expenses/month', expenseController.deleteMonth);
router.delete('/expenses', expenseController.deleteAllExpenses);
router.get('/expenses', expenseController.getAllExpenses);
router.get('/expenses/:userId', expenseController.getExpensesByUser);

module.exports = router;

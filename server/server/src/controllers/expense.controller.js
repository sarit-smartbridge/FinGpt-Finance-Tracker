const Expense = require('../models/expense.model');
const expenseService = require('../services/expense.service');

function sendServiceError(res, error, fallback) {
    if (error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: fallback });
}

async function createOrUpdateExpense(req, res) {
    try {
        const { userId, monthYear, monthNumber, tables } = req.body;
        console.log(req.body);
        console.log(monthNumber, monthYear);
        await expenseService.createOrUpdateExpense({ userId, monthYear, monthNumber, tables });
        res.status(201).json({ message: 'Expense created/updated successfully' });
    } catch (error) {
        console.error('Error creating/updating expense:', error);
        sendServiceError(res, error, 'Internal Server Error');
    }
}

async function addRow(req, res) {
    try {
        const newRow = await expenseService.addRow(req.body);
        res.status(201).json({ message: 'Row added successfully', newRow });
    } catch (error) {
        console.error('Error adding row:', error);
        sendServiceError(res, error, 'Internal Server Error');
    }
}

async function updateRow(req, res) {
    try {
        const { expenseId, tableName, rowId } = req.params;
        const { date, name, amount } = req.body;
        await expenseService.updateRow({ expenseId, tableName, rowId, date, name, amount });
        res.status(200).json({ message: 'Table row updated successfully' });
    } catch (error) {
        console.error('Error updating table row:', error);
        sendServiceError(res, error, 'Internal Server Error');
    }
}

async function getRow(req, res) {
    try {
        const row = await expenseService.getRow(req.params);
        res.status(200).json(row);
    } catch (error) {
        console.error('Error getting table row:', error);
        sendServiceError(res, error, 'Internal Server Error');
    }
}

async function deleteRow(req, res) {
    try {
        await expenseService.deleteRow(req.params);
        res.status(200).json({ message: 'Table row deleted successfully' });
    } catch (error) {
        console.error('Error deleting table row:', error);
        sendServiceError(res, error, 'Internal Server Error');
    }
}

async function deleteMonth(req, res) {
    try {
        const { userId, monthYear, monthNumber } = req.body;
        const deleted = await Expense.findOneAndDelete({ userId, monthYear, monthNumber });
        if (!deleted) {
            return res.status(404).json({ error: 'Month not found' });
        }
        res.status(200).json({ message: 'Month deleted successfully' });
    } catch (error) {
        console.error('Failed to delete month:', error);
        res.status(500).json({ error: 'Failed to delete month' });
    }
}

async function deleteAllExpenses(req, res) {
    try {
        const deletedExpenses = await Expense.deleteMany();
        if (!deletedExpenses || deletedExpenses.deletedCount === 0) {
            return res.status(404).json({ error: 'No expenses found' });
        }

        console.log('Expenses deleted successfully:', deletedExpenses);
        res.status(200).json(deletedExpenses);
    } catch (error) {
        console.error('Failed to delete expenses:', error);
        res.status(500).json({ error: 'Failed to delete expenses' });
    }
}

async function getAllExpenses(req, res) {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

async function getExpensesByUser(req, res) {
    try {
        const expenses = await Expense.find({ userId: req.params.userId });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

module.exports = {
    createOrUpdateExpense,
    addRow,
    updateRow,
    getRow,
    deleteRow,
    deleteMonth,
    deleteAllExpenses,
    getAllExpenses,
    getExpensesByUser,
};

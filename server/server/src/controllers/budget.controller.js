const budgetService = require('../services/budget.service');

async function saveBudget(req, res) {
    try {
        const { userId, category, amount, month, year } = req.body;
        if (!userId || !category || amount === undefined || !month || !year) {
            return res.status(400).json({ error: 'userId, category, amount, month and year are required' });
        }
        const budget = await budgetService.saveBudget({ userId, category, amount, month, year });
        res.status(200).json({ message: 'Budget saved', budget });
    } catch (error) {
        console.error('Save budget error:', error);
        res.status(500).json({ error: 'Failed to save budget' });
    }
}

async function listBudgets(req, res) {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;
        const result = await budgetService.listBudgets({ userId, month, year });
        res.status(200).json(result);
    } catch (error) {
        console.error('List budgets error:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
}

async function deleteBudget(req, res) {
    try {
        const deleted = await budgetService.deleteBudget(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted' });
    } catch (error) {
        console.error('Delete budget error:', error);
        res.status(500).json({ error: 'Failed to delete budget' });
    }
}

module.exports = {
    saveBudget,
    listBudgets,
    deleteBudget,
};

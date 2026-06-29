const express = require('express');
const models = require('../models/schema');

const router = express.Router();

// Sum actual EXPENSE spending per category for a user's given month/year,
// reading the existing Expense document. Categories come from the AI-assigned
// row.category, falling back to the row name.
async function spendingByCategory(userId, year, month) {
    const expense = await models.Expense.findOne({
        userId,
        monthYear: String(year),
        monthNumber: Number(month),
    });
    const totals = {};
    if (expense) {
        const table = expense.tables.find((t) => (t.tableName || '').toUpperCase() === 'EXPENSE');
        (table?.rows || []).forEach((r) => {
            const cat = r.category || r.name || 'Other';
            totals[cat] = (totals[cat] || 0) + (Number(r.amount) || 0);
        });
    }
    return totals;
}

// Create or update a budget (one per user + category + month + year).
router.post('/', async (req, res) => {
    try {
        const { userId, category, amount, month, year } = req.body;
        if (!userId || !category || amount === undefined || !month || !year) {
            return res.status(400).json({ error: 'userId, category, amount, month and year are required' });
        }
        const budget = await models.Budget.findOneAndUpdate(
            { userId, category, month: Number(month), year: String(year) },
            { $set: { amount: Number(amount) } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: 'Budget saved', budget });
    } catch (error) {
        console.error('Save budget error:', error);
        res.status(500).json({ error: 'Failed to save budget' });
    }
});

// List a user's budgets for a month/year, each with computed spending/progress.
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;

        const filter = { userId };
        if (month) filter.month = Number(month);
        if (year) filter.year = String(year);

        const budgets = await models.Budget.find(filter).sort({ category: 1 });

        // Compute spending only when a specific month+year is requested.
        const spent = (month && year) ? await spendingByCategory(userId, year, month) : {};

        const enriched = budgets.map((b) => {
            const used = spent[b.category] || 0;
            const percent = b.amount > 0 ? Math.round((used / b.amount) * 100) : 0;
            return {
                _id: b._id,
                category: b.category,
                amount: b.amount,
                month: b.month,
                year: b.year,
                spent: used,
                remaining: b.amount - used,
                percent,
                over: used > b.amount,
            };
        });

        const totalBudget = enriched.reduce((s, b) => s + b.amount, 0);
        const totalSpent = enriched.reduce((s, b) => s + b.spent, 0);

        res.status(200).json({ budgets: enriched, totalBudget, totalSpent });
    } catch (error) {
        console.error('List budgets error:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
});

// Delete a budget.
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await models.Budget.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted' });
    } catch (error) {
        console.error('Delete budget error:', error);
        res.status(500).json({ error: 'Failed to delete budget' });
    }
});

module.exports = router;

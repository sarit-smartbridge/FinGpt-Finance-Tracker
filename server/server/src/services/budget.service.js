const Budget = require('../models/budget.model');
const Expense = require('../models/expense.model');

async function spendingByCategory(userId, year, month) {
    const expense = await Expense.findOne({
        userId,
        monthYear: String(year),
        monthNumber: Number(month),
    });
    const totals = {};
    if (expense) {
        const table = expense.tables.find((item) => (item.tableName || '').toUpperCase() === 'EXPENSE');
        (table?.rows || []).forEach((row) => {
            const category = row.category || row.name || 'Other';
            totals[category] = (totals[category] || 0) + (Number(row.amount) || 0);
        });
    }
    return totals;
}

async function saveBudget({ userId, category, amount, month, year }) {
    return Budget.findOneAndUpdate(
        { userId, category, month: Number(month), year: String(year) },
        { $set: { amount: Number(amount) } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
}

async function listBudgets({ userId, month, year }) {
    const filter = { userId };
    if (month) filter.month = Number(month);
    if (year) filter.year = String(year);

    const budgets = await Budget.find(filter).sort({ category: 1 });
    const spent = (month && year) ? await spendingByCategory(userId, year, month) : {};

    const enriched = budgets.map((budget) => {
        const used = spent[budget.category] || 0;
        const percent = budget.amount > 0 ? Math.round((used / budget.amount) * 100) : 0;
        return {
            _id: budget._id,
            category: budget.category,
            amount: budget.amount,
            month: budget.month,
            year: budget.year,
            spent: used,
            remaining: budget.amount - used,
            percent,
            over: used > budget.amount,
        };
    });

    return {
        budgets: enriched,
        totalBudget: enriched.reduce((sum, budget) => sum + budget.amount, 0),
        totalSpent: enriched.reduce((sum, budget) => sum + budget.spent, 0),
    };
}

async function deleteBudget(id) {
    return Budget.findByIdAndDelete(id);
}

module.exports = {
    spendingByCategory,
    saveBudget,
    listBudgets,
    deleteBudget,
};

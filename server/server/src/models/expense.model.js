const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    monthYear: { type: String, required: true },
    monthNumber: { type: Number, required: true },
    tables: [{
        tableName: { type: String },
        columns: [{ type: String }],
        rows: [{
            date: { type: String },
            name: { type: String },
            amount: { type: Number },
            category: { type: String },
        }],
    }],
    calculations: {
        totalIncome: { type: Number, default: 0 },
        totalExpense: { type: Number, default: 0 },
        currentAmount: { type: Number, default: 0 },
    },
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

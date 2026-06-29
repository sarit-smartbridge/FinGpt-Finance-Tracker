const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

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
            category: { type: String }, // optional, set by the AI categorizer
        }],
    }],
    calculations: {
        totalIncome: {type: Number, default: 0},
        totalExpense: { type: Number, default: 0},
        currentAmount: { type: Number, default: 0}
    }
});



// FR-5: per-category monthly budgets (matches SRS §6 Budgets collection)
const budgetSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: Number, required: true },   // matches Expense.monthNumber
    year: { type: String, required: true },    // matches Expense.monthYear
});
// one budget per user + category + month + year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const models = {
    Users: mongoose.model('User', userSchema),
    Expense: mongoose.model('Expense', expenseSchema),
    Budget: mongoose.model('Budget', budgetSchema),
};

module.exports = models;

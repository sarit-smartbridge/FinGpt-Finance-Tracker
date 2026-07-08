const Expense = require('../models/expense.model');

function recalculateExpense(expense) {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const table of expense.tables) {
        const tableName = (table.tableName || '').toUpperCase();
        for (const row of table.rows) {
            const amount = Number(row.amount) || 0;
            if (tableName === 'INCOME') totalIncome += amount;
            if (tableName === 'EXPENSE') totalExpense += amount;
        }
    }

    expense.calculations = {
        totalIncome,
        totalExpense,
        currentAmount: totalIncome - totalExpense,
    };
}

async function createOrUpdateExpense({ userId, monthYear, monthNumber, tables }) {
    const normalizedMonthNumber = Number(monthNumber);
    if (!userId || !monthYear || !Number.isInteger(normalizedMonthNumber) || normalizedMonthNumber < 1 || normalizedMonthNumber > 12 || !Array.isArray(tables)) {
        const error = new Error('userId, monthYear, monthNumber and tables are required');
        error.status = 400;
        throw error;
    }

    let expense = await Expense.findOne({ userId, monthYear, monthNumber: normalizedMonthNumber });

    if (expense) {
        tables.forEach((newTable) => {
            const existingTable = expense.tables.find((table) => table.tableName === newTable.tableName);
            if (existingTable) {
                existingTable.columns = newTable.columns;
                existingTable.rows.push(...newTable.rows);
            } else {
                expense.tables.push(newTable);
            }
        });
    } else {
        expense = new Expense({
            userId,
            monthYear,
            monthNumber: normalizedMonthNumber,
            tables,
        });
    }

    recalculateExpense(expense);
    await expense.save();
    return expense;
}

async function addRow({ formData, monthId, tableName }) {
    const { date, name, amount } = formData;
    const expense = await Expense.findById(monthId);
    if (!expense) {
        const error = new Error('Expense not found');
        error.status = 404;
        throw error;
    }

    const table = expense.tables.find((item) => item.tableName === tableName);
    if (!table) {
        const error = new Error('Table not found');
        error.status = 404;
        throw error;
    }

    const newRow = { date, name, amount };
    table.rows.push(newRow);
    recalculateExpense(expense);
    await expense.save();
    return newRow;
}

async function findRow({ expenseId, tableName, rowId }) {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
        const error = new Error('Expense not found');
        error.status = 404;
        throw error;
    }

    const table = expense.tables.find((item) => item.tableName === tableName);
    if (!table) {
        const error = new Error('Table not found');
        error.status = 404;
        throw error;
    }

    const row = table.rows.id(rowId);
    if (!row) {
        const error = new Error('Row not found');
        error.status = 404;
        throw error;
    }

    return { expense, table, row };
}

async function updateRow({ expenseId, tableName, rowId, date, name, amount }) {
    const { expense, row } = await findRow({ expenseId, tableName, rowId });

    row.date = date;
    row.name = name;
    row.amount = Number(amount) || 0;
    recalculateExpense(expense);
    await expense.save();
    return row;
}

async function getRow(params) {
    const { row } = await findRow(params);
    return row;
}

async function deleteRow({ expenseId, tableName, rowId }) {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
        const error = new Error('Expense not found');
        error.status = 404;
        throw error;
    }

    const table = expense.tables.find((item) => item.tableName === tableName);
    if (!table) {
        const error = new Error('Table not found');
        error.status = 404;
        throw error;
    }

    const rowIndex = table.rows.findIndex((row) => row._id.toString() === rowId);
    if (rowIndex === -1) {
        const error = new Error('Row not found');
        error.status = 404;
        throw error;
    }

    table.rows.splice(rowIndex, 1);
    recalculateExpense(expense);
    await expense.save();
}

module.exports = {
    recalculateExpense,
    createOrUpdateExpense,
    addRow,
    updateRow,
    getRow,
    deleteRow,
};

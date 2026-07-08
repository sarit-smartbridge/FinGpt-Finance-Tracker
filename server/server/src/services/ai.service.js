const { GoogleGenAI } = require('@google/genai');
const Expense = require('../models/expense.model');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const EXPENSE_CATEGORIES = [
    'Rent', 'Utilities', 'Groceries', 'Food & Dining', 'Transport',
    'Shopping', 'Health', 'Entertainment', 'Education', 'Subscriptions', 'Other',
];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Business', 'Gift', 'Other'];
const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

let client;

function getClient() {
    if (!process.env.GEMINI_API_KEY) {
        const error = new Error('AI features are not configured. Add GEMINI_API_KEY to server/.env and restart the server.');
        error.status = 503;
        throw error;
    }
    if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return client;
}

async function chat({ system, messages, schema, temperature, maxOutputTokens }) {
    const contents = messages.map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
    }));

    const config = {
        systemInstruction: system,
        temperature: temperature ?? 0.4,
        thinkingConfig: { thinkingBudget: 0 },
    };
    if (maxOutputTokens) config.maxOutputTokens = maxOutputTokens;
    if (schema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = schema;
    }

    const response = await getClient().models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config,
    });

    const text = response.text || '';
    return schema ? JSON.parse(text) : text;
}

async function categorizeTransactions(monthId) {
    const expense = await Expense.findById(monthId);
    if (!expense) {
        const error = new Error('Month not found');
        error.status = 404;
        throw error;
    }

    const items = [];
    expense.tables.forEach((table) => {
        table.rows.forEach((row) => {
            items.push({
                id: row._id.toString(),
                type: (table.tableName || '').toUpperCase() === 'INCOME' ? 'income' : 'expense',
                name: row.name,
                amount: row.amount,
            });
        });
    });

    if (items.length === 0) {
        return { message: 'No rows to categorize', updated: 0 };
    }

    const result = await chat({
        temperature: 0,
        system:
            'You categorize personal finance transactions. For each item pick the single best-fitting category. ' +
            `Expense categories: ${EXPENSE_CATEGORIES.join(', ')}. ` +
            `Income categories: ${INCOME_CATEGORIES.join(', ')}. ` +
            'If genuinely unclear, use "Other". Return a category for every id.',
        messages: [{ role: 'user', content: JSON.stringify(items) }],
        schema: {
            type: 'object',
            properties: {
                categories: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            category: { type: 'string', enum: ALL_CATEGORIES },
                        },
                        required: ['id', 'category'],
                    },
                },
            },
            required: ['categories'],
        },
    });

    const byId = new Map((result.categories || []).map((category) => [category.id, category.category]));
    let updated = 0;
    expense.tables.forEach((table) => {
        table.rows.forEach((row) => {
            const category = byId.get(row._id.toString());
            if (category) {
                row.category = category;
                updated += 1;
            }
        });
    });

    await expense.save();
    return { message: 'Categorized successfully', updated, month: expense };
}

async function generateInsights(monthId) {
    const expense = await Expense.findById(monthId);
    if (!expense) {
        const error = new Error('Month not found');
        error.status = 404;
        throw error;
    }

    const payload = {
        monthNumber: expense.monthNumber,
        monthYear: expense.monthYear,
        calculations: expense.calculations,
        tables: expense.tables.map((table) => ({
            tableName: table.tableName,
            rows: table.rows.map((row) => ({ date: row.date, name: row.name, amount: row.amount, category: row.category })),
        })),
    };

    return chat({
        temperature: 0.3,
        system:
            'You are a friendly personal-finance analyst. Given one month of income and expenses, write a 1-2 sentence ' +
            'plain-language summary and 3 to 5 concrete insight cards. Amounts are in Indian Rupees. ' +
            'Use "warning" severity for overspending or low savings, "good" for healthy patterns, "neutral" otherwise. ' +
            'Reference real numbers from the data. Keep each insight to one short sentence.',
        messages: [{ role: 'user', content: JSON.stringify(payload) }],
        schema: {
            type: 'object',
            properties: {
                summary: { type: 'string' },
                insights: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            detail: { type: 'string' },
                            severity: { type: 'string', enum: ['good', 'neutral', 'warning'] },
                        },
                        required: ['title', 'detail', 'severity'],
                    },
                },
            },
            required: ['summary', 'insights'],
        },
    });
}

async function getAssistantReply({ userId, messages }) {
    const months = await Expense.find({ userId });
    const snapshot = months.map((month) => ({
        month: `${month.monthNumber}/${month.monthYear}`,
        totalIncome: month.calculations?.totalIncome ?? 0,
        totalExpense: month.calculations?.totalExpense ?? 0,
        savings: month.calculations?.currentAmount ?? 0,
        expenses: (month.tables.find((table) => (table.tableName || '').toUpperCase() === 'EXPENSE')?.rows || [])
            .map((row) => ({ name: row.name, amount: row.amount, category: row.category })),
    }));

    const safeMessages = messages
        .filter((message) => (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string')
        .map((message) => ({ role: message.role, content: message.content }));

    return chat({
        temperature: 0.5,
        maxOutputTokens: 600,
        system:
            "You are FinGPT's budgeting assistant. Give practical, encouraging, specific money advice. " +
            "Ground every answer in the user's actual data below. Amounts are in Indian Rupees. " +
            'Be concise (a few sentences), concrete, and never invent numbers not in the data. ' +
            'If asked something the data cannot answer, say so briefly.\n\n' +
            `USER FINANCIAL SNAPSHOT:\n${JSON.stringify(snapshot)}`,
        messages: safeMessages,
    });
}

module.exports = {
    categorizeTransactions,
    generateInsights,
    getAssistantReply,
};

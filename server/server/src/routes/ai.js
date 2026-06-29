const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const models = require('../models/schema');

const router = express.Router();

// AI features via Google Gemini (free tier). Key read from GEMINI_API_KEY in .env.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let _client;
function getClient() {
    if (!process.env.GEMINI_API_KEY) {
        const e = new Error('AI features are not configured. Add GEMINI_API_KEY to server/.env and restart the server.');
        e.status = 503;
        throw e;
    }
    if (!_client) _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return _client;
}

// Call Gemini. `messages` is [{role:'user'|'assistant', content}]. If `schema`
// is passed the model returns JSON matching it (parsed object); else plain text.
async function chat({ system, messages, schema, temperature, maxOutputTokens }) {
    const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));

    const config = {
        systemInstruction: system,
        temperature: temperature ?? 0.4,
        // Disable the 2.5 "thinking" step — not needed here and it adds latency.
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

const EXPENSE_CATEGORIES = [
    'Rent', 'Utilities', 'Groceries', 'Food & Dining', 'Transport',
    'Shopping', 'Health', 'Entertainment', 'Education', 'Subscriptions', 'Other',
];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Business', 'Gift', 'Other'];
const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

const sendError = (res, error, fallback) => {
    console.error('AI error:', error);
    const status = error.status || 500;
    let msg = error.message || fallback;
    if (String(msg).includes('API key') || status === 400 || status === 403) {
        msg = 'Gemini rejected the request — check GEMINI_API_KEY in server/.env.';
    } else if (status === 429) {
        msg = 'Gemini free-tier rate limit hit. Wait a moment and try again.';
    }
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: msg });
};

/* =========================================================================
   1) EXPENSE CATEGORIZATION  —  POST /ai/categorize  { monthId }
   ========================================================================= */
router.post('/categorize', async (req, res) => {
    try {
        const { monthId } = req.body;
        const expense = await models.Expense.findById(monthId);
        if (!expense) return res.status(404).json({ error: 'Month not found' });

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
            return res.status(200).json({ message: 'No rows to categorize', updated: 0 });
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

        const byId = new Map((result.categories || []).map((c) => [c.id, c.category]));
        let updated = 0;
        expense.tables.forEach((table) => {
            table.rows.forEach((row) => {
                const cat = byId.get(row._id.toString());
                if (cat) { row.category = cat; updated += 1; }
            });
        });

        await expense.save();
        res.status(200).json({ message: 'Categorized successfully', updated, month: expense });
    } catch (error) {
        sendError(res, error, 'Failed to categorize transactions');
    }
});

/* =========================================================================
   2) SPENDING ANALYTICS  —  GET /ai/insights/:monthId
   ========================================================================= */
router.get('/insights/:monthId', async (req, res) => {
    try {
        const expense = await models.Expense.findById(req.params.monthId);
        if (!expense) return res.status(404).json({ error: 'Month not found' });

        const payload = {
            monthNumber: expense.monthNumber,
            monthYear: expense.monthYear,
            calculations: expense.calculations,
            tables: expense.tables.map((t) => ({
                tableName: t.tableName,
                rows: t.rows.map((r) => ({ date: r.date, name: r.name, amount: r.amount, category: r.category })),
            })),
        };

        const result = await chat({
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

        res.status(200).json(result);
    } catch (error) {
        sendError(res, error, 'Failed to generate insights');
    }
});

/* =========================================================================
   3) BUDGETING ASSISTANT  —  POST /ai/chat  { userId, messages: [...] }
   ========================================================================= */
router.post('/chat', async (req, res) => {
    try {
        const { userId, messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required' });
        }

        const months = await models.Expense.find({ userId });
        const snapshot = months.map((m) => ({
            month: `${m.monthNumber}/${m.monthYear}`,
            totalIncome: m.calculations?.totalIncome ?? 0,
            totalExpense: m.calculations?.totalExpense ?? 0,
            savings: m.calculations?.currentAmount ?? 0,
            expenses: (m.tables.find((t) => (t.tableName || '').toUpperCase() === 'EXPENSE')?.rows || [])
                .map((r) => ({ name: r.name, amount: r.amount, category: r.category })),
        }));

        const safeMessages = messages
            .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .map((m) => ({ role: m.role, content: m.content }));

        const reply = await chat({
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

        res.status(200).json({ reply });
    } catch (error) {
        sendError(res, error, 'Failed to get a response from the assistant');
    }
});

module.exports = router;

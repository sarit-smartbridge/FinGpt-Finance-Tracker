const aiService = require('../services/ai.service');
const aiTools = require('../services/ai.tools.service');

function sendAiError(res, error, fallback) {
    console.error('AI error:', error);
    const status = error.status || 500;
    let msg = error.message || fallback;
    if (String(msg).includes('API key') || status === 400 || status === 403) {
        msg = 'Gemini rejected the request \u2014 check GEMINI_API_KEY in server/.env.';
    } else if (status === 429) {
        msg = 'Gemini free-tier rate limit hit. Wait a moment and try again.';
    }
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: msg });
}

async function categorize(req, res) {
    try {
        const result = await aiService.categorizeTransactions(req.body.monthId);
        res.status(200).json(result);
    } catch (error) {
        sendAiError(res, error, 'Failed to categorize transactions');
    }
}

async function insights(req, res) {
    try {
        const result = await aiService.generateInsights(req.params.monthId);
        res.status(200).json(result);
    } catch (error) {
        sendAiError(res, error, 'Failed to generate insights');
    }
}

async function chat(req, res) {
    try {
        const { userId, messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required' });
        }
        const reply = await aiService.getAssistantReply({ userId, messages });
        res.status(200).json({ reply });
    } catch (error) {
        sendAiError(res, error, 'Failed to get a response from the assistant');
    }
}

async function tool(req, res) {
    try {
        const { userId, input } = req.body;
        const result = await aiTools.run(userId, req.params.tool, input || {});
        res.status(200).json(result);
    } catch (error) {
        sendAiError(res, error, 'Failed to run AI tool');
    }
}

async function receipt(req, res) {
    try {
        const result = await aiTools.receipt(req.body || {});
        res.status(200).json(result);
    } catch (error) {
        sendAiError(res, error, 'Failed to read receipt');
    }
}

module.exports = {
    categorize,
    insights,
    chat,
    tool,
    receipt,
};

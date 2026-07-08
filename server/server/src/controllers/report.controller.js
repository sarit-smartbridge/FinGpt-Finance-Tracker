const { streamExpenseReport } = require('../utils/pdfReport');

function generatePdf(req, res) {
    const { month } = req.body;
    if (!month) {
        return res.status(400).json({ error: 'month is required' });
    }

    streamExpenseReport(month, res);
}

module.exports = { generatePdf };

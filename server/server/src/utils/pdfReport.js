const PDFDocument = require('pdfkit');

function streamExpenseReport(month, res) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    doc.pipe(res);

    doc.fontSize(18).text(`Expense Report - ${month.monthNumber}/${month.monthYear}`, { align: 'center' });
    doc.moveDown();

    (month.tables || []).forEach((table) => {
        doc.fontSize(14).text(table.tableName || 'Transactions', { underline: true });
        doc.moveDown(0.5);
        (table.rows || []).forEach((row) => {
            doc.fontSize(10).text(`${row.date || '-'}  ${row.name || '-'}  Rs. ${Number(row.amount) || 0}`);
        });
        doc.moveDown();
    });

    doc.fontSize(12).text(`Total Income: Rs. ${month.calculations?.totalIncome || 0}`);
    doc.text(`Total Expense: Rs. ${month.calculations?.totalExpense || 0}`);
    doc.text(`Current Savings: Rs. ${month.calculations?.currentAmount || 0}`);

    doc.end();
}

module.exports = { streamExpenseReport };

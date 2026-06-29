require('dotenv').config();
const express = require("express");
const bcrypt = require('bcrypt')
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('./db/connect');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const models = require("./models/schema");
const PDFDocument = require('pdfkit');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';


app.use(cors());

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

// AI-augmented features (categorization, analytics, budgeting assistant)
app.use('/ai', require('./routes/ai'));

// FR-5: budget management
app.use('/budgets', require('./routes/budgets'));

// admin middelware
function adminAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    jwt.verify(token, 'ADMIN_SECRET_TOKEN', (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
}


// user middleware
const userAuthenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) {
            res.status(401);
            return res.send('Invalid JWT Token');
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user || decoded.userId;
        next();

    } catch (err) {
        console.error(err);
        res.status(500);
        res.send('Server Error');
    }
};

// admin schema
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.Users.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ user, token });

});




// user schema
app.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const { firstname, lastname, username, email, password } = req.body;
        const user = await models.Users.findOne({ email });
  
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        
        // Create a new user object
        const newUser = new models.Users({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        });
        console.log(newUser)
  
        // Save the new user to the database
        const userCreated = await newUser.save();
        console.log(userCreated, 'user created');
        return res.status(201).json({ message: 'Successfully Registered' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
  });
  


// get users

app.get('/users', async (req, res) => {
    try {
        const users = await models.Users.find();
        res.send(users);
    } catch (error) {
        res.status(500).send('Server error');
        console.log(error);
    }
});


app.post('/expenses', async (req, res) => {
    try {
        const { userId, monthYear, monthNumber, tables } = req.body;
        console.log(req.body)
        console.log(monthNumber,monthYear)
        const normalizedMonthNumber = Number(monthNumber);
        if (!userId || !monthYear || !Number.isInteger(normalizedMonthNumber) || normalizedMonthNumber < 1 || normalizedMonthNumber > 12 || !Array.isArray(tables)) {
            return res.status(400).json({ error: 'userId, monthYear, monthNumber and tables are required' });
        }

        let expense = await models.Expense.findOne({ userId, monthYear, monthNumber: normalizedMonthNumber });

        if (expense) {
            // Add columns and rows to existing tables
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
            // Create a new expense document
            expense = new models.Expense({
                userId,
                monthYear,
                monthNumber: normalizedMonthNumber,
                tables,
            });
        }

        recalculateExpense(expense);

        await expense.save();
        res.status(201).json({ message: 'Expense created/updated successfully' });
    } catch (error) {
        console.error('Error creating/updating expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/addRow', async (req, res) => {
    try {
        const { formData, monthId, tableName } = req.body;
        const { date, name, amount } = formData;

        // Find the expense document based on monthId
        const expense = await models.Expense.findById(monthId);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        // Find the table within the expense document based on tableName
        const table = expense.tables.find((t) => t.tableName === tableName);

        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Add the new row to the table
        const newRow = {
            date,
            name,
            amount,
        };
        table.rows.push(newRow);

        recalculateExpense(expense);

        await expense.save();
        res.status(201).json({ message: 'Row added successfully', newRow });
    } catch (error) {
        console.error('Error adding row:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.put('/expenses/:expenseId/tables/:tableName/rows/:rowId', async (req, res) => {
    try {
        const { expenseId, tableName, rowId } = req.params;
        const { date, name, amount } = req.body;
        const expense = await models.Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const table = expense.tables.find((table) => table.tableName === tableName);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ error: 'Row not found' });
        }

        row.date = date;
        row.name = name;
        row.amount = Number(amount) || 0;
        recalculateExpense(expense);

        await expense.save();

        res.status(200).json({ message: 'Table row updated successfully' });
    } catch (error) {
        console.error('Error updating table row:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/expenses/:expenseId/tables/:tableName/rows/:rowId', async (req, res) => {
    try {
        const { expenseId, tableName, rowId } = req.params;
        const expense = await models.Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const table = expense.tables.find((table) => table.tableName === tableName);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }

        const row = table.rows.id(rowId);
        if (!row) {
            return res.status(404).json({ error: 'Row not found' });
        }

        res.status(200).json(row);
    } catch (error) {
        console.error('Error getting table row:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.delete('/expenses/:expenseId/tables/:tableName/rows/:rowId', async (req, res) => {
    try {
        const { expenseId, tableName, rowId } = req.params;

        const expense = await models.Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const table = expense.tables.find((table) => table.tableName === tableName);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        const rowIndex = table.rows.findIndex((row) => row._id.toString() === rowId);

        if (rowIndex !== -1) {
            table.rows.splice(rowIndex, 1); // Remove the row from the array
            recalculateExpense(expense);

            await expense.save();

            res.status(200).json({ message: 'Table row deleted successfully' });
        } else {
            res.status(404).json({ error: 'Row not found' });
        }
    } catch (error) {
        console.error('Error deleting table row:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







// Delete a single month's expense document for a user
app.delete('/expenses/month', async (req, res) => {
    try {
        const { userId, monthYear, monthNumber } = req.body;
        const deleted = await models.Expense.findOneAndDelete({ userId, monthYear, monthNumber });
        if (!deleted) {
            return res.status(404).json({ error: 'Month not found' });
        }
        res.status(200).json({ message: 'Month deleted successfully' });
    } catch (error) {
        console.error('Failed to delete month:', error);
        res.status(500).json({ error: 'Failed to delete month' });
    }
});


app.delete('/expenses', (req, res) => {
    models.Expense.deleteMany()
        .then(deletedExpenses => {
            if (!deletedExpenses || deletedExpenses.deletedCount === 0) {
                return res.status(404).json({ error: 'No expenses found' });
            }

            console.log('Expenses deleted successfully:', deletedExpenses);
            res.status(200).json(deletedExpenses);
        })
        .catch(error => {
            console.error('Failed to delete expenses:', error);
            res.status(500).json({ error: 'Failed to delete expenses' });
        });
});


app.get('/expenses', (req, res) => {
    models.Expense.find()
        .then(expenses => {
            res.status(200).json(expenses);
        })
        .catch(error => {
            console.error('Failed to fetch expenses:', error);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        });
});


app.get('/expenses/:userId', (req, res) => {
    const userId = req.params.userId; // Access the userId correctly

    models.Expense.find({ userId: userId }) // Filter expenses by userId
        .then(expenses => {
            res.status(200).json(expenses);
        })
        .catch(error => {
            console.error('Failed to fetch expenses:', error);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        });
});


app.post('/generate-pdf', (req, res) => {
    const { month } = req.body;
    if (!month) {
        return res.status(400).json({ error: 'month is required' });
    }

    const doc = new PDFDocument();
  
    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  
    // Pipe the PDF content to the response
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
  
    // End the PDF stream
    doc.end();
  });

module.exports = app;

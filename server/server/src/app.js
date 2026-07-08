require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db/connect');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const reportRoutes = require('./routes/report.routes');
const aiRoutes = require('./routes/ai');
const budgetRoutes = require('./routes/budgets');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', expenseRoutes);
app.use('/', reportRoutes);
app.use('/ai', aiRoutes);
app.use('/budgets', budgetRoutes);

module.exports = app;

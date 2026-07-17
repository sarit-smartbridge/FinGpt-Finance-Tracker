const Expense = require('../models/expense.model');
const ai = require('./ai.service');

const CATEGORIES = ['Rent', 'Utilities', 'Groceries', 'Food & Dining', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Subscriptions', 'Other'];
const round = (n) => Math.round((Number(n) || 0) * 100) / 100;

async function snapshot(userId) {
    if (!userId) { const e = new Error('userId is required'); e.status = 400; throw e; }
    const months = await Expense.find({ userId }).lean();
    months.sort((a, b) => `${a.monthYear}${String(a.monthNumber).padStart(2, '0')}`.localeCompare(`${b.monthYear}${String(b.monthNumber).padStart(2, '0')}`));
    return months.map((month) => ({
        id: String(month._id), month: Number(month.monthNumber), year: String(month.monthYear),
        income: Number(month.calculations?.totalIncome || 0), expense: Number(month.calculations?.totalExpense || 0),
        savings: Number(month.calculations?.currentAmount || 0),
        rows: (month.tables || []).flatMap((table) => (table.rows || []).map((row) => ({
            id: String(row._id), type: String(table.tableName || '').toUpperCase() === 'INCOME' ? 'income' : 'expense',
            date: row.date || '', name: row.name || '', amount: Number(row.amount || 0), category: row.category || 'Other',
        }))),
    }));
}

const expenses = (months) => months.flatMap((m) => m.rows.map((r) => ({ ...r, month: m.month, year: m.year }))).filter((r) => r.type === 'expense');
const averages = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

function forecast(months) {
    const recent = months.slice(-6);
    if (!recent.length) return { message: 'Add at least one month of data to generate a forecast.' };
    const weighted = (key) => {
        const weights = recent.map((_, i) => i + 1); const total = weights.reduce((a, b) => a + b, 0);
        return recent.reduce((sum, m, i) => sum + m[key] * weights[i], 0) / total;
    };
    const categoryTotals = {};
    recent.forEach((m) => m.rows.filter((r) => r.type === 'expense').forEach((r) => { categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount; }));
    const predictedExpense = weighted('expense'); const predictedIncome = weighted('income');
    const variance = averages(recent.map((m) => Math.abs(m.expense - predictedExpense)));
    return { predictedIncome: round(predictedIncome), predictedExpense: round(predictedExpense), predictedSavings: round(predictedIncome - predictedExpense),
        confidenceRange: { low: round(Math.max(0, predictedExpense - variance)), high: round(predictedExpense + variance) },
        categories: Object.entries(categoryTotals).map(([category, total]) => ({ category, predicted: round(total / recent.length) })).sort((a,b) => b.predicted-a.predicted).slice(0,6),
        basedOnMonths: recent.length };
}

function anomalies(months) {
    const rows = expenses(months); const mean = averages(rows.map((r) => r.amount));
    const sd = Math.sqrt(averages(rows.map((r) => (r.amount - mean) ** 2)));
    const duplicates = new Map(); rows.forEach((r) => { const k = `${r.date}|${r.name.toLowerCase()}|${r.amount}`; duplicates.set(k, [...(duplicates.get(k) || []), r]); });
    const alerts = rows.filter((r) => rows.length > 3 && r.amount > mean + 1.5 * sd).map((r) => ({ type: 'unusual', severity: 'warning', title: `Unusually high ${r.name}`, detail: `₹${round(r.amount)} is well above your typical transaction of ₹${round(mean)}.`, transaction: r }));
    duplicates.forEach((items) => { if (items.length > 1) alerts.push({ type: 'duplicate', severity: 'warning', title: 'Possible duplicate transaction', detail: `${items.length} matching entries for ${items[0].name} at ₹${round(items[0].amount)}.`, transactions: items }); });
    return { alerts: alerts.slice(0, 20), scannedTransactions: rows.length };
}

function budgetPlan(months) {
    const recent = months.slice(-3); const totals = {};
    expenses(recent).forEach((r) => { totals[r.category] = (totals[r.category] || 0) + r.amount; });
    return { basedOnMonths: recent.length, suggestions: Object.entries(totals).map(([category,total]) => ({ category, historicalAverage: round(total / Math.max(recent.length,1)), suggestedLimit: Math.ceil((total / Math.max(recent.length,1)) * 1.05 / 100) * 100 })).sort((a,b)=>b.suggestedLimit-a.suggestedLimit) };
}

function subscriptions(months) {
    const groups = {};
    expenses(months).forEach((r) => { const k = r.name.trim().toLowerCase(); if (!groups[k]) groups[k] = []; groups[k].push(r); });
    const recurring = Object.entries(groups).filter(([,rows]) => new Set(rows.map((r)=>`${r.year}-${r.month}`)).size >= 2).map(([name,rows]) => ({ name: rows[0].name || name, frequency: 'monthly', occurrences: rows.length, averageAmount: round(averages(rows.map((r)=>r.amount))), estimatedAnnualCost: round(averages(rows.map((r)=>r.amount))*12), category: rows[0].category })).sort((a,b)=>b.estimatedAnnualCost-a.estimatedAnnualCost);
    return { subscriptions: recurring };
}

function goal(months, input) {
    const target = Number(input.targetAmount); const current = Number(input.currentSaved || 0); const targetDate = new Date(input.targetDate);
    if (!(target > 0) || Number.isNaN(targetDate.getTime())) { const e = new Error('Valid targetAmount and targetDate are required'); e.status=400; throw e; }
    const now = new Date(); const monthsLeft = Math.max(1, (targetDate.getFullYear()-now.getFullYear())*12 + targetDate.getMonth()-now.getMonth());
    const required = Math.max(0,target-current); const monthly = required/monthsLeft; const avgSavings = averages(months.slice(-6).map((m)=>m.savings));
    return { targetAmount: target, currentSaved: current, amountRemaining: round(required), monthsLeft, requiredMonthlySaving: round(monthly), currentAverageSaving: round(avgSavings), feasible: avgSavings >= monthly, monthlyGap: round(Math.max(0,monthly-avgSavings)) };
}

function simulate(months, input) {
    const base = forecast(months); if (!base.predictedExpense) return base;
    const amount = Number(input.amount || 0); const percent = Number(input.percent || 0); const mode = input.mode || 'add-expense';
    let delta = mode === 'reduce-expense' ? -Math.abs(amount || base.predictedExpense*percent/100) : Math.abs(amount || base.predictedExpense*percent/100);
    if (mode === 'income-change') delta = 0;
    const newIncome = mode === 'income-change' ? base.predictedIncome + (amount || base.predictedIncome*percent/100) : base.predictedIncome;
    const newExpense = Math.max(0,base.predictedExpense+delta);
    return { baseline: base, scenario: { income: round(newIncome), expense: round(newExpense), savings: round(newIncome-newExpense), monthlyDifference: round((newIncome-newExpense)-base.predictedSavings) } };
}

function timeline(months) {
    if (!months.length) return { events: [] };
    const events=[]; let prior;
    months.forEach((m)=>{ events.push({ date:`${m.year}-${String(m.month).padStart(2,'0')}`, type:m.savings>=0?'good':'warning', title:m.savings>=0?'Positive monthly savings':'Monthly deficit', detail:`Income ₹${round(m.income)}, expenses ₹${round(m.expense)}, savings ₹${round(m.savings)}.` }); if(prior && m.expense>prior.expense*1.25) events.push({date:`${m.year}-${String(m.month).padStart(2,'0')}`,type:'warning',title:'Spending increased',detail:`Expenses rose ${round((m.expense-prior.expense)/Math.max(prior.expense,1)*100)}% from the previous month.`}); prior=m; });
    return { events: events.reverse().slice(0,16) };
}

async function structuredTool(months, tool, input) {
    const data = JSON.stringify(months);
    if (tool === 'parse-transaction') return ai.generateStructured({ temperature:0, system:`Extract one personal-finance transaction. Categories: ${CATEGORIES.join(', ')}. Use YYYY-MM-DD dates. Today's date is ${new Date().toISOString().slice(0,10)}.`, messages:[{role:'user',content:input.text||''}], schema:{type:'object',properties:{type:{type:'string',enum:['income','expense']},name:{type:'string'},amount:{type:'number'},date:{type:'string'},category:{type:'string'}},required:['type','name','amount','date','category']} });
    if (tool === 'search') return ai.generateStructured({ temperature:0, system:'Select only transactions that semantically answer the query. Never invent records.', messages:[{role:'user',content:`QUERY: ${input.query}\nDATA: ${data}`}], schema:{type:'object',properties:{summary:{type:'string'},matches:{type:'array',items:{type:'object',properties:{name:{type:'string'},amount:{type:'number'},date:{type:'string'},category:{type:'string'},reason:{type:'string'}},required:['name','amount','reason']}}},required:['summary','matches']} });
    const prompts={digest:'Write a concise weekly-style financial briefing with highlights, risks, and three actions.',explain:'Explain the requested chart using only supplied financial data. Mention meaningful changes and avoid generic advice.'};
    return ai.generateStructured({temperature:.2,system:prompts[tool],messages:[{role:'user',content:`REQUEST: ${input.query||'Explain my recent trends'}\nDATA: ${data}`}],schema:{type:'object',properties:{summary:{type:'string'},highlights:{type:'array',items:{type:'string'}},actions:{type:'array',items:{type:'string'}}},required:['summary','highlights','actions']}});
}

async function run(userId, tool, input={}) {
    const months=await snapshot(userId);
    const local={forecast,anomalies,'smart-budget':budgetPlan,subscriptions,goal,simulate,timeline};
    return local[tool] ? local[tool](months,input) : structuredTool(months,tool,input);
}

async function receipt(input) {
    const raw=String(input.image||''); const match=raw.match(/^data:(.+);base64,(.+)$/); const data=match?match[2]:raw;
    return ai.analyzeImage({data,mimeType:match?.[1]||input.mimeType||'image/jpeg',prompt:'Extract this receipt into a transaction preview. Do not guess unreadable values.',schema:{type:'object',properties:{merchant:{type:'string'},date:{type:'string'},total:{type:'number'},category:{type:'string'},items:{type:'array',items:{type:'object',properties:{name:{type:'string'},amount:{type:'number'}},required:['name','amount']}},confidence:{type:'string',enum:['high','medium','low']}},required:['merchant','total','category','items','confidence']}});
}

module.exports={run,receipt};

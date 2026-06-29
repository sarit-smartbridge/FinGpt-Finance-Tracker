import React from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mLabel = (n, y) => `${MONTHS[Number(n) - 1] || n} ${y}`;

// palette for the category pie
const PIE_COLORS = ['#6366f1', '#0ea5e9', '#16a34a', '#f59e0b', '#e11d48',
    '#8b5cf6', '#14b8a6', '#ec4899', '#84cc16', '#f97316', '#64748b'];

const tooltipStyle = {
    background: '#fff',
    border: '1px solid #e6e8ef',
    borderRadius: 10,
    fontSize: 13,
    boxShadow: '0 8px 24px -12px rgba(17,24,39,0.25)',
};

/* FR-4: Bar graph — monthly income vs expense trends across all months */
export const MonthlyTrendChart = ({ months }) => {
    if (!months || months.length === 0) return null;

    const data = [...months]
        .sort((a, b) => (String(a.monthYear) + String(a.monthNumber).padStart(2, '0'))
            .localeCompare(String(b.monthYear) + String(b.monthNumber).padStart(2, '0')))
        .map((m) => ({
            name: mLabel(m.monthNumber, m.monthYear),
            Income: m.calculations?.totalIncome || 0,
            Expense: m.calculations?.totalExpense || 0,
        }));

    return (
        <div className="chart-card">
            <h3 className="chart-title">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f5" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e6e8ef' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar dataKey="Income" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Expense" fill="#e11d48" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

/* FR-4: Pie chart — one month's spending split by category */
export const CategoryPieChart = ({ month }) => {
    const table = (month.tables || []).find((t) => (t.tableName || '').toUpperCase() === 'EXPENSE');
    const totals = {};
    (table?.rows || []).forEach((r) => {
        const cat = r.category || r.name || 'Other';
        totals[cat] = (totals[cat] || 0) + (Number(r.amount) || 0);
    });
    const data = Object.entries(totals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    if (data.length === 0) return null;

    return (
        <div className="chart-card">
            <h3 className="chart-title">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="#fff"
                        strokeWidth={2}
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v}`} />
                    <Legend wrapperStyle={{ fontSize: 12.5 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookies';
import { FaWallet, FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import './index.css';

const EXPENSE_CATEGORIES = [
    'Rent', 'Utilities', 'Groceries', 'Food & Dining', 'Transport',
    'Shopping', 'Health', 'Entertainment', 'Education', 'Subscriptions', 'Other',
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const API = 'http://localhost:5100/budgets';

const BudgetManager = () => {
    const now = new Date();
    const userId = Cookies.getItem('userId');

    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [category, setCategory] = useState('Groceries');
    const [amount, setAmount] = useState('');
    const [data, setData] = useState({ budgets: [], totalBudget: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/${userId}?month=${month}&year=${year}`);
            const body = await res.json();
            if (res.ok) setData(body);
        } catch (e) {
            // leave previous data
        } finally {
            setLoading(false);
        }
    }, [userId, month, year]);

    useEffect(() => { load(); }, [load]);

    const setBudget = async (e) => {
        e.preventDefault();
        if (!amount) return;
        try {
            const res = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, category, amount: Number(amount), month, year: String(year) }),
            });
            if (res.ok) { setAmount(''); load(); }
            else { const b = await res.json(); alert(b.error || 'Could not save budget.'); }
        } catch (err) {
            alert('Error saving budget: ' + err);
        }
    };

    const removeBudget = async (id) => {
        if (!window.confirm('Delete this budget?')) return;
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (res.ok) load();
    };

    const barColor = (b) => (b.over ? 'over' : b.percent >= 80 ? 'warn' : 'ok');
    const overCount = data.budgets.filter((b) => b.over).length;

    return (
        <div className="budget-page">
            <div className="budget-shell">
                <div className="budget-head">
                    <div>
                        <h1 className="budget-title"><FaWallet /> Budgets</h1>
                        <p className="budget-sub">Set a monthly limit per category and track your spending against it.</p>
                    </div>
                    <div className="budget-period">
                        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="form-select">
                            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="form-control"
                            style={{ width: 110 }}
                        />
                    </div>
                </div>

                <form className="budget-form" onSubmit={setBudget}>
                    <div className="bf-field">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="bf-field">
                        <label>Monthly Limit (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 5000"
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-gradient"><FaPlus style={{ marginRight: 7 }} /> Set Budget</button>
                </form>

                {/* totals */}
                <div className="budget-totals">
                    <div className="bt-card">
                        <span className="bt-label">Total Budget</span>
                        <span className="bt-value">₹{data.totalBudget}</span>
                    </div>
                    <div className="bt-card">
                        <span className="bt-label">Total Spent</span>
                        <span className="bt-value" style={{ color: data.totalSpent > data.totalBudget ? 'var(--expense)' : 'var(--ink-900)' }}>₹{data.totalSpent}</span>
                    </div>
                    <div className="bt-card">
                        <span className="bt-label">Remaining</span>
                        <span className="bt-value" style={{ color: 'var(--income)' }}>₹{data.totalBudget - data.totalSpent}</span>
                    </div>
                </div>

                {overCount > 0 && (
                    <div className="budget-alert">
                        <FaExclamationTriangle />
                        You've exceeded your budget in {overCount} {overCount === 1 ? 'category' : 'categories'} this month.
                    </div>
                )}

                {/* progress list */}
                {loading && data.budgets.length === 0 ? (
                    <p className="budget-muted">Loading…</p>
                ) : data.budgets.length === 0 ? (
                    <div className="budget-empty">
                        <div className="be-icon"><FaWallet /></div>
                        <h3>No budgets for {MONTHS[month - 1]} {year}</h3>
                        <p>Add a category limit above to start tracking your spending against a budget.</p>
                    </div>
                ) : (
                    <div className="budget-list">
                        {data.budgets.map((b) => (
                            <div className="budget-item" key={b._id}>
                                <div className="bi-top">
                                    <span className="bi-cat">{b.category}</span>
                                    <div className="bi-right">
                                        <span className="bi-amounts">
                                            ₹{b.spent} <span className="bi-of">/ ₹{b.amount}</span>
                                        </span>
                                        <button className="bi-del" onClick={() => removeBudget(b._id)} title="Delete budget">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="bi-bar">
                                    <div className={`bi-fill ${barColor(b)}`} style={{ width: `${Math.min(b.percent, 100)}%` }} />
                                </div>
                                <div className="bi-meta">
                                    <span className={b.over ? 'text-expense' : ''}>{b.percent}% used</span>
                                    <span>{b.remaining >= 0 ? `₹${b.remaining} left` : `₹${Math.abs(b.remaining)} over`}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetManager;

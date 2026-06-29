import React, { useState, useEffect } from "react";
import { TrackContainer } from "./styledComponents";
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookies';
import LoaderSpinner from '../LoaderSpinner';
import {
    FaEdit, FaTrash, FaDownload, FaPlus, FaCheck,
    FaArrowDown, FaArrowUp, FaPiggyBank, FaExclamationTriangle,
    FaCalendarPlus, FaCalendarTimes, FaRegCalendarAlt, FaInbox, FaTags,
} from 'react-icons/fa';
import AiInsights from '../AiInsights';
import { MonthlyTrendChart, CategoryPieChart } from '../Charts';

import './index.css';

const MONTH_OPTIONS = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const Track = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [rowMonthId, setRowMonthId] = useState('')
    const [rowTableId, setRowTableId] = useState('')

    const [date, setDate] = useState('')
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')

    const [editRowData, setEditRowData] = useState({})
    const [editId, setEditId] = useState('')
    const [categorizingId, setCategorizingId] = useState('')

    const apiStatusConstants = {
        initial: 'INITIAL',
        inProgress: 'INPROGRESS',
        success: 'SUCCESS',
        failure: 'FAILURE',
    };

    const [apiResponseData, setApiResponseData] = useState({
        status: apiStatusConstants.initial,
        data: [],
        errMsg: ''
    });

    const userName = Cookies.getItem('userName');

    const renderInProgress = () => {
        return (
            <div className="track-status">
                <LoaderSpinner />
            </div>
        );
    };

    const renderFailure = () => {
        return (
            <div className="track-empty">
                <div className="e-icon" style={{ background: 'var(--expense-soft)', color: 'var(--expense)' }}>
                    <FaExclamationTriangle />
                </div>
                <h3>Something went wrong</h3>
                <p>We couldn't load your expenses. Please try again.</p>
            </div>
        );
    };

    const handleEditRow = async (expenseId, tableName, rowId) => {
        try {
            const response = await fetch(`http://localhost:5100/expenses/${expenseId}/tables/${tableName}/rows/${rowId}`);
            const data = await response.json();
            if (response.ok) {
                setEditRowData(data);
                setEditId(rowId);
            } else {
                alert(data.error || 'Could not load this row.');
            }
        } catch (error) {
            alert('Error loading table row: ' + error);
        }
    };

    const submitEditedRow = async (monthId, tableName, rowId) => {
        try {
            const response = await fetch(`http://localhost:5100/expenses/${monthId}/tables/${tableName}/rows/${rowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRowData),
            });
            const data = await response.json();
            if (response.ok) {
                getData();
                setEditId('');
            } else {
                alert(data.error || 'Could not update this row.');
            }
        } catch (error) {
            alert('Error updating table row: ' + error);
        }
    };

    const handleDeleteRow = async (expenseId, tableName, rowId) => {
        try {
            const response = await fetch(`http://localhost:5100/expenses/${expenseId}/tables/${tableName}/rows/${rowId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await response.json();
                getData();
            } else {
                const errorData = await response.json();
                alert(errorData)
            }
        } catch (error) {
            alert('Error deleting table row:', error);
        }
    };

    const handleAddRow = async (month, table) => {
        const requestBody = {
            formData: { date, name, amount },
            monthId: month._id,
            tableName: table.tableName
        };

        try {
            const response = await fetch('http://localhost:5100/addRow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                await response.json();
                getData();
                setDate("")
                setName("")
                setAmount("")
            } else {
                alert('Error adding new row:', response);
            }
        } catch (error) {
            alert('Error adding new row:', error);
        }
    };

    const handleDeleteMonth = async () => {
        if (!year.trim() || !month.trim()) {
            alert('Enter the Year and Month of the month you want to delete.');
            return;
        }
        const userId = Cookies.getItem('userId');
        const confirmed = window.confirm(`Delete all data for month ${month}, ${year}? This cannot be undone.`);
        if (!confirmed) return;
        try {
            const response = await fetch('http://localhost:5100/expenses/month', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, monthYear: year.trim(), monthNumber: month.trim() }),
            });
            if (response.ok) {
                setYear('');
                setMonth('');
                getData();
            } else if (response.status === 404) {
                alert('No month found for that Year and Month.');
            } else {
                alert('Could not delete that month.');
            }
        } catch (error) {
            alert('Error deleting month: ' + error);
        }
    };

    const exportPdfe = async (month) => {
        try {
            const response = await fetch('http://localhost:5100/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month }),
            });
            if (response.ok) {
                const blob = await response.blob();

                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'report.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleCategorize = async (monthId) => {
        setCategorizingId(monthId);
        try {
            const response = await fetch('http://localhost:5100/ai/categorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthId }),
            });
            const data = await response.json();
            if (response.ok) {
                getData();
            } else {
                alert(data.error || 'Could not categorize this month.');
            }
        } catch (error) {
            alert('Error categorizing: ' + error);
        } finally {
            setCategorizingId('');
        }
    };

    const tagClass = (tableName) => {
        const t = (tableName || '').toUpperCase();
        if (t === 'INCOME') return 'income';
        if (t === 'EXPENSE') return 'expense';
        return 'neutral';
    };

    const tagIcon = (tableName) => {
        const t = (tableName || '').toUpperCase();
        if (t === 'INCOME') return <FaArrowDown />;
        if (t === 'EXPENSE') return <FaArrowUp />;
        return <FaRegCalendarAlt />;
    };

    const getMonthName = (monthNumber) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const monthIndex = Number(monthNumber) - 1;
        return monthNames[monthIndex] || `Month ${monthNumber}`;
    };

    const renderSuccessData = () => {
        if (!apiResponseData.data || apiResponseData.data.length === 0) {
            return (
                <div className="track-empty">
                    <div className="e-icon"><FaInbox /></div>
                    <h3>No months yet</h3>
                    <p>Start by adding a new month to track your income and expenses.</p>
                </div>
            );
        }

        const visibleMonths = apiResponseData.data.filter((m) =>
            (year.trim() ? String(m.monthYear) === year.trim() : true) &&
            (month.trim() ? String(m.monthNumber) === month.trim() : true)
        );

        if (visibleMonths.length === 0) {
            return (
                <div className="track-empty">
                    <div className="e-icon"><FaInbox /></div>
                    <h3>No matching months</h3>
                    <p>No month matches the Year / Month filter above. Clear the filter to see all months.</p>
                </div>
            );
        }

        return (
            <div>
                <MonthlyTrendChart months={apiResponseData.data} />
                {visibleMonths.map((month, index) => (
                    <div key={index} className="month-card animate-up">
                        <div className="month-card-header">
                            <span className="month-pill"><FaRegCalendarAlt /></span>
                            <h2>{getMonthName(month.monthNumber)} &middot; {month.monthYear}</h2>
                        </div>

                        <div className="month-card-body">
                            <div className="tables-grid">
                                {month.tables.map((table, tableIndex) => (
                                    <div className="txn-block" key={tableIndex}>
                                        <div className="txn-block-head">
                                            <span className={`txn-tag ${tagClass(table.tableName)}`}>
                                                {tagIcon(table.tableName)} {table.tableName}
                                            </span>
                                        </div>
                                        <table className="txn-table">
                                            <thead>
                                                <tr>
                                                    <th className="col-actions"></th>
                                                    {table.columns.map((column, columnIndex) => (
                                                        <th key={columnIndex}>{column}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {table.rows.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td className="col-actions">
                                                            {editId !== row._id ? (
                                                                <div className="row-actions">
                                                                    <button className="icon-btn edit" title="Edit" onClick={() => { handleEditRow(month._id, table.tableName, row._id) }}>
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button className="icon-btn del" title="Delete" onClick={() => { handleDeleteRow(month._id, table.tableName, row._id) }}>
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button className="icon-btn save" onClick={() => { submitEditedRow(month._id, table.tableName, row._id) }}>
                                                                    <FaCheck /> Save
                                                                </button>
                                                            )}
                                                        </td>
                                                        {editId !== row._id ? (
                                                            <>
                                                                <td>{row.date}</td>
                                                                <td>
                                                                    {row.name}
                                                                    {row.category && <span className="cat-badge">{row.category}</span>}
                                                                </td>
                                                                <td className="amount-cell">{row.amount}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        value={editRowData.date}
                                                                        onChange={(e) => setEditRowData({ ...editRowData, date: e.target.value })}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        value={editRowData.name}
                                                                        onChange={(e) => setEditRowData({ ...editRowData, name: e.target.value })}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        value={editRowData.amount}
                                                                        onChange={(e) => setEditRowData({ ...editRowData, amount: e.target.value })}
                                                                    />
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                                <tr className="add-row">
                                                    <td className="col-actions">
                                                        <button className="icon-btn add" title="Add row" onClick={() => handleAddRow(month, table)}>
                                                            <FaPlus />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? date : ''} onChange={(e) => { setDate(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="date" aria-label="Date" />
                                                    </td>
                                                    <td>
                                                        <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? name : ''} onChange={(e) => { setName(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="text" placeholder="Name" />
                                                    </td>
                                                    <td>
                                                        <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? amount : ''} onChange={(e) => { setAmount(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="number" placeholder="Amount" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-grid">
                                <div className="summary-card income">
                                    <div className="s-label"><span className="s-icon"><FaArrowDown /></span> Total Income</div>
                                    <div className="s-value">{month.calculations.totalIncome}</div>
                                </div>
                                <div className="summary-card expense">
                                    <div className="s-label"><span className="s-icon"><FaArrowUp /></span> Total Expense</div>
                                    <div className="s-value">{month.calculations.totalExpense}</div>
                                </div>
                                <div className="summary-card savings">
                                    <div className="s-label"><span className="s-icon"><FaPiggyBank /></span> Current Savings</div>
                                    <div className="s-value">{month.calculations.currentAmount}</div>
                                </div>
                            </div>

                            <CategoryPieChart month={month} />

                            {month.calculations.totalExpense > month.calculations.totalIncome / 2 && (
                                <div className="limit-alert">
                                    <FaExclamationTriangle className="alert-icon" />
                                    <div>
                                        <h4>You've exceeded your spending limit</h4>
                                        <p>You shouldn't spend more than half of your income in a month. Time to ease off a little.</p>
                                    </div>
                                </div>
                            )}

                            <AiInsights monthId={month._id} />

                            <div className="month-footer">
                                <button
                                    className="btn btn-soft"
                                    onClick={() => handleCategorize(month._id)}
                                    disabled={categorizingId === month._id}
                                >
                                    <FaTags style={{ marginRight: 8 }} />
                                    {categorizingId === month._id ? 'Categorizing...' : 'Auto-categorize'}
                                </button>
                                <button className="btn btn-outline-success" onClick={() => { exportPdfe(month) }}>
                                    <FaDownload style={{ marginRight: 8 }} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getData = async () => {
        const api = 'http://localhost:5100/expenses';
        const userId = Cookies.getItem('userId');
        const options = {
            method: 'GET',
        };
        try {
            setApiResponseData({ ...apiResponseData, status: apiStatusConstants.inProgress });
            const response = await fetch(`${api}/${userId}`, options);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setApiResponseData({ ...apiResponseData, status: apiStatusConstants.success, data });
            } else if (response.status === 401) {
                setApiResponseData({ ...apiResponseData, status: apiStatusConstants.failure, errMsg: 'Unauthorized user!' });
            }
        } catch (error) {
            console.error('Error during data fetching:', error);
        }
    };

    const renderApiStatus = () => {
        const apiStatus = apiResponseData.status;
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderInProgress();
            case apiStatusConstants.failure:
                return renderFailure();
            case apiStatusConstants.success:
                return renderSuccessData();
            default:
                return null;
        }
    };

    useEffect(() => {
        getData();
        renderApiStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TrackContainer>
            <div className="track-shell">
                <h1 className="track-greeting">
                    Welcome back, {userName || 'there'}
                </h1>
                <p className="track-subtitle">Here's an overview of your income, expenses and savings.</p>

                <div className="track-toolbar">
                    <div className="field">
                        <label>Year</label>
                        <input
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="e.g. 2026"
                        />
                    </div>
                    <div className="field">
                        <label>Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            <option value="">All months</option>
                            {MONTH_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="actions">
                        <NavLink to="/addincome-or-expense" className="btn btn-gradient">
                            <FaCalendarPlus style={{ marginRight: 8 }} /> Add New Month
                        </NavLink>
                        <button className="btn btn-outline-danger" onClick={handleDeleteMonth}>
                            <FaCalendarTimes style={{ marginRight: 8 }} /> Delete Month
                        </button>
                    </div>
                </div>

                <p className="track-hint">
                    Want to record a new month's earnings and expenditure? Click <NavLink to="/addincome-or-expense">Add New Month</NavLink> above to get started.
                </p>

                {renderApiStatus()}
            </div>
        </TrackContainer>
    );
};

export default Track;

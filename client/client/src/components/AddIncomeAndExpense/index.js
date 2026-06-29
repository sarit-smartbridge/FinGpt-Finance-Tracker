import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { FaArrowDown, FaArrowUp, FaCheck } from 'react-icons/fa';
import Cookies from 'js-cookies';

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other'];
const expenseCategories = ['Rent', 'Utilities', 'Groceries'];
const monthOptions = [
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

const Page = styled.div`
    min-height: 100vh;
    padding: 112px 20px 64px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: var(--bg-0);
`;

const StyledForm = styled(Form)`
    width: 100%;
    max-width: 560px;
    padding: 34px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    background: var(--surface);
`;

const Title = styled.h2`
    font-size: 1.55rem;
    font-weight: 850;
    margin-bottom: 6px;
`;

const Sub = styled.p`
    color: var(--ink-500);
    margin-bottom: 24px;
    font-size: 0.95rem;
`;

const Toggle = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 5px;
    margin-bottom: 24px;

    button {
        border: none;
        background: transparent;
        border-radius: var(--radius-sm);
        padding: 10px;
        font-weight: 800;
        color: var(--ink-500);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.15s ease;
    }
    button.active-income {
        background: var(--income);
        color: #fff;
    }
    button.active-expense {
        background: var(--expense);
        color: #fff;
    }
`;

const AddIncomeAndExpense = () => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        month: '',
        year: '',
        date: '',
    });

    const [type, setType] = useState('income');

    const handleTypeChange = (newType) => {
        setType(newType);
        setFormData((prev) => ({ ...prev, category: '' }));
    };

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        const api = 'http://localhost:5100/expenses';
        const userId = Cookies.getItem("userId");

        const data = {
            userId: userId,
            monthYear: formData.year,
            monthNumber: Number(formData.month),
            tables: [
                {
                    tableName: "INCOME",
                    columns: ["Date", "Category", "Amount"],
                    rows: [
                        {
                            date: formData.date,
                            name: formData.category,
                            amount: Number(formData.amount)
                        }
                    ]
                }
            ]
        };

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await response.json();
                alert('Income added successfully');
                setFormData({
                    amount: '',
                    category: '',
                    month: '',
                    year: '',
                    date: '',
                })
            } else {
                const body = await response.json().catch(() => ({}));
                alert(body.error || 'Failed to add income');
            }
        } catch (error) {
            alert('Error while adding income: ' + error);
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        const api = 'http://localhost:5100/expenses';
        const userId = Cookies.getItem("userId");

        const data = {
            userId: userId,
            monthYear: formData.year,
            monthNumber: Number(formData.month),
            tables: [
                {
                    tableName: "EXPENSE",
                    columns: ["Date", "Category", "Amount"],
                    rows: [
                        {
                            date: formData.date,
                            name: formData.category,
                            amount: Number(formData.amount)
                        }
                    ]
                }
            ]
        };

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await response.json();
                alert('Expense added successfully');
                setFormData({
                    amount: '',
                    category: '',
                    month: '',
                    year: '',
                    date: '',
                })
            } else {
                const body = await response.json().catch(() => ({}));
                alert(body.error || 'Failed to add expense');
            }
        } catch (error) {
            alert('Error while adding expense: ' + error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <Page>
            <StyledForm className="animate-up" onSubmit={type === 'income' ? handleIncomeSubmit : handleExpenseSubmit}>
                <Title>Add a transaction</Title>
                <Sub>Record a new income or expense entry for the month.</Sub>

                <Toggle>
                    <button
                        type="button"
                        className={type === 'income' ? 'active-income' : ''}
                        onClick={() => handleTypeChange('income')}
                    >
                        <FaArrowDown /> Income
                    </button>
                    <button
                        type="button"
                        className={type === 'expense' ? 'active-expense' : ''}
                        onClick={() => handleTypeChange('expense')}
                    >
                        <FaArrowUp /> Expense
                    </button>
                </Toggle>

                <Form.Group className="mb-3" controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select category</option>
                        {(type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="row g-3">
                    <Form.Group className="col-6" controlId="month">
                        <Form.Label>Month</Form.Label>
                        <Form.Select
                            name="month"
                            value={formData.month}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select month</option>
                            {monthOptions.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {[
                        { controlId: 'year', label: 'Year', col: 'col-6', type: 'text' },
                        { controlId: 'date', label: 'Date', col: 'col-12', type: 'date' },
                    ].map((field) => (
                        <Form.Group className={field.col} controlId={field.controlId} key={field.controlId}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type={field.type}
                                placeholder={field.type === 'date' ? undefined : `Enter ${field.label.toLowerCase()}`}
                                name={field.controlId}
                                value={formData[field.controlId]}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    ))}
                </div>

                <Button
                    type="submit"
                    className={`w-100 mt-4 py-2 border-0 ${type === 'income' ? 'btn-success' : 'btn-danger'}`}
                    style={{
                        backgroundColor: type === 'income' ? 'var(--income)' : 'var(--expense)',
                    }}
                >
                    <FaCheck style={{ marginRight: 8 }} />
                    Add {type === 'income' ? 'Income' : 'Expense'}
                </Button>
            </StyledForm>
        </Page>
    );
};

export default AddIncomeAndExpense;

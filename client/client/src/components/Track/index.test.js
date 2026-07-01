import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Track from './index';

vi.mock('js-cookies', () => ({
    default: {
        getItem: vi.fn((key) => (key === 'userId' ? 'user-1' : 'Test User')),
    },
}));

vi.mock('../Charts', () => ({
    MonthlyTrendChart: () => <div data-testid="monthly-trend-chart" />,
    CategoryPieChart: () => <div data-testid="category-pie-chart" />,
}));

vi.mock('../AiInsights', () => ({
    default: () => <div data-testid="ai-insights" />,
}));

vi.mock('../LoaderSpinner', () => ({
    default: () => <div>Loading...</div>,
}));

beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ([
            {
                _id: 'month-1',
                userId: 'user-1',
                monthYear: '2026',
                monthNumber: 7,
                tables: [
                    {
                        _id: 'table-1',
                        tableName: 'INCOME',
                        columns: ['Date', 'Category', 'Amount'],
                        rows: [
                            {
                                _id: 'row-1',
                                date: '2026-07-01',
                                name: 'Salary',
                                amount: 1000,
                            },
                            {
                                _id: 'row-2',
                                Date: '2026-07-02',
                                name: 'Freelance',
                                amount: 500,
                            },
                        ],
                    },
                ],
                calculations: {
                    totalIncome: 1000,
                    totalExpense: 0,
                    currentAmount: 1000,
                },
            },
        ]),
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});

test('renders the saved transaction date in the Track table', async () => {
    render(
        <MemoryRouter>
            <Track />
        </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('2026-07-01')).toBeInTheDocument());
    expect(screen.getByText('2026-07-02')).toBeInTheDocument();
});

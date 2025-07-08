import { LoanApplication } from '../types/loan';

export const mockTransactions = [
  {
    date: '2025-07-01',
    amount: 5000,
    type: 'credit',
    description: 'Salary Deposit'
  },
  {
    date: '2025-07-02',
    amount: 2000,
    type: 'credit',
    description: 'Bonus Payment'
  },
  {
    date: '2025-07-03',
    amount: 1500,
    type: 'debit',
    description: 'Airtime Purchase'
  },
  {
    date: '2025-07-04',
    amount: 1000,
    type: 'credit',
    description: 'Refund'
  },
  {
    date: '2025-07-05',
    amount: 3000,
    type: 'debit',
    description: 'Bills Payment'
  }
];

export const mockLoanApplications: LoanApplication[] = [
  {
    id: 'loan123',
    userId: 'user456',
    transactions: mockTransactions,
    screenshotUrl: 'https://example.com/transaction-screenshot-1.jpg',
    loanAmount: 3250, // 50% of total transactions (13000)
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'loan456',
    userId: 'user789',
    transactions: [
      ...mockTransactions.slice(0, 3),
      {
        date: '2025-07-06',
        amount: 2500,
        type: 'credit',
        description: 'Investment Return'
      },
      {
        date: '2025-07-07',
        amount: 500,
        type: 'debit',
        description: 'Groceries'
      }
    ],
    screenshotUrl: 'https://example.com/transaction-screenshot-2.jpg',
    loanAmount: 3500, // 50% of total transactions (14000)
    status: 'approved',
    createdAt: new Date('2025-07-03').toISOString(),
    updatedAt: new Date('2025-07-04').toISOString()
  },
  {
    id: 'loan789',
    userId: 'user101',
    transactions: [
      ...mockTransactions.slice(0, 2),
      {
        date: '2025-07-08',
        amount: 10000,
        type: 'debit',
        description: 'Large Payment'
      },
      {
        date: '2025-07-09',
        amount: 2000,
        type: 'credit',
        description: 'Refund'
      },
      {
        date: '2025-07-10',
        amount: 500,
        type: 'debit',
        description: 'Small Expense'
      }
    ],
    screenshotUrl: 'https://example.com/transaction-screenshot-3.jpg',
    loanAmount: 2250, // 50% of total transactions (4500)
    status: 'rejected',
    createdAt: new Date('2025-07-01').toISOString(),
    updatedAt: new Date('2025-07-02').toISOString()
  }
];

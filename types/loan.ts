export interface Transaction {
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  transactions: Transaction[];
  screenshotUrl: string;
  loanAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface LoanApproval {
  id: string;
  loanAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

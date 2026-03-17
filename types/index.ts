export type UserData = {
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
};

export type TransactionData = {
  amount: string;
  type: 'credit' | 'debit';
  date: string;
  description?: string;
};

export type LoanApplicationData = {
  loanType: 'personal' | 'business';
  transactions: TransactionData[];
  screenshotUri?: string;
};

export type RootStackParamList = {
  Register: undefined;
  LoanApplication: { userId: string };
  TransactionForm: { userId: string };
  Dashboard: { userId: string };
};

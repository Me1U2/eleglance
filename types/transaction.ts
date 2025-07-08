export interface Transaction {
  id: number;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | string;
  amount: number;
  description: string;
  date: string;
}

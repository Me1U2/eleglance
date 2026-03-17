// API client for Eleglance Backend
// Use environment variable or fallback to localhost for development
// For production, set EXPO_PUBLIC_API_URL to your deployed backend URL
// For local testing on device, use your computer's IP address (e.g., http://192.168.1.100:3001/api)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  description?: string;
  userId: string;
}

export interface Loan {
  id: string;
  amount: number;
  loanType: 'personal' | 'business';
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  screenshotUrl: string;
  netCashFlow: number;
  createdAt: string;
}

export interface LoanApplicationData {
  loanType: 'personal' | 'business';
  transactions: Array<{
    amount: string;
    type: 'credit' | 'debit';
    description?: string;
  }>;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User endpoints
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Transaction endpoints
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/user/${userId}`);
  }

  // Loan endpoints
  async createLoan(loanData: Omit<Loan, 'id' | 'createdAt'>): Promise<Loan> {
    return this.request<Loan>('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  async getUserLoans(userId: string): Promise<Loan[]> {
    return this.request<Loan[]>(`/loans/user/${userId}`);
  }

  // Loan application endpoint
  async submitLoanApplication(data: {
    loanType: 'personal' | 'business';
    transactions: Array<{
      amount: string;
      type: 'credit' | 'debit';
      description?: string;
    }>;
    userId: string;
    screenshotUrl: string;
  }): Promise<{
    loan: Loan;
    transactions: Transaction[];
    netCashFlow: number;
    isEligible: boolean;
    message: string;
  }> {
    return this.request('/loan-application', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();






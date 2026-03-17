// Mock Prisma client for React Native compatibility
// Prisma Client doesn't work in React Native/Expo environment
// In a real production app, you would use a REST API backend

interface User {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  createdAt: Date;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
  description?: string;
  userId: string;
}

interface Loan {
  id: string;
  amount: number;
  loanType: 'personal' | 'business';
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  screenshotUrl?: string;
  netCashFlow: number;
  createdAt: Date;
}

class MockPrismaClient {
  private users: User[] = [];
  private transactions: Transaction[] = [];
  private loans: Loan[] = [];

  get user() {
    return {
      findFirst: async (params: { where: any }) => {
        const { where } = params;
        if (where.OR) {
          return this.users.find(user => 
            where.OR.some((condition: any) => 
              Object.entries(condition).every(([key, value]) => user[key as keyof User] === value)
            )
          ) || null;
        }
        return this.users.find(user => 
          Object.entries(where).every(([key, value]) => user[key as keyof User] === value)
        ) || null;
      },
      create: async (params: { data: Omit<User, 'id' | 'createdAt'> }) => {
        const newUser: User = {
          id: Date.now().toString(),
          ...params.data,
          createdAt: new Date(),
        };
        this.users.push(newUser);
        console.log('✅ User created:', newUser);
        return newUser;
      },
    };
  }

  get transaction() {
    return {
      create: async (params: { data: Omit<Transaction, 'id'> }) => {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          ...params.data,
        };
        this.transactions.push(newTransaction);
        console.log('✅ Transaction created:', newTransaction);
        return newTransaction;
      },
    };
  }

  get loan() {
    return {
      create: async (params: { data: Omit<Loan, 'id' | 'createdAt'> }) => {
        const newLoan: Loan = {
          id: Date.now().toString(),
          ...params.data,
          createdAt: new Date(),
        };
        this.loans.push(newLoan);
        console.log('✅ Loan created:', newLoan);
        return newLoan;
      },
    };
  }
}

const prisma = new MockPrismaClient();

export { prisma };

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Eleglance Backend API is running!', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, nationalId, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { nationalId },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this National ID or Phone Number' 
      });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        nationalId,
        phoneNumber
      }
    });

    console.log('✅ User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true,
        loans: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Transaction routes
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, type, description, userId } = req.body;
    
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        description,
        userId,
        date: new Date()
      }
    });

    console.log('✅ Transaction created:', transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.get('/api/transactions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Loan routes
app.post('/api/loans', async (req, res) => {
  try {
    const { amount, loanType, status, userId, screenshotUrl, netCashFlow } = req.body;
    
    const loan = await prisma.loan.create({
      data: {
        amount: parseFloat(amount),
        loanType,
        status,
        userId,
        screenshotUrl,
        netCashFlow: parseFloat(netCashFlow)
      }
    });

    console.log('✅ Loan created:', loan);
    res.status(201).json(loan);
  } catch (error) {
    console.error('❌ Error creating loan:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

app.get('/api/loans/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const loans = await prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(loans);
  } catch (error) {
    console.error('❌ Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Loan application endpoint (creates both loan and transactions)
app.post('/api/loan-application', async (req, res) => {
  try {
    const { loanType, transactions, userId, screenshotUrl } = req.body;
    
    // Calculate net cash flow
    const netCashFlow = transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      return transaction.type === 'credit' ? sum + amount : sum - amount;
    }, 0);
    
    // Determine loan eligibility
    const isEligible = loanType === 'personal' 
      ? netCashFlow >= 50000 
      : netCashFlow >= 500000;
    
    const loanAmount = loanType === 'personal' ? 50000 : 500000;
    const status = isEligible ? 'approved' : 'rejected';

    // Create loan
    const loan = await prisma.loan.create({
      data: {
        amount: loanAmount,
        loanType,
        status,
        userId,
        screenshotUrl,
        netCashFlow
      }
    });

    // Create transactions
    const createdTransactions = await Promise.all(
      transactions.map(transaction =>
        prisma.transaction.create({
          data: {
            amount: parseFloat(transaction.amount) || 0,
            type: transaction.type,
            date: new Date(),
            description: transaction.description || 'Mobile Money Transaction',
            userId,
          },
        })
      )
    );

    console.log('✅ Loan application processed:', { loan, transactions: createdTransactions });
    
    res.status(201).json({
      loan,
      transactions: createdTransactions,
      netCashFlow,
      isEligible,
      message: isEligible ? 'Loan approved!' : 'Loan rejected - insufficient cash flow'
    });
  } catch (error) {
    console.error('❌ Error processing loan application:', error);
    res.status(500).json({ error: 'Failed to process loan application' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Eleglance Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});








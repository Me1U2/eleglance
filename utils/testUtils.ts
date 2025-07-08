import { LoanApplication } from '../types/loan';
import { mockLoanApplications } from '../data/mockLoanData';

export const testLoanWorkflow = async () => {
  console.log('Starting loan workflow test...');
  
  // Test 1: Calculate loan amount from transactions
  const testTransactions = mockLoanApplications[0].transactions;
  const totalAmount = testTransactions.reduce((sum, t) => 
    t.type === 'credit' ? sum + t.amount : sum - t.amount, 0
  );
  const loanAmount = totalAmount * 0.5;
  
  console.log(`\nTest 1: Loan Amount Calculation`);
  console.log(`Total Transactions: $${totalAmount}`);
  console.log(`Loan Amount (50%): $${loanAmount}`);
  
  // Test 2: Verify admin dashboard display
  console.log(`\nTest 2: Admin Dashboard Display`);
  mockLoanApplications.forEach((app, index) => {
    console.log(`\nApplication ${index + 1}:`);
    console.log(`ID: ${app.id}`);
    console.log(`User ID: ${app.userId}`);
    console.log(`Status: ${app.status}`);
    console.log(`Loan Amount: $${app.loanAmount}`);
    console.log(`Transactions: ${app.transactions.length}`);
  });
  
  // Test 3: Verify loan status updates
  console.log(`\nTest 3: Loan Status Updates`);
  const testApp = mockLoanApplications[0];
  console.log(`Initial Status: ${testApp.status}`);
  
  // Simulate status update
  const updatedApp: LoanApplication = {
    ...testApp,
    status: 'approved',
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Updated Status: ${updatedApp.status}`);
  
  // Test 4: Verify transaction display
  console.log(`\nTest 4: Transaction Display`);
  const testTransactionsDisplay = testApp.transactions.map(t => (
    `${t.date} - ${t.type === 'credit' ? '+' : '-'} ${t.amount} - ${t.description}`
  ));
  
  console.log('Recent Transactions:');
  testTransactionsDisplay.forEach(t => console.log(t));
};

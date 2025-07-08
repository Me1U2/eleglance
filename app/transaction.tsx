import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { TransactionHistory } from '../components/transaction/TransactionHistory';
import { Transaction } from '../types/transaction';

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'Deposit',
    amount: 1500,
    description: 'Salary Deposit',
    date: '2025-07-07',
  },
  {
    id: 2,
    type: 'Withdrawal',
    amount: -200,
    description: 'Grocery Shopping',
    date: '2025-07-06',
  },
  {
    id: 3,
    type: 'Deposit',
    amount: 500,
    description: 'Freelance Payment',
    date: '2025-07-05',
  },
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const handleTransactionSubmit = (newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...newTransaction, id: Date.now() },
      ...prev,
    ]);
  };

  return (
    <TransactionHistory
      transactions={transactions}
      onTransactionPress={() => {}}
      onTransactionSubmit={handleTransactionSubmit}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <TransactionForm onSubmit={handleTransactionSubmit} />
        </View>
        <View style={styles.historyContainer}>
          <TransactionHistory transactions={transactions} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  historyContainer: {
    flex: 1,
  },
});
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS } from '../constants/theme';
import { Transaction } from '../types/loan';

interface TransactionInput {
  date: string;
  amount: string;
  type: 'credit' | 'debit';
  description: string;
}

export default function LoanTransactionScreen() {
  const [transactions, setTransactions] = useState<TransactionInput[]>([]);
  const [loanType, setLoanType] = useState<'business' | 'personal'>('personal');
  const [newTransaction, setNewTransaction] = useState<TransactionInput>({
    date: '',
    amount: '',
    type: 'credit',
    description: '',
  });

  const handleAddTransaction = () => {
    if (transactions.length >= 5) {
      Alert.alert('Maximum reached', 'You can only add up to 5 transactions.');
      return;
    }

    if (!newTransaction.date || !newTransaction.amount || !newTransaction.description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setTransactions([...transactions, { ...newTransaction, amount: newTransaction.amount }]);
    setNewTransaction({
      date: '',
      amount: '',
      type: 'credit',
      description: '',
    });
  };

  const handleCalculate = () => {
    const totalAmount = transactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount);
      return sum + (t.type === 'credit' ? amount : -amount);
    }, 0);

    const minAmount = loanType === 'business' ? 1000000 : 400000;
    const isEligible = totalAmount >= minAmount;

    Alert.alert(
      'Loan Eligibility',
      `Total transactions: ${totalAmount.toLocaleString()} shillings\n\n${
        isEligible
          ? 'Congratulations! You are eligible for a loan.'
          : `Sorry, your total transactions (${totalAmount.toLocaleString()} shillings) do not meet the minimum requirement of ${minAmount.toLocaleString()} shillings.`
      }`
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Loan Transaction Input',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.content}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loanType === 'business' && styles.switchButtonActive,
            ]}
            onPress={() => setLoanType('business')}
          >
            <Text style={[styles.switchText, loanType === 'business' && styles.switchTextActive]}>Business Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loanType === 'personal' && styles.switchButtonActive,
            ]}
            onPress={() => setLoanType('personal')}
          >
            <Text style={[styles.switchText, loanType === 'personal' && styles.switchTextActive]}>Personal Loan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newTransaction.date}
            onChangeText={(text) => setNewTransaction({ ...newTransaction, date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={newTransaction.amount}
            onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            keyboardType="numeric"
          />
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                newTransaction.type === 'credit' && styles.typeButtonActive,
              ]}
              onPress={() => setNewTransaction({ ...newTransaction, type: 'credit' })}
            >
              <Text style={[styles.typeText, newTransaction.type === 'credit' && styles.typeTextActive]}>Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                newTransaction.type === 'debit' && styles.typeButtonActive,
              ]}
              onPress={() => setNewTransaction({ ...newTransaction, type: 'debit' })}
            >
              <Text style={[styles.typeText, newTransaction.type === 'debit' && styles.typeTextActive]}>Debit</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newTransaction.description}
            onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        {transactions.length > 0 && (
          <View style={styles.transactionsContainer}>
            <Text style={styles.transactionsTitle}>Transactions ({transactions.length}/5)</Text>
            {transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <Text style={styles.transactionText}>{transaction.date}</Text>
                <Text style={styles.transactionText}>{transaction.amount} {transaction.type}</Text>
                <Text style={styles.transactionText}>{transaction.description}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>Calculate Loan Eligibility</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  switchButtonActive: {
    backgroundColor: COLORS.primary,
  },
  switchText: {
    textAlign: 'center',
    color: COLORS.primary,
  },
  switchTextActive: {
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.lightWhite,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    textAlign: 'center',
    color: COLORS.primary,
  },
  typeTextActive: {
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionItem: {
    padding: 12,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionText: {
    marginBottom: 4,
  },
  calculateButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  calculateButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

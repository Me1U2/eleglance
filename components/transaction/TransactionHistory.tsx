import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TransactionForm } from '../transaction/TransactionForm';
import { COLORS } from '../../constants/theme';
import { Transaction } from '../../types/transaction';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  onTransactionSubmit?: (transaction: Omit<Transaction, 'id'>) => void;
}

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return COLORS.tertiary;
      case 'withdrawal':
        return COLORS.secondary;
      default:
        return COLORS.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.transactionItem} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionType}>
            {transaction.type}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionAmount}>
            {transaction.amount > 0 ? '+' : '-'} {transaction.amount}
          </Text>
          <Text style={styles.transactionDescription}>
            {transaction.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onTransactionPress, onTransactionSubmit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TransactionForm onSubmit={onTransactionSubmit} />
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onPress={() => onTransactionPress?.(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  formContainer: {
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  transactionItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.lightWhite,
  },
  transactionContent: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

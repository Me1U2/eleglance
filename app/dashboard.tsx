import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { prisma } from '../lib/prisma';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string | null;
  date: string;
}

export default function Dashboard() {
  const { 
    userId, 
    loanType, 
    loanAmount, 
    netCashFlow, 
    status, 
    transactions 
  } = useLocalSearchParams<{ 
    userId: string;
    loanType: string;
    loanAmount: string;
    netCashFlow: string;
    status: string;
    transactions: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get user data from Prisma
        const userData = await prisma.user.findFirst({
          where: { id: userId }
        });

        if (userData) {
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
          });
        }

        // Parse transactions from loan application
        if (transactions) {
          try {
            const parsedTransactions = JSON.parse(transactions);
            const formattedTransactions: Transaction[] = parsedTransactions.map((tx: any, index: number) => ({
              id: `tx-${index + 1}`,
              amount: parseFloat(tx.amount),
              type: tx.type,
              description: tx.description || 'Transaction',
              date: new Date().toISOString(),
            }));
            setUserTransactions(formattedTransactions);
          } catch (parseError) {
            console.error('Error parsing transactions:', parseError);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadData();
  }, [userId, transactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    // Use an explicit "Ugx" prefix to match product copy, while keeping locale grouping.
    const formatted = new Intl.NumberFormat('en-UG', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `Ugx ${formatted}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/')}>
          <Text style={styles.retryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.subtitle}>Your Loan Application Status</Text>
        </View>

        {/* Loan Application Status */}
        <View style={[styles.card, styles.loanCard, status === 'approved' ? styles.successCard : styles.errorCard]}>
          <View style={styles.loanHeader}>
            <Text style={styles.loanTitle}>Loan Application</Text>
            <View style={[styles.statusBadge, status === 'approved' ? styles.statusApproved : styles.statusRejected]}>
              <Text style={styles.statusText}>{status === 'approved' ? 'Approved' : 'Not Approved'}</Text>
            </View>
          </View>
          <Text style={styles.loanAmount}>{formatCurrency(parseInt(loanAmount || '0'))}</Text>
          <Text style={styles.loanType}>
            {loanType === 'personal' ? 'Personal Loan' : 'Business Loan'}
          </Text>
          <View style={styles.loanDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Net Cash Flow</Text>
              <Text style={styles.detailValue}>{formatCurrency(parseInt(netCashFlow || '0'))}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Applied On</Text>
              <Text style={styles.detailValue}>{formatDate(new Date().toISOString())}</Text>
            </View>
          </View>
          <Text style={styles.loanMessage}>
            {status === 'approved' 
              ? `Congratulations! Your loan application has been approved. Your net cash flow of ${formatCurrency(parseInt(netCashFlow || '0'))} meets our requirements.`
              : `Your loan application was not approved. Your net cash flow of ${formatCurrency(parseInt(netCashFlow || '0'))} does not meet the minimum requirement of ${formatCurrency(loanType === 'personal' ? 50000 : 500000)}.`
            }
          </Text>
        </View>

        {/* User's Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Transactions</Text>
          {userTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {userTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
            </View>
          )}
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanCard: {
    borderLeftWidth: 4,
  },
  successCard: {
    borderLeftColor: '#4caf50',
  },
  errorCard: {
    borderLeftColor: '#f44336',
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusApproved: {
    backgroundColor: '#e8f5e9',
  },
  statusRejected: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  loanAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  loanType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  loanDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  loanMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  transactionsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditAmount: {
    color: '#4caf50',
  },
  debitAmount: {
    color: '#f44336',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  homeButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
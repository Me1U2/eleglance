import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface LoanVerificationProps {
  transactionData: {
    transactions: Array<{
      date: string;
      amount: number;
      type: 'credit' | 'debit';
      description: string;
    }>;
    screenshotUrl: string;
    loanAmount: number;
    userId: string;
  };
}

export const LoanVerification: React.FC<LoanVerificationProps> = ({ transactionData }) => {
  const [status, setStatus] = React.useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApproval = () => {
    // TODO: Implement loan approval logic
    setStatus('approved');
    // Send notification to user
  };

  const handleRejection = () => {
    // TODO: Implement loan rejection logic
    setStatus('rejected');
    // Send notification to user
  };

  const calculateTotal = (transactions: LoanVerificationProps['transactionData']['transactions']) => {
    return transactions.reduce((sum, t) => 
      t.type === 'credit' ? sum + t.amount : sum - t.amount, 0
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.header}>
        <Text style={styles.title}>Loan Verification</Text>
        <Text style={styles.userId}>User ID: {transactionData.userId}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <Image
          source={{ uri: transactionData.screenshotUrl }}
          style={styles.screenshot}
          resizeMode="contain"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.transactionsList}>
          {transactionData.transactions.map((t, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text>{t.date}</Text>
              <Text style={t.type === 'credit' ? styles.credit : styles.debit}>
                {t.type === 'credit' ? '+' : '-'} {t.amount}
              </Text>
              {t.description && <Text>{t.description}</Text>}
            </View>
          ))}
        </View>
        <Text style={styles.totalText}>
          Total Amount: {calculateTotal(transactionData.transactions).toFixed(2)}
        </Text>
        <Text style={styles.loanText}>
          Proposed Loan Amount: {transactionData.loanAmount.toFixed(2)}
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Status</Text>
        <Text style={styles.statusText}>
          Status: {status === 'pending' ? 'Pending' : 
                  status === 'approved' ? 'Approved' : 'Rejected'}
        </Text>
        {status === 'pending' && (
          <View style={styles.buttonContainer}>
            <Button onPress={handleApproval} title="Approve Loan" />
            <Button onPress={handleRejection} title="Reject Loan" />
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userId: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  screenshot: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionsList: {
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  credit: {
    color: '#00C851',
  },
  debit: {
    color: '#FF1744',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  loanText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
